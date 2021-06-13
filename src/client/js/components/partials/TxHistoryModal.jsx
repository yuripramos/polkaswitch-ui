import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

import Wallet from '../../utils/wallet';
import Metrics from '../../utils/metrics';
import EventManager from '../../utils/events';
import TokenListManager from '../../utils/tokenList';
import TxQueue from '../../utils/txQueue';

import TxExplorerLink from './TxExplorerLink';
import TxStatusView from './TxStatusView';

export default class TxHistoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = { refresh: Date.now(), open: false };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  componentDidMount() {
    this.subUpdate = EventManager.listenFor(
      'txQueueUpdated', this.handleUpdate
    );
    this.subPrompt = EventManager.listenFor(
      'promptTxHistory', this.handleOpen
    );
  }

  componentDidUnmount() {
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

  render() {
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
            </div>

            {_.map(TxQueue.getQueue(), function(item) {
              return (
                <TxStatusView data={item} />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

