
import _ from "underscore";
import EventManager from './events';
import * as ethers from 'ethers';

const BigNumber = ethers.BigNumber;
const Utils = ethers.utils;
const Contract = ethers.Contract;

window.TokenListManager = {
  initialize: async function() {
    EventManager.listenFor('chainNetworkSettingsChanged', this.updateTokenList.bind(this));
  },

  updateTokenList: async function() {
    var network = _.findWhere(window.NETWORK_CONFIGS, { name: window.SELECTED_NETWORK });
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

