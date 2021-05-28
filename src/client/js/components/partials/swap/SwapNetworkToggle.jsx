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
      { name: "Ethereum", token: "ETH" },
      { name: "Polygon", token: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0" },
      { name: "Binance Smart Chain", token: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52" },
    ], function(v) {
      v.token = Wallet.findTokenById(v.token);
      return v;
    });

    this.state = { selected: _.first(this.NETWORKS), active: false };
  }

  handleDropdownClick(token) {
    return function handleClick(e) {
      this.setState({
        selected: token
      });
    }.bind(this);
  }

  render() {
    var networkList = _.map(this.NETWORKS, function(v) {
      return (
        <a href="#"
          onClick={this.handleDropdownClick(v)}
          className={classnames("dropdown-item level is-mobile")}>
          <span className="level-left my-2">
            <span className="level-item">
              <TokenIconImg
                size={30}
                token={v.token} />
            </span>
            <span className="level-item">{v.name}</span>
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
                <span className="option-title">Network</span>
                <span
                  className="is-hidden hint-icon hint--top hint--medium"
                  aria-label="Change Network"
                >?</span>
              </span>
            </div>
          </div>

          <div className="level-right">
            <div className="level-item">
              <div className={classnames("dropdown is-right is-hoverable")}>
                <div className="dropdown-trigger">
                  <button className="button is-white" aria-haspopup="true" aria-controls="dropdown-menu">
                    <span className="level">
                      <span className="level-left my-2">
                        <span className="level-item">
                          <TokenIconImg
                            size={30}
                            token={this.state.selected.token} />
                        </span>
                        <span className="level-item has-text-grey">{this.state.selected.name}</span>
                      </span>
                    </span>
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

