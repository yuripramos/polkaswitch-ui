import React, { Component } from 'react';

import Wallet from '../../utils/wallet';
import Metrics from '../../utils/metrics';
import EventManager from '../../utils/events';

export default class ConnectWalletButton extends Component {
  constructor(props) {
    super(props);
    this.state = { refresh: Date.now() };
    this.handleWalletChange = this.handleWalletChange.bind(this);
  }

  componentDidMount() {
    if (Wallet.isConnectedToAnyNetwork()) {
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
    EventManager.emitEvent('promptWalletConnect', 1);
  }

  handleWalletChange() {
    this.setState({ refresh: Date.now() });
  }

  renderButtonContent() {
    if (Wallet.isConnectedToAnyNetwork()) {
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

  render() {
    return (
      <div className="wallet-status">
        <button className="button is-primary"
          onClick={this.handleConnection.bind(this)}
          aria-haspopup="true" aria-controls="dropdown-menu6">
          {this.renderButtonContent()}
        </button>
      </div>
    );
  }
}

