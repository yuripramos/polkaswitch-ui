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
        if (provider && web3Account) {
            enabledNetworks.forEach((net) => {
                let netProvider = new ethers.providers.StaticJsonRpcProvider(networks[net].chain.rpcUrls[0]);

                axios.get(`/tokens/${net}.list.json`).then((tokenListRes) => {
                    const { data } = tokenListRes;

                    data.forEach((token) => {
                        if (token.native) {
                            netProvider.getBalance(web3Account).then((balance) => {
                                let converted = +balance / 1e18;

                                if (converted > 0) {
                                    dispatchTokensState({
                                        type: "ADD_TOKEN",
                                        payload: {
                                            network: token.chainId,
                                            symbol: token.symbol,
                                            metadata: { ...token, balance: converted },
                                        },
                                    });
                                }
                            });
                        } else {
                            let erc20 = new ethers.Contract(token.address, window.erc20Abi, netProvider);

                            erc20
                                .balanceOf(web3Account)
                                .then((balance) => {
                                    let cBal = +balance;

                                    if (cBal > 0) {
                                        dispatchTokensState({
                                            type: "ADD_TOKEN",
                                            payload: {
                                                network: token.chainId,
                                                symbol: token.symbol,
                                                metadata: { ...token, balance: cBal },
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
