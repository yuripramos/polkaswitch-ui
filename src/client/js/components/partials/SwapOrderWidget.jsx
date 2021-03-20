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
        <div className="level">
          <div className="level-left is-flex-grow-1">
            <div className="level-item">
              <div className="buttons has-addons">
                <button className="button is-link is-outlined is-selected px-6">Market</button>
                <button className="button px-6">Limit</button>
              </div>
            </div>
          </div>

          <div className="level-right">
            <div className="level-item">
              <span className="icon is-medium">
                <i className="fas fa-sliders-h"></i>
              </span>
            </div>
          </div>
        </div>

        <div className="notification is-white px-6 my-0">
          <div>
            <span>You Pay</span>
          </div>
          <div className="level">
            <div className="level-left is-flex-shrink-1 is-flex-grow-1">
              <div className="level-item">
                <i className="fab fa-ethereum is-size-4 pr-2"></i>
              </div>
              <div className="level-item">
                <div className="is-size-3"><b>ETH</b></div>
              </div>
              <div className="level-item">
                <i className="fas fa-angle-down mr-5"></i>
              </div>
              <div className="level-item is-flex-grow-1 is-flex-shrink-1 is-flex-direction-column is-align-items-flex-end">
                <div className="field" style={{ width: "100%", maxWidth: "200px" }}>
                  <div className="control" style={{ width: "100%" }}>
                    <input className="input is-medium" placeholder="0.0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <i class="fas fa-exchange-alt fa-rotate-90"></i>
        </div>

        <div className="notification is-link is-light px-6">
          <div>
            <span>You Recieve</span>
          </div>
          <div className="level">
            <div className="level-left is-flex-shrink-1 is-flex-grow-1">
              <div className="level-item">
                <i className="fab fa-slack-hash is-size-4 pr-2"></i>
              </div>
              <div className="level-item">
                <div className="is-size-3"><b>RSR</b></div>
              </div>
              <div className="level-item">
                <i className="fas fa-angle-down mr-5"></i>
              </div>
              <div className="level-item is-flex-grow-1 is-flex-shrink-1 is-flex-direction-column is-align-items-flex-end">
                <div className="field" style={{ width: "100%", maxWidth: "200px" }}>
                  <div className="control" style={{ width: "100%" }}>
                    <input className="input is-medium" placeholder="0.0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
            <button className="button is-danger is-fullwidth is-medium">
              Review Order
            </button>
        </div>
      </div>
    );
  }
}

