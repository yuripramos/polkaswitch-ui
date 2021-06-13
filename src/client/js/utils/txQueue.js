import _ from "underscore";
import EventManager from './events';
import * as ethers from 'ethers';

const BigNumber = ethers.BigNumber;
const Utils = ethers.utils;
const Contract = ethers.Contract;

export default {
  _queue: {},

  queuePendingTx: function(data, confirms) {
    var hash = data.tx.hash;

    // TODO serialize _queue into window.localStorage eventually, so not lost on refresh
    this._queue[hash] = data;

    EventManager.emitEvent('txQueueUpdated', hash);

    data.tx.wait(confirms || 1).then(function(txReceipt) {
      console.log(txReceipt);
      console.log(`Transaction Hash: ${txReceipt.transactionHash}`);
      console.log(`Gas Used: ${txReceipt.gasUsed.toString()}`);
      this._queue[hash].receipt = txReceipt;
      this._queue[hash].success = true;
      EventManager.emitEvent('txQueueUpdated', hash);
      EventManager.emitEvent('txSuccess', hash);
    }.bind(this)).catch(function(err) {
      console.error(err);
      this._queue[hash].success = false;
      EventManager.emitEvent('txQueueUpdated', hash);
      EventManager.emitEvent('txFailed', hash);
    }.bind(this));
  },

  getQueue: function() {
    return this._queue;
  },

  numOfPending: function() {
    return _.keys(this._queue).length;
  },

  getTx: function(nonce) {
    return this._queue[nonce];
  }
};

