import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';
import Wallet from '../../utils/wallet';
import numeral from 'numeral';

export default class TokenSymbolBalance extends Component {
  constructor(props) {
    super(props);
    this.state = { balance: 0 };
  }

  componentDidMount() {
    if (Wallet.isConnected() && this.props.token.id) {
      Wallet.getERC20Balance(this.props.token.id).then(function(bal) {
        this.setState({ balance: bal });
      }.bind(this));
    }
  }

  render() {
    return (
      <div className="token-symbol-wrapper">
        <div className="symbol">{this.props.token.symbol}</div>
        <div
          className="balance hint--bottom"
          aria-label={this.state.balance}
          >Bal: {numeral(this.state.balance).format('0.00a')}</div>
      </div>
    );
  }
}

