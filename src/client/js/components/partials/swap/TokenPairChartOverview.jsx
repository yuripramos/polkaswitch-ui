import React, { useEffect, useRef } from 'react';
import { createChart, CrosshairMode } from "lightweight-charts";
import TradingViewChart from "./TradingViewChart";
import Routing from "./Routing";
import Dashboard from "./Dashboard";

export default function TokenPairChartOverview(){
  return (
      <div>
        <TradingViewChart/>
        <Dashboard/>
        <Routing/>
      </div>
    );
}

