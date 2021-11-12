import React from "react";
import AssetTableRow from "./AssetTableRow";

export default function AssetsTable({ tokenData }) {
    return (
        <div className="wallets-page-tokens-table">
            <div className="columns wallets-page-tokens-table__header is-mobile">
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

            {tokenData.map((t) => {
                return (
                    <AssetTableRow
                        key={t.symbol}
                        logoURI={t.logoURI}
                        name={t.name}
                        symbol={t.symbol}
                        price={t.price}
                        balance={t.balance}
                        value={t.value}
                        networkId={t.chainId}
                    ></AssetTableRow>
                );
            })}
        </div>
    );
}
