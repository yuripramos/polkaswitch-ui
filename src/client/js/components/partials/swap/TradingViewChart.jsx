import React, {useEffect, useRef, useState} from 'react';
import { createChart, CrosshairMode } from "lightweight-charts";
import TokenPairSelector from "./TokenPairSelector";
import ChartPriceDetails from "./ChartPriceDetails";
import ChartViewOption from "./ChartViewOption";
import ChartRangeSelector from "./ChartRangeSelector";
import EventManager from "../../../utils/events";

export default function TradingViewChart(){

  const timeRangeList = [
    {name: "1D", value: 0, from: 'Past 1 Day'},
    {name: "3D", value: 0, from: 'Past 3 Days'},
    {name: "1W", value: 0, from: 'Past Week'},
    {name: "1M", value: 0, from: 'Past Month'},
    {name: "1Y", value: 0, from: 'Past Year'}
  ];
  const viewModes = ["Candlestick", "Line"];
  const chartContainerRef = useRef();
  const chart = useRef();
  const resizeObserver = useRef();

  const createTokenPairList = () => {
    const swapConfig = TokenListManager.getSwapConfig();
    const list = []
    const fromSymbol = swapConfig.from.symbol;
    const toSymbol = swapConfig.to.symbol;
    list.push({name: fromSymbol + '/' + toSymbol, fromSymbol, toSymbol});
    list.push({name: toSymbol + '/' + fromSymbol, fromSymbol: toSymbol, toSymbol: fromSymbol});
    list.push({name: fromSymbol, fromSymbol});
    list.push({name: toSymbol, fromSymbol: toSymbol});
    return list;
  }

  // init states
  const initTokenPair = createTokenPairList();
  const [tokenPair, setTokenPair] = useState(initTokenPair);
  const [selectedPair, setSelectedPair] = useState(initTokenPair[0]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRangeList[0]);
  const [selectedViewMode, setSelectedViewMode] = useState(viewModes[0]);
  const [priceDetails, setPriceDetails] = useState({price:0, percent: 0, from: timeRangeList[0].from})
  const [priceData, setPriceData] = useState([]);
  const [volumnData, setVolumnData] = useState([]);


  useEffect(()=>{
    this.subSwapConfigChange = EventManager.listenFor(
        'swapConfigUpdated', handleSwapConfigChange
    );
    return () => {
      this.subSwapConfigChange.unsubscribe();
    }
  }, []);

  // Fetch Data
  useEffect(() =>{

  }, [selectedPair, selectedTimeRange])

  useEffect(() => {
    chart.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        backgroundColor: '#253248',
        textColor: 'rgba(255, 255, 255, 0.9)',
      },
      grid: {
        vertLines: {
          color: '#334158',
        },
        horzLines: {
          color: '#334158',
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      priceScale: {
        borderColor: '#485c7b',
      },
      timeScale: {
        borderColor: '#485c7b',
      },
    });

    const candleSeries = chart.current.addCandlestickSeries({
      upColor: '#4bffb5',
      downColor: '#ff4976',
      borderDownColor: '#ff4976',
      borderUpColor: '#4bffb5',
      wickDownColor: '#838ca1',
      wickUpColor: '#838ca1',
    });

    candleSeries.setData(priceData);

    // const lineSeries = chart.current.addLineSeries({
    //   upColor: '#4bffb5',
    //   downColor: '#ff4976',
    //   borderDownColor: '#ff4976',
    //   borderUpColor: '#4bffb5',
    //   wickDownColor: '#838ca1',
    //   wickUpColor: '#838ca1',
    // });
    //
    // lineSeries.setData(volumeData);

    // const volumeSeries = chart.current.addHistogramSeries({
    //   color: '#182233',
    //   lineWidth: 2,
    //   priceFormat: {
    //     type: 'volume',
    //   },
    //   overlay: true,
    //   scaleMargins: {
    //     top: 0.8,
    //     bottom: 0,
    //   },
    // });
    //
    // volumeSeries.setData(volumeData);
  }, [selectedViewMode]);

  // Resize chart on container resizes.
  useEffect(() => {
    resizeObserver.current = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      chart.current.applyOptions({ width, height });
      setTimeout(() => {
        chart.current.timeScale().fitContent();
      }, 0);
    });

    resizeObserver.current.observe(chartContainerRef.current);

    return () => resizeObserver.current.disconnect();
  }, []);

  const handleSwapConfigChange = () => {
    setTokenPair(createTokenPairList());
  }

  const handleTokenPairChange = (pair) => {
    setSelectedPair(pair);
  }

  const handleViewModeChange = (mode) => {
    setSelectedViewMode(mode);
  }

  const handleRangeChange = (timeRange) => {
    setSelectedTimeRange(timeRange);
  }

  return (
      <div className="trading-view-wrapper">
        <div className="trading-view-header">
          <TokenPairSelector tokenPair={tokenPair} handleTokenPairChange={handleTokenPairChange()}/>
          <ChartPriceDetails priceDetails={priceDetails}/>
        </div>
        <div className="trading-view-body">
          <ChartViewOption viewModes={viewModes} handleViewModeChange={handleViewModeChange()}/>
          <div className="chart"  ref={chartContainerRef}/>
          <ChartRangeSelector timeRangeList={timeRangeList} handleRangeChange={handleRangeChange()}/>
        </div>
      </div>
    );
}

