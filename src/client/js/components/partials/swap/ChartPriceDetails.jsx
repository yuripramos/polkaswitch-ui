import React, { useEffect, useRef } from 'react';
import { createChart, CrosshairMode } from "lightweight-charts";
export default function ChartPriceDetails() {
  useEffect(() => {
  }, []);

  return (
      <div className="level-item level-left">
          <div className="token-symbol-wrapper hint--bottom" aria-label="Bal: ">
              <div className="symbol">$513</div>
              <div className="balance">33.57%</div>
              <div className="balance">Past Month</div>
          </div>
      </div>
    );
}

