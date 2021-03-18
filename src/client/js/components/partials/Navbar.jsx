import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import ConnectWalletButton from './ConnectWalletButton';

export default class Navbar extends Component {
  render() {
    return (
      <nav className="level my-6">
        <div className="level-left is-flex-grow-1">
          <div className="level-item">
            <span className="icon is-left">
              <i className="fab fa-octopus-deploy is-size-5 has-text-danger"></i>
            </span>
          </div>
          <div className="level-item">
            <div className="is-family-monospace is-size-4 mr-4 has-text-weight-bold">polkaswitch</div>
          </div>
          <div className="level-item is-flex-grow-3 is-justify-content-left">
            <div className="field" style={{ width: "75%" }}>
              <div className="control has-icons-left has-icons-right">
                <input className="input is-medium" type="email" placeholder="Search by token name, symbol, or address ..." />
                <span className="icon is-left">
                  <i className="fas fa-search fa-sm"></i>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="level-right">
          <div className="level-item"><a className="button is-light">Explore</a></div>
          <div className="level-item"><ConnectWalletButton /></div>
        </div>
      </nav>
    );
  }
}

