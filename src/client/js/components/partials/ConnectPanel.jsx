import React, { Component } from 'react';

import Wallet from '../../utils/wallet';
import Metrics from '../../utils/metrics';
import EventManager from '../../utils/events';

export default class ConnectPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { refresh: Date.now() };
    this.handleWalletChange = this.handleWalletChange.bind(this);
  }

  componentDidMount() {
    if (Wallet.isConnected()) {
      Metrics.identify(Wallet.currentAddress());
    }

    this.subWalletChange = EventManager.listenFor(
      'walletUpdated', this.handleWalletChange
    );
  }

  componentDidUnmount() {
    this.subWalletChange.unsubscribe();
  }

  handleConnection(e) {
    if (Wallet.isConnected()) {
      return false;
    }

    Metrics.track("connect-wallet", { type: "metamask" });
    EventManager.emitEvent('initiateWalletConnect', 1);
  }

  handleWalletChange() {
    this.setState({ refresh: Date.now() });
    Metrics.identify(Wallet.currentAddress());
  }

  renderButtonContent() {
    if (Wallet.isConnected()) {
      return (
        <>
        <span className="icon icon-person">
          <ion-icon name="person-circle"></ion-icon>
        </span>
        <span className="wallet-address">
          {Wallet.currentAddress().substring(0, 7)}
        </span>
        <span className="icon icon-arrow-down">
          <ion-icon name="chevron-down"></ion-icon>
        </span>
        </>
      );
    } else {
      return (
        <>
        <span>Connect Wallet</span>
        </>
      );
    }
  }

  renderDropdownContent() {
    if (Wallet.isConnected()) {
      return (
        <div className="dropdown-content">
          <div className="dropdown-item">
            <div>Account:</div>
            <span className="tag is-info is-light">
              {Wallet.currentAddress()}
            </span>
          </div>
        </div>
      );
    } else if (Wallet.isSupported()) {
      return (
        <div className="dropdown-content">
          <div className="dropdown-item has-text-info">
            Connect via Metamask
          </div>
        </div>
      )
    } else {
      return (
        <div className="dropdown-content">
          <div className="dropdown-item has-text-danger">
            Please install Metamask first!
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-content">
          <div className="connect-panel box">
            <div class="button are-large is-fullwidth">
              <div class="level is-mobile is-narrow">
                <div class="level-left">
                  <div class="level-item">
                    Metamask
                  </div>
                </div>
                <div class="level-right">
                  <div class="level-item">
                    <img src="/images/metamask.png" />
                  </div>
                </div>
              </div>
            </div>
            <div class="button are-large">
              Metamask
            </div>
            <div class="button are-large">
              Metamask
            </div>
            <div class="button are-large">
              Metamask
            </div>
          </div>
        </div>
        <button class="modal-close is-large" aria-label="close"></button>
      </div>
    );
  }
}

