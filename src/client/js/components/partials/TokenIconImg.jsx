import React, { Component } from 'react';
import { Link } from "react-router-dom";
import _ from "underscore";

export default class TokenIconImg extends Component {
  render() {
    return (
      <img
        { ... this.props }
        src={`/tokens/erc20/${this.props.token.id || this.props.token.symbol}/logo.png`} />
    );
  }
}

