
import _ from "underscore";
import EventManager from './events';
import * as ethers from 'ethers';
import TokenListManager from './tokenList';
import BN from 'bignumber.js';

import WalletConnectProvider from "@walletconnect/web3-provider";

const BigNumber = ethers.BigNumber;
const Utils = ethers.utils;
const Contract = ethers.Contract;

window.WalletJS = {
  currentNetworkId: -1,

  providerConfigs: {
    'walletConnect': {
    }
  },

  initialize: async function() {
    if (window.ethereum) {
      this.initListeners(window.ethereum);

      if (window.ethereum.selectedAddress) {
        // cache value
        this._currentConnectedNetworkId().then(function(chainId) {
          this.currentNetworkId = chainId;
        }.bind(this));
      }
    }

    window.erc20Abi = await (await fetch('/abi/erc20_standard.json')).json();
    window.oneSplitAbi = await (await fetch('/abi/test/OneSplit.json')).json();

    EventManager.listenFor(
      'initiateWalletConnect',
      this._connectWalletHandler.bind(this)
    );
  },

  initListeners: function(provider) {
    provider.on('accountsChanged', function (accounts) {
      // Time to reload your interface with accounts[0]!
      console.log(accounts);
      EventManager.emitEvent('walletUpdated', 1);
    });

    provider.on('disconnect', function(providerRpcError) {
      console.log(providerRpcError);
      EventManager.emitEvent('walletUpdated', 1);
    });

    provider.on('chainChanged', function(chainId) {
      console.log(chainId);
      if (this.isConnectedToAnyNetwork()) {

        this._currentConnectedNetworkId().then(function(chainId) {
          this.currentNetworkId = chainId;
          EventManager.emitEvent('walletUpdated', 1);
        }.bind(this));
      }
    }.bind(this));
  },

  getReadOnlyProvider: function() {
    var network = TokenListManager.getCurrentNetworkConfig();
    const provider = new ethers.providers.JsonRpcProvider(network.nodeProvider);
    const signer = provider.getSigner();
    return provider;
  },

  getProvider: function(strictCheck) {
    var condition = strictCheck ? this.isConnected() : this.isConnectedToAnyNetwork();

    if (condition) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      return provider;
    } else {
      return this.getReadOnlyProvider();
    }
  },

  getBalance: function(token) {
    if (this.isConnected()) {
      if (token.native) {
        return this.getDefaultBalance();
      }

      else if (token.address) {
        return this.getERC20Balance(token.address);
      }
    } else {
      return Promise.resolve(BigNumber.from(0));
    }
  },

  getDefaultBalance: function() {
    return this.getProvider().getBalance(this.currentAddress());
  },

  getERC20Balance: async function(tokenContractAddress) {
    const contract = new Contract(
      tokenContractAddress,
      window.erc20Abi,
      this.getProvider()
    );
    return await contract.balanceOf(this.currentAddress());
  },

  isSupported: function() {
    return (typeof window.ethereum !== 'undefined');
  },

  _currentConnectedNetworkId: async function() {
    if (!(window.ethereum && window.ethereum.selectedAddress)) {
      return -1;
    }

    else {
      let connectedNetwork = await this.getProvider().getNetwork();
      return connectedNetwork.chainId;
    }
  },

  isConnected: function() {
    return window.ethereum &&
      window.ethereum.selectedAddress &&
      this.isMatchingConnectedNetwork();
  },

  isConnectedToAnyNetwork: function() {
    return window.ethereum &&
      window.ethereum.selectedAddress;
  },

  isMatchingConnectedNetwork: function() {
    var network = TokenListManager.getCurrentNetworkConfig();
    return +network.chainId === +this.currentNetworkId;
  },

  currentAddress: function() {
    return this.isConnectedToAnyNetwork() ? window.ethereum.selectedAddress : undefined;
  },

  _changeNetwork: function(network) {
    return window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [network.chain]
    });
  },

  _connectWalletHandler: function(target) {
    if (target === "metamask") {
      this._connectProviderMetamask();
    } else if (target === "walletConnect") {
      // TODO disable for now
      return;
      this._connectProviderWalletConnect();
    }
  },

  _connectProviderWalletConnect: function() {
    const provider = new WalletConnectProvider({
      rpc: {
        137: "https://rpc-mainnet.maticvigil.com"
      },
    });

    provider.enable().then(function(v) {
      console.log(arguments);

      const web3Provider = new ethers.providers.Web3Provider(provider);

      window.PPP = web3Provider;
    }).catch(function(e) {
      console.error(e);
    });

    this.initListeners(provider);
  },

  _connectProviderMetamask: function() {
    return new Promise(function (resolve, reject) {
      let network = TokenListManager.getCurrentNetworkConfig();

      this._changeNetwork(network).then(function() {
        _.delay(function() {
          window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(function(accounts) {
              // Metamask currently only ever provide a single account
              const account = accounts[0];
              EventManager.emitEvent('walletUpdated', 1);

              return this._currentConnectedNetworkId().then(function(chainId) {
                this.currentNetworkId = chainId;
                EventManager.emitEvent('walletUpdated', 1);
                resolve(account);
              }.bind(this));

            }.bind(this))
            .catch(function(e) {
              console.error(e);
              reject(e);
            });
        }.bind(this), 1000)
      }.bind(this));
    }.bind(this));
  }
};

export default window.WalletJS;

