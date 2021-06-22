import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

import Wallet from '../../utils/wallet';
import Metrics from '../../utils/metrics';
import EventManager from '../../utils/events';
import TokenListManager from '../../utils/tokenList';

export default class ConnectWalletModal extends Component {
  constructor(props) {
    super(props);
    this.state = { refresh: Date.now(), open: false };
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
    var currentNetworkName = TokenListManager.getCurrentNetworkConfig().chain.chainName;

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

            <div
              className={classnames("option", {
                "connected": Wallet.isConnected()
              })}
              onClick={this.handleConnection}
            >
              <div className="level is-mobile is-narrow">
                <div className="level-left">
                  <div className="level-item">
                    <div>
                      <div>MetaMask</div>
                      {Wallet.isConnected() && (
                        <>
                          <div className="connected">Connected</div>
                          <div className="connected">
                            {Wallet.currentAddress()}
                          </div>
                        </>
                      )}
                      {!Wallet.isSupported() && (
                        <>
                          <div className="error">
                            Please install Metamask Plugin first!
                          </div>
                        </>
                      )}
                      {Wallet.isConnectedToAnyNetwork() &&
                          !Wallet.isMatchingConnectedNetwork() &&
                      (
                        <>
                        <div className="error">
                          You are connected to the wrong network!<br/>
                          Click here to switch to the {currentNetworkName}
                        </div>
                        </>
                      )}
                      {Wallet.isSupported() &&
                          !Wallet.isConnectedToAnyNetwork() &&
                      (
                        <>
                        <div className="has-text-info">
                          Click here to connect to {currentNetworkName}
                        </div>
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
              New to <a target="_blank" href="https://ethereum.org/wallets/">Ethereum</a>, <a target="_blank" href="https://polygon.technology/technology/">Polygon</a>, or <a target="_blank" href="https://wiki.polkadot.network/docs/en/getting-started">Polkadot</a>?
            </div>
          </div>
        </div>
      </div>
    );
  }
}

