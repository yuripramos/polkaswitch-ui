import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

import Wallet from '../../utils/wallet';
import Metrics from '../../utils/metrics';

export default class NotificationSystem extends Component {
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
      <div></div>
    );
  }
}

