import React, { Component } from 'react';
import { Link } from "react-router-dom";
import _ from 'underscore';
import classnames from 'classnames';

export default class TokenSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = { focused: false, value: "" };
    this.handleChange = this.handleChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  onBlur(e) {
    _.delay(function() {
      this.setState({ focused: false })
    }.bind(this), 200);
  }

  onFocus(e) {
    this.setState({ focused: true })
  }

  render() {
    var filteredTokens = [];
    var _query = this.state.value.toLowerCase().trim();
    var showDropdown = _query.length > 0 && this.state.focused;

    if (_query.length > 0) {
      filteredTokens = _.first(_.filter(window.tokens, function(t) {
        return (t.id && t.symbol && t.name) &&
          (t.symbol.toLowerCase().includes(_query) ||
          t.name.toLowerCase().includes(_query));
      }), 10);
    }

    return (
      <div
        className={classnames("dropdown", { "is-active": showDropdown })}
        style={{ width: "75%" }}>
        <div className="dropdown-trigger" style={{ width: "100%" }}>
          <div className="field" style={{ width: "100%" }}>
            <div className="control has-icons-left has-icons-right">
              <input
                className="input is-medium"
                onFocus={this.onFocus} onBlur={this.onBlur}
                value={this.state.value} onChange={this.handleChange}
                placeholder="Search by token name, symbol, or address ..." />
              <span className="icon is-left">
                <i className="fas fa-search fa-sm"></i>
              </span>
            </div>
          </div>
        </div>
        <div className="dropdown-menu" id="dropdown-menu"
          role="menu" style={{ width: "100%" }}>
          <div className="dropdown-content">
            {_.map(filteredTokens, function(v) {
              return (
                <a href="#" className="dropdown-item level my-0 px-6">
                  <span className="level-left my-2">
                    <span className="level-item">
                      <img
                        style={{ height: "40px" }}
                        src={`/tokens/erc20/${window.ethers.utils.getAddress(v.id)}/logo.png`} />
                    </span>
                    <span className="level-item is-size-5">{v.name}</span>
                    <span className="level-item has-text-grey is-size-5">{v.symbol}</span>
                  </span>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

