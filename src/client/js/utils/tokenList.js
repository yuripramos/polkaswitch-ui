
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
    });
  },

  updateTokenList: async function() {
    var network = this.getCurrentNetworkConfig();
    var tokenList = await(await fetch(network.tokenList)).json();

    tokenList = _.map(_.filter(tokenList, function(v) {
      return (v.coin) || (v.symbol && Utils.isAddress(v.address));
    }), function(v) {
      if (v.address) {
        v.address = Utils.getAddress(v.address);
      }
      return v;
    });

    window.TOKEN_LIST = tokenList;
  },

  findTokenById: function(tid) {
    return _.find(window.TOKEN_LIST, function(v) {
      return v.address == tid || v.symbol == tid;
    });
  },

};

export default window.TokenListManager;

