import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      darkMode: false,
      viewMode: false
    };
    this.handleDarkModeChange = this.handleDarkModeChange.bind(this);
    this.handleViewModeChange = this.handleViewModeChange.bind(this);
  }

  handleDarkModeChange(event) {
    this.setState({ darkMode: event.target.checked });
  }

  handleViewModeChange(event) {
    this.setState({ viewMode: event.target.checked });
  }

  render() {
    return (
      <div>
        <span className="icon clickable settings-icon">
          <ion-icon name="settings-outline"></ion-icon>
        </span>
        <div className="flyout">
          <div className="menu-item">About</div>
          <div className="menu-item">Documentation</div>
          <div className="menu-item">Help</div>
          <div className="menu-item">Telegram</div>
          <div className="divider"></div>
          <div className="menu-item">Dark Mode
            <span className="item-switcher hint--bottom hint--medium">
              <input
                id="dark-mode-switcher"
                type="checkbox"
                checked={this.state.darkMode}
                onChange={this.handleDarkModeChange} />
              <label htmlFor="dark-mode-switcher"></label>
            </span>
          </div>
          <div className="menu-item">Simplify View
            <span className="item-switcher hint--bottom hint--medium">
              <input
                id="simplify-mode-switcher"
                type="checkbox"
                checked={this.state.viewMode}
                onChange={this.handleViewModeChange} />
              <label htmlFor="simplify-mode-switcher"></label>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

