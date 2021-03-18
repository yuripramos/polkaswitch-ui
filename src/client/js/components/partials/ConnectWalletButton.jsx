import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

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
        <i className="fas fa-user-circle"></i>
        <span className="icon is-small">
          <i className="fas fa-angle-down" aria-hidden="true"></i>
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
      <div>
        <div className="dropdown is-right is-hoverable">
          <div className="dropdown-trigger">
            <button className="button is-danger"
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

