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
  }

  componentDidMount() {
    this.subWalletChange = EventManager.listenFor(
      'walletUpdated', this.handleWalletChange
    );
  }

  componentWillUnmount() {
    this.subWalletChange.unsubscribe();
  }

  handleWalletChange() {
    this.setState({ refresh: Date.now() });
  }

  handleOpen(e) {
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
    return (
      <div>
        <button className="button" onClick={this.handleOpen}>Bridge</button>
        <ConnextModal
          showModal={this.state.opened}
          //routerPublicIdentifier={"vector892GMZ3CuUkpyW8eeXfW2bt5W73TWEXtgV71nphXUXAmpncnj8"}
          routerPublicIdentifier={"vector5AGCU8oedG9HDmrC7mU9fDyQkpVRovFtEauVq3fHGcmRdbg7iu"}
          depositAssetId={"0x55d398326f99059fF775485246999027B3197955"}
          depositChainId={56}
          withdrawAssetId={"0xc2132D05D31c914a87C6611C10748AEb04B58e8F"}
          withdrawChainId={137}
          withdrawalAddress={window.ethereum.selectedAddress}
          //onClose={() => setShowModal(false)}
          depositChainProvider={"https://rpc-mainnet.maticvigil.com"}
          withdrawChainProvider={"https://bsc-dataseed1.ninicoin.io"}
          //injectedProvider={Wallet.getProvider()}
          loginProvider={window.ethereum}
        />
      </div>
    );
  }
}

