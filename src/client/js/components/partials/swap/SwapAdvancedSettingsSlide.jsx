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

export default class SwapAdvancedSettingsSlide extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="page page-stack page-view-settings">
        <div className="page-inner">
          <div className="level is-mobile">
            <div className="level-left">
              <div className="level-item">
                <span className="icon ion-icon clickable"
                  onClick={this.props.handleBackOnSettings}>
                  <ion-icon name="arrow-back-outline"></ion-icon>
                </span>
              </div>
              <div className="level-item">
                <b className="widget-title">Advanced Settings</b>
              </div>
            </div>
          </div>

          <hr />

          <div className="level is-mobile option">
            <div className="level-left">
              <div className="level-item">
                <span>
                  <b>Gas Price</b>
                  <span
                    className="hint-icon hint--bottom hint--medium"
                    aria-label="You can expedite your transaction by paying more Gas Fees. You can choose between either faster transactions or cheaper fees."
                  >?</span>
                </span>
              </div>
            </div>

            <div className="level-right">
              <div className="level-item">
                <div className="select">
                  <select>
                    <option>Instant</option>
                    <option>Cheapest</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="level is-mobile option">
            <div className="level-left">
              <div className="level-item">
                <span>
                  <b>Slippage Tolerance</b>
                  <span
                    className="hint-icon hint--bottom hint--medium"
                    aria-label="Your transaction will revert if the price changes unfavorably by more than this percentage"
                  >?</span>
                </span>
              </div>
            </div>

            <div className="level-right">
              <div className="level-item">
                <div className="select">
                  <select>
                    <option>0.1%</option>
                    <option>0.5%</option>
                    <option>1%</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="level is-mobile option">
            <div className="level-left">
              <div className="level-item">
                <span>
                  <b>Liquidity Sources</b>
                  <span
                    className="hint-icon hint--bottom hint--medium"
                    aria-label="COMING SOON! Customize which sources to route your swap through"
                  >?</span>
                </span>
              </div>
            </div>

            <div className="level-right">
              <div className="level-item">
                <div className="select">
                  <select disabled>
                    <option>10</option>
                    <option>2</option>
                    <option>1</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="level is-mobile option">
            <div className="level-left">
              <div className="level-item">
                <span>
                  <b>Custom Tokens</b>
                  <span
                    className="hint-icon hint--bottom"
                    aria-label="COMING SOON">?</span>
                </span>
              </div>
            </div>

            <div className="level-right">
              <div className="level-item">
                <span className="icon ion-icon disabled is-medium">
                  <ion-icon name="add-circle-outline"></ion-icon>
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

}

