
window.WalletJS = {
  initialize: async function() {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', function (accounts) {
        // Time to reload your interface with accounts[0]!
        console.log(accounts);
      });

      window.ethereum.on('disconnect', function(providerRpcError) {
        console.log(providerRpcError);
      });
    }

    window.erc20Abi = await (await fetch('/abi/erc20_standard.abi')).json();
  },

  getProvider: function() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return provider;
  },

  getERC20Balance: async function(tokenContractAddress) {
    const contract = new window.ethers.Contract(
      tokenContractAddress,
      window.erc20Abi,
      this.getProvider()
    );
    return await contract.balanceOf(this.currentAddress());
  },

  findTokenById: function(tid) {
    return _.find(window.tokens, function(v) {
      return v.id == tid || v.symbol == tid;
    });
  },

  _mint: async function(symbol, value) {
    var abi = await fetch(`/abi/test/${symbol.toUpperCase()}.abi`);
    window.abiMeth = await abi.json();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const token = this.findTokenById(symbol);

    const incrementer = new window.ethers.Contract(token.id, abiMeth, signer);
    const contractFn = async () => {
      console.log(
        `Calling the mint function for: ${token.symbol} ${token.id}`
      );

      // Sign-Send Tx and Wait for Receipt
      const createReceipt = await incrementer.mint(window.ethereum.selectedAddress, value);
      await createReceipt.wait();

      console.log(`Tx successful with hash: ${createReceipt.hash}`);
    };

    const approveFn = async () => {
      console.log(
        `Calling the approve function in contract at address: ${methAddress}`
      );

      // Sign-Send Tx and Wait for Receipt
      const createReceipt = await incrementer.approve(window.ethereum.selectedAddress, value);
      await createReceipt.wait();

      console.log(`Tx successful with hash: ${createReceipt.hash}`);
    }

    await contractFn();
    // await approveFn();
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
};

module.exports = window.WalletJS;

