import React from "react";
import { useWeb3Context } from "../../../Web3/Web3Context";

export default function DisconnectedWallet () {
    const { connectWallet } = useWeb3Context();

    return (
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
    );
}
