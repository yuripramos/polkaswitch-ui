import React, { Component } from 'react';

import Wallet from '../../utils/wallet';

export default class ConnectWalletButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleConnection(e) {
    Wallet.connectWallet().then(function(account) {
        this.setState({ account: account });
    }.bind(this));
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
          <div className="dropdown-item">
            Balance: $0.00
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
      <div className="wallet-status">
        <div className="dropdown is-right is-hoverable">
          <div className="dropdown-trigger">
            <button className="button is-primary"
              onClick={this.handleConnection.bind(this)}
              aria-haspopup="true" aria-controls="dropdown-menu6">
              {this.renderButtonContent()}
            </button>
          </div>
          <div className="dropdown-menu" id="dropdown-menu6" role="menu">
            {this.renderDropdownContent()}
          </div>
        </div>
      </div>
    );
  }
}

