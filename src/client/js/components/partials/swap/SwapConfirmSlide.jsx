import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';
import numeral from 'numeral';

import TokenSearchBar from './../TokenSearchBar';
import TokenIconBalanceGroupView from './TokenIconBalanceGroupView';
import TokenSwapDistribution from './TokenSwapDistribution';
import MarketLimitToggle from './MarketLimitToggle';

import Wallet from '../../../utils/wallet';
import Metrics from '../../../utils/metrics';
import EventManager from '../../../utils/events';

export default class SwapConfirmSlide extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.subWalletUpdated = EventManager.listenFor('walletUpdated', this.handleWalletChange);
  }

  componentDidUnmount() {
    this.subWalletUpdated.unsubscribe();
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
                    onClick={this.props.handleBackOnConfirm}>
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
                  {window.ethers.utils.formatEther(
                    window.ethers.utils.parseEther(this.props.fromAmount)
                  )}
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
                  {window.ethers.utils.formatEther(
                    window.ethers.utils.parseEther(this.props.toAmount)
                  )}
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div className="level is-mobile">
            <div className="level-left">
              <div className="level-item">
                <b>Gas Price</b>
              </div>
            </div>

            <div className="level-right">
              <div className="level-item currency-text">
                0.00000324 ETH
              </div>
            </div>
          </div>

          <hr />

          <div>
            <button className="button is-primary is-fullwidth is-medium"
              onClick={this.handleSwapConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }
}

