
import _ from "underscore";
import EventManager from './events';
import * as ethers from 'ethers';

const BigNumber = ethers.BigNumber;
const Utils = ethers.utils;
const Contract = ethers.Contract;

window.TokenListManager = {
  initialize: async function() {
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

    window.GAS_STATS = _.pick(gasStats, [
      'fast', 'fastest', 'safeLow'
    ]);
    window.TOKEN_LIST = tokenList;
    window.NATIVE_TOKEN = _.findWhere(tokenList, { native: true });
  },

  findTokenById: function(tid) {
    return _.find(window.TOKEN_LIST, function(v) {
      return v.address == tid || v.symbol == tid;
    });
  },

};

export default window.TokenListManager;

