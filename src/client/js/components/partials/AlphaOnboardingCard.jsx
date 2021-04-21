import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

import Wallet from '../../utils/wallet';
import Metrics from '../../utils/metrics';

export default class AlphaOnboardingCard extends Component {
  constructor(props) {
    super(props);
    this.state = { minting: false, success: false };
    this.handleMint = this.handleMint.bind(this);
  }

  handleMint(e) {
    if (!Wallet.isConnected()) {

    }

    this.setState({
      minting: true
    }, function() {
      Promise.all(_.map([
        "METH", "MUNI", "MSUSHI", "MBAL"
      ], function(sym) {
        return Wallet._mint(sym, window.ethers.utils.parseEther("100"));
      })).then(function(values) {
        this.setState({
          minting: false,
          success: true
        });
        console.log("done");
      }.bind(this));
    }.bind(this));
  }

  render() {
    return (
      <div className="alpha-banner notification is-warning is-light">
        <div className="content">
          <p className="is-size-6">
            <b>Welcome to the Polkaswitch Alpha launch!</b>
          </p>
          <p>As we work closely with our technology partners for the Mainnet launch, you will experience intermittent issues until then.</p>
          <p>To be able to perform swaps on the Polkaswitch Alpha we need
            to mint test tokens on the Moonbeam Alphanet.</p>
          <p className="is-italic">100 Tokens will be added under METH, MUNI, MSUSHI and MBAL</p>
          <div className="buttons">
            <button disabled className={classnames("button is-success", {
                "is-hidden": !this.state.success
              })}
            >
              Tokens Added!
            </button>
            <button
              onClick={this.handleMint}
              disabled={this.state.minting}
              className={classnames("button is-warning", {
                "is-loading": this.state.minting,
                "is-hidden": this.state.success
              })}
            >Mint Test Tokens</button>
          </div>
        </div>
      </div>
    );
  }
}

