import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';
import numeral from 'numeral';
import BN from 'bignumber.js';

import TokenSearchBar from './../TokenSearchBar';
import TokenIconBalanceGroupView from './TokenIconBalanceGroupView';
import TokenSwapDistribution from './TokenSwapDistribution';
import SwapTransactionDetails from './SwapTransactionDetails';
import MarketLimitToggle from './MarketLimitToggle';

import Wallet from '../../../utils/wallet';
import Metrics from '../../../utils/metrics';
import EventManager from '../../../utils/events';
import SwapFn from '../../../utils/swapFn';

export default class SwapConfirmSlide extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false }

    this.handleSwapConfirm = this.handleSwapConfirm.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  componentDidMount() {
    this.subWalletUpdated = EventManager.listenFor('walletUpdated', this.handleWalletChange);
  }

  componentDidUnmount() {
    this.subWalletUpdated.unsubscribe();
  }

  handleBack(e) {
    if (!this.state.loading) {
      this.props.handleBackOnConfirm();
    }
  }

  handleSwapConfirm() {
    this.setState({
      loading: true,
    }, function() {
      var fromAmountBN = window.ethers.utils.parseUnits(this.props.fromAmount, this.props.from.decimals);

      var distBN = _.map(this.props.swapDistribution, function(e) {
        return window.ethers.utils.parseUnits("" + e, "wei");
      });

      SwapFn.performSwap(
        this.props.from,
        this.props.to,
        fromAmountBN,
        distBN
      ).then(function(result) {
        console.log(result);
        console.log(`Transaction Hash: ${result.transactionHash}`);
        console.log(`Gas Used: ${result.gasUsed.toString()}`);
        // var toAmountString = window.ethers.utils.formatEther(result.returnAmount);

        this.props.handleTransactionComplete(true, result.transactionHash);

        Metrics.track("swap-complete", {
          from: this.props.from,
          to: this.props.to,
          fromAmont: this.props.fromAmount
        });

        this.setState({
          loading: false
        });
      }.bind(this)).catch(function(e) {
        console.error(e);

        this.props.handleTransactionComplete(false, undefined);

        this.setState({
          loading: false
        });
      }.bind(this));
    }.bind(this));
  }

  render() {
    if (!this.props.toAmount || !this.props.fromAmount) {
      return (<div />)
    }

    return (
      <div className="page page-stack">
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
                <b className="widget-title">Review Order</b>
              </div>
            </div>
          </div>

          <hr />

          <div className="text-gray-stylized">
            <span>You Pay</span>
          </div>

          <div className="level is-mobile">
            <div className="level-left">
              <TokenIconBalanceGroupView
                token={this.props.from}
                refresh={this.props.refresh}
              />
            </div>

            <div className="level-right">
              <div className="level-item">
                <div class="currency-text">
                  {
                    BN(
                      window.ethers.utils.formatUnits(
                        window.ethers.utils.parseUnits(
                          this.props.fromAmount, this.props.from.decimals
                        ),
                        this.props.from.decimals
                      )
                    ).toPrecision(15)
                  }
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
              <TokenIconBalanceGroupView
                token={this.props.to}
                refresh={this.props.refresh}
              />
            </div>

            <div className="level-right">
              <div className="level-item">
                <div className="currency-text">
                  {
                    BN(
                      window.ethers.utils.formatUnits(
                        window.ethers.utils.parseUnits(
                          this.props.toAmount, this.props.to.decimals
                        ),
                        this.props.to.decimals
                      )
                    ).toPrecision(20)
                  }
                </div>
              </div>
            </div>
          </div>

          <hr />

          <SwapTransactionDetails
            to={this.props.to}
            from={this.props.from}
            toAmount={this.props.toAmount}
            fromAmount={this.props.fromAmount}
            swapDistribution={this.props.swapDistribution}
          />

          <div
            className={classnames("hint--large", "token-dist-expand-wrapper", {
              "hint--top": this.props.swapDistribution,
              "expand": this.props.swapDistribution
            })}
            aria-label="We have queried multiple exchanges to find the best possible pricing for this swap. The below routing chart shows which exchanges we used to achieve the best swap."
          >
            <div className="token-dist-hint-text">
              <span>Routing Distribution</span>
              <span className="hint-icon">?</span>
            </div>
            <TokenSwapDistribution
              parts={this.props.swapDistribution}/>
          </div>

          <div>
            <button
              className={classnames("button is-primary is-fullwidth is-medium", {
                "is-loading": this.state.loading
              })}
              disabled={this.state.loading}
              onClick={this.handleSwapConfirm}>
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    );
  }
}

