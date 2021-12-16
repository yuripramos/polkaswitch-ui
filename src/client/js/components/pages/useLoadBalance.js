import React, { useState } from 'react';
import * as ethers from 'ethers';
import BN from 'bignumber.js';
import { BigNumber, constants, providers, Signer, utils } from 'ethers';

import _ from 'underscore';

import Wallet from '../../utils/wallet';
import TokenListManager from '../../utils/tokenList';

const INITIAL_STATE = {
  refresh: Date.now(),
  currentNetwork: TokenListManager.getCurrentNetworkConfig(),
  balances: [],
  loading: true,
};

const useLoadBalances = () => {
  const [myApplicationState, setMyApplicationState] = useState(INITIAL_STATE);

  _.defer(async () => {
    let promises = [];
    let localRefresh = myApplicationState.refresh;

    let networks = _.filter(window.NETWORK_CONFIGS, (v) => {
      return v.enabled;
    });

    Promise.all(
      networks.map((network) => {
        return new Promise(async (resolve, reject) => {
          let tokenList = TokenListManager.getTokenListForNetwork(network);

          try {
            var nativeBalance = await Wallet.getDefaultBalance(network);
          } catch (e) {
            console.error(
              'Failed to fetch balances from network: ',
              network.name
            );
            console.error(e);
            resolve(true);
            return; // go next network, if the provider is not working
          }

          for (var j = 0; j < tokenList.length; j++) {
            var token = tokenList[j];

            let p = Wallet.getBalance(token, network).then(function (
              tk,
              net,
              balance
            ) {
              if (
                myApplicationState.refresh === localRefresh &&
                !balance.isZero()
              ) {
                setMyApplicationState((prevState) => {
                  return {
                    ...prevState,
                    balances: [
                      ...myApplicationState.balances,
                      {
                        ...tk,
                        balance:
                          +balance.toString() / Math.pow(10, tk.decimals),
                        balanceBN: balance,
                        price: 1,
                      },
                    ],
                  };
                });
              }
            });

            promises.push(p);
          }

          resolve(true);
        });
      })
    ).then(() => {
      // bleeding browser-support
      Promise.allSettled(promises).then(() => {
        console.log('Completed fetching balances from all networks');
        if (myApplicationState.refresh === localRefresh) {
          setMyApplicationState((prevState) => {
            return {
              ...prevState,
              loading: false,
              networks,
            };
          });
        }
      });
    });
  });

  return {
    myApplicationState,
    setMyApplicationState,
  };
};

export default useLoadBalances;
