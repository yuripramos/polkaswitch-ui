import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import ConnectWalletButton from './ConnectWalletButton';
import TokenSearchBar from './TokenSearchBar';

export default class Navbar extends Component {
  render() {
    return (
      <nav id="nav" className="level is-mobile" style={{ display: "flex" }}>
        <div className="level-left is-flex-grow-1">
          <div className="level-item is-narrow">
            <span className="logo-icon icon is-left">
              <i className="fab fa-octopus-deploy"></i>
            </span>
          </div>
          <div className="logo-title level-item is-narrow">
            polkaswitch
          </div>
          <div className="level-item is-flex-grow-3 is-justify-content-left is-hidden-touch">
            { /* <TokenSearchBar width={"75%"} /> */ }
          </div>
        </div>

        <div className="level-right">
          <div className="level-item is-narrow"><ConnectWalletButton /></div>
        </div>
      </nav>
    );
  }
}

