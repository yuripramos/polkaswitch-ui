import React, { useEffect, useState } from 'react';

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
import { BalanceProvider } from '../context/balance';
import useLoadBalances from './pages/useLoadBalance';

require('../../css/index.scss');

const App = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenOn = () => setIsFullScreen(true);

  const handleFullScreenOff = () => setIsFullScreen(false);

  useEffect(() => {
    keepTheme();
    window.document.addEventListener('fullScreenOn', handleFullScreenOn);
    window.document.addEventListener('fullScreenOff', handleFullScreenOff);
  }, []);

  useEffect(() => {
    return () => {
      window.document.removeEventListener('fullScreenOn', handleFullScreenOn);
      window.document.removeEventListener('fullScreenOff', handleFullScreenOff);
    };
  }, []);

  const { myApplicationState, setMyApplicationState } = useLoadBalances();

  return (
    <BalanceProvider value={{ ...myApplicationState, setMyApplicationState }}>
      {myApplicationState && (
        <Router>
          <div className={classnames({ fullscreen: isFullScreen })}>
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
      )}
    </BalanceProvider>
  );
};

export default App;
