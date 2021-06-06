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

export default class SwapFinalResultSlide extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="page page-stack page-view-results">
        <div className="page-inner">
          <div className="level is-mobile">
            <div className="level-left">
              <div className="level-item">
                <span className="icon ion-icon clickable"
                  onClick={this.props.handleDismiss}>
                  <ion-icon name="arrow-back-outline"></ion-icon>
                </span>
              </div>
            </div>
          </div>

          <div className={classnames("view", { "failed": !this.props.transactionSuccess })}>
            <div className="icon">
              {this.props.transactionSuccess ? (
                <ion-icon name="checkmark-circle-outline"></ion-icon>
              ) : (
                <ion-icon name="alert-circle-outline"></ion-icon>
              )}
            </div>
            <div className="title">
              {this.props.transactionSuccess ? "Transaction Complete" : "Transaction Failed" }
            </div>
            <div className="details">
              <div style={{ wordBreak: "break-all" }}>{
                this.props.transactionSuccess
                  ? this.props.transactionHash
                  : "Please try again"
              }</div>
            </div>
          </div>

          <div>
            <button
              className="button is-primary is-fullwidth is-medium"
              onClick={this.props.handleDismiss}
            >
              Dismiss
            </button>
          </div>

        </div>
      </div>
    );
  }

}

