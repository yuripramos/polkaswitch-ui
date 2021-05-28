import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Wallet from './utils/wallet';
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

var t = await fetch('/tokens/erc20_list.json');
window.tokens = await t.json();
var tt = await fetch('/tokens/erc20_top_list.json');
window.topt = await tt.json();

window.tokens = _.map(_.filter(window.tokens, function(v) {
  return (v.coin) || window.ethers.utils.isAddress(v.address);
}), function(v) {
  if (v.address) {
    v.address = window.ethers.utils.getAddress(v.address);
  }
  return v;
});

window.tokens = _.filter(window.tokens, function(v) {
  return (v.coin) || (
    v.name && v.symbol && v.address && _.include(window.topt, v.address)
  );
});

window.tokens.push({
  "name": "METH Test Token",
  "symbol": "METH",
  "address": "0x798fA7Cf084129616B0108452aF3E1d5d1B32179",
  "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png"
});
window.tokens.push({
  "name": "MUNI Test Token",
  "symbol": "MUNI",
  "address": "0x806628fC9c801A5a7CcF8FfBC8a0ae3348C5F913",
  "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png"
});
window.tokens.push({
  "name": "MSUSHI Test Token",
  "symbol": "MSUSHI",
  "address": "0xFb9BCff3C409AF21a9a55E01717491aDEd7223B1",
  "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xFb9BCff3C409AF21a9a55E01717491aDEd7223B1/logo.png"
});
window.tokens.push({
  "name": "MBAL Test Token",
  "symbol": "MBAL",
  "address": "0x99f23F9A4b3BBCBA9dDe9fe533C32649A555a939",
  "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x99f23F9A4b3BBCBA9dDe9fe533C32649A555a939/logo.png"
});

await Wallet.initialize();

if (Wallet.isSupported()) {
  console.log('MetaMask is installed!');
} else {
  console.error('Metamask not installed!');
}

ReactDOM.render(<App />, document.getElementById('root'));
