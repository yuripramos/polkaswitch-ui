import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

export default class DropdownSelectModal extends Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose(e) {
    this.props.handleClose(e);
  }

  render() {
    return (
      <div className={classnames("modal", { "is-active": this.props.open })}>
        <div onClick={this.handleClose} className="modal-background"></div>
        <div className="modal-content">
          <div className="modal-dropdown-options box">
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
                  <b className="widget-title">{this.props.title}</b>
                </div>
              </div>
            </div>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

