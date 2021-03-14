
import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default class PairOverviewChart extends Component {
  componentDidMount() {
    setTimeout(function() {
      const s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js"
      s.async = true;
      s.innerHTML = JSON.stringify({
        "symbol": "KUCOIN:DRGNBTC",
        "width": "100%",
        "height": "100%",
        "locale": "en",
        "dateRange": "12M",
        "colorTheme": "light",
        "trendLineColor": "#37a6ef",
        "underLineColor": "#E3F2FD",
        "isTransparent": true,
        "autosize": true,
        "largeChartUrl": "/"
      });
      this.instance.appendChild(s);
    }.bind(this), 1);
  }

  render() {
    return (
      <div>
        <div class="block" style={{ width: "100%",  height: "600px" }}>
          <div class="tradingview-widget-container"
            ref={el => (this.instance = el)}>
            <div class="tradingview-widget-container__widget"></div>
            <div class="tradingview-widget-copyright">by TradingView</div>
          </div>
        </div>

        <div class="block">
          <div class="level notification is-light is-info">
            <div class="level-item has-text-centered">
              <div>
                <p>Total Supply</p>
                <p><b>$15.54M</b></p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p>24 Hour Volume</p>
                <p><b>$19.54B</b></p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p>Pooled ETH</p>
                <p><b>837.83</b></p>
              </div>
            </div>
            <div class="level-item has-text-centered">
              <div>
                <p>Market Cap</p>
                <p><b>$61.83B</b></p>
              </div>
            </div>
          </div>
        </div>

        <div class="block is-size-6"><b>Routing</b></div>
        <div class="block">
          <div class="columns">
            <div class="column is-half">
              <div class="tile is-ancestor">
                <div class="tile is-parent">
                  <article class="tile is-child notification is-light is-info is-flex
                    is-flex-direction-column is-align-items-center is-justify-content-center">
                    <b>Balancer</b>
                  </article>
                </div>
                <div class="tile is-parent is-vertical">
                  <article class="tile is-child notification is-light is-info is-flex
                    is-flex-direction-column is-align-items-center is-justify-content-center">
                    <b>Sushiswap</b>
                  </article>
                  <article class="tile is-child notification is-light is-info is-flex
                    is-flex-direction-column is-align-items-center is-justify-content-center">
                    <b>Uniswap</b>
                  </article>
                </div>
              </div>
            </div>
            <div class="column">
            </div>
          </div>
        </div>
      </div>

    );
  }
}

