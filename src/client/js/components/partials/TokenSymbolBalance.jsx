import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';
import Wallet from '../../utils/wallet';
import numeral from 'numeral';

export default class TokenSymbolBalance extends Component {
  constructor(props) {
    super(props);
    this.state = { balance: window.ethers.BigNumber.from(0) };
  }

  componentDidMount() {
    if (Wallet.isConnected() && this.props.token.id) {
      Wallet.getERC20Balance(this.props.token.id).then(function(bal) {
        // balance is in WEI and is a BigNumber
        this.setState({ balance: bal });
      }.bind(this));
    }
  }

  render() {
    var balOutput;
    const Utils = window.ethers.utils;

    if (this.state.balance.isZero()) {
      balOutput = "0.0";
    } else if (this.state.balance.lt(Utils.parseEther("0.0001"))) {
      balOutput = "< 0.0001";
    } else {
      balOutput = numeral(Utils.formatEther(this.state.balance)).format('0.00a');
    }

    return (
      <div className="token-symbol-wrapper">
        <div className="symbol">{this.props.token.symbol}</div>
        <div
          className="balance hint--bottom"
          aria-label={this.state.balance}
        >
          Bal: {balOutput}
        </div>
      </div>
    );
  }
}

