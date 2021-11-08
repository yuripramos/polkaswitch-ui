import React from "react";
import Navbar from "../partials/navbar/Navbar";
import ConnectWalletModal from "../partials/ConnectWalletModal";
import TxHistoryModal from "../partials/TxHistoryModal";
import NotificationSystem from "../partials/NotificationSystem";
import MobileMenu from "../partials/navbar/MobileMenu";
import PortfolioNetwork from "../partials/wallet/NetworkPrice";
import NetworkDropdown from "../partials/wallet/NetworkDropdown";
import AssetsTable from "../partials/wallet/AssetsTable";

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

                                <NetworkDropdown />
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
        </div>
    );
}
