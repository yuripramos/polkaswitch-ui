import React, { useState } from "react";
import Navbar from "../partials/navbar/Navbar";
import ConnectWalletModal from "../partials/ConnectWalletModal";
import TxHistoryModal from "../partials/TxHistoryModal";
import NotificationSystem from "../partials/NotificationSystem";
import MobileMenu from "../partials/navbar/MobileMenu";
import NetworkPrice from "../partials/wallet/NetworkPrice";
import NetworkDropdown from "../partials/swap/NetworkDropdown";
import AssetsTable from "../partials/wallet/AssetsTable";
import DisconnectedWallet from "../partials/wallet/DisconnectedWallet";
import networks from "../../Web3/networks";
import EmptyBalances from "../partials/wallet/EmptyBalances";

import { ethers } from "@connext/nxtp-utils/node_modules/ethers";
import BigNumber from "bignumber.js";

import _ from "underscore";
import classnames from 'classnames';

import Wallet from '../../utils/wallet';
import TokenListManager from '../../utils/tokenList';
import EventManager from '../../utils/events';

export default class WalletHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: Date.now(),
      currentNetwork: TokenListManager.getCurrentNetworkConfig(),
      balances: []
    };

    this.NETWORKS = _.filter(window.NETWORK_CONFIGS, (v) => { return v.enabled });

    this.loadBalances = this.loadBalances.bind(this);
    this.handleWalletChange = this.handleWalletChange.bind(this);
    this.handleConnect = this.handleConnect.bind(this);
    this.renderBalancesAccrossNetworks = this.renderBalancesAccrossNetworks.bind(this);
    this.renderPortfolioMakeUp = this.renderPortfolioMakeUp.bind(this);
    this.renderWalletHome = this.renderWalletHome.bind(this);
  }

  componentDidMount() {
    this.subWalletChange = EventManager.listenFor(
      'walletUpdated', this.handleWalletChange
    );

    this.loadBalances();
  }

  componentWillUnmount() {
    this.subWalletChange.unsubscribe();
  }

  handleWalletChange() {
    this.setState({
      refresh: Date.now(),
      balances: []
    });

    this.loadBalances();
  }

  handleConnect() {
    EventManager.emitEvent('promptWalletConnect', 1);
  }

  handleNetworkChange() {
    this.setState({
      balances: [],
      currentNetwork: network
    });

    this.loadBalances();
  }

  loadBalances() {
    var currentNetwork = this.state.currentNetwork;

    let balances = [];

    this.NETWORKS.forEach((network) => {
      let tokenList = TokenListManager.getTokenListForNetwork(network);

      tokenList.forEach((token) => {
        let balance = Wallet.getBalance(token, network);

        if (!balance.isZero()) {
          balances.push({
            ...token,
            balance: (+balance.toString()) / (Math.pow(10, token.decimals)),
            balanceBN: balance,
            price: 1
          });
        }
      });
    });

    this.setState({
      balances: balances
    });
  }

  renderBalancesAccrossNetworks() {
    const bMap = this.state.balances.reduce((_map, cv) => {
      let balance = 0;
      if (_map[cv.chainId]) {
        balance += _map[cv.chainId];
      }
      balance += cv.balance * cv.price;
      return { ..._map, [cv.chainId]: balance };
    }, {});

    return Object.keys(bMap).map((netId) => {
      return (
        <NetworkPrice
          key={netId}
          logoURI={networks[netId].logoURI}
          name={networks[netId].name}
          value={bMap[netId]}
          change={0}
        />
      );
    });
  }

  renderPortfolioMakeUp() {
    if (Wallet.isConnected() && this.state.balances.length) {
      return (
        <>
        <div className="columns is-hidden-mobile">
          <div className="column">
            <div className="portfolio-makeup__heading">Portfolio Makeup</div>
          </div>
        </div>

        <div className="columns is-hidden-mobile portfolio-makeup">{this.renderBalancesAccrossNetworks()}</div>
        </>
      );
    }
    return null;
  }

  renderWalletHome() {
    if (Wallet.isConnected()) {
      if (!this.state.balances.length && this.state.currentNetwork === undefined) {
        return <EmptyBalances />;
      } else {
        return (
          <>
          <div className="columns is-centered">
            <div className="column card-container">
              <div className="card wallets-page-card">
                <div className="columns portfolio-balance">
                  <div className="column">
                    <h6 className="portfolio-balance__main-heading">Portfolio Balance</h6>

                    <NetworkDropdown
                      handleDropdownClick={this.handleNetworkChange}
                      selected={this.state.currentNetwork}
                    />
                  </div>
                </div>

                <div className="columns total-balance">
                  <div className="column">
                    <h6 className="total-balance__sub-heading">Total Balance</h6>
                    <h2 className="total-balance__main-heading">
                      {this.state.balances
                          .reduce((p, t) => {
                            return (p += t.price * t.balance);
                          }, 0)
                          .toLocaleString("en-US", { style: "currency", currency: "USD" })}
                        </h2>
                      </div>
                    </div>

                    {this.renderPortfolioMakeUp()}
                  </div>
                </div>
              </div>
          <div className="columns is-centered">
            <div className="column card-container">
              <div className="card wallets-page-card">
                <div className="tokens-table-title-container">
                  <span className="tokens-table-title-container__main">Assets</span>
                  <span className="tokens-table-title-container__sub">Don't see your assets?</span>
                </div>

                <AssetsTable tokenData={this.state.balances} />
              </div>
            </div>
          </div>
          </>
        );
      }
    }
    return <DisconnectedWallet onClick={this.handleConnect} />;
  }

  render() {
    return (
      <div className="container">
        <Navbar />
        <MobileMenu />
        <NotificationSystem />
        <ConnectWalletModal />
        <TxHistoryModal />

        {this.renderWalletHome()}
      </div>
    );
  }
}
