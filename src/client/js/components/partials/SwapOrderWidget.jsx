import React, { Component } from 'react';
import { Link } from "react-router-dom";
import _ from "underscore";

import TokenIconImg from './TokenIconImg';

export default class SwapOrderWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // RSR
      to: "0x8762db106B2c2A0bccB3A80d1Ed41273552616E8",
      // ETH
      from: "ETH"
    };
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  renderToken(tid) {
    var token = _.find(window.tokens, function(v) {
      return v.id == tid || v.symbol == tid;
    });

    return (
      <div className="level">
        <div className="level my-0 token-dropdown">
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
          <div>
            <span>You Pay</span>
          </div>
          {this.renderToken(this.state.from)}
      </div>

      <div>
        <i class="fas fa-long-arrow-alt-up"></i>
        <i class="fas fa-long-arrow-alt-down"></i>
      </div>

      <div className="notification is-link is-light">
        <div>
          <span>You Recieve</span>
        </div>
        {this.renderToken(this.state.to)}
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

