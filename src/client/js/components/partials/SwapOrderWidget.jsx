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
import SwapFinalResultSlide from './swap/SwapFinalResultSlide';

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
      showResults: false,

      transactionHash: "0xf520e322b0ff308e4ae2db38b57b5fa081192df1",

      refresh: Date.now()
    };

    this.subscribers = [];
    this.onSwapTokens = this.onSwapTokens.bind(this);
    this.handleTokenChange = this.handleTokenChange.bind(this);
    this.handleSearchToggle = this.handleSearchToggle.bind(this);
    this.handleSettingsToggle = this.handleSettingsToggle.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleResults = this.handleResults.bind(this);
    this.handleBackOnConfirm = this.handleBackOnConfirm.bind(this);
    this.handleBackOnResults = this.handleBackOnResults.bind(this);
    this.triggerHeightResize = this.triggerHeightResize.bind(this);
    this.updateBoxHeight = _.debounce(this.updateBoxHeight.bind(this), 20);
    this.handleWalletChange = this.handleWalletChange.bind(this);
    this.onSwapEstimateComplete = this.onSwapEstimateComplete.bind(this);
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

  onSwapEstimateComplete(fromAmount, toAmount, dist) {
    this.box.current.style.height = "";
    this.setState({
      fromAmount: fromAmount,
      toAmount: toAmount,
      swapDistribution: dist
    }, function() {
      _.delay(function() {
        // put back height after dist expand anim
        this.updateBoxHeight();
      }.bind(this), 301)
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

  handleConfirm(e) {
    Metrics.track("swap-review-step", { closing: this.state.showConfirm });
    this.setState({
      showConfirm: true
    });
  }

  handleResults(e) {
    this.setState({
      showConfirm: false,
      showResults: true
    });
  }

  handleBackOnConfirm(e) {
    this.setState({ showConfirm: false });
  }

  handleBackOnResults(e) {
    this.setState({
      showConfirm: false,
      showResults: false
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

  render() {
    var animTiming = 300;
    var isStack = !(
      this.state.showSettings ||
      this.state.showConfirm ||
      this.state.showSearch ||
      this.state.showResults
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
            handleSearchToggle={this.handleSearchToggle}
            handleSettingsToggle={this.handleSettingsToggle}
            swapDistribution={this.state.swapDistribution}
            onSwapEstimateComplete={this.onSwapEstimateComplete}
            onSwapTokens={this.onSwapTokens}
            handleSubmit={this.handleConfirm}
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
          in={this.state.showConfirm || this.state.showResults}
          timeout={animTiming}
          onEntering={this.triggerHeightResize}
          classNames="slidein">
          <CSSTransition
            in={!this.state.showResults}
            timeout={animTiming}
            classNames="fade">
            <SwapConfirmSlide
              to={this.state.to}
              from={this.state.from}
              fromAmount={this.state.fromAmount}
              toAmount={this.state.toAmount}
              refresh={this.state.refresh}
              swapDistribution={this.state.swapDistribution}
              handleTransactionComplete={this.handleResults}
              handleBackOnConfirm={this.handleBackOnConfirm}
            />
          </CSSTransition>
        </CSSTransition>
        <CSSTransition
          in={this.state.showResults}
          timeout={animTiming}
          onEntering={this.triggerHeightResize}
          classNames="slidein">
          <SwapFinalResultSlide
            to={this.state.to}
            from={this.state.from}
            fromAmount={this.state.fromAmount}
            toAmount={this.state.toAmount}
            transactionHash={this.state.transactionHash}
            handleDismiss={this.handleBackOnResults}
          />
        </CSSTransition>
      </div>
    );
  }
}

