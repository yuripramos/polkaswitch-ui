import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';
import TokenIconImg from './../TokenIconImg';
import Wallet from '../../../utils/wallet';
import TokenListManager from '../../../utils/tokenList';

export default class TokenSwapDistribution extends Component {
  constructor(props) {
    super(props);
  }

  renderPool(name, icon, poolWidth) {
    return (
      <div
        className="token-dist-pool-wrapper"
        style={{ width: `${poolWidth * 100.0}%` }}>
        <div className="token-dist-pool">
          <TokenIconImg token={icon} size={25} />
          <span>{Math.round(poolWidth * 100.0)}%</span>
        </div>
      </div>
    );
  }

  render() {
    var pools;
    var network = TokenListManager.getCurrentNetworkConfig();
    var sumOne, sumTwo, sumThree, parts, totalParts;

    if (network.name == "Ethereum") {
      totalParts = 3;
      parts = this.props.parts || [0, 0, 0, 0, 0, 0, 0];

      /*
        This returns the destToken output amount and the optimized
        list of distributions accross different liquidity pools.
        There are 7 pools: pool 1 and 2 are Uniswap pools,
        pool 3 and 4 are Sushiswap pools, and pool 5 - 7 are
        Balancer pools. For example, the distribution [1, 0, 2, 0, 0, 0, 0]
        means 1/3 of the swap amount will route to Uniswap and 2/3 will
        route to Sushiswap.[1, 0, 0, 0, 0, 1, 1] means 1/3 of amount
        will route to Uniswap and 2/3 will route to Balancer.
      */

      sumOne = parts[0] + parts[1];
      sumTwo = parts[2] + parts[3];
      sumThree = parts[4] + parts[5] + parts[6];

      var pools = [{
        name: "Uniswap",
        icon: TokenListManager.findTokenById("UNI"),
        size: sumOne / totalParts
      }, {
        name: "Sushiswap",
        icon: TokenListManager.findTokenById("SUSHI"),
        size: sumTwo / totalParts
      }, {
        name: "Balancer",
        icon: TokenListManager.findTokenById("BAL"),
        size: sumThree / totalParts
      }];
    }

    else if (network.name == "Polygon") {
      totalParts = 3;
      parts = this.props.parts || [0, 0, 0, 0, 0, 0];

      /*
        This returns the destToken output amount and the optimized list
        of distributions accross different liquidity pools.
        There are 6 pools: pool 1 and 2 are Quickswap pools,
        pool 3 and 4 are Sushiswap pools, and pool 5 - 7 are Dfyn
        exchange pools. For example, the distribution [1, 0, 2, 0, 0, 0]
        means 1/3 of the swap amount will route to Quickswap and 2/3 will
        route to Sushiswap.[1, 0, 0, 0, 3] means 1/3 of amount will
        route to Quickswap and 2/3 will route to Dfyn.
      */

      sumOne = parts[0] + parts[1];
      sumTwo = parts[2] + parts[3];
      sumThree = parts[4] + parts[5] + (parts[6] || 0.0); // sometimes get 7th part

      pools = [{
        name: "Quickswap",
        icon: TokenListManager.findTokenById("QUICK"),
        size: sumOne / totalParts
      }, {
        name: "Sushiswap",
        icon: TokenListManager.findTokenById("SUSHI"),
        size: sumTwo / totalParts
      }, {
        name: "Dfyn",
        icon: TokenListManager.findTokenById("Dfyn"),
        size: sumThree / totalParts
      }];
    }

    return (
      <div
        className="token-dist-wrapper"
        aria-label="Routing distribution for the swap"
      >
        {_.map(pools, function(v) {
          return this.renderPool(v.name, v.icon, v.size);
        }.bind(this))}
      </div>
    );
  }
}

