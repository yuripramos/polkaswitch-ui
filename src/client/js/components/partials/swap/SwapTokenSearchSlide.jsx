import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

import TokenSearchBar from './../TokenSearchBar';
import TokenIconBalanceGroupView from './TokenIconBalanceGroupView';
import TokenSwapDistribution from './TokenSwapDistribution';
import MarketLimitToggle from './MarketLimitToggle';

import Wallet from '../../../utils/wallet';
import Metrics from '../../../utils/metrics';
import EventManager from '../../../utils/events';

export default class SwapTokenSearchSlide extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var isCrossChainEnabled = TokenListManager.isCrossChainEnabled();
    var network = this.props.network || TokenListManager.getCurrentNetworkConfig();
    var crossChainTokens = _.map(network.supportedCrossChainTokens, function(v) {
      return TokenListManager.findTokenById(v, network)
    });

    // passing undefined, will default to the original network list.
    // we only want to show the cross-chain tokens from the sending chain
    var tokenList = isCrossChainEnabled && this.props.isFrom ? crossChainTokens : undefined;

    return (
      <div className="page page-stack page-view-search">
        <div className="page-inner">
          <TokenSearchBar
            inline={true}
            network={this.props.network}
            tokenList={tokenList}
            focused={this.props.showSearch}
            placeholder={"Try DAI, USDT or Ethereum ... "}
            handleClose={this.props.handleSearchToggle("to")} // "to" is arbitary
            handleTokenChange={this.props.handleTokenChange} />
        </div>
      </div>
    );
  }

}

