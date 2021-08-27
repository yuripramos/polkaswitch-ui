import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

export default class TokenIconImg extends Component {
  constructor(props) {
    super(props);
    this.state = { errored: false };
    this.onError = this.onError.bind(this);
    this.onLoad = this.onLoad.bind(this);
  }

  onError(e) {
    this.setState({ errored: true });
  }

  onLoad(e) {
    this.setState({ errored: false });
  }

  render() {
    var imgSrc = this.props.imgSrc || this.props.token.logoURI;

    if (!imgSrc) {
      var chainPart = window.SELECTED_NETWORK.toLowerCase().replace(/\s+/g, '');
      var keyPart = this.props.token.address || this.props.token.symbol;
      imgSrc = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainPart}/assets/${keyPart}/logo.png`;
    }

    return (
      <span
        className={classnames("token-icon-img-wrapper", { "errored": this.state.errored })}
        style={{
          height: `${this.props.size || 40}px`,
          width: `${this.props.size || 40}px`,
          marginLeft: this.props.marginLeft || 0,
          marginRight: this.props.marginRight || 0,
        }}>
        <img
          { ... _.omit(this.props, 'imgSrc', 'token', 'size') }
          onLoad={this.onLoad}
          onError={this.onError}
          style={{
            height: `${this.props.size || 40}px`,
            width: `${this.props.size || 40}px`
          }}
          src={imgSrc} />
        <span className="icon">
          <ion-icon name="cube-outline"></ion-icon>
        </span>
      </span>
    );
  }
}

