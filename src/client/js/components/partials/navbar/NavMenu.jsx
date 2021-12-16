import React from 'react';
import { NavLink } from "react-router-dom";
import TokenListManager from "../../../utils/tokenList";
import _ from "underscore";
import Wallet from "../../../utils/wallet";

export default function NavMenu(props) {

  const CROSS_CHAIN_NETWORKS = _.filter(window.NETWORK_CONFIGS, (v) => {
    return v.crossChainSupported
  });

  const handleClick = async (isSwap) => {
    const currNetwork = TokenListManager.getCurrentNetworkConfig();
    const changeNetwork = !isSwap && !currNetwork.crossChainSupported;
    const nextNetwork = !changeNetwork ?
        currNetwork :
        _.first(CROSS_CHAIN_NETWORKS);

    if (changeNetwork) {
      let connectStrategy = Wallet.isConnectedToAnyNetwork() &&
          Wallet.getConnectionStrategy();
      TokenListManager.updateNetwork(nextNetwork, connectStrategy);
    }

    TokenListManager.toggleCrossChain(!isSwap);
    await TokenListManager.updateTokenList();
  }

  return (
    <div className="nav-menu">
      <NavLink
        exact
        className="nav-link"
        activeClassName="active"
        to="/swap"
        onClick={(e) => handleClick(true)}
      >
        Trade
      </NavLink>
      <NavLink
        className="nav-link"
        activeClassName="active"
        to="/bridge"
        onClick={(e) => handleClick(false)}
      >
        Bridge
      </NavLink>
      <NavLink exact className="nav-link" activeClassName="active" to="/wallet">
        Wallet
      </NavLink>
      <NavLink exact className="nav-link" activeClassName="active" to="/status">
        Status
      </NavLink>
    </div>
  );
}
