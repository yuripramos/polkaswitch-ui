import React from "react";

export default function PortfolioNetwork({ image, networkName, value, change }) {
    return (
        <div className="column is-3">
            <img className="is-rounded asset-icon" src={image} />
            <div className="portfolio-makeup__asset_container">
                <span className="portfolio-makeup__asset_heading">{networkName}</span>
                <span className="portfolio-makeup__asset_price">
                    {value.toLocaleString("en-US", { style: "currency", currency: "USD" })} ({change}%)
                </span>
            </div>
        </div>
    );
}
