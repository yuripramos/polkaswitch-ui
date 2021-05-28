import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

import Wallet from '../../../utils/wallet';
import Metrics from '../../../utils/metrics';
import EventManager from '../../../utils/events';

import TokenIconImg from './../TokenIconImg';

export default class SwapNetworkToggle extends Component {
  constructor(props) {
    super(props);

    this.handleDropdownClick = this.handleDropdownClick.bind(this);

    this.NETWORKS = _.map([
      "ETH",
      "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", // MATIC
      "0xB8c77482e45F1F44dE1745F52C74426C631bDD52" // BNB
    ], function(v) { return Wallet.findTokenById(v) });
  }

  handleDropdownClick(token) {
    return function handleClick(e) {
    }.bind(this);
  }

  render() {
    var networkList = _.map(this.NETWORKS, function(v) {
      return (
        <a href="#"
          onClick={this.handleDropdownClick(v)}
          className={classnames("dropdown-item level column is-mobile")}>
          <span className="level-left my-2">
            <span className="level-item">
              <TokenIconImg
                size={35}
                token={v} />
            </span>
            <span className="level-item has-text-grey">{v.symbol}</span>
          </span>
        </a>
      );
    }.bind(this));

    return (
      <div className="swap-network-toggle notification">
        <div className="level is-mobile option">
          <div className="level-left">
            <div className="level-item">
              <span>
                <b>Choose Network</b>
                <span
                  className="hint-icon hint--bottom hint--medium"
                  aria-label="You can expedite your transaction by paying more Gas Fees. You can choose between either faster transactions or cheaper fees."
                >?</span>
              </span>
            </div>
          </div>

          <div className="level-right">
            <div className="level-item">
              <div className="dropdown is-active">
                <div className="dropdown-trigger">
                  <button className="button" aria-haspopup="true" aria-controls="dropdown-menu">
                    <span>Dropdown button</span>
                    <span className="icon is-small">
                      <i className="fas fa-angle-down" aria-hidden="true"></i>
                    </span>
                  </button>
                </div>
                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                  <div className="dropdown-content">
                    {networkList}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

