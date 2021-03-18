import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import Wallet from './utils/wallet';

if (Wallet.isSupported()) {
  console.log('MetaMask is installed!');
} else {
  console.error('Metamask not installed!');
}

ReactDOM.render(<App />, document.getElementById('root'));
