import React, { Component } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import _ from "underscore";
import classnames from 'classnames';

import TokenSymbolBalance from './TokenSymbolBalance';
import TokenConversionRate from './TokenConversionRate';
import TokenIconImg from './TokenIconImg';
import TokenSearchBar from './TokenSearchBar';
import TokenSwapDistribution from './TokenSwapDistribution';
import MarketLimitToggle from './MarketLimitToggle';

import Wallet from '../../utils/wallet';
import Metrics from '../../utils/metrics';
import EventManager from '../../utils/events';

export default class SwapOrderWidget extends Component {
  constructor(props) {
    super(props);

    this.box = React.createRef();
    this.orderPage = React.createRef();

    this.state = {
      // RSR
      // to: "0x8762db106B2c2A0bccB3A80d1Ed41273552616E8",
      // DAI
      // to: Wallet.findTokenById("0x6B175474E89094C44Da98b954EedeAC495271d0F"),
      // MUNI
      to: Wallet.findTokenById("0x806628fC9c801A5a7CcF8FfBC8a0ae3348C5F913"),
      // ETH
      //from: Wallet.findTokenById("ETH"),
      // METH
      from: Wallet.findTokenById("0x798fA7Cf084129616B0108452aF3E1d5d1B32179"),

      fromAmount: undefined,
      toAmount: undefined,

      searchTarget: "",
      showSettings: false,
      showConfirm: false,
      showSearch: false,

      lastWalletUpdate: Date.now()
    };

    this.subscribers = [];
    this.onSwapTokens = this.onSwapTokens.bind(this);
    this.handleTokenChange = this.handleTokenChange.bind(this);
    this.handleSearchToggle = this.handleSearchToggle.bind(this);
    this.handleSettingsToggle = this.handleSettingsToggle.bind(this);
    this.handleReview = this.handleReview.bind(this);
    this.triggerHeightResize = this.triggerHeightResize.bind(this);
    this.updateBoxHeight = _.debounce(this.updateBoxHeight.bind(this), 20);
    this.handleWalletChange = this.handleWalletChange.bind(this);
  }

  componentDidMount() {
    this.subscribers.push(EventManager.listenFor('walletUpdated', this.handleWalletChange));
    window.addEventListener('resize', this.updateBoxHeight);
    this.updateBoxHeight();
  }

  componentDidUnmount() {
    window.removeEventListener('resize', this.updateBoxHeight);
    this.subscribers.forEach(function(v) {
      EventManager.unsubscribe(v);
    });
  }

  handleWalletChange(e) {
    this.setState({
      lastWalletUpdate: Date.now()
    });
  }

  updateBoxHeight() {
    this.box.current.style.height = "";
    _.defer(function() {
      this.box.current.style.height = `${this.box.current.offsetHeight}px`;
    }.bind(this))
  }

  triggerHeightResize(node, isAppearing) {
    this.box.current.style.height = `${node.offsetHeight}px`;
  }

  validateOrderForm() {

  }

  fetchSwapEstimate() {
    if (!this.state.fromAmount ||
      this.state.fromAmount.length == 0 ||
      !Wallet.isConnected()) {
      return;
    }

    var fromAmount = window.ethers.utils.parseUnits(this.state.fromAmount);

    Wallet.getExpectedReturn(
      this.state.from,
      this.state.to,
      fromAmount
    ).then(function(result) {
      var dist = _.map(result.distribution, function(e) {
        return e.toNumber();
      });

      console.log(dist);

      this.box.current.style.height = "";

      this.setState({
        toAmount: window.ethers.utils.formatEther(result.returnAmount),
        swapDistribution: dist
      }, function() {
        Metrics.track("swap-estimate-result", {
          from: this.state.from,
          to: this.state.to,
          fromAmont: this.state.fromAmount,
          toAmount: this.state.toAmount,
          swapDistribution: this.state.swapDistribution
        });
      }.bind(this));
    }.bind(this));
  }

  onSwapTokens(e) {
    Metrics.track("swap-flipped-tokens");
    this.setState({
      to: this.state.from,
      from: this.state.to
    });
  }

  handleSearchToggle(target) {
    return function(e) {
      Metrics.track("swap-search-view", { closing: this.state.showSearch });
      this.setState({
        searchTarget: target,
        showSearch: !this.state.showSearch
      });
    }.bind(this);
  }

