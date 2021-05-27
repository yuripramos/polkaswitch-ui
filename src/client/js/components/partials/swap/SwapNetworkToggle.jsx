import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

import Wallet from '../../../utils/wallet';
import Metrics from '../../../utils/metrics';
import EventManager from '../../../utils/events';

export default class SwapNetworkToggle extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="alpha-banner notification is-warning is-light">
        <div className="content">
          <p className="is-size-6">
            <b>Welcome to the Polkaswitch Alpha launch!</b>
          </p>
          <p>As we work closely with our technology partners for the Mainnet launch, you may experience intermittent issues.</p>
          <p>To be able to perform swaps on the Polkaswitch Alpha, we have built the following tool to conveniently mint test tokens into your connected wallet.</p>
          <p className="is-italic">100 Tokens will be added under METH, MUNI, MSUSHI and MBAL</p>
        </div>
      </div>
    );
  }
}

