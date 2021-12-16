import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';

import SwapHome from './pages/SwapHome';
import TokenClaimHome from './pages/TokenClaimHome';
import BridgeHome from './pages/BridgeHome';
import WalletHome from './pages/WalletHome';
import StakeHome from './pages/StakeHome';
import StatusHome from './pages/StatusHome';
import Footer from './partials/Footer';
import classnames from 'classnames';
import { keepTheme } from '../utils/theme';

require('../../css/index.scss');

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { fullscreen: false };
  }

  componentDidMount() {
    keepTheme();
    this.handleFullScreenOn = this.handleFullScreenOn.bind(this);
    this.handleFullScreenOff = this.handleFullScreenOff.bind(this);
    window.document.addEventListener('fullScreenOn', this.handleFullScreenOn);
    window.document.addEventListener('fullScreenOff', this.handleFullScreenOff);
  }

  componentWillUnmount() {
    window.document.removeEventListener(
      'fullScreenOn',
      this.handleFullScreenOn
    );
    window.document.removeEventListener(
      'fullScreenOff',
      this.handleFullScreenOff
    );
  }

  handleFullScreenOn() {
    this.setState({
      fullscreen: true,
    });
  }

  handleFullScreenOff() {
    this.setState({
      fullscreen: false,
    });
  }

  render() {
    return (
      <Router>
        <div className={classnames({ fullscreen: this.state.fullscreen })}>
          <Switch>
            <Route exact path="/">
              <Redirect to="/swap" />
            </Route>
            <Route path="/swap">
              <SwapHome />
            </Route>
            <Route path="/bridge">
              <BridgeHome />
            </Route>
            <Route path="/claim">
              <TokenClaimHome />
            </Route>
            <Route path="/stake">
              <StakeHome />
            </Route>
            <Route path="/wallet">
              <WalletHome />
            </Route>
            <Route path="/status">
              <StatusHome />
            </Route>
            <Route>
              <Redirect to="/swap" />
            </Route>
          </Switch>
          <Footer />
        </div>
      </Router>
    );
  }
}
