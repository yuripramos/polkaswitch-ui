
module.exports = {
  iniitalize: function() {
    window.ethereum.on('accountsChanged', function (accounts) {
      // Time to reload your interface with accounts[0]!
    });

    window.ethereum.on('disconnect', function(providerRpcError) {
    });
  },

  isSupported: function() {
    return (typeof window.ethereum !== 'undefined');
  },

  isConnected: function() {
    return window.ethereum && window.ethereum.selectedAddress;
  },

  currentAddress: function() {
    return this.isConnected() ? window.ethereum.selectedAddress : undefined;
  },

  connectWallet: function() {
    return new Promise(function (resolve, reject) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(function(accounts) {
          // Metamask currently only ever provide a single account
          const account = accounts[0];
          console.log('Ethereum Account: ', account);
          resolve(account);
        })
        .catch(function(e) {
          console.error(e);
          reject(e);
        });
    });
  }
}

