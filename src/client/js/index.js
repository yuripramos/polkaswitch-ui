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
  "name": "Meth Test Token",
  "symbol": "METH",
  "id": "0x798fA7Cf084129616B0108452aF3E1d5d1B32179"
});

await Wallet.initialize();

if (Wallet.isSupported()) {
  console.log('MetaMask is installed!');
} else {
  console.error('Metamask not installed!');
}

ReactDOM.render(<App />, document.getElementById('root'));
