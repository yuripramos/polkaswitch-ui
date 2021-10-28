import { useEffect, useState } from "react"
import WalletConnectProvider from "@walletconnect/web3-provider";

const networks = require("./networks");

const web3Context = React.createContext({
    tokens: {},
    provider: undefined,
    signer: undefined,
    networkId: -1,
    isConnected: boolean,
    connectWallet: undefined,
    ethAccount: undefined
})

export const web3ContextProvider = ({ children, supportedChainIds }) => {
    const [ethProvider, setEthProvider] = useState(undefined);
    const [ethSigner, setEthSigner] = useState(undefined);
    const [ethAccount, setEthAccount] = useState(undefined);
    const [networkId, setNetworkId] = useState(-1);
    const [isConnected, setIsConnected] = useState(false);
    const [errorMessage, setErrorMessage] = useState(undefined);

    const connectWallet = (wallet) => {
        switch(wallet) {
            case "metamask":
                if (!(window).ethereum || !(window).ethereum.isMetaMask)
                    setErrorMessage(`Metamask is not installed, please install metamask and try again!`);

                const provider = new ethers.providers.Web3Provider(
                    (window).ethereum
                );

                const networkId = (await provider.getNetwork()).chainId;
                if (!supportedChainIds.includes(networkId)) {
                    setErrorMessage(`Unsupported network, please switch to a supported network.`);
                }

                const ethAccounts = await (window).ethereum.request({
                    method: "eth_requestAccounts",
                });

                const signer = provider.getSigner();

                (window).ethereum.on(
                    "accountsChanged",
                    (accounts) => {
                        setEthAddress(accounts[0]);
                    }
                );

                (window).ethereum.on("chainChanged", connectWallet);

                setEthAccount(ethAccounts[0]);
                setEthProvider(provider);
                setEthSigner(signer);
                setNetworkId(networkId);
                break;
            case "walletconnect":
                let chainId = 137;
                
                let rpc = { [chainId]: networks[chainId].chain.rpcUrls[0] }
                const provider = new WalletConnectProvider({
                    rpc
                });

                await provider.enable();
                const ethersProvider = new ethers.providers.Web3Provider(provider);
                const signer = web3Provider.getSigner();
                const address = signer.getAddress();

                setEthAccount(address);
                setEthProvider(ethersProvider);
                setEthSigner(signer);
                setNetworkId(networkId);
            default:
                return;
        }
    }

    return (
        <web3Context.Provider value={{
            provider: ethProvider,
            signer: ethSigner,
            networkId,
            isConnected,
            errorMessage,
            ethAccount,
            connectWallet
        }}>{children}</web3Context.Provider>
    )
}