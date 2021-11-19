import React, { useReducer, useState } from "react";
import { useEffect } from "react";
import TokensReducer from "./reducers/TokensReducer";
import { ethers } from "@connext/nxtp-utils/node_modules/ethers";
import networks from "./networks.js";
import BigNumber from "bignumber.js";

const tokensContext = React.createContext({
  tokensState: {},
});

export const TokensContextProvider = ({ children }) => {
  const [tokensState, dispatchTokensState] = useReducer(TokensReducer, {});

  useEffect(() => {
    if (provider && web3Account) {
      enabledNetworks.forEach((net) => {
        let netProvider = new ethers.providers.StaticJsonRpcProvider(networks[net].chain.rpcUrls[0]);

        fetch(`/tokens/${net}.list.json`)
          .then(response => response.json())
          .then((tokenListRes) => {
            const { data } = tokenListRes;

            data.forEach((token) => {
              if (token.native) {
                netProvider.getBalance(web3Account).then((balance) => {
                  let converted = (+balance) / (Math.pow(10, token.decimals));
                  if (converted > 0) {
                    dispatchTokensState({
                      type: "ADD_TOKEN",
                      payload: {
                        network: token.chainId,
                        symbol: token.symbol,
                        metadata: { ...token, balance: converted, price: 2 },
                      },
                    });
                  }
                });
              } else {
                let erc20 = new ethers.Contract(token.address, window.erc20Abi, netProvider);

                erc20
                  .balanceOf(web3Account)
                  .then((balance) => {
                    let converted = (+balance) / (Math.pow(10, token.decimals));

                    if (converted > 0) {
                      dispatchTokensState({
                        type: "ADD_TOKEN",
                        payload: {
                          network: token.chainId,
                          symbol: token.symbol,
                          metadata: { ...token, balance: converted, price: 1 },
                        },
                      });
                    }
                  })
                  .catch((err) => {
                    console.error(`${net} ${token.symbol} ${err.message}`);
                  });
              }
            });
          });
      });
    }
  }, [provider, web3Account]);

  return (
    <tokensContext.Provider
      value={{
        tokensState,
      }}
    >
      {children}
    </tokensContext.Provider>
  );
};

export const useTokensByNetwork = (chainId) => {
  const { tokensState } = React.useContext(tokensContext);

  let tkns = tokensState[chainId];
  if (tkns) {
    return Object.keys(tkns).map((symbl) => {
      return tkns[symbl];
    });
  } else {
    return [];
  }
};

export const useTokensWithBalance = () => {
  const { tokensState } = React.useContext(tokensContext);
  let withBalance = [];

  Object.keys(tokensState).forEach((net) => {
    Object.keys(tokensState[net]).forEach((tkn) => {
      if (tokensState[net][tkn].balance > 0) {
        withBalance.push({ ... tokensState[net][tkn] });
      }
    });
  });

  return withBalance;
};
