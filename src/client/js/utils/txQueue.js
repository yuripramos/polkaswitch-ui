import _ from "underscore";
import EventManager from './events';
import * as ethers from 'ethers';
import Wallet from "./wallet";
let store = require('store')
const BigNumber = ethers.BigNumber;
const Utils = ethers.utils;
const Contract = ethers.Contract;

export default {
  _signerAddress: '',
  _queue: {},

  queuePendingTx: function(data, confirms) {
    const queue = this.getQueue()
    if (queue) {
      this._queue = queue;
    }
    var hash = data.tx.hash;
    data.lastUpdated = Date.now();
    data.completed = false;
    data.success = false;

    this._queue[hash] = data;
    if (this._signerAddress && (this._signerAddress.length > 0)) {
      store.set(this._signerAddress, this._queue)
      EventManager.emitEvent('txQueueUpdated', hash);
    }

    data.tx.wait(confirms || 1).then(function (txReceipt) {
      console.log(txReceipt);
      console.log(`Transaction Hash: ${txReceipt.transactionHash}`);
      console.log(`Gas Used: ${txReceipt.gasUsed.toString()}`);
      this._queue[hash].receipt = txReceipt;
      this._queue[hash].success = true;
      this._queue[hash].completed = true;
      this._queue[hash].lastUpdated = Date.now();
      store.set(this._signerAddress, this._queue)
      EventManager.emitEvent('txQueueUpdated', hash);
      EventManager.emitEvent('txSuccess', hash);
    }.bind(this)).catch(function (err) {
      console.error(err);
      this._queue[hash].completed = true;
      this._queue[hash].success = false;
      this._queue[hash].lastUpdated = Date.now();
      store.set(this._signerAddress, this._queue)
      EventManager.emitEvent('txQueueUpdated', hash);
      EventManager.emitEvent('txFailed', hash);
    }.bind(this));
  },

  getQueue: function() {
    this._signerAddress = Wallet.currentAddress();
    const queue = store.get(this._signerAddress) || {};
    return queue;
  },

  numOfPending: function() {
    return _.keys(this.getQueue()).length;
  },

  getTx: function(nonce) {
    return this.getQueue()[nonce];
  }
};

