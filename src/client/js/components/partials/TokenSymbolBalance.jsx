import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';
import Wallet from '../../utils/wallet';
import numeral from 'numeral';

export default class TokenSymbolBalance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: window.ethers.BigNumber.from(0),
      errored: false
    };

    this.fetchBalance = this.fetchBalance.bind(this);
  }

  componentDidMount() {
    this.fetchBalance();
  }

  componentDidUpdate(prevProps) {
    if (this.props.token.symbol !== prevProps.token.symbol) {
      this.fetchBalance();
    }
  }

  fetchBalance() {
    if (Wallet.isConnected() && this.props.token.id) {
      Wallet.getERC20Balance(this.props.token.id)
        .then(function(bal) {
          _.defer(function() {
            // balance is in WEI and is a BigNumber
            this.setState({
              balance: bal,
              errored: false
            });
          }.bind(this))
        }.bind(this))
        .catch(function(e) {
          console.error(e);
          _.defer(function() {
            this.setState({ errored: true });
          }.bind(this))
        }.bind(this));
    }
  }

  render() {
    var balOutput;
    const Utils = window.ethers.utils;

    if (this.state.errored) {
      balOutput = "N/A";
    } else if (this.state.balance.isZero()) {
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

