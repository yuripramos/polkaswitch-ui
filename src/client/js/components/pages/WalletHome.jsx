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
                <div className="column is-two-thirds">
                    <div className="column">
                        <div className="card wallet-card">
                            
                            <div className="columns portfolio-balance">
                                <div className="column">
                                    <h6 className="portfolio-balance__main-heading">Portfolio Balance</h6>
                                </div>
                            </div>

                            <div className="columns total-balance">
                                <div className="column">
                                    <h6 className="total-balance__sub-heading">Total Balance</h6>
                                    <h2 className="total-balance__main-heading">$456.156</h2>
                                </div>
                            </div>

                            <div className="columns">
                                <div className="column">
                                    <div className="portfolio-makeup__heading">Portfolio Makeup</div>
                                </div>
                            </div>

                            <div className="columns portfolio-makeup">
                                <div className="column">1</div>
                                <div className="column">2</div>
                                <div className="column">3</div>
                                <div className="column">4</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
