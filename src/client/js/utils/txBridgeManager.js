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

  initialize: async function() {},

  getBridgeInterface: function(nonce) {
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
    var tx = this.getTx(transactionId);
    return bridgeInterface.transferStepOne(
      transactionId,
      tx.sendingChainId,
      tx.sendingAssetId,
      tx.receivingChainId,
      tx.receivingAssetId,
      tx.amountBN,
      tx.receivingAddress
    );
  },

  transferStepTwo: function(
    transactionId
  ) {
    const bridgeInterface = this.getBridgeInterface(transactionId);
    var tx = this.getTx(transactionId);
    return bridgeInterface.transferStepTwo(
      transactionId,
      tx.sendingChainId,
      tx.sendingAssetId,
      tx.receivingChainId,
      tx.receivingAssetId,
      tx.amountBN,
      tx.receivingAddress
    );
  },

  twoStepTransferRequired: function(nonce) {
    var tx = this.getTx(nonce);
    if (!tx) {
      return false;
    }

    return "connext" === tx.bridge
  },

  getTx: function(nonce) {
    return this._queue[nonce];
  },
};

