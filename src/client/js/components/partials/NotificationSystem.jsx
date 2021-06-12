import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

import Wallet from '../../utils/wallet';
import Metrics from '../../utils/metrics';
import EventManager from '../../utils/events';
import TxQueue from '../../utils/txQueue';

export default class NotificationSystem extends Component {
  constructor(props) {
    super(props);

    this.state = { refresh: Date.now() };

    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    this.sub = EventManager.listenFor(
      'txQueueUpdated', this.handleUpdate
    );
    this.sub2 = EventManager.listenFor(
      'txSuccess', this.handleUpdate
    );
  }

  componentDidUnmount() {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }

  handleUpdate(txNonce) {
    this.setState({
      refresh: Date.now()
    });
  }

  render() {
    return (
      <div className="notification-drawer">
        <div class="notification">
          <button class="delete"></button>
          Lorem ipsum
        </div>
      </div>
    );
  }
}

