import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import ConnectWalletButton from './ConnectWalletButton';
import NotificationButton from './NotificationButton';
import BridgeButton from './BridgeButton';
import TokenSearchBar from './TokenSearchBar';

export default class Navbar extends Component {
  render() {
    return (
      <nav id="nav" className="level is-mobile" style={{ display: "flex" }}>
        <div className="level-left is-flex-grow-1">
          <div className="level-item is-narrow">
            <span className="logo-icon icon is-left is-hidden-mobile">
              <img src="/images/logo_alpha.svg" />
            </span>
            <span className="logo-icon icon is-left is-hidden-tablet">
              <img src="/images/logo_only.svg" />
            </span>
          </div>
          <div className="level-item is-flex-grow-3 is-justify-content-left is-hidden-touch">
            { /* <TokenSearchBar width={"75%"} /> */ }
          </div>
        </div>

        <div className="level-right">
          <div className="level-item is-narrow"><BridgeButton /></div>
          <div className="level-item is-narrow"><NotificationButton /></div>
          <div className="level-item is-narrow"><ConnectWalletButton /></div>
        </div>
      </nav>
    );
  }
}

