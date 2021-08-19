import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Wallet from './utils/wallet';
import TokenListManager from './utils/tokenList';
import SwapFn from './utils/swapFn';
import TxQueue from './utils/txQueue';
import _ from 'underscore';
import { ethers } from 'ethers';
import BN from 'bignumber.js';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

const IS_MAIN_NETWORK = (process.env.IS_MAIN_NETWORK === "true");

if (process.env.IS_PRODUCTION) {
  Sentry.init({
    dsn: process.env.SENTRY_JS_DSN,
    environment: IS_MAIN_NETWORK ? 'production' : 'development',
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.5,
  });
}

window.ethers = ethers;
window._ = _;
window.BN = BN;
window.BigNumber = ethers.BigNumber;

if (IS_MAIN_NETWORK) {
  console.log("Loading MAIN config...");
} else {
  console.log("Loading TEST config...");
}

var config  = await fetch(
  IS_MAIN_NETWORK ?
    '/config/main.config.json' :
    '/config/test.config.json'
);
window.NETWORK_CONFIGS = await config.json();
// Default to the ETH network
window.SELECTED_NETWORK = _.findWhere(window.NETWORK_CONFIGS, { enabled: true }).name;

// initialize TokenList
await TokenListManager.updateTokenList();
await Wallet.initialize();
await SwapFn.initalize();
TxQueue.initalize();

if (Wallet.isMetamaskSupported()) {
  console.log('MetaMask is installed!');
} else {
  console.error('Metamask not installed!');
}

ReactDOM.render(<App />, document.getElementById('root'));
