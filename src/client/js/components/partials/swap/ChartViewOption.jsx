import React, { useEffect, useRef } from 'react';
import { createChart, CrosshairMode } from "lightweight-charts";
import classnames from "classnames";
export default function ChartViewOption(props) {
  const handleViewOptionChange = (event) => {
    console.log('## event.target.checked ###', event.target.checked)
    let viewOption = 'candlestick'
    if (event.target.checked) {
      viewOption = 'candlestick'
    } else {
      viewOption = 'line'
    }
    console.log('## view option ###', viewOption)
    props.handleViewModeChange(viewOption);
  }

  return (
      <div className="chart-view-option">
        <span
            className="switcher hint--bottom hint--medium"
        >
          <input
              id="order-type-switcher"
              type="checkbox"
              checked={props.selectedViewMode !== 'line'}
              onChange={handleViewOptionChange} />
          <label htmlFor="order-type-switcher"/>
        </span>
      </div>
  );
}

