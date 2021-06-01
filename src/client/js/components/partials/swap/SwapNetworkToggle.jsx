import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

import Wallet from '../../../utils/wallet';
import Metrics from '../../../utils/metrics';
import EventManager from '../../../utils/events';
import TokenListManager from '../../../utils/tokenList';
import TokenIconImg from './../TokenIconImg';

export default class SwapNetworkToggle extends Component {
  constructor(props) {
    super(props);

    this.handleDropdownClick = this.handleDropdownClick.bind(this);

    this.NETWORKS = window.NETWORK_CONFIGS;
    this.state = {
      selected: TokenListManager.getCurrentNetworkConfig(),
      active: false
    };
  }

  handleDropdownClick(network) {
    return function handleClick(e) {
      if (network.enabled) {
        this.setState({
          selected: network
        });
        TokenListManager.updateNetwork(network);
      }
    }.bind(this);
  }

  render() {
    var networkList = _.map(this.NETWORKS, function(v) {
      return (
        <a href="#"
          onClick={this.handleDropdownClick(v)}
          className={classnames("dropdown-item level is-mobile", {
            "disabled": !v.enabled
          })}
        >
          <span className="level-left my-2">
            <span className="level-item">
              <TokenIconImg
                size={30}
                imgSrc={v.logoURI} />
            </span>
            <span className="level-item">{v.name} {!v.enabled && "(Coming Soon)"}</span>
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
                            imgSrc={this.state.selected.logoURI} />
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

