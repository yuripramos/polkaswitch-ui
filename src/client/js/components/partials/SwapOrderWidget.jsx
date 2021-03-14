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
      <div>
        <div class="level">
          <div class="level-left is-flex-grow-1">
            <div class="level-item">
              <div class="buttons has-addons">
                <button class="button is-link is-outlined is-selected px-6">Market</button>
                <button class="button px-6">Limit</button>
              </div>
            </div>
          </div>

          <div class="level-right">
            <div class="level-item">
              <span class="icon is-medium">
                <i class="fas fa-sliders-h"></i>
              </span>
            </div>
          </div>
        </div>

        <div class="notification is-white px-6">
          <div class="level">
            <div class="level-left is-flex-shrink-1 is-flex-grow-1">
              <div class="level-item">
                <i class="fab fa-ethereum is-size-4 pr-2"></i>
              </div>
              <div class="level-item">
                <div class="is-size-3"><b>ETH</b></div>
              </div>
              <div class="level-item">
                <i class="fas fa-angle-down mr-5"></i>
              </div>
              <div class="level-item is-flex-grow-1 is-flex-shrink-1 is-flex-direction-column is-align-items-flex-end">
                <div class="field" style={{ width: "100%", maxWidth: "200px" }}>
                  <div class="control" style={{ width: "100%" }}>
                    <input class="input is-medium" placeholder="0.0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="notification is-link is-light px-6">
          <div class="level">
            <div class="level-left is-flex-shrink-1 is-flex-grow-1">
              <div class="level-item">
                <i class="fab fa-slack-hash is-size-4 pr-2"></i>
              </div>
              <div class="level-item">
                <div class="is-size-3"><b>RSR</b></div>
              </div>
              <div class="level-item">
                <i class="fas fa-angle-down mr-5"></i>
              </div>
              <div class="level-item is-flex-grow-1 is-flex-shrink-1 is-flex-direction-column is-align-items-flex-end">
                <div class="field" style={{ width: "100%", maxWidth: "200px" }}>
                  <div class="control" style={{ width: "100%" }}>
                    <input class="input is-medium" placeholder="0.0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

