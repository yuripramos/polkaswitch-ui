import React, { Component } from 'react';
import _ from "underscore";
import Wallet from '../../../utils/wallet';
import numeral from 'numeral';

export default class TokenSymbolBalance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: false,
      errored: false,
      loading: true,
      timestamp: Date.now()
    };

    this.fetchBalance = this.fetchBalance.bind(this);
  }

  componentDidMount() {
    this.fetchBalance();
  }

  componentDidUpdate(prevProps) {
    if (this.props.token.symbol !== prevProps.token.symbol ||
      this.props.refresh !== prevProps.refresh) {
      this.setState({
        timestamp: Date.now(),
        loading: true,
        balance: false,
        errored: false
      }, this.fetchBalance.bind(this));
    }
  }

  fetchBalance(attempt) {
    if (!attempt) {
      attempt = 0;
    } else if (attempt > 10) {
      this.setState({
        errored: true,
        loading: false
      });
      console.error("TokenSymbolBalance: Network Failure");
      return;
    }

    if (this.props.network && !Wallet.isMatchingConnectedNetwork(this.props.network)) {
      console.error("TokenSymbolBalance: Wrong network");
      this.setState({
        errored: true,
        loading: false
      });
      return;
    }

    if (Wallet.isConnected()) {
      Wallet.getBalance(this.props.token)
        .then(function(_ts, bal) {
          if (this.state.timestamp != _ts) {
            return;
          }

          // balance is in WEI and is a BigNumber
          this.setState({
            balance: bal,
            errored: false,
            loading: false
          });
        }.bind(this, this.state.timestamp))
        .catch(function(_ts, e) {
          // try again
          console.error("TokenSymbolBalance: Failed to fetch balance", e);
          if (this.state.timestamp != _ts) {
            return;
          }

          this.fetchBalance(attempt + 1);
        }.bind(this, this.state.timestamp));
    } else {
      console.error("TokenSymbolBalance: Wallet not connected");
      this.setState({
        errored: true,
        loading: false
      });
    }
  }

  render() {
    var balOutput;
    var fullOutput;
    const Utils = window.ethers.utils;

    var renderBalFn = function() {
      return numeral(Utils.formatUnits(this.state.balance, this.props.token.decimals)).format('0.0000a');
    }.bind(this);

    if (this.state.loading) {
      balOutput = "--";
      fullOutput = "";
    } else if (this.state.errored) {
      if (Wallet.isConnected() && this.state.balance) {
        fullOutput = Utils.formatUnits(this.state.balance, this.props.token.decimals);
        balOutput = fullOutput;
      } else {
        balOutput = "N/A";
        fullOutput = "";
      }
    } else if (this.state.balance) {
      if (this.state.balance.isZero()) {
        balOutput = "0.0";
        fullOutput = balOutput;
      } else if (this.state.balance.lt(Utils.parseUnits("0.0001", this.props.token.decimals))) {
        balOutput = "< 0.0001";
        fullOutput = Utils.formatUnits(this.state.balance, this.props.token.decimals);
      } else {
        fullOutput = Utils.formatUnits(this.state.balance, this.props.token.decimals);
        balOutput = fullOutput;
      }
    } else {
      balOutput = "--";
      fullOutput = "";
    }

    return (
      <div
        className="token-symbol-wrapper hint--bottom"
        aria-label={fullOutput ? `Balance: ${fullOutput}` : "Balance unavailable"}
      >
        <div className="symbol">{this.props.token.symbol}</div>
        <div className="balance truncate">
          {balOutput}
        </div>
      </div>
    );
  }
}

