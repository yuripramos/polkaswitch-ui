import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Wallet from './utils/wallet';
import _ from 'underscore';
import { ethers } from 'ethers';

window.ethers = ethers;
window._ = _;

var t = await fetch('/tokens/erc20_list.json');
window.tokens = await t.json();
var tt = await fetch('/tokens/erc20_top_list.json');
window.topt = await tt.json();

window.tokens = _.map(_.filter(window.tokens, function(v) {
  return (v.coin) || window.ethers.utils.isAddress(v.id);
}), function(v) {
  if (v.id) {
    v.id = window.ethers.utils.getAddress(v.id);
  }
  return v;
});

window.tokens = _.filter(window.tokens, function(v) {
  return (v.coin) || (
    v.name && v.symbol && v.id && _.include(window.topt, v.id)
  );
});

window.tokens.push({
  "name": "METH Test Token",
  "symbol": "METH",
  "id": "0x798fA7Cf084129616B0108452aF3E1d5d1B32179"
});
window.tokens.push({
  "name": "MUNI Test Token",
  "symbol": "MUNI",
  "id": "0x806628fC9c801A5a7CcF8FfBC8a0ae3348C5F913"
});
window.tokens.push({
  "name": "MSUSHI Test Token",
  "symbol": "MSUSHI",
  "id": "0xFb9BCff3C409AF21a9a55E01717491aDEd7223B1"
});
window.tokens.push({
  "name": "MBAL Test Token",
  "symbol": "MBAL",
  "id": "0x99f23F9A4b3BBCBA9dDe9fe533C32649A555a939"
});

await Wallet.initialize();

if (Wallet.isSupported()) {
  console.log('MetaMask is installed!');
} else {
  console.error('Metamask not installed!');
}

ReactDOM.render(<App />, document.getElementById('root'));
