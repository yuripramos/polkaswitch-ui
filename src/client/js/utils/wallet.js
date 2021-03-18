
module.exports = {
  iniitalize: function() {
    window.ethereum.on('accountsChanged', function (accounts) {
      // Time to reload your interface with accounts[0]!
    });

    window.ethereum.on('disconnect', function(providerRpcError) {
    });
  },
}

