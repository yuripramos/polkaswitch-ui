import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

import Wallet from '../../utils/wallet';
import EventManager from '../../utils/events';

export default class BridgeButton extends Component {
  constructor(props) {
    super(props);
    this.state = { refresh: Date.now() };
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    this.subUpdates = EventManager.listenFor(
      'walletUpdated', this.handleUpdate
    );
  }

  componentWillUnmount() {
    this.subUpdates.unsubscribe();
  }

  handleClick(e) {
    EventManager.emitEvent('promptTxHistory', 1);
  }

  handleUpdate() {
    this.setState({ refresh: Date.now() });
  }

  render() {
    var network = TokenListManager.getCurrentNetworkConfig();

    return (
      <div className={"bridge-button"}>
        <a
          href={network.bridgeURI}
          className="button is-white is-medium connected">
          <span>Bridge</span>
        </a>
      </div>
    );
  }
}

