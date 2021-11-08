import classNames from "classnames";
import React, { useState } from "react";

export default function NetworkDropdown({}) {
    const [isActive, setIsActive] = useState(false);

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
                        <img src="https://bulma.io/images/placeholders/128x128.png" alt="" className="is-rounted token-icon" />
                        <div className="dropdown-menu__asset_names">
                            <h4>All Network</h4>
                            <span>$4,873.23 (81%)</span>
                        </div>
                    </a>

                    <hr className="dropdown-divider" />

                    <a href="#" className="dropdown-item">
                        <img src="https://bulma.io/images/placeholders/128x128.png" alt="" className="is-rounted token-icon" />
                        <div className="dropdown-menu__asset_names">
                            <h4>All Network</h4>
                            <span>$4,873.23 (81%)</span>
                        </div>
                    </a>

                    <a href="#" className="dropdown-item">
                        <img src="https://bulma.io/images/placeholders/128x128.png" alt="" className="is-rounted token-icon" />
                        <div className="dropdown-menu__asset_names">
                            <h4>All Network</h4>
                            <span>$4,873.23 (81%)</span>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}
