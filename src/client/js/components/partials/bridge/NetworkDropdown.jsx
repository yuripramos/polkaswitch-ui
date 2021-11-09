import React, { Component } from 'react';
import _ from "underscore";
import classnames from 'classnames';
import TokenListManager from '../../../utils/tokenList';
import TokenIconImg from './../TokenIconImg';

export default class NetworkDropdown extends Component {
  constructor(props) {
    super(props);
    this.NETWORKS = window.NETWORK_CONFIGS;
    this.handleDropdownClick = this.handleDropdownClick.bind(this);
  }

  handleDropdownClick(network) {
    return function handleClick(e) {
      this.props.handleDropdownClick(network);
    }.bind(this);
  }

  render() {
    var selected = this.props.selected || TokenListManager.getCurrentNetworkConfig();
    var filteredNetworks = _.filter(this.NETWORKS, (v) => { return v.enabled });

    if (this.props.crossChain) {
      filteredNetworks = _.filter(filteredNetworks, (v) => { return v.crossChainSupported });
    }

    var networkList = _.map(filteredNetworks, function(v, i) {
      return (
        <a href="#"
          key={i}
          onClick={this.handleDropdownClick(v)}
          className={classnames("dropdown-item level is-mobile", {
            "disabled": !v.enabled
          })}
        >
          <span className="level-left my-2">
            <span className="level-item">
              <TokenIconImg
                size={30}
                imgSrc={v.logoURI} />
            </span>
            <span className="level-item">{v.name} {!v.enabled && "(Coming Soon)"}</span>
          </span>
        </a>
      );
    }.bind(this));

    return (
      <div className={classnames("network-dropdown dropdown is-left is-hoverable ",
          this.props.className)}>
        <div className="dropdown-trigger">
          <button className="button is-info is-light"
            aria-haspopup="true"
            aria-controls="dropdown-menu">
            <span className="level">
              <span className="level-left is-flex">
                <span className="level-item">
                  <TokenIconImg
                    size={30}
                    imgSrc={selected.logoURI} />
                </span>
                <div className="network-wrapper item-level">
                  <div className="platform">{selected.name}</div>
                  <div className="name">Blockchain</div>
                </div>
              </span>
            </span>
            <span className="icon is-small">
              <ion-icon name="chevron-down"></ion-icon>
            </span>
          </button>
        </div>
        <div
          className="dropdown-menu"
          style={{width: '100%'}}
          id="dropdown-menu"
          role="menu">
          <div className="dropdown-content">
            {networkList}
          </div>
        </div>
      </div>
    );
  }
}

