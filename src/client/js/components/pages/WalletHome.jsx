import React, { useEffect, useContext } from 'react';
import Navbar from '../partials/navbar/Navbar';
import ConnectWalletModal from '../partials/ConnectWalletModal';
import TxHistoryModal from '../partials/TxHistoryModal';
import NotificationSystem from '../partials/NotificationSystem';
import MobileMenu from '../partials/navbar/MobileMenu';
import NetworkPrice from '../partials/wallet/NetworkPrice';
import NetworkDropdown from '../partials/NetworkDropdown';
import AssetsTable from '../partials/wallet/AssetsTable';
import DisconnectedWallet from '../partials/wallet/DisconnectedWallet';
import EmptyBalances from '../partials/wallet/EmptyBalances';
import { balanceContext } from '../../context/balance';

import * as ethers from 'ethers';

import _ from 'underscore';

import Wallet from '../../utils/wallet';
import TokenListManager from '../../utils/tokenList';
import EventManager from '../../utils/events';

const WalletHome = () => {
  const { refresh, currentNetwork, balances, loading, setMyApplicationState } =
    useContext(balanceContext);

  let subWalletChange;

  useEffect(() => {
    subWalletChange = EventManager.listenFor(
      'walletUpdated',
      handleWalletChange
    );
  }, []);

  useEffect(() => {
    return () => subWalletChange.unsubscribe();
  }, []);

  const handleWalletChange = () => {
    setMyApplicationState((prevState) => {
      return {
        ...prevState,
        refresh: Date.now(),
        balances: [],
        loading: true,
      };
    });
  };

  const handleConnect = () => {
    EventManager.emitEvent('promptWalletConnect', 1);
  };

  const handleNetworkChange = (network) => {
    setMyApplicationState((prevState) => {
      return {
        ...prevState,
        refresh: Date.now(),
        balances: [],
        currentNetwork: network,
        loading: true,
      };
    });
  };

  const renderBalancesAccrossNetworks = () => {
    const bMap = balances.reduce((_map, cv) => {
      let balance = 0;
      if (_map[cv.chainId]) {
        balance += _map[cv.chainId];
      }
      balance += cv.balance * cv.price;
      return { ..._map, [cv.chainId]: balance };
    }, {});

    return Object.keys(bMap).map((netId) => {
      var network = TokenListManager.getNetworkById(netId);
      return (
        <NetworkPrice
          key={netId}
          logoURI={network.logoURI}
          name={network.name}
          value={bMap[netId]}
          change={0}
        />
      );
    });
  };

  const renderPortfolioMakeUp = () => {
    if (Wallet.isConnected() && balances.length) {
      return (
        <>
          <div className="columns is-hidden-mobile">
            <div className="column">
              <div className="portfolio-makeup__heading">Portfolio Makeup</div>
            </div>
          </div>

          <div className="columns is-hidden-mobile portfolio-makeup">
            {renderBalancesAccrossNetworks()}
          </div>
        </>
      );
    }
    return null;
  };

  const renderWalletHome = () => {
    if (Wallet.isConnected()) {
      if (!balances.length && currentNetwork === undefined) {
        return <EmptyBalances />;
      } else {
        return (
          <>
            <div className="columns is-centered">
              <div className="column card-container">
                <div className="card wallets-page-card">
                  <div className="portfolio-balance level is-mobile">
                    <div className="level-left">
                      <h6 className="portfolio-balance__main-heading">
                        Portfolio Overview
                      </h6>
                    </div>
                    <div className="is-hidden level-right">
                      <NetworkDropdown
                        handleDropdownClick={handleNetworkChange}
                        selected={currentNetwork}
                      />
                    </div>
                  </div>

                  <div className="is-hidden columns total-balance">
                    <div className="column">
                      <h6 className="total-balance__sub-heading">
                        Total Balance
                      </h6>
                      <h2 className="total-balance__main-heading">
                        {balances
                          .reduce((p, t) => {
                            return (p += t.price * t.balance);
                          }, 0)
                          .toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          })}
                      </h2>
                    </div>
                  </div>

                  <div className="is-hidden">{renderPortfolioMakeUp()}</div>
                </div>
              </div>
            </div>
            <div className="columns is-centered">
              <div className="column card-container">
                <div className="card wallets-page-card">
                  <div className="tokens-table-title-container">
                    <span className="tokens-table-title-container__main">
                      Assets
                    </span>
                    <span className="is-hidden tokens-table-title-container__sub">
                      Don't see your assets?
                    </span>
                  </div>

                  <AssetsTable tokenData={balances} loading={loading} />
                </div>
              </div>
            </div>
          </>
        );
      }
    }
    return <DisconnectedWallet onClick={handleConnect} />;
  };

  return (
    <div className="container">
      <Navbar />
      <MobileMenu />
      <NotificationSystem />
      <ConnectWalletModal />
      <TxHistoryModal />

      {renderWalletHome()}
    </div>
  );
};

export default WalletHome;
