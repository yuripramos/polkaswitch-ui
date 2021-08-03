import React, { Component } from 'react';
import classnames from 'classnames';
import SwapFn from "../../../utils/swapFn";

export default class GasPriceControl extends Component {
  constructor(props) {
    super(props);
    const gasStats = [window.GAS_STATS.safeLow, window.GAS_STATS.fast, window.GAS_STATS.fastest];
    let gasPrice = SwapFn.getSetting().gasPrice;
    let isCustomGasPrice = SwapFn.getSetting().isCustomGasPrice;

    if (isCustomGasPrice) {
      this.state = {
        custom: true,
        customValue: gasPrice,
        current: 0
      };
    } else {
      this.state = {
        custom: false,
        customValue: '',
        current: gasStats[0]
      };
    }

    this.handleClick = this.handleClick.bind(this);
    this.onCustomChange = this.onCustomChange.bind(this);
    this.initGasPrice = this.initGasPrice.bind(this);
    this.initGasPrice(gasStats[0], isCustomGasPrice);
  }

  initGasPrice(gasPrice, isCustomGasPrice) {
    if (!isCustomGasPrice) {
      this.props.handleGasPrice(gasPrice, false);
    }
  }

  handleClick(event) {
    this.setState({
      current: +event.target.value,
      custom: false,
      customValue: ''
    });

    this.props.handleGasPrice(+event.target.value, false);
  }

  onCustomChange(e) {
    this.setState({
      custom: true,
      customValue: e.target.value
    });

    if (!isNaN(e.target.value) && e.target.value.match(/^\d+(\.\d+)?$/)) {
      this.props.handleGasPrice(+e.target.value, true);
    } else {
      this.setState({
        current: -1,
        custom: false
      });
    }
  }

  render() {
    const { current } = this.state
    return (
      <div className="gas-price-control">
        <div className={classnames("select", { "disabled": this.state.custom})}>
          <select value={current} onChange={this.handleClick}>
            <option value={window.GAS_STATS.safeLow}>Auto (~{window.GAS_STATS.safeLow})</option>
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

