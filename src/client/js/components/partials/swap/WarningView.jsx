import React, { Component } from 'react';

export default class WarningView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="warning-view">
        <div className="warning-box">
            <div className="warning-icon">
                <img src="/images/warning-icon.jpg"/>
            </div>
            <div>
                <div className="warning-text-bold">Warning!</div>
                <div className="warning-text">This token is not whitelisted by polkaswtich. The polkaswitch team makes no representation about the quality or legal categorization of the token.</div>
            </div>
        </div>
      </div>
    );
  }

}

