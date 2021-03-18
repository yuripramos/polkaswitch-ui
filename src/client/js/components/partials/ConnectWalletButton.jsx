import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default class ConnectWalletButton extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
    } else {
      console.error('Metamask not installed!');
    }
  }

  handleConnection(e) {
    window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(function(accounts) {
        // Metamask currently only ever provide a single account,
        const account = accounts[0];
        console.log('Ethereum Account: ', account);

        this.setState({ account: account });
      }.bind(this))
      .catch(function(e) {
        console.error(e);
      });
  }

  renderButtonContent() {
    if (window.ethereum && window.ethereum.selectedAddress) {
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
    if (window.ethereum && window.ethereum.selectedAddress) {
      return (
        <div className="dropdown-content">
          <div className="dropdown-item">
            <div>Account:</div>
            <span className="tag is-info is-light">
              {window.ethereum.selectedAddress}
            </span>
          </div>
          <div className="dropdown-item">
            Balance: $0.00
          </div>
        </div>
      );
    } else if (window.ethereum) {
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

