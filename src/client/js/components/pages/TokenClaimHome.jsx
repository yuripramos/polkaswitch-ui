
import React, { Component } from 'react';

import Navbar from '../partials/Navbar';
import ConnectPanel from '../partials/ConnectPanel';

export default class Home extends Component {
  render() {
    return (
      <div className="container">
        <Navbar />

        <ConnectPanel />

        <div className="columns">
          <div className="column swap-column" style={{ margin: "0 auto" }}>
            <div className="card">
              <header className="card-header">
                <p className="card-header-title">
                  Token Claim
                </p>
              </header>
              <div className="card-content">
                Hello
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

