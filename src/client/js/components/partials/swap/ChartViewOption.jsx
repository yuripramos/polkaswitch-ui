import React, { useEffect, useRef } from 'react';
import { createChart, CrosshairMode } from "lightweight-charts";
import classnames from "classnames";
export default function ChartViewOption() {
  useEffect(() => {
  }, []);

  return (
      <div className="chart-view-option">
          <span
              className={classnames("button", {
              })}>
            XXXXX
          </span>
          <span
              className={classnames("button", {
              })}>
            YYYY
          </span>
      </div>
  );
}

