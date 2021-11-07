import React from "react";

export default function AssetTableRow({ iconUrl, name, symbol, price, balance }) {
    return (
        <div className="columns asset-table__row">
            <div className="column is-3">
                <img className="asset-icon" src={iconUrl} />
                <div className="asset-table__content">
                    <h4 className="asset-table__title">{name}</h4>
                    <span className="asset-table__sub">{symbol} &middot; <span>USDC</span></span>
                </div>
            </div>
            <div className="column is-hidden-mobile is-3 align-right">
                <h4 className="asset-table__title">{price.toLocaleString("en-US", { style: "currency", currency: "USD" })}</h4>
                <span className="asset-table__sub">USD</span>
            </div>
            <div className="column is-3 align-right">
                <h4 className="asset-table__title">{balance.toLocaleString("en-US", { style: "currency", currency: "USD" })}</h4>
                <span className="asset-table__sub">USD</span>
            </div>
            <div className="column is-hidden-mobile is-3 align-right">
                <h4 className="asset-table__title">{(balance*price).toLocaleString("en-US", { style: "currency", currency: "USD" })}</h4>
                <span className="asset-table__sub">USD</span>
            </div>
        </div>
    );
}
