
import React, { Component } from 'react';

import Navbar from '../partials/Navbar';
import PairOverviewChart from '../partials/swap/PairOverviewChart';
import SwapWidget from '../partials/swap/SwapWidget';
import AlphaOnboardingCard from '../partials/swap/AlphaOnboardingCard';
import SwapNetworkToggle from '../partials/swap/SwapNetworkToggle';
import ConnectWalletModal from '../partials/ConnectWalletModal';
import TxHistoryModal from '../partials/TxHistoryModal';
import NotificationSystem from '../partials/NotificationSystem';

export default class Home extends Component {
  render() {
    return (
      <div className="container">
        <Navbar />

        <NotificationSystem />

        <ConnectWalletModal />
        <TxHistoryModal />

        <div className="columns">
          { /*
          <div className="column is-three-fifths">
            <div className="box">
              <PairOverviewChart />
            </div>
          </div>
          */
          }

          <div className="column swap-column" style={{ margin: "0 auto" }}>
            <SwapNetworkToggle />

            <SwapWidget />

            <AlphaOnboardingCard />

            <div className="is-hidden card">
              <header className="card-header">
                <p className="card-header-title">
                  Exchange Comparsion
                </p>
                <div className="card-header-icon">
                  <span className="icon">
                    <i className="fas fa-search"></i>
                  </span>
                </div>
              </header>
              <div className="card-content">
                <div className="content">
                  <div className="columns">
                    <div className="column">
                      <div className="mb-5">Exchange</div>
                      <div className="mb-5">Polkaswitch</div>
                      <div className="mb-5">Uniswap</div>
                      <div className="mb-2">Sushiswap</div>
                    </div>
                    <div className="column">
                      <div className="mb-5">Amount</div>
                      <div className="mb-5">13232</div>
                      <div className="mb-5">3455</div>
                      <div className="mb-2">8844</div>
                    </div>
                    <div className="column">
                      <div className="mb-5">Result</div>
                      <div className="mb-5">BEST</div>
                      <div className="mb-5">Match</div>
                      <div className="mb-2">-4%</div>
                    </div>
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

