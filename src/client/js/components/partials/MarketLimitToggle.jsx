import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

export default class MarketLimitToggle extends Component {
  constructor(props) {
    super(props);
    this.state = { balance: 0 };
  }

  render() {
    return (
      <span className="switcher">
        <input type="checkbox" />
        <label for="switcher-1"></label>
      </span>
    );
  }
}

