import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Wallet from './utils/wallet';
import TokenListManager from './utils/tokenList';
import _ from 'underscore';
import { ethers } from 'ethers';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

if (process.env.IS_PRODUCTION) {
  Sentry.init({
    dsn: "https://841e0be7a1c74056b0cc8a763291be6c@o577869.ingest.sentry.io/5733634",
    integrations: [new Integrations.BrowserTracing()],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

window.ethers = ethers;
window._ = _;

var config  = await fetch('/config/test.config.json');
window.NETWORK_CONFIGS = await config.json();
window.SELECTED_NETWORK = "Ethereum";

await TokenListManager.updateTokenList();
await Wallet.initialize();

if (Wallet.isSupported()) {
  console.log('MetaMask is installed!');
} else {
  console.error('Metamask not installed!');
}

ReactDOM.render(<App />, document.getElementById('root'));
