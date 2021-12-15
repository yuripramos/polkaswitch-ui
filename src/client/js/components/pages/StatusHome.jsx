import React, { useContext } from 'react';
import TokenPairChartOverview from '../partials/swap/TokenPairChartOverview';
import Navbar from '../partials/navbar/Navbar';
import SwapWidget from '../partials/swap/SwapWidget';
import AlphaOnboardingCard from '../partials/swap/AlphaOnboardingCard';
import SwapNetworkToggle from '../partials/swap/SwapNetworkToggle';
import ConnectWalletModal from '../partials/ConnectWalletModal';
import TxHistoryModal from '../partials/TxHistoryModal';
import NotificationSystem from '../partials/NotificationSystem';
import MobileMenu from '../partials/navbar/MobileMenu';
import BridgeWidget from '../partials/bridge/BridgeWidget';
import TxnHistory from '../partials/swap/TxnHistory';
import { balanceContext } from '../../context/balance';

const Status = () => {
  const { networks } = useContext(balanceContext);

  return (
    <div className="container">
      <Navbar />
      <MobileMenu />
      <NotificationSystem />
      <ConnectWalletModal />
      <TxHistoryModal />
      <div className="columns is-centered">
        <div className="column card-container">
          <div className="card wallets-page-card">
            <div className="columns portfolio-balance">
              <div className="column">
                <h6 className="portfolio-balance__main-heading">Node Status</h6>
              </div>
            </div>

            <div className="columns">
              <div className="column data-na-container">
                <ul className="node-list">
                  {networks
                    ? networks.map((node, index) => (
                        <li key={index}>
                          {node.name}
                          {node.enabled ? (
                            <span className="network-status-online">
                              {' '}
                              online{' '}
                            </span>
                          ) : (
                            <span className="network-status-offline">
                              offline
                            </span>
                          )}
                        </li>
                      ))
                    : "Please reconnect the RPC's"}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Status;
