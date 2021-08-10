import React, { useEffect, useRef } from 'react';
import { createChart, CrosshairMode } from "lightweight-charts";
export default function ChartRangeSelector() {
  useEffect(() => {
  }, []);

  return (
      <div className="chart-range-selector">
        <div className="time-range">1D
        </div>
        <div className="time-range">3D
        </div>
        <div className="time-range">1W
        </div>
        <div className="time-range">1Y
        </div>

      </div>
  );
}

