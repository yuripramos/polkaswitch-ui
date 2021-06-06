import React, { Component } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import _ from "underscore";
import classnames from 'classnames';

import SwapOrderSlide from './SwapOrderSlide';
import SwapTokenSearchSlide from './SwapTokenSearchSlide';
import SwapConfirmSlide from './SwapConfirmSlide';
import SwapAdvancedSettingsSlide from './SwapAdvancedSettingsSlide';
import SwapFinalResultSlide from './SwapFinalResultSlide';

import Wallet from '../../../utils/wallet';
import TokenListManager from '../../../utils/tokenList';
import Metrics from '../../../utils/metrics';
import EventManager from '../../../utils/events';

export default class SwapOrderWidget extends Component {
  constructor(props) {
    super(props);

    this.box = React.createRef();
    this.orderPage = React.createRef();

    var network = TokenListManager.getCurrentNetworkConfig();

    this.state = {
      to: TokenListManager.findTokenById(network.defaultPair.to),
      from: TokenListManager.findTokenById(network.defaultPair.from),

      fromAmount: undefined,
      toAmount: undefined,

      searchTarget: "",
      showSettings: false,
      showConfirm: false,
      showSearch: false,
      showResults: false,

      transactionHash: "",

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
    this.handleNetworkChange = this.handleNetworkChange.bind(this);
    this.onSwapEstimateComplete = this.onSwapEstimateComplete.bind(this);
  }

  componentDidMount() {
    this.subscribers.push(EventManager.listenFor('walletUpdated', this.handleWalletChange));
    this.subscribers.push(EventManager.listenFor('networkUpdated', this.handleNetworkChange));
    window.addEventListener('resize', this.updateBoxHeight);
    this.updateBoxHeight();
  }

  componentDidUnmount() {
    window.removeEventListener('resize', this.updateBoxHeight);
    this.subscribers.forEach(function(v) {
      EventManager.unsubscribe(v);
    });
  }

  handleNetworkChange(e) {
    var network = TokenListManager.getCurrentNetworkConfig();

    this.setState({
      to: TokenListManager.findTokenById(network.defaultPair.to),
      from: TokenListManager.findTokenById(network.defaultPair.from)
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
      fromAmount: this.state.toAmount,
      from: this.state.to,
      toAmount: 0.0
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

  handleResults(success, hash) {
    this.setState({
      transactionHash: hash,
      showConfirm: false,
      showResults: true,
      transactionSuccess: success,
      refresh: Date.now() // refresh Balances
    });
  }

  handleBackOnConfirm(e) {
    this.setState({ showConfirm: false });
  }

  handleBackOnResults(e) {
    this.setState({
      showConfirm: false,
      showResults: false,
      toAmount: '',
      fromAmount: '',
      swapDistribution: undefined
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
            transactionSuccess={this.state.transactionSuccess}
            transactionHash={this.state.transactionHash}
            handleDismiss={this.handleBackOnResults}
          />
        </CSSTransition>
      </div>
    );
  }
}

