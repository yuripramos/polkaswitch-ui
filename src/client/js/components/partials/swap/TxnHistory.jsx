import React, { useState, useEffect, useMemo } from 'react'
import _ from "underscore";
import TxStatusView from "../TxStatusView";
import TxQueue from '../../../utils/txQueue';

export default function TxnHistory() {
  const itemMax = 3;
  const [queue, setQueue] = useState({});
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  useEffect(() =>{
    setMaxPage(1);
    setPage(1);
    const length = Object.keys(queue).length
    if (length > 0) {
      let extraPages = 1
      if (length % itemMax === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(length / itemMax) + extraPages)
    }
  }, [queue, itemMax]);

  // Fetch Data
  useEffect(() =>{
    setPage(1)
    setQueue(TxQueue.getQueue())
  }, []);

  const filteredList = useMemo(() => {
    return (
        queue && Object.keys(queue).map((key) => queue[key]).slice(itemMax * (page - 1), page * itemMax)
    )
  }, [queue, itemMax, page])

  return (
      <div>
      {
        queue && Object.keys(queue).length > 0 &&
          <div className="grid-table">
            <div className="title-bar">Trade History</div>
            <div className="body">
              {
                filteredList &&
                _.map(filteredList, function (item, i) {
                  return (
                      <div
                          key={i}
                          className="row">
                        <TxStatusView key={i} data={item}/>
                      </div>
                  );
                })
              }
            </div>
            <div className="page-button">
              <div onClick={() => setPage(page === 1 ? page : page - 1)}>
                <div className="arrow">←</div>
              </div>
              <div>{'Page ' + page + ' of ' + maxPage}</div>
              <div onClick={() => setPage(page === maxPage ? page : page + 1)}>
                <div className="arrow">→</div>
              </div>
            </div>
          </div>
      }
      </div>
  )
}
