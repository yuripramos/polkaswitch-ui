import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default class Navbar extends Component {
  render() {
    return (
      <nav class="level my-6">
        <div class="level-left is-flex-grow-1">
          <div class="level-item">
            <span class="icon is-left">
              <i class="fab fa-octopus-deploy is-size-5 has-text-danger"></i>
            </span>
          </div>
          <div class="level-item">
            <div class="is-family-monospace is-size-4 mr-4 has-text-weight-bold">polkaswitch</div>
          </div>
          <div class="level-item is-flex-grow-3 is-justify-content-left">
            <div class="field" style={{ width: "75%" }}>
              <div class="control has-icons-left has-icons-right">
                <input class="input is-medium" type="email" placeholder="Search by token name, symbol, or address ..." />
                <span class="icon is-left">
                  <i class="fas fa-search fa-sm"></i>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="level-right">
          <p class="level-item"><a class="button is-light">Explore</a></p>
          <p class="level-item"><a class="button is-danger">Connect Wallet</a></p>
        </div>
      </nav>
    );
  }
}

