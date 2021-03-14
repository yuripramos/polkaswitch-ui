
import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Navbar from '../partials/Navbar';
import PairOverviewChart from '../partials/PairOverviewChart';
import SwapOrderWidget from '../partials/SwapOrderWidget';

export default class Home extends Component {
  render() {
    return (
      <div class="container">
        <Navbar />

        <div class="columns">
          <div class="column is-three-fifths">
            <div class="box">
              <PairOverviewChart />
            </div>
          </div>

          <div class="column is-two-fifths">
            <div class="box">
              <SwapOrderWidget />
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

