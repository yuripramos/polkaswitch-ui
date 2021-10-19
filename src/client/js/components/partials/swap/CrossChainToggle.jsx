import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

export default class CrossChainToggle extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      crossChainSupported: TokenListManager.getCurrentNetworkConfig().crossChainSupported
    }
  }

  handleChange(event) {
    this.props.handleChange(event.target.checked);
  }

  render() {
    return (
      <span
        className={classnames("cross-chain-toggle switcher", {
          "disabled": this.state.crossChainSupported
        })}
      >
        <input
          id="cross-chain-switcher"
          type="checkbox"
          checked={this.props.checked}
          onChange={this.handleChange} />
        <label htmlFor="cross-chain-switcher"></label>
      </span>
    );
  }
}

