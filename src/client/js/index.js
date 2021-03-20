import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Wallet from './utils/wallet';

if (Wallet.isSupported()) {
  console.log('MetaMask is installed!');
} else {
  console.error('Metamask not installed!');
}

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

ReactDOM.render(<App />, document.getElementById('root'));
