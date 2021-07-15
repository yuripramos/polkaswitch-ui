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
      customValue: '',
      current: 0.5
    };
  }

  handleClick(event) {
    this.setState({
      current: +event.target.value,
      custom: false,
      customValue: ''
    });

    this.props.handleGasPrice(+event.target.value);
  }

  onCustomChange(e) {
    this.setState({
      custom: true,
      customValue: e.target.value
    });

    if (!isNaN(e.target.value) && e.target.value.match(/^\d+(\.\d+)?$/)) {
      this.props.handleGasPrice(+e.target.value);
    } else {
      this.setState({
        current: 0.5,
        custom: false
      });
    }
  }

  render() {
    return (
      <div className="gas-price-control">
        <div className={classnames("select", { "disabled": this.state.custom})}>
          <select defaultValue={"-1"} onChange={this.handleClick}>
            <option value="-1">Auto (~{window.GAS_STATS.safeLow})</option>
            <option value={window.GAS_STATS.fast}>Fast (~{window.GAS_STATS.fast})</option>
            <option value={window.GAS_STATS.fastest}>Fastest (~{window.GAS_STATS.fastest})</option>
          </select>
        </div>
        <div className="control has-icons-right">
          <input
            className={classnames("input", {
              "is-info is-light is-outlined": this.state.custom
            })}
            value={this.state.customValue}
            type="number"
            placeholder="0.0"
            onChange={this.onCustomChange} />
        </div>
      </div>
    );
  }

}

