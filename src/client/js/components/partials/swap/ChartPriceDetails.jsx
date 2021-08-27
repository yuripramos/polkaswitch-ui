import React, { useEffect, useRef } from 'react';
import { createChart, CrosshairMode } from "lightweight-charts";
export default function ChartPriceDetails() {
  useEffect(() => {
  }, []);

  return (
      <div className="price-details" aria-label="Bal: ">
          <div className="price">$513</div>
          <div className="wrapper">
            <div className="percent">33.57%</div>
            <div className="period">Past Month</div>
          </div>
      </div>
    );
}

