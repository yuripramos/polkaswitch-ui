import React from "react";
import { useEffect, useState } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";

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
                if (!window.ethereum || !window.ethereum.isMetaMask) {
                    setErrorMessage(`Metamask is not installed, please install metamask and try again!`);
                    throw new Error(`Metamask is not installed, please install metamask and try again!`);
                }

                const provider = new ethers.providers.Web3Provider(window.ethereum);

                const networkId = (await provider.getNetwork()).chainId;

                if (!enabledNetworks.includes(networkId)) {
                    setErrorMessage(`Unsupported network, please switch to a supported network.`);
                    throw new Error(`Unsupported network, please switch to a supported network.`);
                }

                const web3Accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });

                const signer = provider.getSigner();

                window.ethereum.on("accountsChanged", (accounts) => {
                    setweb3Account(accounts[0]);
                });

                window.ethereum.on("chainChanged", connectWallet);

                setweb3Account(web3Accounts[0]);
                setweb3Provider(provider);
                setweb3Signer(signer);
                setNetworkId(networkId);
                setIsConnected(true);
                break;
            case "walletconnect":
                let chainId = 137;

                let rpc = { [chainId]: networks[chainId].chain.rpcUrls[0] };
                const _provider = new WalletConnectProvider({
                    rpc,
                });

                await _provider.enable();
                const _ethersProvider = new ethers.providers.Web3Provider(_provider);
                const _signer = web3Provider.getSigner();
                const _address = signer.getAddress();

                setweb3Account(_address);
                setweb3Provider(_ethersProvider);
                setweb3Signer(_signer);
                setNetworkId(chainId);
                setIsConnected(true);
            default:
                return;
        }
    };

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
