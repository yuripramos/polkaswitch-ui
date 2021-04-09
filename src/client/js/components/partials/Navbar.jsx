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
  componentDidMount() {
  }

  componentDidUnmount() {
  }

  render() {
    return (
      <nav id="nav" className="level is-mobile" style={{ display: "flex" }}>
        <div className="level-left is-flex-grow-1">
          <div className="level-item is-narrow">
            <span className="icon is-left">
              <i className="fab fa-octopus-deploy is-size-5 has-text-danger"></i>
            </span>
          </div>
          <div className="level-item is-narrow">
            <div className="is-family-monospace is-size-4 mr-4 has-text-weight-bold is-hidden-mobile">polkaswitch</div>
            <div className="is-family-monospace is-size-5 mr-4 has-text-weight-bold is-hidden-tablet">polkaswitch</div>
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

