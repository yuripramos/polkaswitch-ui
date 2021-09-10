import _ from "underscore";
import * as ethers from 'ethers';
import BN from 'bignumber.js'
import numeral from 'numeral';
import store from 'store';

import EventManager from './events';
import * as React from "react";
import { ConnextSdk, TransferQuote } from "@connext/vector-sdk";

const BigNumber = ethers.BigNumber;
const Utils = ethers.utils;
const Contract = ethers.Contract;

const Sdk = () => {
  const connextSdk = new ConnextSdk();

  const init = async () => {
    try {
      await connextSdk.init({
        routerPublicIdentifier: "vector892GMZ3CuUkpyW8eeXfW2bt5W73TWEXtgV71nphXUXAmpncnj8", // Router Public Identifier
        // loginProvider: undefined, // Web3/JsonRPCProvider
        senderChainProvider: "https://rpc-mainnet.maticvigil.com", // Rpc Provider Link
        senderAssetId: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // Asset/Token Address on Sender Chain
        recipientChainProvider: "https://bsc-dataseed.binance.org", // Rpc Provider Link
        recipientAssetId: "0x55d398326f99059fF775485246999027B3197955", // Asset/Token Address on Recipient Chain
      });
    } catch (e) {
      const message = "Error initalizing";
      console.log(e, message);
      throw e;
    }
  };

  const getEstimatedFee = async (input) => {
    try {
      const res = await connextSdk.estimateFees({
        transferAmount: input,
      });
      console.log(res);
      return res.transferQuote;
    } catch (e) {
      const message = "Error Estimating Fees";
      console.log(message, e);
    }
  };

  const deposit = async (transferAmount) => {
    try {
      await connextSdk.deposit({
        transferAmount,
        webProvider,
        onDeposited: function (params) {
          console.log("On deposit ==>", params);
        }, // onFinished callback function
      });
    } catch (e) {
      console.log("Error during deposit", e);
    }
  }


  const crossChainSwap = async (input, withdrawalAddress) => {
    try {
      await connextSdk.crossChainSwap({
        recipientAddress: window.ethereum.selectedAddress, // Recipient Address
        transferQuote: await getEstimatedFee(input),
        onTransfered: function() {
          console.log("onTransfered", arguments);
        },
        onFinished: function(params) {
          console.log("On finish ==>", params);
        }, // onFinished callback function
      });
    } catch (e) {
      console.log("Error at crossChain Swap", e);
      throw e;
    }
  };

  return <></>;
};

export default Sdk;
