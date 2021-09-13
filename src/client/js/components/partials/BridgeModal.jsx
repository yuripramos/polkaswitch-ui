import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';

import Wallet from '../../utils/wallet';
import Metrics from '../../utils/metrics';
import EventManager from '../../utils/events';
import TxQueue from '../../utils/txQueue';

import { ConnextModal } from '@connext/vector-modal';

export default class BridgeModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opened: false,
      refresh: Date.now()
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleWalletChange = this.handleWalletChange.bind(this);
  }

  componentDidMount() {
    this.subWalletChange = EventManager.listenFor(
      'walletUpdated', this.handleWalletChange
    );
  }

  componentDidUpdate() {
    console.count("bridge-updated");
  }

  componentWillUnmount() {
    this.subWalletChange.unsubscribe();
  }

  handleWalletChange() {
    window.ethereum.autoRefreshOnNetworkChange = false;
    this.setState({ refresh: Date.now() });
  }

  handleOpen(e) {
    window.ethereum.enable();
    this.setState({
      opened: true
    });
  }

  handleClose(e) {
    this.setState({
      opened: false
    });
  }

  render() {

    window.ethereum.autoRefreshOnNetworkChange = false;
    return (
      <div>
        <button className="button" onClick={this.handleOpen}>Bridge Swap (Beta)</button>
        {this.state.opened && window.ethereum && window.ethereum.selectedAddress && (
          <ConnextModal
            showModal={this.state.opened}
            //routerPublicIdentifier={"vector892GMZ3CuUkpyW8eeXfW2bt5W73TWEXtgV71nphXUXAmpncnj8"}
            routerPublicIdentifier={"vector5AGCU8oedG9HDmrC7mU9fDyQkpVRovFtEauVq3fHGcmRdbg7iu"}
            //routerPublicIdentifier={"vector52rjrwRFUkaJai2J4TrngZ6doTUXGZhizHmrZ6J15xVv4YFgFC"}
            depositAssetId={"0x55d398326f99059fF775485246999027B3197955"}
            depositChainId={56}
            withdrawAssetId={"0xc2132D05D31c914a87C6611C10748AEb04B58e8F"}
            withdrawChainId={137}
            withdrawalAddress={window.ethereum.selectedAddress}
            //onClose={() => setShowModal(false)}
            depositChainProvider={"https://rpc-mainnet.maticvigil.com"}
            withdrawChainProvider={"https://bsc-dataseed1.ninicoin.io"}
            injectedProvider={window.ethereum}
            loginProvider={window.ethereum}
          />
        )}
      </div>
    );
  }
}

