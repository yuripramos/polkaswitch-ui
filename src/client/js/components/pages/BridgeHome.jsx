
import React, { Component } from 'react';
import Navbar from '../partials/navbar/Navbar';
import SwapNetworkToggle from '../partials/swap/SwapNetworkToggle';
import ConnectWalletModal from '../partials/ConnectWalletModal';
import NotificationSystem from '../partials/NotificationSystem';
import MobileMenu from "../partials/navbar/MobileMenu";
import BridgeWidget from "../partials/bridge/BridgeWidget";

export default class Bridge extends Component {
  render() {
    return (
      <div className="container">
        <Navbar />
        <MobileMenu />
        <NotificationSystem />
        <ConnectWalletModal />
        <div className="columns">
          <div className="column swap-column" style={{ margin: "0 auto" }}>
            <BridgeWidget />
          </div>
        </div>
      </div>
    );
  }
}

