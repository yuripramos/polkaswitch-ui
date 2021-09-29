import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

import Wallet from '../../utils/wallet';
import Metrics from '../../utils/metrics';
import EventManager from '../../utils/events';
import TokenListManager from '../../utils/tokenList';
import TxQueue from '../../utils/txQueue';

import TxExplorerLink from './TxExplorerLink';
import TxStatusView from './TxStatusView'
import CrossChainToggle from './swap/CrossChainToggle';

export default class TxHistoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: Date.now(),
      open: false,
      showSingleChain: true
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleCrossChainChange = this.handleCrossChainChange.bind(this);
  }

  componentDidMount() {
    this.subUpdate = EventManager.listenFor(
      'txQueueUpdated', this.handleUpdate
    );
    this.subPrompt = EventManager.listenFor(
      'promptTxHistory', this.handleOpen
    );
  }

  componentWillUnmount() {
    this.subUpdate.unsubscribe();
  }

  handleUpdate() {
    this.setState({ refresh: Date.now() });
  }

  handleOpen(e) {
    this.setState({
      open: true
    });
  }

  handleClose(e) {
    this.setState({
      open: false
    });
  }

  handleCrossChainChange(checked) {
    this.setState({
      showSingleChain: checked
    });
    TokenListManager.toggleCrossChain(!checked);
  }

  render() {
    var queue = TxQueue.getQueue();

    return (
      <div className={classnames("modal", { "is-active": this.state.open })}>
        <div onClick={this.handleClose} className="modal-background"></div>
        <div className="modal-content">
          <div className="tx-history-modal box">
            <div className="level is-mobile">
              <div className="level-left">
                <div className="level-item">
                  <span
                    className="icon ion-icon clickable is-medium"
                    onClick={this.handleClose}
                  >
                    <ion-icon name="close-outline"></ion-icon>
                  </span>
                </div>
                <div className="level-item">
                  <b className="widget-title">Transaction History</b>
                </div>
              </div>
              <div className="level-right">
                <div className="level-item">
                  <CrossChainToggle
                    checked={this.state.showSingleChain}
                    handleChange={this.handleCrossChainChange} />
                </div>
              </div>
            </div>

            {_.keys(queue).length < 1 && (
              <div className="empty-state">
                <div>
                  <div className="empty-text has-text-info">
                    No recent transactions
                  </div>
                  <div className="icon has-text-info-light">
                    <ion-icon name="file-tray-outline"></ion-icon>
                  </div>
                </div>
              </div>
            )}

            {_.map(queue, function(item, i) {
              return (
                <TxStatusView key={i} data={item} />
              );
            })}
            {_.keys(queue).length > 0 && (
              <div className="footer-note">Only showing transactions in the last 72 hours.</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

