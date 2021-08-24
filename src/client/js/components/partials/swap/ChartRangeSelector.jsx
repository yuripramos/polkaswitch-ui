import React, { useEffect, useRef } from 'react';
import { createChart, CrosshairMode } from "lightweight-charts";
export default function ChartRangeSelector(props) {

  const handleTimeRangeChange = (range) => {
    props.handleTimeRangeChange(range);
  }

  return (
      <div className="chart-range-selector">
        {
          _.map(props.timeRangeList, function (v){
            return (
            <div
              className="time-range"
              key={i}
              onClick={() => handleTimeRangeChange(v)}>
              {v.name}
            </div>
            )
          })
        }
      </div>
  );
}

