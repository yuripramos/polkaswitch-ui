import React, { Component } from 'react';

export default class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <script type="module" src="https://cdn.freshstatus.io/widget/index.js"></script>
        <a href="https://polkaswitch.freshstatus.io" id="freshstatus-badge-root"
          data-banner-style="compact">
          <img src="https://public-api.freshstatus.io/v1/public/badge.svg/?badge=826087c7-9469-492a-8821-928a674cc49e" />
        </a>
      </div>
    );
  }
}

