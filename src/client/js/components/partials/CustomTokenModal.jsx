import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';
import EventManager from "../../utils/events";
import GasPriceControl from "./swap/GasPriceControl";

export default class CustomTokenModal extends Component {
  constructor(props) {
    super(props);
    this.state = { focused: false, open: false, customTokenAddr: '' };
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.onTokenAddrChange = this.onTokenAddrChange.bind(this);
  }

  componentDidMount() {
    this.customTokenPrompt = EventManager.listenFor(
        'addCustomToken', this.handleOpen
    );
  }

  componentWillUnmount() {
    this.customTokenPrompt.unsubscribe();
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

  onTokenAddrChange(e) {

  }

  render() {
    return (
      <div className={classnames("modal", { "is-active": this.state.open })}>
        <div onClick={this.handleClose} className="modal-background"></div>
        <div className="modal-content">
          <div className="connect-panel box">
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
                  <b className="widget-title">Add Custom Token</b>
                </div>
              </div>
            </div>

            <hr />

            <div className="text-gray-stylized">
              <span>Token address</span>
            </div>
            <div class="level is-mobile control">
              <input
                className="input is-medium"
                value={this.state.customTokenAddr}
                placeholder="0x000...."
                onChange={this.onTokenAddrChange} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

