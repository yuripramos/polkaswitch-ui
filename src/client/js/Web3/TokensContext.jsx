import React, { useReducer, useState } from "react";
import { useEffect } from "react"
import { enabledNetworks, useWeb3Context } from "./Web3Context.jsx";
import TokensReducer from "./reducers/TokensReducer";
import { ethers } from "@connext/nxtp-utils/node_modules/ethers";
import networks from "./networks.js";

const axios = require('axios');
const tokensContext = React.createContext({
    tokenList: []
})

export const TokensContextProvider = ({ children }) => {
    const { provider, web3Account } = useWeb3Context();
    const [tokensState, dispatchTokensState] = useReducer(TokensReducer, {});
    const [tokenList, setTokenList] = useState([]);

    useEffect(() => {
        let axPromises = [];
        enabledNetworks.forEach(net => {
            axPromises.push(axios.get(`/tokens/${net}.list.json`));
        })

        Promise.all(axPromises).then(axResponseList => {
            axResponseList.forEach(_listResponse => {
                const { data } = _listResponse;

                
                data.forEach(token => {
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
                            metadata: token
                        }
                    })
                })
            })
        })
    }, [])

    useEffect(() => {
        if (provider) {
            enabledNetworks.forEach(net => {
                let tokenSymbols = Object.keys(tokensState[net])
                let netProvider = new ethers.providers.StaticJsonRpcProvider(networks[net].chain.rpcUrls[0])

                tokenSymbols.forEach(tkn => {                    
                    if (tokensState[net][tkn].native && !tokensState[net][tkn].address) {
                        
                    } else {
                        let erc20 = new ethers.Contract(tokensState[net][tkn].address, window.erc20Abi, netProvider);
                        
                        erc20.balanceOf(web3Account).then((balance) => {
                            console.log(`Fetched Balance of ${networks[net].name} ${tokensState[net][tkn].symbol}`)
                            dispatchTokensState({
                                type: "UPDATE_BALANCE",
                                payload: {
                                    network: net,
                                    symbol: tokensState[net][tkn].symbol,
                                    balance: +balance
                                }
                            })
                        }).catch(err => {
                            console.log(`${net} ${tokensState[net][tkn].symbol}`)
                        })
                    }
                })
            })

        }
    }, [provider]);

    return (
        <tokensContext.Provider value={{
            tokenList
        }}>{children}</tokensContext.Provider>
    )
}

export const useTokens = () => {
    return React.useContext(tokensContext);
} 