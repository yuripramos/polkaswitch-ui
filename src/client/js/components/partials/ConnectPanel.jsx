import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

import Wallet from '../../utils/wallet';
import Metrics from '../../utils/metrics';
import EventManager from '../../utils/events';

export default class ConnectPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { refresh: Date.now(), open: true };
    this.handleWalletChange = this.handleWalletChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  componentDidMount() {
    this.subWalletChange = EventManager.listenFor(
      'walletUpdated', this.handleWalletChange
    );
    this.subConnectPrompt = EventManager.listenFor(
      'promptWalletConnect', this.handleOpen
    );
  }

  componentDidUnmount() {
    this.subWalletChange.unsubscribe();
    this.subConnectPrompt.unsubscribe();
  }

  handleConnection(e) {
    if (Wallet.isConnected() || !Wallet.isSupported()) {
      return false;
    }

    Metrics.track("connect-wallet", { type: "metamask" });
    EventManager.emitEvent('initiateWalletConnect', 1);
  }

  handleWalletChange() {
    this.setState({ refresh: Date.now() });

    if (Wallet.isConnected()) {
      Metrics.identify(Wallet.currentAddress());
      if (this.state.open) {
        this.handleClose();
      }
    };
  }

  handleOpen(e) {
    this.setState({
      open: true
    });
  }

  handleClose(e) {
    this.setState({
      open: false
    });
  }

  render() {
    return (
      <div className={classnames("modal", { "is-active": this.state.open })}>
        <div onClick={this.handleClose} className="modal-background"></div>
        <div className="modal-content">
          <div className="connect-panel box">
            <div className="level is-mobile">
              <div className="level-left">
                <div className="level-item">
                  <span
                    className="icon ion-icon clickable is-medium"
                    onClick={this.handleClose}
                  >
                    <ion-icon name="close-outline"></ion-icon>
                  </span>
                </div>
                <div className="level-item">
                  <b className="widget-title">Connect your Wallet</b>
                </div>
              </div>
            </div>

            <div className="option" onClick={this.handleConnection}>
              <div className="level is-mobile is-narrow">
                <div className="level-left">
                  <div className="level-item">
                    <div>
                      <div>MetaMask</div>
                      {Wallet.isConnected() && (
                        <>
                          <span className="connected">Connected</span><br/>
                          <span className="connected">
                            {Wallet.currentAddress()}
                          </span>
                        </>
                      )}
                      {!Wallet.isSupported() && (
                        <>
                          <span className="connected">
                            Please install Metamask Plugin first!
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item">
                    <img src="/images/metamask.png" />
                  </div>
                </div>
              </div>
            </div>
            <div className="option coming-soon">
              <div className="level is-mobile is-narrow">
                <div className="level-left">
                  <div className="level-item">
                    WalletConnect (Coming Soon)
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item">
                    <img src="/images/walletConnect.svg" />
                  </div>
                </div>
              </div>
            </div>
            <div className="option coming-soon">
              <div className="level is-mobile is-narrow">
                <div className="level-left">
                  <div className="level-item">
                    Coinbase Wallet (Coming Soon)
                  </div>
                </div>
                <div className="level-right">
                  <div className="level-item">
                    <img src="/images/coinbaseWallet.svg" />
                  </div>
                </div>
              </div>
            </div>

            <div className="footnote">
              New to Ethereum?&nbsp;
              <a href="https://ethereum.org/wallets/">Learn more about wallets</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

