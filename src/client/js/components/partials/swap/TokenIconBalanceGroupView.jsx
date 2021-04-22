import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

import TokenSymbolBalance from './TokenSymbolBalance';
import TokenIconImg from './../TokenIconImg';

export default class TokenIconBalanceGroupView extends Component {
  render() {
    if (!this.props.token) {
      return (<div />);
    }

    return (
      <>
      <div className="level-item">
        <TokenIconImg
          size={"35"}
          token={this.props.token} />
      </div>
      <div className="level-item">
        <TokenSymbolBalance
          refresh={this.props.refresh}
          token={this.props.token} />
      </div>
      </>
    )
  }
}

