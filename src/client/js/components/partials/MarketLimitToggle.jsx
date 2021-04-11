import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

export default class MarketLimitToggle extends Component {
  constructor(props) {
    super(props);
    this.state = { checked: true };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ checked: event.target.checked });
  }

  render() {
    return (
      <span className="switcher">
        <input
          id="order-type-switcher"
          type="checkbox"
          checked={this.state.checked}
          onChange={this.handleChange} />
        <label for="order-type-switcher"></label>
      </span>
    );
  }
}

