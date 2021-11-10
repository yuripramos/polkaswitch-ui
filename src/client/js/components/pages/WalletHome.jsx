import React, { useState } from "react";
import Navbar from "../partials/navbar/Navbar";
import ConnectWalletModal from "../partials/ConnectWalletModal";
import TxHistoryModal from "../partials/TxHistoryModal";
import NotificationSystem from "../partials/NotificationSystem";
import MobileMenu from "../partials/navbar/MobileMenu";
import PortfolioNetwork from "../partials/wallet/NetworkPrice";
import NetworkDropdown from "../partials/wallet/NetworkDropdown";
import AssetsTable from "../partials/wallet/AssetsTable";
import { useWeb3Context, Web3ContextProvider } from "../../Web3/Web3Context";
import { TokensContextProvider } from "../../Web3/TokensContext";

const data = [
    {
        iconUrl: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32%402x/color/eth%402x.png",
        name: "Ethereum",
        symbol: "ETH",
        price: 4516.24,
        balance: 0.05,
        isNative: true,
        homeNetwork: undefined,
    },
    {
        iconUrl: "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32%402x/color/btc%402x.png",
        name: "Bitcoin",
        symbol: "BTC",
        price: 62109.9,
        balance: 1.2,
        isNative: true,
        homeNetwork: "ETH",
    },
];

export default function WalletHome() {
    const { connectWallet } = useWeb3Context();
    const [dropdownVisible, setDropdownVisible] = useState(false);

    return (
        <div className="container">
            <Navbar />
            <MobileMenu />
            <NotificationSystem />
            <ConnectWalletModal />
            <TxHistoryModal />

            <div className="columns is-centered">
                <div className="column card-container">
                    <div className="card wallets-page-card">
                        <div className="columns portfolio-balance">
                            <div className="column">
                                <h6 className="portfolio-balance__main-heading">Portfolio Balance</h6>

                                <NetworkDropdown isActive={dropdownVisible} networkList={[]} />
                            </div>
                        </div>

                        <div className="columns total-balance">
                            <div className="column">
                                <h6 className="total-balance__sub-heading">Total Balance</h6>
                                <h2 className="total-balance__main-heading">$456.156</h2>
                            </div>
                        </div>

                        <div className="columns is-hidden-mobile">
                            <div className="column">
                                <div className="portfolio-makeup__heading">Portfolio Makeup</div>
                            </div>
                        </div>

                        <div className="columns is-hidden-mobile portfolio-makeup">
                            {data
                                .filter((t) => t.isNative)
                                .map((t) => {
                                    return (
                                        <PortfolioNetwork
                                            key={t.symbol}
                                            iconUrl={t.iconUrl}
                                            name={t.name}
                                            value={t.price * t.balance}
                                            change={0}
                                        />
                                    );
                                })}
                        </div>
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

                        <AssetsTable tokenData={data} />
                    </div>
                </div>
            </div>

            <div className="columns is-centered">
                <div className="column card-container">
                    <div className="card wallets-page-card">
                        <div className="columns portfolio-balance">
                            <div className="column">
                                <h6 className="portfolio-balance__main-heading">Portfolio Balance</h6>
                            </div>
                        </div>

                        <div className="columns">
                            <div
                                className="column"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexDirection: "column",
                                }}
                            >
                                <img style={{ marginTop: "49px", width: "62px" }} src="/images/group.svg" alt="Connect Wallet" />
                                <h2
                                    style={{
                                        fontFamily: "Gilroy",
                                        fontStyle: "normal",
                                        fontWeight: "bold",
                                        fontSize: "18px",
                                        lineHeight: " 22px",
                                        color: "#333333",
                                    }}
                                >
                                    Your crypto balance will show up here.
                                </h2>
                                <h3
                                    style={{
                                        marginTop: "9px",
                                        fontFamily: "Gilroy",
                                        fontStyle: "normal",
                                        fontWeight: "normal",
                                        fontSize: "14px",
                                        lineHeight: "16px",
                                        textAlign: "center",
                                        color: "#A3A5A6",
                                    }}
                                >
                                    Connect your wallet to display up to date price and balances.
                                </h3>

                                <button
                                    onClick={(evt) => {
                                        evt.preventDefault();
                                        connectWallet("metamask");
                                    }}
                                    style={{ marginTop: "30px", marginBottom: "70px" }}
                                    class="button is-success"
                                >
                                    Connect Wallet
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="columns is-centered">
                <div className="column card-container">
                    <div className="card wallets-page-card">
                        <div className="tokens-table-title-container">
                            <span className="tokens-table-title-container__main">Assets</span>
                        </div>

                        <div className="columns">
                            <div
                                className="column"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    flexDirection: "column",
                                }}
                            >
                                <img style={{ marginTop: "49px", width: "62px" }} src="/images/group.svg" alt="Connect Wallet" />
                                <h2
                                    style={{
                                        fontFamily: "Gilroy",
                                        fontStyle: "normal",
                                        fontWeight: "bold",
                                        fontSize: "18px",
                                        lineHeight: " 22px",
                                        color: "#333333",
                                    }}
                                >
                                    Your crypto assets will show up here.
                                </h2>
                                <h3
                                    style={{
                                        marginTop: "9px",
                                        fontFamily: "Gilroy",
                                        fontStyle: "normal",
                                        fontWeight: "normal",
                                        fontSize: "14px",
                                        lineHeight: "16px",
                                        textAlign: "center",
                                        color: "#A3A5A6",
                                    }}
                                >
                                    Add assets to your wallet to display up to date prices and balances..
                                </h3>

                                <button style={{ marginTop: "30px", marginBottom: "70px" }} class="button is-success">
                                    Start Trading
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
