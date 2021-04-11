import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

export default class TokenSymbolBalance extends Component {
  constructor(props) {
    super(props);
    this.state = { balance: 0 };
  }

  onError(e) {
    this.setState({ errored: true });
  }

  render() {
    return (
      <div className="token-symbol-wrapper">
        <div className="symbol">{this.props.token.symbol}</div>
        <div className="balance">Bal: {this.state.balance}</div>
      </div>
    );
  }
}

