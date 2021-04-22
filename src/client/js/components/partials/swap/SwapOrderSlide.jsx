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
                "is-loading": !isFrom && this.props.calculatingSwap
              })}
              style={{ width: "100%" }}
            >
              <input
                onChange={this.props.handleTokenAmountChange(target)}
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
              <span>You Recieve</span>
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
              disabled={Wallet.isConnected() && !this.props.validateOrderForm()}
              className="button is-primary is-fullwidth is-medium"
              onClick={this.props.handleSubmit}
            >
              {Wallet.isConnected() ? "Review Order" : "Connect Wallet"}
            </button>
          </div>
        </div>
      </div>
    );
  }

}

