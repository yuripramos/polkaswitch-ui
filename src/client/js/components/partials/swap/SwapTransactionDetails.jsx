import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';
import Wallet from '../../../utils/wallet';
import numeral from 'numeral';

export default class SwapTransactionDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
  }

  render() {
    return (
      <div className="swap-trans-details">
        <div
          className="level is-mobile is-narrow detail hint--bottom hint--medium"
          aria-label="The calculated exchange rate for this transaction"
        >
          <div className="level-left">
            <div className="level-item">
              <div className="detail-title">
                <span>Rate</span>
                <span className="hint-icon">?</span>
              </div>
            </div>
          </div>

          <div className="level-right">
            <div className="level-item">
              <div className="detail-value">
                1 {this.props.from.symbol} ~= {numeral(this.props.toAmount / this.props.fromAmount).format("0.0[0000000000000]")} {this.props.to.symbol}
              </div>
            </div>
          </div>
        </div>
        <div
          className="level is-mobile is-narrow detail hint--bottom hint--medium"
          aria-label="Minimum Received"
        >
          <div className="level-left">
            <div className="level-item">
              <div className="detail-title">
                <span>Minimum Received</span>
                <span className="hint-icon">?</span>
              </div>
            </div>
          </div>

          <div className="level-right">
            <div className="level-item">
              <div className="detail-value">
                {this.props.toAmount} {this.props.to.symbol}
              </div>
            </div>
          </div>
        </div>
        <div
          className="level is-mobile is-narrow detail hint--bottom hint--medium"
          aria-label="The difference between the current market price and the price you will actually pay when performing this swap"
        >
          <div className="level-left">
            <div className="level-item">
              <div className="detail-title">
                <span>Price Impact</span>
                <span className="hint-icon">?</span>
              </div>
            </div>
          </div>

          <div className="level-right">
            <div className="level-item">
              <div className="detail-value">
                + 3.5%
              </div>
            </div>
          </div>
        </div>
        <div
          className="level is-mobile is-narrow detail hint--bottom hint--medium"
          aria-label="Total transaction cost for this swap which includes Gas fees and Liquidity Provider Fees"
        >
          <div className="level-left">
            <div className="level-item">
              <div className="detail-title">
                <span>Transaction Cost</span>
                <span className="hint-icon">?</span>
              </div>
            </div>
          </div>

          <div className="level-right">
            <div className="level-item">
              <div className="detail-value">
                0.003434 ETH
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

