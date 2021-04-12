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
    return (
      <span
        className={classnames("token-icon-img-wrapper", { "errored": this.state.errored })}
        style={{ height: `${this.props.size || 40}px`, width: `${this.props.size || 40}px` }}>
        <img
          { ... this.props }
          onLoad={this.onLoad}
          onError={this.onError}
          style={{
            height: `${this.props.size || 40}px`,
            width: `${this.props.size || 40}px`
          }}
          src={`/tokens/erc20/${this.props.token.id || this.props.token.symbol}/logo.png`} />
        <span className="icon">
          <ion-icon name="cube-outline"></ion-icon>
        </span>
      </span>
    );
  }
}

