import {BridgeToken} from "./bridgeToken";

export const USDC_BSC = new BridgeToken(
    56,
    '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    18,
    'USDC',
    'USD//C',
    'Connext'
);

export const USDT_BSC = new BridgeToken(
    56,
    '0x55d398326f99059fF775485246999027B3197955',
    18,
    'USDT',
    'USD//T',
    'Connext',
);

export const DAI_BSC = new BridgeToken(
    56,
    '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
    18,
    'DAI',
    'DAI Stable Coin',
    'Connext'
);

export const USDC_MATIC = new BridgeToken(
    137,
    '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    6,
    'USDC',
    'USD//C',
    'Connext'
);

export const USDT_MATIC = new BridgeToken(
    137,
    '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    6,
    'USDT',
    'USD//T',
    'Connext'
);

export const DAI_MATIC = new BridgeToken(
    137,
    '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    18,
    'DAI',
    'DAI Stable Coin',
    'Connext'
);

export const CONTRACT_ADDRESS = new Map(
    [
        [56, '0x08C1242F51a16f9451D873644ED4E29E224Da71e'],
        [137, '0xB9E1505be481FC3fb8E87E92554E45FE6FbcFB7e']
    ]
)

export const BRIDGE_TOKEN_MAP = new Map([
        //USDC
        ['0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d-137', USDC_MATIC],
        ['0x2791bca1f2de4661ed88a30c99a7a9449aa84174-56', USDC_BSC],
        //USDT
        ['0x55d398326f99059ff775485246999027b3197955-137', USDT_MATIC],
        ['0xc2132d05d31c914a87c6611c10748aeb04b58e8f-56', USDT_BSC],
        //DAI
        ['0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3-137', DAI_MATIC],
        ['0x8f3cf7ad23cd3cadbd9735aff958023239c6a063-56', DAI_BSC]
    ]
);

export function findBridgeAsset (sendingAssetId, receivingChainId) {
        return BRIDGE_TOKEN_MAP.get(sendingAssetId.toLowerCase() + '-' + receivingChainId);
}

export function findContractAddress (receivingChainId) {
        return CONTRACT_ADDRESS.get(receivingChainId);
}