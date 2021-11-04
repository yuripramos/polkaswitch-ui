import React from "react";
import Navbar from "../partials/navbar/Navbar";
import ConnectWalletModal from "../partials/ConnectWalletModal";
import TxHistoryModal from "../partials/TxHistoryModal";
import NotificationSystem from "../partials/NotificationSystem";
import MobileMenu from "../partials/navbar/MobileMenu";

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

                                <div className="dropdown">
                                    <div className="dropdown-trigger">
                                        <img src="https://bulma.io/images/placeholders/128x128.png" />

                                        <div className="dropdown-trigger__content">
                                            <span className="sub">Network</span>
                                            <span className="main">All Networks</span>
                                        </div>

                                        <div className="icon">
                                            <i className="fa fa-chevron-down" aria-hidden="true"></i>
                                        </div>
                                    </div>
                                    <div className="dropdown-menu" id="dropdown-menu" role="menu">
                                        <div className="dropdown-content">
                                            <a href="#" className="dropdown-item">
                                                Dropdown item
                                            </a>
                                        </div>
                                    </div>
                                </div>
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
                            <div className="column is-3">
                                <img className="is-rounded asset-icon" src="https://bulma.io/images/placeholders/128x128.png" />
                                <div className="portfolio-makeup__asset_container">
                                    <span className="portfolio-makeup__asset_heading">Ethereum</span>
                                    <span className="portfolio-makeup__asset_price">$48,125.83 (19%)</span>
                                </div>
                            </div>

                            <div className="column is-3">
                                <img className="is-rounded asset-icon" src="https://bulma.io/images/placeholders/128x128.png" />
                                <div className="portfolio-makeup__asset_container">
                                    <span className="portfolio-makeup__asset_heading">BSC</span>
                                    <span className="portfolio-makeup__asset_price">$48,125.83 (19%)</span>
                                </div>
                            </div>
                            <div className="column is-3">
                                <img className="is-rounded asset-icon" src="https://bulma.io/images/placeholders/128x128.png" />
                                <div className="portfolio-makeup__asset_container">
                                    <span className="portfolio-makeup__asset_heading">Avalanche</span>
                                    <span className="portfolio-makeup__asset_price">$48,125.83 (19%)</span>
                                </div>
                            </div>
                            <div className="column is-3">
                                <img className="is-rounded asset-icon" src="https://bulma.io/images/placeholders/128x128.png" />
                                <div className="portfolio-makeup__asset_container">
                                    <span className="portfolio-makeup__asset_heading">Arbitrum</span>
                                    <span className="portfolio-makeup__asset_price">$293.03 (1%)</span>
                                </div>
                            </div>

                            <div className="column is-3">
                                <img className="is-rounded asset-icon" src="https://bulma.io/images/placeholders/128x128.png" />
                                <div className="portfolio-makeup__asset_container">
                                    <span className="portfolio-makeup__asset_heading">Arbitrum</span>
                                    <span className="portfolio-makeup__asset_price">$293.03 (1%)</span>
                                </div>
                            </div>
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
                            <div className="asset-table">
                                <div className="columns asset-table__header is-mobile">
                                    <div className="column is-3 is-half-mobile">
                                        <span>Token</span>
                                    </div>
                                    <div className="column is-hidden-mobile is-3">
                                        <span>Price</span>
                                    </div>
                                    <div className="column is-3 is-half-mobile">
                                        <span>Balance</span>
                                    </div>
                                    <div className="column is-hidden-mobile is-3">
                                        <span>Value</span>
                                    </div>
                                </div>

                                <div className="columns asset-table__row is-mobile">
                                    <div className="column is-3 is-6-mobile">
                                        <img className="asset-icon" src="https://bulma.io/images/placeholders/128x128.png" />
                                        <div className="asset-table__content">
                                            <h4 className="asset-table__title">Chainlink</h4>
                                            <span className="asset-table__sub">
                                                LINK
                                                <span>BSC</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="column is-hidden-mobile is-3 align-right">
                                        <h4 className="asset-table__title">$56.41</h4>
                                        <span className="asset-table__sub">USD</span>
                                    </div>
                                    <div className="column is-3 align-right">
                                        <h4 className="asset-table__title">$12.41</h4>
                                        <span className="asset-table__sub">USD</span>
                                    </div>
                                    <div className="column is-hidden-mobile is-3 align-right">
                                        <h4 className="asset-table__title">$21,456.41</h4>
                                        <span className="asset-table__sub">USD</span>
                                    </div>
                                </div>

                                <div className="columns asset-table__row">
                                    <div className="column is-3">
                                        <img className="asset-icon" src="https://bulma.io/images/placeholders/128x128.png" />
                                        <div className="asset-table__content">
                                            <h4 className="asset-table__title">Ethereum</h4>
                                            <span className="asset-table__sub">
                                                ETH
                                            </span>
                                        </div>
                                    </div>
                                    <div className="column is-hidden-mobile is-3 align-right">
                                        <h4 className="asset-table__title">$4,729.83</h4>
                                        <span className="asset-table__sub">USD</span>
                                    </div>
                                    <div className="column is-3 align-right">
                                        <h4 className="asset-table__title">$49.912</h4>
                                        <span className="asset-table__sub">USD</span>
                                    </div>
                                    <div className="column is-hidden-mobile is-3 align-right">
                                        <h4 className="asset-table__title">$236,499.81</h4>
                                        <span className="asset-table__sub">USD</span>
                                    </div>
                                </div>

                                <div className="columns asset-table__row">
                                    <div className="column is-3">
                                        <img className="asset-icon" src="https://bulma.io/images/placeholders/128x128.png" />
                                        <div className="asset-table__content">
                                            <h4 className="asset-table__title">Uniswap</h4>
                                            <span className="asset-table__sub">
                                                UNI
                                                <span>Ethereum</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="column is-3 align-right">
                                        <h4 className="asset-table__title">$32.19</h4>
                                        <span className="asset-table__sub">USD</span>
                                    </div>
                                    <div className="column is-3 align-right">
                                        <h4 className="asset-table__title">$98.99</h4>
                                        <span className="asset-table__sub">USD</span>
                                    </div>
                                    <div className="column is-3 align-right">
                                        <h4 className="asset-table__title">$9,485.48</h4>
                                        <span className="asset-table__sub">USD</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
