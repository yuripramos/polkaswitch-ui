import _ from "underscore";
import store from "store";
import BN from 'bignumber.js';
import { BigNumber, constants, providers, Signer, utils } from "ethers";

import Wallet from "./wallet";
import swapFn from "./swapFn";
import HopUtils from "./hop";
import Nxtp from "./nxtp";
import Storage from "./storage";

import { getRandomBytes32 } from "@connext/nxtp-utils";

export default {
  _signerAddress: '',
  _queue: {},

  initialize: async function() {
    this._queue = this.getQueue();
  },

  getBridgeInterface: function(nonce) {
    this._queue = this.getQueue();

    var tx = this.getTx(nonce);
    var bridgeOption = Storage.swapSettings.bridgeOption;

    if (tx?.bridge) {
      bridgeOption = tx.bridge;
    }

    if ("hop" === bridgeOption) {
      return HopUtils;
    } else {
      return Nxtp;
    }
  },

  getEstimate: function(
    sendingChainId,
    sendingAssetId,
    receivingChainId,
    receivingAssetId,
    amountBN,
    receivingAddress
  ) {
    this._queue = this.getQueue();

    const transactionId = getRandomBytes32();
    const bridgeInterface = this.getBridgeInterface();

    this._queue[transactionId] = {
      bridge: Storage.swapSettings.bridgeOption,
      sendingChainId,
      sendingAssetId,
      receivingChainId,
      receivingAssetId,
      amountBN,
      receivingAddress
    };

    return this.getBridgeInterface().getEstimate(
      transactionId,
      sendingChainId,
      sendingAssetId,
      receivingChainId,
      receivingAssetId,
      amountBN,
      receivingAddress
    );
  },

  transferStepOne: function(
    transactionId
  ) {
    const bridgeInterface = this.getBridgeInterface(transactionId);
    return bridgeInterface.transferStepOne(transactionId);
  },

  transferStepTwo: function(
    transactionId
  ) {
    const bridgeInterface = this.getBridgeInterface(transactionId);
    return bridgeInterface.transferStepTwo(transactionId);
  },

  twoStepTransferRequired: function(nonce) {
    var tx = this.getTx(nonce);
    if (!tx) {
      return false;
    }

    return "connext" === tx.bridge
  },

  getQueue: function() {
    this._signerAddress = Wallet.currentAddress();
    const queue = store.get(this._signerAddress) || {};
    return queue;
  },

  getTx: function(nonce) {
    return this.getQueue()[nonce];
  },
};

