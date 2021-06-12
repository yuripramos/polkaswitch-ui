import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import SwapHome from './pages/SwapHome';
import TokenClaimHome from './pages/TokenClaimHome';
import Footer from './partials/Footer';
import classnames from 'classnames';

require('../../css/index.scss');

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { fullscreen: false };
  }

  componentDidMount() {
    this.handleFullScreenOn = this.handleFullScreenOn.bind(this);
    this.handleFullScreenOff = this.handleFullScreenOff.bind(this);
    window.document.addEventListener('fullScreenOn', this.handleFullScreenOn);
    window.document.addEventListener('fullScreenOff', this.handleFullScreenOff);
  }

  componentDidUnmount() {
    window.document.removeEventListener('fullScreenOn', this.handleFullScreenOn);
    window.document.removeEventListener('fullScreenOff', this.handleFullScreenOff);
  }

  handleFullScreenOn() {
    this.setState({
      fullscreen: true
    });
  }

  handleFullScreenOff() {
    this.setState({
      fullscreen: false
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
            <Route path="/claim">
              <TokenClaimHome />
            </Route>
          </Switch>
          <Footer />
        </div>
      </Router>
    );
  }
}

