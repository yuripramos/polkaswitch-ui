import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';
import * as Sentry from "@sentry/react";
import Wallet from '../../../utils/wallet';
import EventManager from '../../../utils/events';
import TokenListManager from '../../../utils/tokenList';
import CrossChainToggle from './CrossChainToggle';
import NetworkDropdown from '../NetworkDropdown';

export default class SwapNetworkToggle extends Component {
  constructor(props) {
    super(props);

    this.handleDropdownClick = this.handleDropdownClick.bind(this);

    this.state = {
      selected: TokenListManager.getCurrentNetworkConfig(),
      active: false,
      singleChain: !TokenListManager.isCrossChainEnabled(),
      hoverable: true,
    };

    this.subscribers = [];
    this.handleNetworkHoverable = this.handleNetworkHoverable.bind(this);
  }

  componentDidMount() {
    this.subscribers.push(EventManager.listenFor('networkHoverableUpdated', this.handleNetworkHoverable));
  }

  componentWillUnmount() {
    this.subscribers.forEach(function(v) {
      EventManager.unsubscribe(v);
    });
  }

  handleNetworkHoverable(event) {
    if (event && (event.hoverable !== this.state.hoverable)) {
      this.setState({
        hoverable: event.hoverable
      });
    }
  }

  handleDropdownClick(network) {
    if (network.enabled) {
      Sentry.addBreadcrumb({
        message: "Action: Network Changed: " + network.name
      });
      this.setState({
        selected: network
      });
      let connectStrategy = Wallet.isConnectedToAnyNetwork() &&
        Wallet.getConnectionStrategy();
      TokenListManager.updateNetwork(network, connectStrategy);
    }
  }

  render() {
    return (
      <div className="swap-network-toggle box notification">
        <div className="level is-mobile option is-justify-content-flex-end">
          <div className="level-right">
            <div className="level-item">
              <NetworkDropdown
                className={classnames("is-right", {
                "is-hoverable": this.state.hoverable,
                "is-hidden": !this.state.singleChain
                })}
                selected={this.state.selected}
                handleDropdownClick={this.handleDropdownClick}
              />
            </div>
          </div>
        </div>

      </div>
    );
  }
}

