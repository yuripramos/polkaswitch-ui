import React from "react";
import Navbar from "../partials/navbar/Navbar";
import ConnectWalletModal from "../partials/ConnectWalletModal";
import TxHistoryModal from "../partials/TxHistoryModal";
import NotificationSystem from "../partials/NotificationSystem";
import MobileMenu from "../partials/navbar/MobileMenu";
import PortfolioNetwork from "../partials/wallet/NetworkPrice";
import NetworkDropdown from "../partials/wallet/NetworkDropdown";
import AssetsTable from "../partials/wallet/AssetsTable";

export default function WalletHome() {
    return (
        <div className="container">
            <Navbar />
            <MobileMenu />
            <NotificationSystem />
            <ConnectWalletModal />
            <TxHistoryModal />

            <div className="columns is-centered">
                <div className="column main">
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
                            <PortfolioNetwork
                                image="https://bulma.io/images/placeholders/128x128.png"
                                networkName="Ethereum"
                                value={4230}
                                change={1}
                            />

                            <PortfolioNetwork
                                image="https://bulma.io/images/placeholders/128x128.png"
                                networkName="Solana"
                                value={4230}
                                change={1}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="columns is-centered">
                <div className="column main">
                    <div className="card wallets-page-card">
                        <div className="heading-container">
                            <span className="heading-container__main">Assets</span>
                            <span className="heading-container__sub">Don't see your assets?</span>
                        </div>

                        <div>
                            <AssetsTable
                                tokenData={[
                                    {
                                        iconUrl:
                                            "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32%402x/color/eth%402x.png",
                                        name: "Ethereum",
                                        symbol: "ETH",
                                        price: 4516.24,
                                        balance: 0.05,
                                    },
                                    {
                                        iconUrl:
                                            "https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32%402x/color/btc%402x.png",
                                        name: "Bitcoin",
                                        symbol: "BTC",
                                        price: 62109.90,
                                        balance: 1.20,
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
