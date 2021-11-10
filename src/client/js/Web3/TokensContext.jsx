import React, { useReducer, useState } from "react";
import { useEffect } from "react";
import { enabledNetworks, useWeb3Context } from "./Web3Context.jsx";
import TokensReducer from "./reducers/TokensReducer";
import { ethers } from "@connext/nxtp-utils/node_modules/ethers";
import networks from "./networks.js";

const axios = require("axios");
const tokensContext = React.createContext({
    tokensState: [],
});

export const TokensContextProvider = ({ children }) => {
    const { provider, web3Account } = useWeb3Context();
    const [tokensState, dispatchTokensState] = useReducer(TokensReducer, {});

    useEffect(() => {
        let axPromises = [];

        enabledNetworks.forEach((net) => {
            axPromises.push(axios.get(`/tokens/${net}.list.json`));
        });

        Promise.all(axPromises).then((axResponseList) => {
            axResponseList.forEach((_listResponse) => {
                const { data } = _listResponse;

                data.forEach((token) => {
                    // {
                    //     "symbol": "BNB",
                    //     "address": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
                    //     "decimals": 18,
                    //     "native": true,
                    //     "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/info/logo.png",
                    //     "chainId": 56
                    // }
                    dispatchTokensState({
                        type: "ADD_TOKEN",
                        payload: {
                            network: token.chainId,
                            symbol: token.symbol,
                            metadata: token,
                        },
                    });
                });
            });
        });
    }, []);

    useEffect(() => {
        if (provider) {
            // let toFetchPrices = new Set();

            enabledNetworks.forEach((net) => {
                let tokenSymbols = Object.keys(tokensState[net]);
                let netProvider = new ethers.providers.StaticJsonRpcProvider(networks[net].chain.rpcUrls[0]);

                tokenSymbols.forEach((tkn) => {
                    if (tokensState[net][tkn].native && !tokensState[net][tkn].address) {
                    } else {
                        let erc20 = new ethers.Contract(tokensState[net][tkn].address, window.erc20Abi, netProvider);

                        erc20
                            .balanceOf(web3Account)
                            .then((balance) => {
                                console.log(`Fetched Balance of ${networks[net].name} ${tokensState[net][tkn].symbol}`);
                                dispatchTokensState({
                                    type: "UPDATE_BALANCE",
                                    payload: {
                                        network: net,
                                        symbol: tokensState[net][tkn].symbol,
                                        balance: +balance,
                                    },
                                });

                                // if (+balance > 0) {
                                //     toFetchPrices.add(tokensState[net][tkn].symbol);
                                // }
                            })
                            .catch((err) => {
                                console.log(`${net} ${tokensState[net][tkn].symbol}`);
                            });
                    }
                });
            });
            setTimeout(() => {
                console.log(toFetchPrices);
            }, 150000);
        }
    }, [provider]);

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

export const getTokensByNetwork = (chainId) => {
    const { tokenState } = React.useContext(tokensContext);

    let tkns = tokenState[chainId];
    if (tkns) {
        return Object.keys(tkns).map((symbl) => {
            return tkns[symbl];
        });
    } else {
        return [];
    }
};

export const getTokensWithBalance = () => {
    const { tokenState } = React.useContext(tokensContext);
    let withBalance = [];

    Object.keys(tokenState).forEach((net) => {
        Object.keys(tokenState[net]).forEach((tkn) => {
            if (tkn.balance > 0) {
                withBalance.push({ ...tkn });
            }
        });
    });

    return withBalance;
};
