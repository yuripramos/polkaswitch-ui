import React, { useEffect, useRef } from 'react';
import classnames from "classnames";
export default function ChartRangeSelector(props) {

  const handleTimeRangeChange = (range) => {
    props.handleTimeRangeChange(range);
  }

  return (
      <div className="chart-range-selector">
        {
          _.map(props.timeRangeList[props.selectedViewMode], function (v, i){
            console.log('## selectedTimeRange ###', props.selectedTimeRange)
            console.log('## timeRangeList ###', props.timeRangeList[props.selectedViewMode])
            console.log('## index ###', props.timeRangeList[props.selectedViewMode].indexOf(props.selectedTimeRange))
            return (
              <div
                className={classnames("time-range-item", {
                  "active": (i === props.timeRangeList[props.selectedViewMode].findIndex(item=> item.name === props.selectedTimeRange.name))
                })}
                key={i}
                onClick={() => handleTimeRangeChange(v)}>
                <h5>{v.name}</h5>
              </div>
            )
          })
        }
      </div>
  );
}

