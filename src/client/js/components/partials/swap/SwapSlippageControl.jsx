import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

import * as ethers from 'ethers';
const BigNumber = ethers.BigNumber;
const Utils = ethers.utils;

export default class SwapSlippageControl extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.onCustomChange = this.onCustomChange.bind(this);

    this.state = {
      custom: false,
      customValue: undefined,
      current: 0.5
    };
  }

  handleClick(v) {
    return function(e) {
      this.setState({
        current: +v,
        custom: false,
        customValue: ''
      });
    }.bind(this);
  }

  onCustomChange(e) {
    this.setState({
      custom: true,
      customValue: e.target.value
    })
  }

  render() {
    return (
      <div className="slippage-control">
        {
          ["0.1", "0.5", "1.0"].map(function(v) {
            return (
              <span
                onClick={this.handleClick(v)}
                className={classnames("button", {
                  "is-info is-light is-outlined": !this.state.custom && +v === this.state.current
                })}>
                {v}%
              </span>
            );
          }.bind(this))
        }
        <div className="control has-icons-right">
          <input
            className={classnames("input", {
              "is-info is-light is-outlined": this.state.custom
            })}
            value={this.state.customValue}
            type="number"
            placeholder="0.0"
            onChange={this.onCustomChange} />
          <span className="icon is-right">
            %
          </span>
        </div>
      </div>
    );
  }

}

