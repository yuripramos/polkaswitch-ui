import React, { Component } from 'react';
import _ from 'underscore';
import classnames from 'classnames';

import TokenIconImg from './TokenIconImg';
import CustomScroll from 'react-custom-scroll';

import Wallet from '../../utils/wallet';
import TokenListManager from '../../utils/tokenList';

export default class TokenSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = { focused: false, value: "" };

    this.input = React.createRef();

    this.handleChange = this.handleChange.bind(this);
    this.handleDropdownClick = this.handleDropdownClick.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);

    this.TOP_TOKENS = _.map([
      "ETH",
      "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
      "0x514910771AF9Ca656af840dff83E8264EcF986CA", // LINK
      "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", // UNI
      "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2", // Sushi
      "0xba100000625a3754423978a60c9317c58a424e3D", // Balancor
      "0xE41d2489571d322189246DaFA5ebDe1F4699F498", // 0x
      "0xd26114cd6EE289AccF82350c8d8487fedB8A0C07" // OMG
    ], function(v) { return TokenListManager.findTokenById(v) });
  }

  componentDidUpdate(prevProps) {
    if (this.props.focused !== prevProps.focused) {
      if (this.props.focused) {
        _.defer(function() {
          window.document.dispatchEvent(new Event('fullScreenOn'));

          // wait for animation to clear;
          _.delay(function() {
            this.input.current.focus();
          }.bind(this), 200);
        }.bind(this));
      } else {
        _.defer(function() {
          window.document.dispatchEvent(new Event('fullScreenOff'));
        });
      }
    }
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  onBlur(e) {
    this.setState({ focused: false });
  }

  onFocus(e) {
    this.setState({ focused: true });
  }

  handleDropdownClick(token) {
    return function handleClick(e) {
      if (this.props.handleTokenChange) {
        this.props.handleTokenChange(token);
      }

      // wait for animation to complete
      _.delay(function() {
        this.setState({
          value: ""
        });
      }.bind(this), 400);
    }.bind(this);
  }

  renderTopList() {
    var top3 = _.first(this.TOP_TOKENS, 3);
    var rest = _.rest(this.TOP_TOKENS, 3);

    var top3Content = _.map(top3, function(v) {
      return (
        <a href="#"
          onClick={this.handleDropdownClick(v)}
          className={classnames("top-item level column is-mobile")}>
          <span className="level-left my-2">
            <span className="level-item">
              <TokenIconImg
                size={35}
                token={v} />
            </span>
            <span className="level-item has-text-grey">{v.symbol}</span>
          </span>
        </a>
      );
    }.bind(this));

    return (
      <div class="token-top-list">
        <div className="text-gray-stylized">
          <span>Popular</span>
        </div>
        <div className="columns is-mobile">
          {top3Content}
        </div>
        {this.renderDropList(rest)}
    </div>
    );
  }

  renderDropList(filteredTokens) {
    return _.map(filteredTokens, function(v) {
      return (
        <a href="#"
          onClick={this.handleDropdownClick(v)}
          className={classnames("dropdown-item level is-mobile")}>
          <span className="level-left my-2">
            <span className="level-item">
              <TokenIconImg
                size={35}
                token={v} />
            </span>
            <span className="level-item">{v.name}</span>
            <span className="level-item has-text-grey">{v.symbol}</span>
          </span>
        </a>
      )
    }.bind(this));
  }

  renderEmptyList() {
    return (
      <div className="token-empty-list">
        <div>
          <div className="empty-text has-text-info">Unrecongized Token</div>
          <i class="fas fa-question has-text-info-light"></i>
        </div>
      </div>
    )
  }

  render() {
    var filteredTokens = [];
    var _query = this.state.value.toLowerCase().trim();
    var showDropdown = _query.length > 0 && this.state.focused;
    var dropContent;

    if (_query.length > 0) {
      filteredTokens = _.first(_.filter(window.tokens, function(t) {
        return (t.symbol) && (
          (t.symbol && t.symbol.toLowerCase().includes(_query)) ||
          (t.name && t.name.toLowerCase().includes(_query))
        );
      }), 10);

      if (filteredTokens.length > 0) {
        dropContent = this.renderDropList(filteredTokens);
      } else {
        dropContent = this.renderEmptyList();
      }
    } else {
      dropContent = this.renderTopList();
    }

    var dropList;

    if (this.props.inline) {
      dropList = (
        <div className="token-inline-list">
          <CustomScroll heightRelativeToParent="100%">
            {dropContent}
          </CustomScroll>
          <div className="token-inline-list-bottom">&nbsp;</div>
        </div>
      );
    } else {
      dropList = (
        <div className="dropdown-menu" id="dropdown-menu"
          role="menu" style={{ width: "100%" }}>
          <div className="dropdown-content">
            {dropContent}
          </div>
        </div>
      );
    }

    return (
      <div
        className={classnames("token-search-bar", {
          "is-active": showDropdown,
          "dropdown": !this.props.inline
        })}
        style={{ width: this.props.width || "100%" }}>
        <div
          className={classnames({
            "dropdown-trigger": !this.props.inline
          })}
          style={{ width: "100%" }}>
          <div className="field" style={{ width: "100%" }}>
            <div className="control has-icons-left has-icons-right">
              <input
                ref={this.input}
                className="input is-medium"
                onFocus={this.onFocus} onBlur={this.onBlur}
                value={this.state.value} onChange={this.handleChange}
                placeholder={this.props.placeholder || "Search by token name, symbol, or address ..."} />
              <span className="icon is-left">
                <i className="fas fa-search fa-sm"></i>
              </span>
              {this.props.handleClose && (
                <span className="icon close-icon is-right" onClick={this.props.handleClose}>
                  <i className="fas fa-times fa-sm"></i>
                </span>
              )}
            </div>
          </div>
        </div>
        {dropList}
      </div>
    );
  }
}

