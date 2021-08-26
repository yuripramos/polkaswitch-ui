import _ from "underscore";
import * as ethers from 'ethers';
import BN from 'bignumber.js'
import numeral from 'numeral';
import store from 'store';

import EventManager from './events';

const BigNumber = ethers.BigNumber;
const Utils = ethers.utils;
const Contract = ethers.Contract;

const DEFAULT_SWAP_SETTINGS = Object.freeze({
  gasSpeedSetting: 'safeLow',
  customGasPrice: 0,
  isCustomGasPrice: false,
  slippage: 0.5
});

window.Storage = {
  swapSettings: _.extend({}, DEFAULT_SWAP_SETTINGS),

  initialize: function() {
    let cachedSettings = store.get('settings');
    if (_.has(cachedSettings, 'gasSpeedSetting')) {
      this.swapSettings = _.extend(
        this.swapSettings,
        _.pick(cachedSettings, _.keys(DEFAULT_SWAP_SETTINGS))
      );
    }
  },

  clearSettings: function() {
    this.swapSettings = _.extend({}, DEFAULT_SWAP_SETTINGS);
    store.set('settings', this.swapSettings);
    EventManager.emitEvent('swapSettingsUpdated', 1);
  },

  updateSettings: function(settings) {
    this.swapSettings = _.extend(this.swapSettings, settings);
    store.set('settings', this.swapSettings)
    EventManager.emitEvent('swapSettingsUpdated', 1);
  },
}

export default window.Storage;
