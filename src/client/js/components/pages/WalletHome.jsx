import React, { useState } from "react";
import Navbar from "../partials/navbar/Navbar";
import ConnectWalletModal from "../partials/ConnectWalletModal";
import TxHistoryModal from "../partials/TxHistoryModal";
import NotificationSystem from "../partials/NotificationSystem";
import MobileMenu from "../partials/navbar/MobileMenu";
import PortfolioNetwork from "../partials/wallet/NetworkPrice";
import NetworkDropdown from "../partials/wallet/NetworkDropdown";
import AssetsTable from "../partials/wallet/AssetsTable";
import { enabledNetworksList, useWeb3Context } from "../../Web3/Web3Context";
import { useTokensByNetwork, useTokensWithBalance } from "../../Web3/TokensContext";
import DisconnectedWallet from "../partials/wallet/DisconnectedWallet";
import networks from "../../Web3/networks";
import EmptyBalances from "../partials/wallet/EmptyBalances";

export default function WalletHome() {
    const [currentNetwork, setCurrentNetwork] = useState(undefined);
    const { isConnected } = useWeb3Context();

    let tokens = currentNetwork ? useTokensByNetwork(+currentNetwork.chainId) : useTokensWithBalance();

    const renderBalancesAccrossNetworks = () => {
        const bMap = tokens.reduce((_map, cv) => {
            let balance = 0;
            if (_map[cv.chainId]) {
                balance += _map[cv.chainId];
            }
            balance += cv.balance * cv.price;
            return { ..._map, [cv.chainId]: balance };
        }, {});

        return Object.keys(bMap).map((netId) => {
            return (
                <PortfolioNetwork
                    key={netId}
                    logoURI={networks[netId].logoURI}
                    name={networks[netId].name}
                    value={bMap[netId]}
                    change={0}
                />
            );
        });
    };

    const renderPortfolioMakeUp = () => {
        if (isConnected && tokens.length) {
            return (
                <>
                    <div className="columns is-hidden-mobile">
                        <div className="column">
                            <div className="portfolio-makeup__heading">Portfolio Makeup</div>
                        </div>
                    </div>

                    <div className="columns is-hidden-mobile portfolio-makeup">{renderBalancesAccrossNetworks()}</div>
                </>
            );
        }
        return null;
    };

    const renderWalletHome = () => {
        if (isConnected) {
            if (!tokens.length && currentNetwork === undefined) {
                return <EmptyBalances />;
            } else {
                return (
                    <>
                        <div className="columns is-centered">
                            <div className="column card-container">
                                <div className="card wallets-page-card">
                                    <div className="columns portfolio-balance">
                                        <div className="column">
                                            <h6 className="portfolio-balance__main-heading">Portfolio Balance</h6>

                                            <NetworkDropdown
                                                selectedNetwork={currentNetwork}
                                                onChangeSelection={setCurrentNetwork}
                                                networkList={enabledNetworksList}
                                            />
                                        </div>
                                    </div>

                                    <div className="columns total-balance">
                                        <div className="column">
                                            <h6 className="total-balance__sub-heading">Total Balance</h6>
                                            <h2 className="total-balance__main-heading">
                                                {tokens
                                                    .reduce((p, t) => {
                                                        return (p += t.price * t.balance);
                                                    }, 0)
                                                    .toLocaleString("en-US", { style: "currency", currency: "USD" })}
                                            </h2>
                                        </div>
                                    </div>

                                    {renderPortfolioMakeUp()}
                                </div>
                            </div>
                        </div>
                        <div className="columns is-centered">
                            <div className="column card-container">
                                <div className="card wallets-page-card">
                                    <div className="tokens-table-title-container">
                                        <span className="tokens-table-title-container__main">Assets</span>
                                        <span className="tokens-table-title-container__sub">Don't see your assets?</span>
                                    </div>

                                    <AssetsTable tokenData={tokens} />
                                </div>
                            </div>
                        </div>
                    </>
                );
            }
        }
        return <DisconnectedWallet />;
    };

    return (
        <div className="container">
            <Navbar />
            <MobileMenu />
            <NotificationSystem />
            <ConnectWalletModal />
            <TxHistoryModal />

            {renderWalletHome()}
        </div>
    );
}
