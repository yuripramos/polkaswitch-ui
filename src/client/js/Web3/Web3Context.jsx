import React from "react";
import { useEffect, useState } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import WalletJS from '../../utils/wallet';

const networks = require("./networks.js");
export const enabledNetworks = Object.keys(networks)
    .filter((netId) => {
        return networks[netId].enabled;
    })
    .map((netIdStr) => +netIdStr);

export const enabledNetworksList = Object.keys(networks)
    .map((netId) => {
        networks[netId].price = 0;
        networks[netId].priceChange = 0;
        return networks[netId];
    })
    .filter((net) => net.enabled);
const networksIds = Object.keys(networks);

const web3Context = React.createContext({
    tokens: {},
    provider: undefined,
    signer: undefined,
    networkId: -1,
    isConnected: false,
    connectWallet: undefined,
    web3Account: undefined,
});

export const Web3ContextProvider = ({ children }) => {
    const [web3Provider, setweb3Provider] = useState(undefined);
    const [web3Signer, setweb3Signer] = useState(undefined);
    const [web3Account, setweb3Account] = useState(undefined);
    const [networkId, setNetworkId] = useState(-1);
    const [isConnected, setIsConnected] = useState(false);
    const [errorMessage, setErrorMessage] = useState(undefined);
    const [web3Balance, setEthBalace] = useState(undefined);

    const connectWallet = async (wallet) => {
        switch (wallet) {
            case "metamask":



                setweb3Account(web3Accounts[0]);
                setweb3Provider(provider);
                setweb3Signer(signer);
                setNetworkId(networkId);
                setIsConnected(true);
                break;
            case "walletconnect":
            // TODO
                break;
            default:
                return;
        }
    };

    useEffect(() => {
        if (window.ethereum) {
            connectWallet("metamask");
        }
    }, [])

    return (
        <web3Context.Provider
            value={{
                provider: web3Provider,
                signer: web3Signer,
                networkId,
                isConnected,
                errorMessage,
                web3Account,
                connectWallet,
                web3Balance,
            }}
        >
            {children}
        </web3Context.Provider>
    );
};

export const useWeb3Context = () => {
    return React.useContext(web3Context);
};
