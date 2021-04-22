import React, { Component } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import _ from "underscore";
import classnames from 'classnames';

import TokenSymbolBalance from './swap/TokenSymbolBalance';
import TokenIconImg from './TokenIconImg';
import TokenSearchBar from './TokenSearchBar';
import TokenSwapDistribution from './swap/TokenSwapDistribution';
import TokenIconBalanceGroupView from './swap/TokenIconBalanceGroupView';
import MarketLimitToggle from './swap/MarketLimitToggle';

import SwapOrderSlide from './swap/SwapOrderSlide';
import SwapTokenSearchSlide from './swap/SwapTokenSearchSlide';
import SwapConfirmSlide from './swap/SwapConfirmSlide';
import SwapAdvancedSettingsSlide from './swap/SwapAdvancedSettingsSlide';

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

      refresh: Date.now()
    };

    this.subscribers = [];
    this.onSwapTokens = this.onSwapTokens.bind(this);
    this.handleTokenChange = this.handleTokenChange.bind(this);
    this.handleTokenAmountChange = this.handleTokenAmountChange.bind(this);
    this.handleSearchToggle = this.handleSearchToggle.bind(this);
    this.handleSettingsToggle = this.handleSettingsToggle.bind(this);
    this.handleReview = this.handleReview.bind(this);
    this.handleBackOnConfirm = this.handleBackOnConfirm.bind(this);
    this.triggerHeightResize = this.triggerHeightResize.bind(this);
    this.updateBoxHeight = _.debounce(this.updateBoxHeight.bind(this), 20);
    this.handleWalletChange = this.handleWalletChange.bind(this);
    this.validateOrderForm = this.validateOrderForm.bind(this);
    this.fetchSwapEstimate = this.fetchSwapEstimate.bind(this);
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
      refresh: Date.now()
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
    return (this.state.from && this.state.to &&
      this.state.fromAmount && this.state.fromAmount.length > 0 &&
      this.state.toAmount && this.state.toAmount.length > 0 &&
      !this.state.calculatingSwap);
  }

  fetchSwapEstimate() {
    if (!this.state.fromAmount ||
      this.state.fromAmount.length == 0) {
      return;
    }

    var timeNow = Date.now();

    this.setState({
      calculatingSwap: true,
      calculatingSwapTimestamp: timeNow
    }, function() {
      var fromAmount = window.ethers.utils.parseUnits(this.state.fromAmount);

      _.delay(function() {
        Wallet.getExpectedReturn(
          this.state.from,
          this.state.to,
          fromAmount
        ).then(function(result) {
          if (this.state.calculatingSwapTimestamp != timeNow) {
            return;
          }

          var dist = _.map(result.distribution, function(e) {
            return e.toNumber();
          });

          this.box.current.style.height = "";

          this.setState({
            toAmount: window.ethers.utils.formatEther(result.returnAmount),
            swapDistribution: dist,
            calculatingSwap: false
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
      }.bind(this), 500);

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
    if (!Wallet.isConnected()) {
      EventManager.emitEvent('promptWalletConnect', 1);
    }

    else {
      if (this.validateOrderForm()) {
        Metrics.track("swap-review-step", { clossing: this.state.showConfirm });

        this.setState({
          showConfirm: !this.state.showConfirm
        });
      }
    }
  }

  handleBackOnConfirm(e) {
    this.setState({ showConfirm: false });
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
          <SwapOrderSlide
            ref={this.orderPage}
            to={this.state.to}
            from={this.state.from}
            fromAmount={this.state.fromAmount}
            toAmount={this.state.toAmount}
            refresh={this.state.refresh}
            calculatingSwap={this.state.calculatingSwap}
            swapDistribution={this.state.swapDistribution}
            validateOrderForm={this.validateOrderForm}
            handleSearchToggle={this.handleSearchToggle}
            handleSettingsToggle={this.handleSettingsToggle}
            handleTokenAmountChange={this.handleTokenAmountChange}
            onSwapTokens={this.onSwapTokens}
            handleSubmit={this.handleReview}
          />
        </CSSTransition>
        <CSSTransition
          in={this.state.showSearch}
          timeout={animTiming}
          onEntering={this.triggerHeightResize}
          classNames="slidein">
          <SwapTokenSearchSlide
            showSearch={this.state.showSearch}
            handleSearchToggle={this.handleSearchToggle}
            handleTokenChange={this.handleTokenChange}
          />
        </CSSTransition>
        <CSSTransition
          in={this.state.showSettings}
          timeout={animTiming}
          onEntering={this.triggerHeightResize}
          classNames="slidein">
          <SwapAdvancedSettingsSlide
            handleBackOnSettings={this.handleSettingsToggle}
          />
        </CSSTransition>
        <CSSTransition
          in={this.state.showConfirm}
          timeout={animTiming}
          onEntering={this.triggerHeightResize}
          classNames="slidein">
          <SwapConfirmSlide
            to={this.state.to}
            from={this.state.from}
            fromAmount={this.state.fromAmount}
            toAmount={this.state.toAmount}
            refresh={this.state.refresh}
            handleBackOnConfirm={this.handleBackOnConfirm}
          />
        </CSSTransition>
      </div>
    );
  }
}

