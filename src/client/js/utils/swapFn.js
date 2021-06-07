
import _ from "underscore";
import EventManager from './events';
import * as ethers from 'ethers';
import TokenListManager from './tokenList';
import Wallet from './wallet';
import BN from 'bignumber.js';

const BigNumber = ethers.BigNumber;
const Utils = ethers.utils;
const Contract = ethers.Contract;

window.SwapFn = {
  settings: {
    gasPrice: -1, // auto,
    slippage: 0.5
  },

  updateSettings: function(settings) {
    this.settings = _.extend(this.settings, settings);
    EventManager.emitEvent('swapSettingsUpdated', 1);
  },

  calculateMinReturn: function(fromToken, toToken, amount) {
    return this._findSmallResult(
      fromToken, toToken, 1
    ).then(function(small) {
      const [smallResult, smallAmount] = small;

      return this.getExpectedReturn(
        fromToken, toToken, amount
      ).then(function(actualReturn) {
        var x = BN(smallResult.returnAmount.toString())
          .div(BN(smallAmount.toString()));
        var y = x.times(1.0 - (this.settings.slippage / 100.0));
        var r = BN(amount.toString()).times(y);

        var minReturn = Utils.formatUnits(r.toFixed(0), toToken.decimals);

        return minReturn;
      }.bind(this));
    }.bind(this));
  },

  calculateEstimatedTransactionCost: function() {
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

  _findSmallResult: function(fromToken, toToken, factor) {
    let smallAmount = Utils.parseUnits(
      "" + Math.ceil(10 ** (factor * 3)), 0
    );

    return this.getExpectedReturn(
      fromToken, toToken, smallAmount
    ).then(function(smallResult) {
      if (smallResult.returnAmount.gt(100)) {
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
    return this._getAllowance(fromToken).then(function(allowanceBN) {
      if (allowanceBN) {
        console.log(`Got Allowance of ${allowanceBN.toString()}`);
      }

      if (fromToken.native || allowanceBN.gte(amountBN)) {
        return this._swap(fromToken, toToken, amountBN, distribution);
      } else {
        return this._approve(
          fromToken.address,
          // approve arbitrarily large number
          amountBN.add(BigNumber.from(Utils.parseUnits("100000000")))
        ).then(function(confirmedTransaction) {
          return this._swap(fromToken, toToken, amountBN, distribution);
        }.bind(this));
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

  getExpectedReturn: function(fromToken, toToken, amount) {
    if (!Wallet.isConnected()) {
      return new Promise(function(resolve) {
        var _U = Utils;
        var _p0 = _U.parseUnits("0", "wei");
        var _p1 = _U.parseUnits("1", "wei");
        resolve({
          returnAmount: amount.mul(_U.parseUnits("99", toToken.decimals)),
          distribution: [_p0, _p1, _p0, _p1, _p0, _p0, _p1]
        })
      });
    }

    const contract = new Contract(
      TokenListManager.getCurrentNetworkConfig().aggregatorAddress,
      window.oneSplitAbi,
      Wallet.getProvider()
    );
    return contract.getExpectedReturn(
      fromToken.address,
      toToken.address,
      amount, // uint256 in wei
      3, // desired parts of splits accross pools(3 is recommended)
      0  // the flag to enable to disable certain exchange(can ignore for testnet and always use 0)
    );
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
          ? Utils.parseUnit(this.settings.gasPrice, "gwei")
          : undefined
        }
      ).then(function(transaction) {
        console.log(`Waiting SWAP() with ${fromToken.symbol} to ${toToken.symbol} of ${amountBN.toString()}`);
        return transaction.wait();
      });

    }.bind(this));

  },
};

export default window.SwapFn;

