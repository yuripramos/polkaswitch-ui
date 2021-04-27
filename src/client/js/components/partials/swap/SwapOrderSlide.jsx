import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

import TokenSearchBar from './../TokenSearchBar';
import TokenIconBalanceGroupView from './TokenIconBalanceGroupView';
import TokenSwapDistribution from './TokenSwapDistribution';
import MarketLimitToggle from './MarketLimitToggle';

import Wallet from '../../../utils/wallet';
import Metrics from '../../../utils/metrics';
import EventManager from '../../../utils/events';

export default class SwapOrderSlide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calculatingSwap: false,
      calculatingSwapTimestamp: Date.now()
    };

    this.handleTokenAmountChange = this.handleTokenAmountChange.bind(this);
    this.validateOrderForm = this.validateOrderForm.bind(this);
    this.fetchSwapEstimate = this.fetchSwapEstimate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  fetchSwapEstimate(origFromAmount) {
    var fromAmount = origFromAmount;

    if (!fromAmount || fromAmount.length == 0) {
      fromAmount = '0';
    }

    var timeNow = Date.now();

    this.setState({
      calculatingSwap: true,
      calculatingSwapTimestamp: timeNow
    }, function() {
      var fromAmountBN = window.ethers.utils.parseUnits(fromAmount);

      _.delay(function() {
        Wallet.getExpectedReturn(
          this.props.from,
          this.props.to,
          fromAmountBN
        ).then(function(result) {
          if (this.state.calculatingSwapTimestamp != timeNow) {
            return;
          }

          var dist = _.map(result.distribution, function(e) {
            return e.toNumber();
          });

          this.props.onSwapEstimateComplete(
            origFromAmount,
            window.ethers.utils.formatEther(result.returnAmount),
            dist
          )

          this.setState({
            calculatingSwap: false
          }, function() {
            Metrics.track("swap-estimate-result", {
              from: this.props.from,
              to: this.props.to,
              fromAmont: fromAmount,
              toAmount: this.props.toAmount,
              swapDistribution: this.props.swapDistribution
            });
          }.bind(this));
        }.bind(this));
      }.bind(this), 500);

    }.bind(this));
  }

  handleTokenAmountChange(e) {
    var targetAmount = e.target.value;

    Metrics.track("swap-token-value", {
      value: targetAmount,
      from: this.props.from,
      to: this.props.to
    });

    this.props.onSwapEstimateComplete(
      targetAmount,
      this.props.toAmount,
      this.props.swapDistribution
    )

    this.fetchSwapEstimate(targetAmount);
  }

  validateOrderForm() {
    return (this.props.from && this.props.to &&
      this.props.fromAmount && this.props.fromAmount.length > 0 &&
      this.props.toAmount && this.props.toAmount.length > 0 &&
      !this.state.calculatingSwap);
  }

  handleSubmit(e) {
    if (!Wallet.isConnected()) {
      EventManager.emitEvent('promptWalletConnect', 1);
    }

    else {
      if (this.validateOrderForm()) {
        this.props.handleSubmit();
      }
    }
  }

  renderTokenInput(target, token) {
    if (!token) {
      return (<div />);
    }

    var isFrom = (target === "from");

    return (
      <div className="level is-mobile">
        <div className="level is-mobile is-narrow my-0 token-dropdown"
          onClick={this.props.handleSearchToggle(target)}>
          <TokenIconBalanceGroupView
            token={token}
            refresh={this.props.refresh}
          />
          <div className="level-item">
            <span className="icon-down">
              <ion-icon name="chevron-down"></ion-icon>
            </span>
          </div>
        </div>
        <div className="level-item is-flex-grow-1 is-flex-shrink-1 is-flex-direction-column is-align-items-flex-end">
          <div className="field" style={{ width: "100%", maxWidth: "200px" }}>
            <div
              className={classnames("control", {
                "is-loading": !isFrom && this.state.calculatingSwap
              })}
              style={{ width: "100%" }}
            >
              <input
                onChange={this.handleTokenAmountChange}
                value={this.props[`${target}Amount`]}
                type="number"
                min="0"
                step="0.000000000000000001"
                className="input is-medium"
                placeholder="0.0"
                disabled={!isFrom}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="page page-view-order">
        <div className="page-inner">
          <div className="level is-mobile">
            <div className="level-left is-flex-grow-1">
              <MarketLimitToggle />
            </div>

            <div className="level-right">
              <div className="level-item">
                <span
                  className="icon clickable settings-icon"
                  onClick={this.props.handleSettingsToggle}>
                  <ion-icon name="settings-outline"></ion-icon>
                </span>
              </div>
            </div>
          </div>

          <div className="notification is-white my-0">
            <div className="text-gray-stylized">
              <span>You Pay</span>
            </div>
            {this.renderTokenInput("from", this.props.from)}
          </div>

          <div class="swap-icon-wrapper">
            <div class="swap-icon-v2 icon" onClick={this.props.onSwapTokens}>
              <ion-icon name="swap-vertical-outline"></ion-icon>
            </div>

            <div class="swap-icon is-hidden" onClick={this.props.onSwapTokens}>
              <i class="fas fa-long-arrow-alt-up"></i>
              <i class="fas fa-long-arrow-alt-down"></i>
            </div>
          </div>

          <div className="notification is-info is-light">
            <div className="text-gray-stylized">
              <span>You Receive</span>
            </div>
            {this.renderTokenInput("to", this.props.to)}
          </div>

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
              totalParts={3}
              parts={this.props.swapDistribution}/>
          </div>

          <div>
            <button
              disabled={Wallet.isConnected() && !this.validateOrderForm()}
              className="button is-primary is-fullwidth is-medium"
              onClick={this.handleSubmit}
            >
              {Wallet.isConnected() ? "Review Order" : "Connect Wallet"}
            </button>
          </div>
        </div>
      </div>
    );
  }

}

