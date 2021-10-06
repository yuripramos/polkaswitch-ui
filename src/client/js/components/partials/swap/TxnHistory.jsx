import React, { useState, useEffect, useMemo } from 'react'
import _ from "underscore";
import TxStatusView from "../TxStatusView";
import TxQueue from '../../../utils/txQueue';

export default function TxnHistory() {
  const [queue, setQueue] = useState({});
  // Fetch Data
  useEffect(() =>{
    setQueue(TxQueue.getQueue())
  }, []);

  return (
    <div className="grid-table">
      {
        Object.keys(queue).length > 0 &&
            < div className="title-bar">Trade History</div>
      }
      <div className="body">
        {_.map(queue, function(item, i) {
          return (
              <div
                key={i}
                className="row">
                <TxStatusView key={i} data={item} />
              </div>
          );
        })}
      </div>
    </div>
  )
}
