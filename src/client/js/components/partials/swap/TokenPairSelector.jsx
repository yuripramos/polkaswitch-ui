import React, { useEffect, useRef } from 'react';
import TokenIconBalanceGroupView from "./TokenIconBalanceGroupView";
import TokenIconImg from "../TokenIconImg";
import classnames from "classnames";
import _ from "underscore";
import TokenListManager from "../../../utils/tokenList";

export default function TokenPairSelector(props){
  const renderTokenPairs = () => {
    return (
      _.map(props.tokenPairs, function (v, i) {
        return (
            <a href="#"
               key={i}
               onClick={() => handleTokenPairChange(v)}
               className="dropdown-item level is-mobile"
            >
            <span className="level-left my-2">
              <span className="level-item">
              </span>
              <span className="level-item">{v.name}</span>
            </span>
            </a>
        );
      })
    )
  }

  const handleTokenPairChange = (tokenPair) => {
    props.handleTokenPairChange(tokenPair);
  }

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
                    <span className="level-item">{props.selectedPair.name}</span>
                  </span>
                </span>
              <span className="icon is-small">
                  <ion-icon name="chevron-down"/>
                </span>
            </button>
          </div>
          <div className="dropdown-menu" id="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {renderTokenPairs()}
            </div>
          </div>
        </div>
      </div>
      </div>
    );
}

