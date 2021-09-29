/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
import {validateAndParseAddress} from "@connext/nxtp-utils";
import invariant from "tiny-invariant";

export class BridgeToken {
    isNative = false
    isToken= true

    constructor(chainId, address, decimals, symbol, name, bridge) {
        this.chainId = chainId;
        this.address = validateAndParseAddress(address);
        this.decimals = decimals;
        this.symbol = symbol;
        this.name = name;
        this.bridge = bridge;
    }

    /**
    * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
    * @param other other token to compare
    */
    equals(other) {
        return other.isToken && this.chainId === other.chainId && this.address === other.address
    }

    /**
    * Returns true if the address of this token sorts before the address of the other token
    * @param other other token to compare
    * @throws if the tokens have the same address
    * @throws if the tokens are on different chains
    */
    sortsBefore(other) {
        invariant(this.chainId === other.chainId, 'CHAIN_IDS')
        invariant(this.address !== other.address, 'ADDRESSES')
        return this.address.toLowerCase() < other.address.toLowerCase()
    }

    /**
    * Return this token, which does not need to be wrapped
    */
    wrapped() {
        return this
    }
}