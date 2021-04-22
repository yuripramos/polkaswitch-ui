
import _ from "underscore";
import EventManager from './events';

window.WalletJS = {
  ADDRESSES: {
    ONE_SPLIT: "0x689236A0C4A391FdD76dE5c6a759C7984166d166",
    ONE_SPLIT_VIEW: "0x4B5Dc79B38B6e75347Da6d9172Fa240F743401ad"
  },

  isValidNetwork: false,

  initialize: async function() {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', function (accounts) {
        // Time to reload your interface with accounts[0]!
        console.log(accounts);
        EventManager.emitEvent('walletUpdated', 1);
      });

      window.ethereum.on('disconnect', function(providerRpcError) {
        console.log(providerRpcError);
        EventManager.emitEvent('walletUpdated', 1);
      });

      if (window.ethereum.selectedAddress) {
        // cache value
        await this._isValidTestNetwork();
      }
    }

    window.erc20Abi = await (await fetch('/abi/erc20_standard.json')).json();
    window.oneSplitAbi = await (await fetch('/abi/test/OneSplit.json')).json();

    EventManager.listenFor('initiateWalletConnect', this.connectWallet.bind(this));
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
    var abi = await fetch(`/abi/test/${symbol.toUpperCase()}.json`);
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
      EventManager.emitEvent('walletUpdated', 1);
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

  getExpectedReturn: function(fromToken, toToken, amount) {
    if (!this.isConnected()) {
      return new Promise(function(resolve) {
        var _U = window.ethers.utils;
        var _p0 = _U.parseUnits("0", "wei");
        var _p1 = _U.parseUnits("1", "wei");
        resolve({
          returnAmount: amount.mul(_U.parseUnits("99", "wei")),
          distribution: [_p0, _p1, _p0, _p1, _p0, _p0, _p1]
        })
      });
    }

    const contract = new window.ethers.Contract(
      this.ADDRESSES.ONE_SPLIT,
      window.oneSplitAbi,
      this.getProvider()
    );
    return contract.getExpectedReturn(
      fromToken.id,
      toToken.id,
      amount, // uint256 in wei
      3, // desired parts of splits accross pools(3 is recommended)
      0  // the flag to enable to disable certain exchange(can ignore for testnet and always use 0)
    );

    /*
    returns(
      uint256 returnAmount,
      uint256[] memory distribution
    )
    */
  },

  /*
    function swap(
      IERC20 fromToken,
      IERC20 destToken,
      uint256 amount,
      uint256 minReturn,
      uint256[] memory distribution,
      uint256 flags
    ) public payable returns(uint256 returnAmount)
  */

  swap: function(fromToken, toToken, amount, minReturn, distribution) {
    const contract = new window.ethers.Contract(
      this.ADDRESSES.ONE_SPLIT,
      window.oneSplitAbi,
      this.getProvider()
    );
    return contract.swap(
      fromToken.id,
      toToken.id,
      amount, // uint256 in wei
      minReturn,
      distribution,
      0  // the flag to enable to disable certain exchange(can ignore for testnet and always use 0)
    );

    /*
    returns(
      uint256 returnAmount
    )
    */
  },

  isSupported: function() {
    return (typeof window.ethereum !== 'undefined');
  },

  _isValidTestNetwork: async function() {
    if (!(window.ethereum && window.ethereum.selectedAddress)) {
      this.isValidNetwork = false;
      return false;
    }

    else {
      let network = await this.getProvider().getNetwork();
      // moonbeam test-network ID
      this.isValidNetwork = (network.chainId === 1287);
      return this.isValidNetwork;
    }
  },

  isConnected: function() {
    return window.ethereum &&
      window.ethereum.selectedAddress &&
      this.isValidNetwork;
  },

  isConnectedToAnyNetwork: function() {
    return window.ethereum &&
      window.ethereum.selectedAddress;
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
          EventManager.emitEvent('walletUpdated', 1);

          return this._isValidTestNetwork().then(function(v) {
            EventManager.emitEvent('walletUpdated', 1);
            resolve(account);
          });
        }.bind(this))
        .catch(function(e) {
          console.error(e);
          reject(e);
        });
    }.bind(this));
  }
};

export default window.WalletJS;

