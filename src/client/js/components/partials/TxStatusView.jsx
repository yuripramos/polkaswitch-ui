import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';
import * as ethers from 'ethers';
import numeral from 'numeral';

const BigNumber = ethers.BigNumber;
const Utils = ethers.utils;

import TokenListManager from '../../utils/tokenList';

import TxExplorerLink from './TxExplorerLink';

export default class TxStatusView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.data.from) {
      return (<div />);
    }

    var output = numeral(Utils.formatUnits(this.props.data.amount, this.props.data.from.decimals)).format('0.0000a');

    return (
      <div className="level is-mobile tx-item">
        <div className="level-item tx-icon">
          <div className="icon">
            {this.props.success ? (
              <ion-icon name="checkmark-circle-outline"></ion-icon>
            ) : (
              <ion-icon name="alert-circle-outline"></ion-icon>
            )}
          </div>
        </div>
        <div className="level-item">
          <div className="tx-content">
            <div>SWAPPED {output} {this.props.data.from.symbol} for {this.props.data.to.symbol}</div>
            <div>
              <TxExplorerLink hash={this.props.data.tx.hash}>
                View on Explorer <ion-icon name="open-outline"></ion-icon>
              </TxExplorerLink>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

