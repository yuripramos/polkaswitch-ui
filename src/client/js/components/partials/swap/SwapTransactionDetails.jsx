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
        <div className="level is-mobile is-narrow detail">
          <div className="level-left">
            <div className="level-item">
              <div className-"detail-title">
                <span>Title</span>
                <span
                  className="hint-icon hint--bottom hint--medium"
                  aria-label="You can expedite your transaction by paying more Gas Fees. You can choose between either faster transactions or cheaper fees."
                >?</span>
              </div>
            </div>
          </div>

          <div className="level-right">
            <div className="level-item">
              <div className="detail-value">
                0.00000324 ETH
              </div>
            </div>
          </div>
        </div>
        <div className="level is-mobile is-narrow detail">
          <div className="level-left">
            <div className="level-item">
              <div className-"detail-title">
                <span>Title</span>
                <span
                  className="hint-icon hint--bottom hint--medium"
                  aria-label="You can expedite your transaction by paying more Gas Fees. You can choose between either faster transactions or cheaper fees."
                >?</span>
              </div>
            </div>
          </div>

          <div className="level-right">
            <div className="level-item">
              <div className="detail-value">
                0.00000324 ETH
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

