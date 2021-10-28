const { useState } = require("react");

const initialContext = {
    txMode: "SWAP",
    formNetwork: 1,
    toNetwork: 137
};

const SwapContext = React.createContext(initialContext)

exports.SwapContextProvider = () => {
    const [txMode, setTxMode] = useState("SWAP");

    return <SwapContext.Provider value={{}}></SwapContext.Provider>
}