  handleSettingsToggle(e) {
    Metrics.track("swap-settings-view", { closing: this.state.showSettings });
    this.setState({
      showSettings: !this.state.showSettings
    });
  }

  handleReview(e) {
    Metrics.track("swap-review-step", { clossing: this.state.showConfirm });
    // TODO validate form swap

    this.setState({
      showConfirm: !this.state.showConfirm
    });
  }

  handleTokenChange(token) {
    var _s = { showSearch: false };
    _s[this.state.searchTarget] = token;
    this.setState(_s, function() {
      Metrics.track("swap-token-changed", {
        changed: this.state.searchTarget,
        from: this.state.from,
        to: this.state.to
      });
    }.bind(this));
  }

  handleTokenAmountChange(target) {
    return function(e) {
      var targetAmount = e.target.value;
      var _s = {};
      _s[`${target}Amount`] = targetAmount;

      Metrics.track("swap-token-value", {
        value: e.target.value,
        from: this.state.from,
        to: this.state.to
      });

      this.setState(_s, function() {
        if (target == 'from') {
          this.fetchSwapEstimate();
        }
      }.bind(this));
    }.bind(this);
  }

  renderToken(token) {
    if (!token) {
      return (<div />);
    }

    return (
      <>
      <div className="level-item">
        <TokenIconImg
          size={"35"}
          token={token} />
      </div>
      <div className="level-item">
        <TokenSymbolBalance
          refresh={this.state.lastWalletUpdate}
          token={token} />
      </div>
      </>
    )
  }

