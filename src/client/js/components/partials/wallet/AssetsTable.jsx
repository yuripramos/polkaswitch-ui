import React from "react";
import AssetTableRow from "./AssetTableRow";

export default function AssetsTable() {
    return (
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

            <AssetTableRow
                iconUrl="https://bulma.io/images/placeholders/128x128.png"
                name="Ethereum"
                symbol="ETH"
                price={0}
                balance={0}
                value={0}
            ></AssetTableRow>
        </div>
    );
}
