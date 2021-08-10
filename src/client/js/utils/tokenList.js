
import _ from "underscore";
import EventManager from './events';
import * as ethers from 'ethers';
let store = require('store');
const Utils = ethers.utils;

window.TokenListManager = {
  swap: {
    from:{},
    to:{}
  },

  getCurrentNetworkConfig: function() {
    var network = _.findWhere(window.NETWORK_CONFIGS, { name: window.SELECTED_NETWORK });
    return network;
  },

  updateNetwork: function(network) {
    window.SELECTED_NETWORK = network.name;

    this.updateTokenList().then(function() {
      EventManager.emitEvent('networkUpdated', 1);
      EventManager.emitEvent('walletUpdated', 1);
    });
  },

  updateTokenList: async function() {
    var network = this.getCurrentNetworkConfig();
    var tokenList = await(await fetch(network.tokenList)).json();
    var gasStats = await(await fetch(network.gasApi)).json();

    tokenList = _.map(_.filter(tokenList, function(v) {
      return (v.native) || (v.symbol && Utils.isAddress(v.address));
    }), function(v) {
      if (v.address) {
        v.address = Utils.getAddress(v.address);
      }
      return v;
    });

    // Binance Smart Chain GasAPI has different fields
    if (!gasStats.safeLow) {
      gasStats.safeLow = gasStats.standard;
      gasStats.fastest = gasStats.fast;
    }

    window.GAS_STATS = _.pick(gasStats, [
      'fast', 'fastest', 'safeLow'
    ]);
    window.TOKEN_LIST = tokenList;
    this.updateTokenListwithCustom(network);
    window.NATIVE_TOKEN = _.findWhere(tokenList, { native: true });
    // update swap token configuration
    const swap = {
      from: this.findTokenById(network.defaultPair.from),
      to: this.findTokenById(network.defaultPair.to),
    }
    this.updateSwapConfig(swap);
  },

  updateSwapConfig: function(swap) {
    this.swap = _.extend(this.getSwapConfig(), swap);
    store.set('swap', this.swap);
    EventManager.emitEvent('swapConfigUpdated', 1);
  },

  getSwapConfig: function () {
    return this.swap;
  },

  findTokenById: function(tid) {
    return _.find(window.TOKEN_LIST, function(v) {
      return v.address === tid || v.symbol === tid;
    });
  },

  updateTokenListwithCustom: function (network) {
    const customTokenAddresses = store.get('customTokenAddress');

    if (customTokenAddresses) {
      const addresses = customTokenAddresses[network.chainId] || [];
      if (addresses.length > 0) {
        window.TOKEN_LIST = window.TOKEN_LIST.concat(customTokenAddresses[network.chainId]);
      }
    }
  },

  addCustomToken: function(token) {
    const  network = this.getCurrentNetworkConfig();
    const chainId = network.chainId;
    let customToken = token;

    if (chainId > 0) {
      customToken.chainId = Number(chainId);
      customToken.address = Utils.getAddress(customToken.address);
      const customTokenAddresses = store.get('customTokenAddress') || {};
      let addresses = [];

      if (!_.isEmpty(customTokenAddresses) && (!_.isUndefined(customTokenAddresses[chainId]))) {
        addresses = customTokenAddresses[chainId];
      }

      addresses.push(customToken);
      store.set('customTokenAddress', {[chainId]: addresses});
      this.updateTokenListwithCustom(network);
    }
  }

};

export default window.TokenListManager;

