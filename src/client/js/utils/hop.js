import _ from "underscore";
import EventManager from './events';
import Wallet from "./wallet";
import * as ethers from 'ethers';
import TokenListManager from './tokenList';
import Storage from './storage';
import BN from 'bignumber.js';
import { BigNumber, constants, providers, Signer, utils } from "ethers";
import swapFn from "./swapFn";

import { Hop, Chain } from '@hop-protocol/sdk'

// never exponent
BN.config({ EXPONENTIAL_AT: 1e+9 });

window.HopUtils = {
  _sdk: false,

  _activeTxs: [],
  _historicalTxs: [],

  _storeKey: () => {
    return `hop_${Wallet.currentAddress()}`;
  },

  initalize: async function() {
    EventManager.listenFor('walletUpdated', this.resetSdk.bind(this));

    if (Wallet.isConnected()) {
      this._sdk = await this.initalizeSdk();
    }
  },

  isSdkInitalized: function() {
    return !!this._sdk;
  },

  initalizeSdk: async function() {
    const signer = Wallet.getProvider().getSigner();

    var sdk = this._sdk = (new Hop()).connect(signer);

    this._attachSdkListeners(sdk);
    return sdk;
  },

  resetSdk: function() {
    console.log("Nxtp SDK reset");

    if (this._sdk) {
      //detach all listeners
      // TODO
      // this._sdk.removeAllListeners();
      // this._sdk.detach();
    }

    this._sdk = false;
    this._activeTxs = [];
    this._historicalTxs = [];
  },

  _attachSdkListeners: function(_sdk) {
    if (!_sdk) {
      return;
    }
  },

  getEstimate: async function (
    sendingChainId,
    sendingAssetId,
    receivingChainId,
    receivingAssetId,
    amountBN,
    receivingAddress
  ) {
    if (!Wallet.isConnected()) {
      console.error("Hop: Wallet not connected");
      return false;
    }

    if (!this._sdk) {
      this._sdk = await this.initalizeSdk();
    }

    const sendingChain = TokenListManager.getNetworkById(sendingChain);
    const receivingChain = TokenListManager.getNetworkById(receivingChainId);
    const receivingAsset = TokenListManager.findTokenById(receivingAssetId, receivingChain);
    const sendingAsset = TokenListManager.findTokenById(sendingAssetId);
    const bridgeAsset = TokenListManager.findTokenById(sendingAsset.symbol, receivingChain);

    const hopSendingChain = new Chain(
      sendingChain.name,
      sendingChain.chainId,
      sendingChain.nodeProvider
    );
    const hopReceivingChain = new Chain(
      receivingChain.name,
      receivingChain.chainId,
      receivingChain.nodeProvider
    );
    const hopBridge = this._sdk.bridge(sendingAsset.symbol);

    const amountOut = bridge.getAmountOut(
      amountBN.toString(),
      hopSendingChain,
      hopReceivingChain
    );
    const bonderFee = bridge.getTotalFee(
      amountBN.toString(),
      hopSendingChain,
      hopReceivingChain
    );

    return {
      transactionFee: bonderFee,
      returnAmount: amountOut
    };
  },

  transfer: async function(
    sendingChainId,
    sendingAssetId,
    receivingChainId,
    receivingAssetId,
    amountBN,
    receivingAddress
  ) {
    if (!Wallet.isConnected()) {
      console.error("Hop: Wallet not connected");
      return false;
    }

    if (!this._sdk) {
      this._sdk = await this.initalizeSdk();
    }

    const sendingChain = TokenListManager.getNetworkById(sendingChain);
    const receivingChain = TokenListManager.getNetworkById(receivingChainId);
    const receivingAsset = TokenListManager.findTokenById(receivingAssetId, receivingChain);
    const sendingAsset = TokenListManager.findTokenById(sendingAssetId);
    const bridgeAsset = TokenListManager.findTokenById(sendingAsset.symbol, receivingChain);

    const hopSendingChain = new Chain(
      sendingChain.name,
      sendingChain.chainId,
      sendingChain.nodeProvider
    );
    const hopReceivingChain = new Chain(
      receivingChain.name,
      receivingChain.chainId,
      receivingChain.nodeProvider
    );
    const hopBridge = this._sdk.bridge(sendingAsset.symbol);

    const tx = await bridge.send(
      amountBN.toString(),
      hopSendingChain,
      hopReceivingChain
    );

    this._sdk
      .watch(tx.hash, sendingAsset.symbol, hopSendingChain, hopReceivingChain)
      .on('receipt', data => {
        const { receipt, chain } = data
        console.log(receipt, chain)
      });

    return true;
  },

  getAllActiveTxs: function() {
    return this._activeTxs.map((x) => x);
  },

  getAllHistoricalTxs: function() {
    return this._historicalTxs.map((x) => x);
  }
};

export default window.HopUtils;
