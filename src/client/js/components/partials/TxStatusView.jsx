import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';
import * as ethers from 'ethers';
import numeral from 'numeral';
import moment from 'moment';

const BigNumber = ethers.BigNumber;
const Utils = ethers.utils;

import TokenListManager from '../../utils/tokenList';

import TxExplorerLink from './TxExplorerLink';
import TokenIconImg from "./TokenIconImg";

export default class TxStatusView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.data.from) {
      return (<div />);
    }

    var output = numeral(Utils.formatUnits(this.props.data.amount, this.props.data.from.decimals)).format('0.0000a');

    var icon, lang, clazz;

    if (!this.props.data.completed) {
      icon = (<button className="button is-white is-loading">&nbsp;</button>);
      lang = "PENDING";
      clazz = "pending";
    } else if (this.props.data.success) {
      icon = (<ion-icon name="checkmark-circle"></ion-icon>);
      lang = "SWAPPED";
      clazz = "success";
    } else {
      icon = (<ion-icon name="alert-circle"></ion-icon>);
      lang = "FAILED";
      clazz = "failed";
    }

    return (
        <div className={classnames("level is-mobile tx-item", clazz)}>
          <div className="token-pair">
            <TokenIconImg
                size={30}
            />
            <TokenIconImg
                size={30}
            />
          </div>
          <div className="column">
            <div className="item-1">Trade</div>
            <div className="item-2">View on explorer</div>
          </div>
          <div className="column">
            <div className="item-1">ETH</div>
            <div className="item-2">12.92873211</div>
          </div>
          <div className="column">
            <div className="item-1">-> DAI</div>
            <div className="item-2">12.92873211</div>
          </div>
          <div className="column">
            <div className="item-1">Completed</div>
            <div className="item-2">10/10/21 3:49PM</div>
          </div>
        </div>
    );
  }
}

