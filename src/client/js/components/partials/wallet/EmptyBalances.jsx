import React from "react";

export default function EmptyBalances() {
    return (
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
    );
}
