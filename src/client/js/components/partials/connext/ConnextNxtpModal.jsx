import _ from "underscore";
import React, { Component } from 'react';
import classnames from 'classnames';

import { ReactElement, useEffect, useState } from "react";
import { Button, Col, Row, Tabs, Typography } from "antd";
import { providers, Signer, utils } from "ethers";
import { ChainData } from "@connext/nxtp-utils";

import { Router } from "./Router";
import { Swap } from "./Swap";


const REACT_APP_CHAIN_CONFIG = {
  "56":{"provider":["https://api-smart-chain.polkaswitch.com/fff0dd6bf467085a65f5e23ea585adfa5da745e1/"]},
  "137":{"provider":["https://api-matic.polkaswitch.com/3d041599a52783f163b2515d3ab10f900fc61c01/"]}
};
const REACT_APP_SWAP_CONFIG = [
  {
    "name":"USDT","assets":{
      "56":"0x55d398326f99059fF775485246999027B3197955",
      "137":"0xc2132D05D31c914a87C6611C10748AEb04B58e8F"
    }
  }
];


export const chainConfig = REACT_APP_CHAIN_CONFIG;
// arrays of "swap pools"
export const swapConfig = REACT_APP_SWAP_CONFIG;

export const chainProviders = {};

Object.entries(chainConfig).forEach(([chainId, { provider, subgraph, transactionManagerAddress }]) => {
  chainProviders[parseInt(chainId)] = {
    provider: new providers.FallbackProvider(
      provider.map((p) => new providers.StaticJsonRpcProvider(p, parseInt(chainId))),
    ),
    subgraph,
    transactionManagerAddress,
  };
});

function ConnextNxtpModal() {
  const [web3Provider, setProvider] = useState();
  const [signer, setSigner] = useState();
  const [chainData, setChainData] = useState([]);

  const connectMetamask = async () => {
    const ethereum = window.ethereum;
    if (typeof ethereum === "undefined") {
      alert("Please install Metamask");
      return;
    }
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("accounts: ", accounts);
      const provider = new providers.Web3Provider(ethereum);
      const _signer = provider.getSigner();
      const address = await _signer.getAddress();
      setSigner(_signer);
      setProvider(provider);
      console.log("address: ", address);

      // metamask events
      ethereum.on("chainChanged", (_chainId) => {
        console.log("_chainId: ", _chainId);
        window.location.reload();
      });
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  useEffect(() => {
    const init = async () => {
      const json = await utils.fetchJson("https://raw.githubusercontent.com/connext/chaindata/main/crossChain.json");
      setChainData(json);
    };
    init();
  }, []);

  return (
    <div style={{ marginTop: 36, marginLeft: 12, marginRight: 12 }}>
      <Row gutter={16}>
        <Col span={6}>
          <Typography.Title>NXTP Test UI</Typography.Title>
        </Col>
        <Col>
          <Button type="primary" onClick={connectMetamask} disabled={!!web3Provider}>
            Connect Metamask
          </Button>
        </Col>
      </Row>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Swap" key="1">
          <Swap web3Provider={web3Provider} signer={signer} chainData={chainData} />
    </Tabs.TabPane>
    <Tabs.TabPane tab="Router" key="2">
      <Router web3Provider={web3Provider} signer={signer} chainData={chainData} />
    </Tabs.TabPane>
  </Tabs>
    </div>
  );
}

export default ConnextNxtpModal;
