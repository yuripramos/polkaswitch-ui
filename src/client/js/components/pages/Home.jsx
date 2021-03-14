
import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export default class Home extends Component {
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
      <div class="container">
        <nav class="level my-6">
          <div class="level-left is-flex-grow-1">
            <div class="level-item">
              <span class="icon is-left">
                <i class="fab fa-octopus-deploy is-size-5 has-text-danger"></i>
              </span>
            </div>
            <div class="level-item">
              <div class="is-family-monospace is-size-4 mr-4 has-text-weight-bold">polkaswitch</div>
            </div>
            <div class="level-item is-flex-grow-3 is-justify-content-left">
              <div class="field" style={{ width: "75%" }}>
                <div class="control has-icons-left has-icons-right">
                  <input class="input is-medium" type="email" placeholder="Search by token name, symbol, or address ..." />
                  <span class="icon is-left">
                    <i class="fas fa-search fa-sm"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="level-right">
            <p class="level-item"><a class="button is-light">Explore</a></p>
            <p class="level-item"><a class="button is-danger">Connect Wallet</a></p>
          </div>
        </nav>

        <div class="columns">
          <div class="column is-three-fifths">
            <div class="box">
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
          </div>

          <div class="column">
            <div class="box">
              <div class="level">
                <div class="level-left is-flex-grow-1">
                  <div class="level-item">
                    <div class="buttons has-addons">
                      <button class="button is-link is-outlined is-selected px-6">Market</button>
                      <button class="button px-6">Limit</button>
                    </div>
                  </div>
                </div>

                <div class="level-right">
                  <div class="level-item">
                    <span class="icon is-medium">
                      <i class="fas fa-sliders-h"></i>
                    </span>
                  </div>
                </div>
              </div>

              <div class="notification is-white">
                <div class="level mx-3">
                  <div class="level-left">
                    <div class="level-item">
                      <i class="fab fa-ethereum is-size-4 pr-2"></i>
                    </div>
                    <div class="level-item">
                      <div class="is-size-3"><b>ETH</b></div>
                    </div>
                    <div class="level-item">
                      <i class="fas fa-angle-down"></i>
                    </div>
                  </div>
                  <div class="level-right">
                    <div class="level-item">
                      <div class="field">
                        <div class="control">
                          <input class="input is-medium" placeholder="0.0" style={{ width: "200px" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="notification is-info is-light">
                <div class="level mx-3">
                  <div class="level-left">
                    <div class="level-item">
                      <i class="fab fa-slack-hash is-size-4 pr-2"></i>
                    </div>
                    <div class="level-item">
                      <div class="is-size-3"><b>RSR</b></div>
                    </div>
                    <div class="level-item">
                      <i class="fas fa-angle-down"></i>
                    </div>
                  </div>
                  <div class="level-right">
                    <div class="level-item">
                      <div class="field">
                        <div class="control">
                          <input class="input is-medium" placeholder="0.0" style={{ width: "200px" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div class="card">
              <header class="card-header">
                <p class="card-header-title">
                  Exchange Comparsion
                </p>
                <div class="card-header-icon">
                  <span class="icon">
                    <i class="fas fa-search"></i>
                  </span>
                </div>
              </header>
              <div class="card-content">
                <div class="content">
                  <div class="columns">
                    <div class="column">
                      <div class="mb-5">Exchange</div>
                      <div class="mb-5">Polkaswitch</div>
                      <div class="mb-5">Uniswap</div>
                      <div class="mb-2">Sushiswap</div>
                    </div>
                    <div class="column">
                      <div class="mb-5">Amount</div>
                      <div class="mb-5">13232</div>
                      <div class="mb-5">3455</div>
                      <div class="mb-2">8844</div>
                    </div>
                    <div class="column">
                      <div class="mb-5">Result</div>
                      <div class="mb-5">BEST</div>
                      <div class="mb-5">Match</div>
                      <div class="mb-2">-4%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

