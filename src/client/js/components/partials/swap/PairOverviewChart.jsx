
import React, { Component } from 'react';

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
        <div className="block" style={{ width: "100%",  height: "600px" }}>
          <div className="tradingview-widget-container"
            ref={el => (this.instance = el)}>
            <div className="tradingview-widget-container__widget"></div>
            <div className="tradingview-widget-copyright">by TradingView</div>
          </div>
        </div>

        <div className="block">
          <div className="level notification is-light is-info">
            <div className="level-item has-text-centered">
              <div>
                <p>Total Supply</p>
                <p><b>$15.54M</b></p>
              </div>
            </div>
            <div className="level-item has-text-centered">
              <div>
                <p>24 Hour Volume</p>
                <p><b>$19.54B</b></p>
              </div>
            </div>
            <div className="level-item has-text-centered">
              <div>
                <p>Pooled ETH</p>
                <p><b>837.83</b></p>
              </div>
            </div>
            <div className="level-item has-text-centered">
              <div>
                <p>Market Cap</p>
                <p><b>$61.83B</b></p>
              </div>
            </div>
          </div>
        </div>

        <div className="block is-size-6"><b>Routing</b></div>
        <div className="block">
          <div className="columns">
            <div className="column is-half">
              <div className="tile is-ancestor">
                <div className="tile is-parent">
                  <article className="tile is-child notification is-light is-info is-flex
                    is-flex-direction-column is-align-items-center is-justify-content-center">
                    <b>Balancer</b>
                  </article>
                </div>
                <div className="tile is-parent is-vertical">
                  <article className="tile is-child notification is-light is-info is-flex
                    is-flex-direction-column is-align-items-center is-justify-content-center">
                    <b>Sushiswap</b>
                  </article>
                  <article className="tile is-child notification is-light is-info is-flex
                    is-flex-direction-column is-align-items-center is-justify-content-center">
                    <b>Uniswap</b>
                  </article>
                </div>
              </div>
            </div>
            <div className="column">
            </div>
          </div>
        </div>
      </div>

    );
  }
}

