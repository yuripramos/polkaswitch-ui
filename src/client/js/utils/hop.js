import _ from "underscore";
import EventManager from './events';
import Wallet from "./wallet";
import TxQueue from './txQueue';
import * as ethers from 'ethers';
import TokenListManager from './tokenList';
import Storage from './storage';
import BN from 'bignumber.js';
import { BigNumber, constants, providers, Signer, utils } from "ethers";
import swapFn from "./swapFn";

import { Hop, Chain } from '@hop-protocol/sdk'

// never exponent
BN.config({ EXPONENTIAL_AT: 1e+9 });

window.NxtpUtils = {
  _queue: {},
  _sdk: false,

  _activeTxs: [],
  _historicalTxs: [],

  _storeKey: () => {
    return `connext_${Wallet.currentAddress()}`;
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

    var sdk = this._sdk = new NxtpSdk(
      { chainConfig: chainProviders, signer: signer },
      new Logger({ name: "NxtpSdk", level: "info" }),
      process.env.REACT_APP_NETWORK || "mainnet",
    );

    this.attachNxtpSdkListeners(sdk);
    return sdk;
  },

  resetSdk: function() {
    console.log("Nxtp SDK reset");

    if (this._sdk) {
      //detach all listeners
      this._sdk.removeAllListeners();
      this._sdk.detach();
    }

    this._sdk = false;
    this._queue = {};
    this._activeTxs = [];
    this._historicalTxs = [];
  },

  fetchActiveTxs: async function() {
    if (!this._sdk) {
      return;
    }
    this._activeTxs = await this._sdk.getActiveTransactions();
    console.log("activeTxs: ", this._activeTxs);
  },

  fetchHistoricalTxs: async function() {
    if (!this._sdk) {
      return;
    }
    this._historicalTxs = await this._sdk.getHistoricalTransactions();
    console.log("historicalTxs: ", this._historicalTxs);
  },

  attachNxtpSdkListeners: function(_sdk) {
    if (!_sdk) {
      return;
    }

    _sdk.attach(NxtpSdkEvents.SenderTransactionFulfilled, async (data) => {
      console.log("SenderTransactionFulfilled:", data);
      this.removeActiveTx(data.txData.transactionId)
      EventManager.emitEvent('nxtpEventUpdated', NxtpSdkEvents.SenderTransactionFulfilled);
    });

  },

  getTransferQuoteV2: async function (
    sendingChainId,
    sendingAssetId,
    receivingChainId,
    receivingAssetId,
    amountBN,
    receivingAddress
  ) {
    if (!Wallet.isConnected()) {
      console.error("Nxtp: Wallet not connected");
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

    let callToAddr, callData, expectedReturn;

    // if same token on both chains, don't do getExpectedReturn
    if (bridgeAsset.address !== receivingAsset.address) {
      callToAddr = receivingChain.crossChainAggregatorAddress;
      console.log(`callToAddr = ${callToAddr}`);

      let aggregator = new utils.Interface(window.crossChainOneSplitAbi);

      // NXTP has a 0.05% flat fee
      let o1 = BN(utils.formatUnits(amountBN, sendingAsset.decimals))
        .times(0.9995)
        .times(10 ** bridgeAsset.decimals)
        .toString()
      let estimatedOutputBN = utils.parseUnits(swapFn.validateEthValue(bridgeAsset, o1), 0);

      expectedReturn = await swapFn.getExpectedReturn(
        bridgeAsset,
        receivingAsset,
        estimatedOutputBN,
        receivingChainId
      );

      let distBN = _.map(expectedReturn.distribution, function(e) {
        return window.ethers.utils.parseUnits("" + e, "wei");
      });

      // TODO missing the options i.e { gasprice, value }
      callData = aggregator.encodeFunctionData("swap", [
        bridgeAsset.address,
        receivingAssetId,
        estimatedOutputBN,
        BigNumber.from(0), //TODO: Add MinReturn/Slippage
        receivingAddress,
        distBN,
        0
      ]);
    }

    // Create txid
    const transactionId = getRandomBytes32();

    const quote = await this._sdk.getTransferQuote({
      callData,
      sendingAssetId,
      sendingChainId,
      receivingChainId,
      receivingAssetId: bridgeAsset.address,
      receivingAddress,
      amount: amountBN.toString(),
      transactionId,
      expiry: Math.floor(Date.now() / 1000) + 3600 * 24 * 3, // 3 days
      callTo: callToAddr
    });

    this._queue[transactionId] = {
      quote: quote,
      expectedReturn: expectedReturn
    }

    return {
      id: transactionId,
      returnAmount: expectedReturn ? expectedReturn.returnAmount : quote.bid.amountReceived
    };
  },

  transferStepOne: async function (transactionId) {
    const transferQuote = this._queue[transactionId]?.quote;

    if (!transferQuote) {
      throw new Error("Please request quote first");
    }

    if (!Wallet.isConnected()) {
      //if (injectedProviderChainId !== auctionResponse.bid.sendingChainId) {
      return false;
    }

    const transfer = await this._sdk.prepareTransfer(transferQuote, true);
    console.log("transfer: ", transfer);
    // WAIT on Events at this point

    return transfer;
  },

  transferStepTwo: async function(transactionId) {
    const tx = this.getActiveTx(transactionId);

    const { bidSignature, encodedBid, encryptedCallData } = tx;
    const { receiving, sending, invariant } = tx.crosschainTx;
    const variant = receiving ?? sending;
    const sendingTxData = {
      ...invariant,
      ...sending,
    };

    const receivingTxData =
      typeof receiving === "object"
      ? {
        ...invariant,
        ...receiving,
      }
      : undefined;

    const finish = await this._sdk.fulfillTransfer({
      bidSignature, encodedBid, encryptedCallData, txData: receivingTxData
    });

    console.log("finish: ", finish);

    if (finish.metaTxResponse?.transactionHash || finish.metaTxResponse?.transactionHash === "") {
      this.removeActiveTx(receivingTxData.transactionId)
    }
  },

  getAllActiveTxs: function() {
    return this._activeTxs.map((x) => x);
  },

  getAllHistoricalTxs: function() {
    return this._historicalTxs.map((x) => x);
  }
};

export default window.NxtpUtils;
