import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

export default class CrossChainToggle extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
  }

  render() {
    return (
      <span
        className="cross-chain-toggle switcher"
      >
        <input
          id="cross-chain-switcher"
          type="checkbox"
          checked={this.props.checked}
          disabled={true}
          onChange={this.handleChange} />
        <label htmlFor="cross-chain-switcher"></label>
      </span>
    );
  }
}

