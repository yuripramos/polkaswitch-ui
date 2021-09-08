import React, { useState, useEffect } from "react";
import classnames from "classnames";
import _ from "underscore"
import TokenIconImg from "../TokenIconImg";
import Wallet from "../../../utils/wallet";
import numeral from 'numeral';

export default function TokenSearchItem(props) {
  const { token } = props;
  const [balance, setBalance] = useState(0);
  useEffect(()=>{
    // set a clean up flag
    let isSubscribed = true;
    fetchBalance(isSubscribed, token, 0)
    // cancel subscription to useEffect
    return () => (isSubscribed = false)
  }, []);

  const fetchBalance = (isSubscribed, token, attempt) => {
    attempt = 0;
    if (!attempt) {
    } else if (attempt > 2) {
      isSubscribed && setBalance(0);
      return;
    }
    _.delay(() => {
      Wallet.getBalance(token).then(function(bal) {
        console.log('token symbol', token.symbol)
        console.log('token balance', bal)
        isSubscribed && setBalance(bal);
      }).catch(function(e) {
        // try again
        console.error("Failed to fetch balance", e);
        _.defer(function() {
          fetchBalance(isSubscribed, token, attempt + 1);
        })
      })
    }, 1000);
  }

  const getBalanceNumber = (token, tokenBalance) => {
    let balanceNumber = null;
    if (tokenBalance === 0) {
      balanceNumber = '0.0';
    } else if (tokenBalance.lt(window.ethers.utils.parseUnits("0.0001", token.decimals))) {
      balanceNumber = "< 0.0001";
    } else {
      balanceNumber = numeral(window.ethers.utils.formatUnits(tokenBalance, token.decimals)).format('0.0000a');
    }

    return balanceNumber;
  }

  return (
    <span className="level-left my-2">
      <span className="level-item">
        <TokenIconImg
          size={35}
          token={token} />
      </span>
      <span className="level-item">{token.name}</span>
      <div className="token-symbol-balance-wrapper">
        <span className="has-text-grey">{token.symbol}</span>
        <span className="has-text-grey">{getBalanceNumber(token, balance)}</span>
      </div>
    </span>
  )
}