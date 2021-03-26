import React, { Component } from 'react';
import { Link } from "react-router-dom";
import _ from "underscore";

import TokenIconImg from './TokenIconImg';
import TokenSearchBar from './TokenSearchBar';

export default class SwapOrderWidget extends Component {
  constructor(props) {
    super(props);

    var findTokenById = function(tid) {
      return _.find(window.tokens, function(v) {
        return v.id == tid || v.symbol == tid;
      });
    };

    this.state = {
      // RSR
      // to: "0x8762db106B2c2A0bccB3A80d1Ed41273552616E8",
      // DAI
      to: findTokenById("0x6B175474E89094C44Da98b954EedeAC495271d0F"),
      // ETH
      from: findTokenById("ETH"),

      toSearch: false,
      fromSearch: false
    };

    this.onSwapTokens = this.onSwapTokens.bind(this);
    this.onTokenSearchToggle = this.onTokenSearchToggle.bind(this);
    this.handleTokenToChange = this.handleTokenToChange.bind(this);
    this.handleTokenFromChange = this.handleTokenFromChange.bind(this);
  }

  onTokenSearchToggle(target) {
    return function(e) {
      var _s = {};
      _s[target + "Search"] = !this.state[target + "Search"];
      this.setState(_s);
    }.bind(this);
  }

  onSwapTokens(e) {
    this.setState({
      to: this.state.from,
      from: this.state.to
    });
  }

  handleTokenFromChange(token) {
    this.setState({
      from: token,
      toSearch: false,
      fromSearch: false
    });
  }

  handleTokenToChange(token) {
    this.setState({
      to: token,
      toSearch: false,
      fromSearch: false
    });
  }

  renderToken(target, token) {
    return (
      <div className="level">
        <div className="level my-0 token-dropdown" onClick={this.onTokenSearchToggle(target)}>
          <div className="level-item">
            <TokenIconImg
              style={{ height: "35px" }}
              token={token} />
          </div>
          <div className="level-item">
            <div className="is-size-3"><b>{token.symbol}</b></div>
          </div>
          <div className="level-item">
            <i className="fas fa-angle-down"></i>
          </div>
        </div>
        <div className="level-item is-flex-grow-1 is-flex-shrink-1 is-flex-direction-column is-align-items-flex-end">
          <div className="field" style={{ width: "100%", maxWidth: "200px" }}>
            <div className="control" style={{ width: "100%" }}>
              <input className="input is-medium" placeholder="0.0" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="swap-widget">
        <div className="level">
          <div className="level-left is-flex-grow-1">
            <div className="level-item">
              <div className="buttons has-addons">
                <button className="button is-link is-outlined is-selected px-6">Market</button>
                <button className="button px-6">Limit</button>
              </div>
            </div>
          </div>

          <div className="level-right">
            <div className="level-item">
              <span className="icon is-medium">
                <i className="fas fa-sliders-h"></i>
              </span>
            </div>
          </div>
        </div>

        <div className="notification is-white my-0">
          <div className="text-gray-stylized">
            <span>You Pay</span>
          </div>
          {this.renderToken("from", this.state.from)}
          {this.state.fromSearch && (
            <TokenSearchBar
              handleTokenChange={this.handleTokenFromChange} />
            )}
        </div>

        <div class="swap-icon-wrapper">
          <div class="swap-icon" onClick={this.onSwapTokens}>
            <i class="fas fa-long-arrow-alt-up"></i>
            <i class="fas fa-long-arrow-alt-down"></i>
          </div>
        </div>

        <div className="notification is-info is-light">
          <div className="text-gray-stylized">
            <span>You Recieve</span>
          </div>
          {this.renderToken("to", this.state.to)}
          {this.state.toSearch && (
            <TokenSearchBar
              handleTokenChange={this.handleTokenToChange} />
            )}
        </div>

        <div>
          <button className="button is-danger is-fullwidth is-medium">
            Review Order
          </button>
        </div>
      </div>
    );
  }
}

