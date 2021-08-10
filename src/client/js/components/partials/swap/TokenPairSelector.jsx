import React, { useEffect, useRef } from 'react';
import TokenIconBalanceGroupView from "./TokenIconBalanceGroupView";
import TokenIconImg from "../TokenIconImg";
import classnames from "classnames";
import _ from "underscore";

export default function TokenPairSelector(){
  return (
    <div className="level is-mobile is-narrow my-0 token-dropdown">
      <div className="level-item level-left">
        <div className={classnames("dropdown is-right is-hoverable")}>
          <div className="dropdown-trigger">
            <button className="button is-info is-light" aria-haspopup="true" aria-controls="dropdown-menu">
                <span className="level">
                  <span className="level-left my-2">
                    <span className="level-item">
                      <TokenIconImg
                          size={30}
                          imgSrc="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png" />
                    </span>
                    <span className="level-item">ETH</span>
                  </span>
                </span>
              <span className="icon is-small">
                  <ion-icon name="chevron-down"></ion-icon>
                </span>
            </button>
          </div>
          <div className="dropdown-menu" id="dropdown-menu" role="menu">
            <div className="dropdown-content">
                <a href="#"
                    className={classnames("dropdown-item level is-mobile", {
                })}></a>
                <span className="level-left my-2">
                <span className="level-item">
                <TokenIconImg
                size={30}
                imgSrc="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png" />
                </span>
                <span className="level-item">ETH/USDT</span>
                </span>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
}

