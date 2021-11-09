import classNames from "classnames";
import React, { useState } from "react";

export default function NetworkDropdown({ networkList, selectedNetwork, isActive }) {
    
    const renderList = () => {
        return networkList.map((network) => {
            return (
                <a href="#" className="dropdown-item">
                    <img src={network.iconUrl} alt="" className="is-rounted token-icon" />
                    <div className="dropdown-menu__asset_names">
                        <h4>{network.name}</h4>
                        <span>
                            {network.price.toLocaleString("en-US", { style: "currency", currency: "USD" })} (
                            {network.priceChange ? network.priceChange : ""})
                        </span>
                    </div>
                </a>
            );
        });
    };

    return (
        <div
            className={classNames({
                dropdown: true,
                "is-active": isActive,
            })}
        >
            <div className="dropdown-trigger">
                <img src="https://bulma.io/images/placeholders/128x128.png" />

                <div className="dropdown-trigger__content">
                    <span className="sub">Network</span>
                    <span className="main">All Networks</span>
                </div>

                <div className="icon">
                    <span className="icon is-small">
                        <ion-icon name="chevron-down"></ion-icon>
                    </span>
                </div>
            </div>
            <div className="dropdown-menu" id="dropdown-menu" role="menu">
                <div className="dropdown-content">
                    <div className="dropdown-item">
                        <h4>Networks</h4>
                    </div>

                    <hr className="dropdown-divider" />

                    <a href="#" className="dropdown-item">
                        <img src="https://bulma.io/images/placeholders/128x128.png" /* All network icon*/ alt="" className="is-rounted token-icon" />
                        <div className="dropdown-menu__asset_names">
                            <h4>{ selectedNetwork ? selectedNetwork.name : "All Networks" }</h4>
                        </div>
                    </a>

                    <hr className="dropdown-divider" />

                    {renderList()}
                </div>
            </div>
        </div>
    );
}
