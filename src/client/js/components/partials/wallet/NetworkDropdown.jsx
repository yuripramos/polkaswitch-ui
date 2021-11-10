import classNames from "classnames";
import React, { useState } from "react";

export default function NetworkDropdown({ networkList, onChangeSelection, selectedNetwork }) {
    const [isActive, setIsActive] = useState(false);

    const handleSelectionChange = (selection) => {
        onChangeSelection(selection);
        setIsActive(false);
    };

    const renderList = () => {
        return networkList.map((network) => {
            return (
                <a
                    href="#"
                    id={network.chainId}
                    className="dropdown-item"
                    onClick={(evt) => {
                        evt.preventDefault();
                        handleSelectionChange(network);
                    }}
                >
                    <img src={network.logoURI} alt="" className="is-rounted token-icon" />
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
            onMouseOver={(evt) => {
                evt.preventDefault();
                setIsActive(true);
            }}
            className={classNames({
                dropdown: true,
                "is-active": isActive,
            })}
        >
            <div className="dropdown-trigger">
                <img src={selectedNetwork ? selectedNetwork.logoURI : "https://bulma.io/images/placeholders/128x128.png"} />

                <div className="dropdown-trigger__content">
                    <span className="sub">Network</span>
                    <span className="main">{selectedNetwork ? selectedNetwork.name : "All networks"}</span>
                </div>

                <div className="icon">
                    <span className="icon is-small">
                        <ion-icon name="chevron-down"></ion-icon>
                    </span>
                </div>
            </div>
            <div
                onMouseLeave={(evt) => {
                    evt.preventDefault();
                    setIsActive(false);
                }}
                className="dropdown-menu"
                id="dropdown-menu"
                role="menu"
            >
                <div className="dropdown-content">
                    <div className="dropdown-item">
                        <h4>Networks</h4>
                    </div>

                    <hr className="dropdown-divider" />

                    <a
                        onClick={(evt) => {
                            evt.preventDefault();
                            handleSelectionChange(undefined);
                        }}
                        href="#"
                        className="dropdown-item"
                    >
                        <img
                            src="https://bulma.io/images/placeholders/128x128.png"
                            /* All network icon*/ alt=""
                            className="is-rounted token-icon"
                        />
                        <div className="dropdown-menu__asset_names">
                            <h4>All Networks</h4>
                        </div>
                    </a>

                    <hr className="dropdown-divider" />

                    {renderList()}
                </div>
            </div>
        </div>
    );
}
