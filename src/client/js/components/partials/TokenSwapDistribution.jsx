import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';
import TokenIconImg from './TokenIconImg';
import Wallet from '../../utils/wallet';

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
    var parts = this.props.parts || [0, 0, 0, 0, 0, 0, 0];

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

    var sumUni = parts[0] + parts[1];
    var sumSushi = parts[2] + parts[3];
    var sumBal = parts[4] + parts[5] + parts[6];

    var pools = [{
      name: "Uniswap",
      icon: Wallet.findTokenById("UNI"),
      size: sumUni / this.props.totalParts
    }, {
      name: "Sushiswap",
      icon: Wallet.findTokenById("SUSHI"),
      size: sumSushi / this.props.totalParts
    }, {
      name: "Balancer",
      icon: Wallet.findTokenById("BAL"),
      size: sumBal / this.props.totalParts
    }];

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

