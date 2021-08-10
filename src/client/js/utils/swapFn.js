
import _ from "underscore";
import EventManager from './events';
import TxQueue from './txQueue';
import * as ethers from 'ethers';
import TokenListManager from './tokenList';
import Wallet from './wallet';
import BN from 'bignumber.js';
import { ApprovalState } from "../constants/Status";
let store = require('store');

// never exponent
BN.config({ EXPONENTIAL_AT: 1e+9 });

const BigNumber = ethers.BigNumber;
const Utils = ethers.utils;
const Contract = ethers.Contract;

window.SwapFn = {
  settings: {
    gasPrice: 0, // auto,
    isCustomGasPrice: false,
    slippage: 0.5
  },

  initalize: function() {
    const cachedSettings = store.get('settings');
    const cachedSwap = store.get('swap');
    this.settings = _.extend(this.settings, cachedSettings);
    this.swap = _.extend(this.swap, cachedSwap);
  },

  validateEthValue: function(token, value) {
    var targetAmount = +value;

    if(!isNaN(targetAmount)) {
      if (targetAmount === 0) {
        return value;
      }

      // floor to the minimum possible value
      targetAmount = Math.max(10 ** (-token.decimals), targetAmount);

      targetAmount = BN(
        BN(targetAmount).toFixed(token.decimals)
      ).toString();
      return targetAmount;
    } else {
      return undefined;
    }
  },

  updateSettings: function(settings) {
    this.settings = _.extend(this.getSetting(), settings);
    store.set('settings', this.settings)
    EventManager.emitEvent('swapSettingsUpdated', 1);
  },

  getSetting: function () {
    return this.settings;
  },

  updateSwapConfig: function(swap) {
    this.swap = _.extend(this.getSwapConfig(), swap);
    store.set('swap', this.swap)
    EventManager.emitEvent('swapConfigUpdated', 1);
  },

  getSwapConfig: function () {
    return this.swap;
  },

  calculateMinReturn: function(fromToken, toToken, amount) {
    return this.getExpectedReturn(
      fromToken, toToken, amount
    ).then(function(actualReturn) {
      var y = 1.0 - (this.settings.slippage / 100.0);
      var r = BN(actualReturn.returnAmount.toString()).times(y);

      var minReturn = Utils.formatUnits(r.toFixed(0), toToken.decimals);

      return minReturn;
    }.bind(this));
  },

  calculateEstimatedTransactionCost: function(fromToken, toToken, amountBN, distribution) {
    const signer = Wallet.getProvider().getSigner();
    const contract = new Contract(
      TokenListManager.getCurrentNetworkConfig().aggregatorAddress,
      window.oneSplitAbi,
      signer
    );

    return contract.estimateGas.swap(
      fromToken.address,
      toToken.address,
      amountBN, // uint256 in wei
      BigNumber.from(0),
      distribution,
      0,  // the flag to enable to disable certain exchange(can ignore for testnet and always use 0)
      {
        // gasPrice: // the price to pay per gas
        // gasLimit: // the limit on the amount of gas to allow the transaction to consume; any unused gas is returned at the gasPrice,
        value: fromToken.native ? amountBN : undefined,
        gasPrice: this.settings.gasPrice > 0
        ? Utils.parseUnits("" + this.settings.gasPrice, "gwei")
        : undefined
      }
    ).then(function(gasUnitsEstimated) {
      // Returns the estimate units of gas that would be
      // required to execute the METHOD_NAME with args and overrides.
      return Utils.formatUnits(Utils.parseUnits("" +
        Math.floor((this.settings.gasPrice > 0 ?
          this.settings.gasPrice :
          window.GAS_STATS.safeLow) * gasUnitsEstimated.toString()),
        "gwei"
      ));
    }.bind(this));

  },

  calculatePriceImpact: function(fromToken, toToken, amount) {
    return this._findSmallResult(
      fromToken, toToken, 1
    ).then(function(small) {
      const [smallResult, smallAmount] = small;

      return this.getExpectedReturn(
        fromToken, toToken, amount
      ).then(function(actualReturn) {
        var x = BN(smallResult.returnAmount.toString())
          .div(BN(smallAmount.toString()));
        var y = BN(actualReturn.returnAmount.toString())
          .div(BN(amount.toString()));

        return x.minus(y).abs().div(x).toFixed(6);
      }.bind(this));
    }.bind(this));
  },

  _smallResultCache: {},

  _findSmallResult: function(fromToken, toToken, factor) {

    if (this._smallResultCache[`${fromToken.symbol}-${toToken.symbol}`]) {
      return Promise.resolve(this._smallResultCache[`${fromToken.symbol}-${toToken.symbol}`]);
    }

    let smallAmount = Utils.parseUnits(
      "" + Math.ceil(10 ** (factor * 3)), 0
    );

    return this.getExpectedReturn(
      fromToken, toToken, smallAmount
    ).then(function(smallResult) {
      if (smallResult.returnAmount.gt(100)) {
        this._smallResultCache[`${fromToken.symbol}-${toToken.symbol}`] = [smallResult, smallAmount];
        return [smallResult, smallAmount];
      }
      else {
        return this._findSmallResult(fromToken, toToken, factor + 1);
      }
    }.bind(this));
  },

  _mint: async function(symbol, value) {
    var abi = await fetch(`/abi/test/${symbol.toUpperCase()}.json`);
    window.abiMeth = await abi.json();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const token = TokenListManager.findTokenById(symbol);

    const incrementer = new Contract(token.address, abiMeth, signer);
    const contractFn = async () => {
      console.log(
        `Calling the mint function for: ${token.symbol} ${token.address}`
      );

      // Sign-Send Tx and Wait for Receipt
      const createReceipt = await incrementer.mint(window.ethereum.selectedAddress, value);
      await createReceipt.wait();

      console.log(`Tx successful with hash: ${createReceipt.hash}`);
      EventManager.emitEvent('walletUpdated', 1);
    };

    await contractFn();
  },

  performSwap: function(fromToken, toToken, amountBN, distribution) {
    return this._swap(fromToken, toToken, amountBN, distribution);
  },

  performApprove: function(fromToken, amountBN) {
    return this._approve(
      fromToken.address,
      // approve arbitrarily large number
      amountBN.add(BigNumber.from(Utils.parseUnits("100000000")))
    );
  },

  getApproveStatus: function(token, amountBN) {
    return this._getAllowance(token).then(function(allowanceBN) {
      console.log('allowanceBN', allowanceBN);
      if (token.native || allowanceBN.gte(amountBN)) {
        return Promise.resolve(ApprovalState.APPROVED);
      } else {
        return Promise.resolve(ApprovalState.NOT_APPROVED);
      }
    }.bind(this));
  },

  _approve: function(tokenContractAddress, amountBN) {
    console.log(`Calling APPROVE() with ${tokenContractAddress} ${amountBN.toString()}`);
    const signer = Wallet.getProvider().getSigner();
    const contract = new Contract(
      tokenContractAddress,
      window.erc20Abi,
      signer
    );
    return contract.approve(
      TokenListManager.getCurrentNetworkConfig().aggregatorAddress,
      amountBN,
      {
        // gasPrice: // the price to pay per gas
        // gasLimit: // the limit on the amount of gas to allow the transaction to consume; any unused gas is returned at the gasPrice
      }
    ).then(function(transaction) {
      console.log(`Waiting on APPROVE() with ${tokenContractAddress} ${amountBN.toString()}`);
      return transaction.wait();
    });
  },

  _getAllowance: function(token) {
    if (token.native) {
      console.log(`Not calling ALLOWANCE() on native token ${token.symbol}`);
      return Promise.resolve(false);
    }
    console.log(`Calling ALLOWANCE() with ${token.address}`);
    const contract = new Contract(
      token.address,
      window.erc20Abi,
      Wallet.getProvider()
    );
    return contract.allowance(
      Wallet.currentAddress(),
      TokenListManager.getCurrentNetworkConfig().aggregatorAddress
    );
  },

  /*
    function getExpectedReturn(
      IERC20 fromToken,
      IERC20 destToken,
      uint256 amount,
      uint256 parts,
      uint256 flags
    )
    public view returns (
      uint256 returnAmount,
      uint256[] memory distribution
    )
  */

  _getExpectedReturnCache: {},

  getExpectedReturn: async function(fromToken, toToken, amount) {
    var key = [fromToken.address, toToken.address, amount.toString()].join('');
    if (key in this._getExpectedReturnCache) {
      var cacheValue = this._getExpectedReturnCache[key];
      if ((Date.now()) - cacheValue._cacheTimestamp < 5000) { // 5 seconds cache
        console.log('Using expectedReturn cache: ', key);
        return this._getExpectedReturnCache[key];
      }
    }

    const contract = new Contract(
      TokenListManager.getCurrentNetworkConfig().aggregatorAddress,
      window.oneSplitAbi,
      Wallet.getReadOnlyProvider(true)
    );
    var result = await contract.getExpectedReturn(
      fromToken.address,
      toToken.address,
      amount, // uint256 in wei
      3, // desired parts of splits accross pools(3 is recommended)
      0  // the flag to enable to disable certain exchange(can ignore for testnet and always use 0)
    );

    var result = _.extend({}, result);
    result._cacheTimestamp = new Date()
    this._getExpectedReturnCache[key] = result;
    return result;
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

  _swap: function(fromToken, toToken, amountBN, distribution) {
    console.log(`Calling SWAP() with ${fromToken.symbol} to ${toToken.symbol} of ${amountBN.toString()}`);
    const signer = Wallet.getProvider().getSigner();
    const contract = new Contract(
      TokenListManager.getCurrentNetworkConfig().aggregatorAddress,
      window.oneSplitAbi,
      signer
    );

    return this.calculateMinReturn(
      fromToken, toToken, amountBN
    ).then(function(minReturn) {

      /*
        returns(
          uint256 returnAmount
        )
      */

      return contract.swap(
        fromToken.address,
        toToken.address,
        amountBN, // uint256 in wei
        Utils.parseUnits(minReturn, toToken.decimals),
        distribution,
        0,  // the flag to enable to disable certain exchange(can ignore for testnet and always use 0)
        {
          // gasPrice: // the price to pay per gas
          // gasLimit: // the limit on the amount of gas to allow the transaction to consume; any unused gas is returned at the gasPrice,
          value: fromToken.native ? amountBN : undefined,
          gasPrice: this.settings.gasPrice > 0
          ? Utils.parseUnits("" + this.settings.gasPrice, "gwei")
          : undefined
        }
      ).then(function(transaction) {
        console.log(`Waiting SWAP() with ${fromToken.symbol} to ${toToken.symbol} of ${amountBN.toString()}`);
        TxQueue.queuePendingTx({
          from: fromToken,
          to: toToken,
          amount: amountBN,
          tx: transaction
        });
        return transaction.hash;
      });

    }.bind(this));

  },
};

export default window.SwapFn;

