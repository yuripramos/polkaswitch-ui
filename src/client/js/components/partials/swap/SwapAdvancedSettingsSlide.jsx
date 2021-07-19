import React, { Component } from 'react';
import SwapSlippageControl from './SwapSlippageControl';
import GasPriceControl from './GasPriceControl';
import SwapFn from '../../../utils/swapFn';

import * as ethers from 'ethers';

export default class SwapAdvancedSettingsSlide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slippage: 0.5,
      GasPrice: -1 // auto,
    }

    this.handleGasPrice = this.handleGasPrice.bind(this);
    this.handleSlippage = this.handleSlippage.bind(this);
  }

  componentDidMount(){
    const settings = SwapFn.getSetting()
    this.setState(settings);
  }

  handleGasPrice(v) {
    SwapFn.updateSettings({
      gasPrice: v
    });
  }

  handleSlippage(v) {
    SwapFn.updateSettings({
      slippage: v
    });
  }

  render() {
    const { slippage, gasPrice } = this.state
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

          <div className="option">
            <div>
              <span>
                <b>Gas Price</b>
                <span
                    className="hint-icon hint--bottom hint--medium"
                    aria-label="You can expedite your transaction by paying more Gas Fees. You can choose between either faster transactions or cheaper fees (in GWei)"
                  >?</span>
              </span>
            </div>

            <GasPriceControl handleGasPrice={this.handleGasPrice} defaultValue={gasPrice}/>
          </div>

          <div className="option">
            <div>
              <span>
                <b>Slippage Tolerance</b>
                <span
                  className="hint-icon hint--bottom hint--medium"
                  aria-label="Your transaction will revert if the price changes unfavorably by more than this percentage"
                >?</span>
              </span>
            </div>

            <SwapSlippageControl handleSlippage={this.handleSlippage} defaultValue={slippage} />
          </div>

          <div className="level is-mobile option">
            <div className="level-left">
              <div className="level-item">
                <span>
                  <b>Liquidity Sources</b>
                  <span
                    className="hint-icon hint--bottom hint--medium"
                    aria-label="Coming Soon! Customize which sources to route your swap through"
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

          <div className="level is-hidden is-mobile option">
            <div className="level-left">
              <div className="level-item">
                <span>
                  <b>Custom Tokens</b>
                  <span
                    className="hint-icon hint--bottom"
                    aria-label="Coming Soon">?</span>
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

