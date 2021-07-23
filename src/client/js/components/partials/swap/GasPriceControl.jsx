import React, { Component } from 'react';
import classnames from 'classnames';
import SwapFn from "../../../utils/swapFn";

export default class GasPriceControl extends Component {
  constructor(props) {
    super(props);
    const gasStats = [window.GAS_STATS.safeLow, window.GAS_STATS.fast, window.GAS_STATS.fastest];
    const gasPrice = SwapFn.getSetting().gasPrice;
    if (gasStats.indexOf(gasPrice) > -1) {
      this.state = {
        custom: false,
        customValue: '',
        current: gasPrice
      };
    } else {
      this.state = {
        custom: false,
        customValue: gasPrice,
        current: -1
      };
    }

    this.handleClick = this.handleClick.bind(this);
    this.onCustomChange = this.onCustomChange.bind(this);
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

