import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';
import BN from 'bignumber.js';
import TokenIconBalanceGroupView from './TokenIconBalanceGroupView';
import TokenIconImg from './../TokenIconImg';
import Metrics from '../../../utils/metrics';
import EventManager from '../../../utils/events';
import SwapFn from '../../../utils/swapFn';
import Nxtp from '../../../utils/nxtp';
import { ApprovalState } from "../../../constants/Status";

export default class CrossSwapProcessSlide extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false }

    this.handleTransfer = this.handleTransfer.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  componentDidMount() {
    this.subWalletUpdated = EventManager.listenFor('walletUpdated', this.handleWalletChange);
  }

  componentWillUnmount() {
    this.subWalletUpdated.unsubscribe();
  }

  handleBack(e) {
    if (!this.state.loading) {
      this.props.handleBackOnConfirm();
    }
  }

  handleTransfer() {
    this.setState({
      loading: true,
    }, function() {
      console.log("Debug Crash: ", this.props.fromAmount, this.props.from);

      const fromAmountBN = window.ethers.utils.parseUnits(this.props.fromAmount, this.props.from.decimals);

      // TODO track trnasaction ID as a prop
      Nxtp.transferStepOne(this.props.transferQuote).then(function (nonce) {
        console.log(nonce);

        this.props.handleTransactionComplete(true, nonce);

        Metrics.track("swap-complete", {
          from: this.props.from,
          to: this.props.to,
          fromAmont: this.props.fromAmount
        });

        this.setState({
          loading: false
        });
      }.bind(this)).catch(function (e) {
        console.error('#### swap failed from catch ####', e);

        this.props.handleTransactionComplete(false, undefined);

        this.setState({
          loading: false
        });
      }.bind(this));
    }.bind(this));

  }

  displayValue(token, amount) {
    return BN(BN(amount).toPrecision(18)).toString();
  }

  hasSufficientBalance() {
    if (this.props.availableBalance) {
      var balBN = BN(this.props.availableBalance);
      var fromBN = BN(this.props.fromAmount);
      return fromBN.lte(balBN);
    } else {
      return false;
    }
  }

  allowSwap() {
    return !this.state.loading &&
      this.hasSufficientBalance();
  }

  render() {
    if (!this.props.toAmount || !this.props.fromAmount) {
      return (<div />)
    }

    return (
      <div className="page page-stack page-view-cross-process">
        <div className="page-inner">
          <div className="level is-mobile">
            <div className="level-left">
              <div className="level-item">
                <div className="level-item">
                  <span
                    className="icon ion-icon clickable"
                    onClick={this.handleBack}
                  >
                    <ion-icon name="arrow-back-outline"></ion-icon>
                  </span>
                </div>
              </div>
              <div className="level-item">
                <b className="widget-title">Review &amp; Submit Transfer</b>
              </div>
            </div>
          </div>

          <hr />

          <div className="text-gray-stylized">
            <span>You Pay</span>
          </div>

          <div className="level is-mobile">
            <div className="level-left">
              <div className="level-item chain-icon">
                <TokenIconImg
                  size={"35"}
                  imgSrc={this.props.fromChain.logoURI} />
              </div>
              <TokenIconBalanceGroupView
                token={this.props.from}
                refresh={this.props.refresh}
              />
            </div>

            <div className="level-right">
              <div className="level-item">
                <div>
                  <div className="currency-text">
                    {this.displayValue(this.props.from, this.props.fromAmount)}
                  </div>
                  <div className={classnames("fund-warning has-text-danger has-text-right", {
                    "is-hidden": this.hasSufficientBalance()
                  })}>
                    <span className="icon">
                      <ion-icon name="warning-outline"></ion-icon>
                    </span>
                    <span>Insufficient funds</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className="text-gray-stylized">
            <span>You Recieve</span>
          </div>

          <div className="level is-mobile">
            <div className="level-left">
              <div className="level-item chain-icon">
                <TokenIconImg
                  size={"35"}
                  imgSrc={this.props.toChain.logoURI} />
              </div>
              <TokenIconBalanceGroupView
                token={this.props.to}
                refresh={this.props.refresh}
              />
            </div>

            <div className="level-right">
              <div className="level-item">
                <div className="currency-text">
                  {this.displayValue(this.props.to, this.props.toAmount)}
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div>
            <button
              className={classnames("button is-primary is-fullwidth is-medium", {
                "is-loading": this.state.loading,
              })}
              disabled={!this.allowSwap()}
              onClick={this.handleTransfer}>
              Start Transfer
            </button>
          </div>
        </div>
      </div>
    );
  }
}