  renderTokenInput(target, token) {
    if (!token) {
      return (<div />);
    }
    return (
      <div className="level is-mobile">
        <div className="level is-mobile is-narrow my-0 token-dropdown"
          onClick={this.handleSearchToggle(target)}>
          {this.renderToken(token)}
          <div className="level-item">
            <span className="icon-down">
              <ion-icon name="chevron-down"></ion-icon>
            </span>
          </div>
        </div>
        <div className="level-item is-flex-grow-1 is-flex-shrink-1 is-flex-direction-column is-align-items-flex-end">
          <div className="field" style={{ width: "100%", maxWidth: "200px" }}>
            <div className="control" style={{ width: "100%" }}>
              <input
                onChange={this.handleTokenAmountChange(target)}
                value={this.state[`${target}Amount`]}
                type="number"
                min="0"
                className="input is-medium"
                placeholder="0.0" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderOrderView() {
    return (
      <div className="page page-view-order" ref={this.orderPage}>
        <div className="page-inner">
          <div className="level is-mobile">
            <div className="level-left is-flex-grow-1">
              <MarketLimitToggle />
            </div>

            <div className="level-right">
              <div className="level-item">
                <span className="icon clickable settings-icon" onClick={this.handleSettingsToggle}>
                  <ion-icon name="settings-outline"></ion-icon>
                </span>
              </div>
            </div>
          </div>

          <div className="notification is-white my-0">
            <div className="text-gray-stylized">
              <span>You Pay</span>
            </div>
            {this.renderTokenInput("from", this.state.from)}
          </div>

          <div class="swap-icon-wrapper">
            <div class="swap-icon-v2 icon" onClick={this.onSwapTokens}>
              <ion-icon name="swap-vertical-outline"></ion-icon>
            </div>

            <div class="swap-icon is-hidden" onClick={this.onSwapTokens}>
              <i class="fas fa-long-arrow-alt-up"></i>
              <i class="fas fa-long-arrow-alt-down"></i>
            </div>
          </div>

          <div className="notification is-info is-light">
            <div className="text-gray-stylized">
              <span>You Recieve</span>
            </div>
            {this.renderTokenInput("to", this.state.to)}
          </div>

          <div
            className={classnames("hint--large", "token-dist-expand-wrapper", {
              "hint--top": this.state.swapDistribution,
              "expand": this.state.swapDistribution
            })}
            aria-label="We have queried multiple exchanges to find the best possible pricing for this swap. The below routing chart shows which exchanges we used to achieve the best swap."
          >
            <div className="token-dist-hint-text">
              <span>Routing Distribution</span>
              <span className="hint-icon">?</span>
            </div>
            <TokenSwapDistribution
              totalParts={3}
              parts={this.state.swapDistribution}/>
          </div>

          <div>
            <button className="button is-primary is-fullwidth is-medium" onClick={this.handleReview}>
              Review Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderConfirmView() {
    return (
      <div className="page page-stack">
        <div className="page-inner">
          <div className="level is-mobile">
            <div className="level-left">
              <div className="level-item">
                <span className="icon clickable is-medium" onClick={this.handleReview}>
                  <i className="fas fa-arrow-left"></i>
                </span>
              </div>
              <div className="level-item">
                <b className="widget-title">Review Order</b>
              </div>
            </div>
          </div>

          <hr />

          <div className="text-gray-stylized">
            <span>You Pay</span>
          </div>

          <div className="level is-mobile">
            <div className="level-left">
              {this.renderToken(this.state.from)}
            </div>

            <div className="level-right">
              <div className="level-item currency-text">
                {this.state.fromAmount}
              </div>
            </div>
          </div>

          <hr />

          <div className="text-gray-stylized">
            <span>You Recieve</span>
          </div>

          <div className="level is-mobile">
            <div className="level-left">
              {this.renderToken(this.state.to)}
            </div>

            <div className="level-right">
              <div className="level-item currency-text">
                {this.state.toAmount}
              </div>
            </div>
          </div>

          <hr />

          <div className="level is-mobile">
            <div className="level-left">
              <div className="level-item">
                <b>Gas Price</b>
              </div>
            </div>

            <div className="level-right">
              <div className="level-item currency-text">
                0.00000324 ETH
              </div>
            </div>
          </div>

          <hr />

          <div>
            <button className="button is-primary is-fullwidth is-medium"
              onClick={this.handleReview}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderSettingsView() {
    return (
      <div className="page page-stack page-view-settings">
        <div className="page-inner">
          <div className="level is-mobile">
            <div className="level-left">
              <div className="level-item">
                <span className="icon clickable is-medium" onClick={this.handleSettingsToggle}>
                  <i className="fas fa-arrow-left"></i>
                </span>
              </div>
              <div className="level-item">
                <b className="widget-title">Advanced Settings</b>
              </div>
            </div>
          </div>

          <hr />

          <div className="level is-mobile option">
            <div className="level-left">
              <div className="level-item">
                <span>
                  <b>Gas Price</b>
                  <span
                    className="hint-icon hint--bottom hint--medium"
                    aria-label="You can expedite your transaction by paying more Gas Fees. You can choose between either faster transactions or cheaper fees."
                  >?</span>
                </span>
              </div>
            </div>

            <div className="level-right">
              <div className="level-item">
                <div className="select">
                  <select>
                    <option>Instant</option>
                    <option>Cheapest</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="level is-mobile option">
            <div className="level-left">
              <div className="level-item">
                <span>
                  <b>Slippage Tolerance</b>
                  <span
                    className="hint-icon hint--bottom hint--medium"
                    aria-label="Your transaction will revert if the price changes unfavorably by more than this percentage"
                  >?</span>
                </span>
              </div>
            </div>

            <div className="level-right">
              <div className="level-item">
                <div className="select">
                  <select>
                    <option>0.1%</option>
                    <option>0.5%</option>
                    <option>1%</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  renderTokenSearch() {
    return (
      <div className="page page-stack page-view-search">
        <div className="page-inner">
          <TokenSearchBar
            inline={true}
            focused={this.state.showSearch}
            placeholder={"Try DAI, LINK or Ethereum ... "}
            handleClose={this.handleSearchToggle("to")}
            handleTokenChange={this.handleTokenChange} />
        </div>
      </div>
    );
  }

  render() {
    var animTiming = 300;
    var isStack = !(
      this.state.showSettings ||
      this.state.showConfirm ||
      this.state.showSearch
    );

    return (
      <div ref={this.box} className="box swap-widget">
        <CSSTransition
          in={isStack}
          timeout={animTiming}
          onEntering={this.triggerHeightResize}
          classNames="fade">
          {this.renderOrderView()}
        </CSSTransition>
        <CSSTransition
          in={this.state.showSearch}
          timeout={animTiming}
          onEntering={this.triggerHeightResize}
          classNames="slidein">
          {this.renderTokenSearch()}
        </CSSTransition>
        <CSSTransition
          in={this.state.showSettings}
          timeout={animTiming}
          onEntering={this.triggerHeightResize}
          classNames="slidein">
          {this.renderSettingsView()}
        </CSSTransition>
        <CSSTransition
          in={this.state.showConfirm}
          timeout={animTiming}
          onEntering={this.triggerHeightResize}
          classNames="slidein">
          {this.renderConfirmView()}
        </CSSTransition>
      </div>
    );
  }
}

