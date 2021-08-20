import React, {useEffect, useRef, useState} from 'react';
import { createChart, CrosshairMode } from "lightweight-charts";
import TokenPairSelector from "./TokenPairSelector";
import ChartPriceDetails from "./ChartPriceDetails";
import ChartViewOption from "./ChartViewOption";
import ChartRangeSelector from "./ChartRangeSelector";
import EventManager from "../../../utils/events";
import BN from 'bignumber.js';
import _ from "underscore";

export default function TradingViewChart(){

  const timeRangeList = [
    {name: "1D", value: 0, from: 'Past 1 Day'},
    {name: "3D", value: 0, from: 'Past 3 Days'},
    {name: "1W", value: 0, from: 'Past Week'},
    {name: "1M", value: 0, from: 'Past Month'},
    {name: "1Y", value: 0, from: 'Past Year'}
  ];
  const viewModes = ["candlestick", "line"];
  const chartContainerRef = useRef();
  const chart = useRef();
  const resizeObserver = useRef();
  const createTokenPairList = () => {
    const swapConfig = TokenListManager.getSwapConfig();
    const list = []
    const fromSymbol = swapConfig.from.symbol;
    const fromAddress = swapConfig.from.address;
    const toSymbol = swapConfig.to.symbol;
    const toAddress = swapConfig.to.address;
    list.push({name: fromSymbol + '/' + toSymbol, fromSymbol, fromAddress, toSymbol, toAddress});
    list.push({name: toSymbol + '/' + fromSymbol, fromSymbol: toSymbol, fromAddress:toAddress,  toSymbol: fromSymbol, toAddress: fromAddress});
    list.push({name: fromSymbol, fromSymbol, fromAddress: fromAddress});
    list.push({name: toSymbol, fromSymbol: toSymbol, fromAddress: toAddress});
    return list;
  }

  // init states
  const initTokenPair = createTokenPairList();
  const [tokenPairs, setTokenPairs] = useState(initTokenPair);
  const [selectedPair, setSelectedPair] = useState(initTokenPair[0]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRangeList[0]);
  const [selectedViewMode, setSelectedViewMode] = useState(viewModes[0]);
  const [priceDetails, setPriceDetails] = useState({price:0, percent: 0, from: timeRangeList[0].from})
  const [priceData, setPriceData] = useState([]);

  useEffect(()=>{
    let subSwapConfigChange = EventManager.listenFor(
        'swapConfigUpdated', handleSwapConfigChange
    );

    return () => {
      subSwapConfigChange.unsubscribe();
      // if (chart !== null) {
      //   chart.remove();
      // }
    }
  }, []);

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

  // Fetch Data
  useEffect(() =>{
    fetchData(selectedPair, selectedTimeRange, selectedViewMode);
  }, [selectedPair, selectedTimeRange, selectedViewMode])

  const fetchData = async (selectedPair, timeRange, viewMode) => {
    let fromTokenPrices = [];
    let toTokenPrices = [];
    let tokenPrices = [];
    const fromTimeStamp = 1628796813;
    const toTimeStamp = 1629056013

    if (viewMode === 'line') {
      const url = TokenListManager.getCurrentNetworkConfig().tradeView.lineUrl;
      if (selectedPair.fromSymbol && selectedPair.toSymbol) {
        fromTokenPrices = await fetchLinePrices(url, selectedPair.fromAddress, 'usd', fromTimeStamp, toTimeStamp);
        toTokenPrices = await fetchLinePrices(url, selectedPair.toAddress, 'usd', fromTimeStamp, toTimeStamp) || [];
        tokenPrices = mergeLinePrices(fromTokenPrices, toTokenPrices);
      } else {
        fromTokenPrices = await fetchLinePrices(url, selectedPair.fromAddress, 'usd', fromTimeStamp, toTimeStamp);
        tokenPrices = mergeLinePrices(fromTokenPrices, null);
      }
    } else {
      const url = TokenListManager.getCurrentNetworkConfig().tradeView.candleStickUrl;
      if (selectedPair.fromSymbol && selectedPair.toSymbol) {
        const fromCoin = TokenListManager.findTokenBySymbolFromCoinGecko(selectedPair.fromSymbol.toLowerCase());
        const toCoin = TokenListManager.findTokenBySymbolFromCoinGecko(selectedPair.toSymbol.toLowerCase());
        if (fromCoin && toCoin) {
          fromTokenPrices = await fetchCandleStickPrices(url, fromCoin.id, 'usd', 365);
          toTokenPrices = await fetchCandleStickPrices(url, toCoin.id, 'usd', 365) || [];
        }

        tokenPrices = mergeCandleStickPrices(fromTokenPrices, toTokenPrices);
      } else {
        const coinId = TokenListManager.findTokenBySymbolFromCoinGecko(selectedPair.fromSymbol.toLowerCase());
        if (coinId) {
          fromTokenPrices = await fetchCandleStickPrices(url, coinId.id, 'usd', 365);
        }

        tokenPrices = mergeCandleStickPrices(fromTokenPrices, null);
      }
    }
    setPriceData(tokenPrices)
  };

  useEffect(() => {
    if (!chart.current) {
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
          autoScale: false,
        },
        timeScale: {

        },
      });
    }

    if (selectedViewMode === viewModes[0]) {
      const candleSeries = chart.current.addCandlestickSeries({
        upColor: '#4bffb5',
        downColor: '#ff4976',
        borderDownColor: '#ff4976',
        borderUpColor: '#4bffb5',
        wickDownColor: '#838ca1',
        wickUpColor: '#838ca1',
      });

      candleSeries.setData(priceData);
    } else {
      const lineSeries = chart.current.addAreaSeries({
        topColor: "rgba(38,198,218, 0.56)",
        bottomColor: "rgba(38,198,218, 0.04)",
        lineColor: "rgba(38,198,218, 1)",
        lineWidth: 2
      });

      lineSeries.setData(priceData);
    }
  }, [priceData, selectedViewMode]);

  const fetchLinePrices = async(baseUrl, contract, currency, fromTimestamp, toTimestamp, attempt) => {
    let result = [];
    if (!attempt) {
      attempt = 0;
    } else if (attempt > 1) {
      return result;
    }
    try {
      const response = await fetch(`${baseUrl}/contract/${contract.toLowerCase()}/market_chart/range?vs_currency=${currency}&from=${fromTimestamp}&to=${toTimestamp}`)
      if (!response.ok) {
        throw new Error()
      }
      const data = await response.json();
      if (data) {
        result = data.prices
      }
      return result;
    } catch (err) {
      console.error("Failed to fetch price data", err);
      await fetchLinePrices(baseUrl, contract, currency, fromTimestamp, toTimestamp, attempt + 1);
    }
  }

  const fetchCandleStickPrices = async(baseUrl, coinId, currency, days, attempt) => {
    let result = [];
    if (!attempt) {
      attempt = 0;
    } else if (attempt > 1) {
      return result;
    }
    try {
      const response = await fetch(`${baseUrl}/${coinId}/ohlc?vs_currency=${currency}&days=${days}`)
      if (!response.ok) {
        throw new Error()
      }
      const data = await response.json();
      if (data) {
        result = data
      }
      return result;
    } catch (err) {
      console.error("Failed to fetch price data", err);
      await fetchCandleStickPrices(baseUrl, coinId, currency, days, attempt + 1);
    }
  }

  const mergeLinePrices = (fromTokenPrices, toTokenPrices) => {
    const prices = [];
    if ((fromTokenPrices.length > 0) && (toTokenPrices.length > 0) && (fromTokenPrices.length === toTokenPrices.length)) {
      for (let i = 0; i < fromTokenPrices.length; i++) {
        prices.push({time: fromTokenPrices[i][0], value: BN(fromTokenPrices[i][1]).div(toTokenPrices[i][1]).toNumber()})
      }
    } else if ((fromTokenPrices.length > 0) && (toTokenPrices === null)) {
      for (let i = 0; i < fromTokenPrices.length; i++) {
        prices.push({time: fromTokenPrices[i][0], value: BN(fromTokenPrices[i][1]).toNumber()})
      }
    }
    return prices;
  }

  const mergeCandleStickPrices = (fromTokenPrices, toTokenPrices) => {
    const prices = [];
    if (fromTokenPrices && toTokenPrices && (fromTokenPrices.length > 0) && (toTokenPrices.length > 0)) {
      const tempObj = {}
      for (let i = 0; i < fromTokenPrices.length; i++) {
        tempObj[fromTokenPrices[i][0]] = fromTokenPrices[i]
      }

      for (let j = 0; j < toTokenPrices.length; j++) {
        if (tempObj.hasOwnProperty(toTokenPrices[j][0])) {
          const fromTokenItem = tempObj[fromTokenPrices[j][0]];
          const mergedValue = {
            time :  fromTokenItem[0],
            open: BN(fromTokenItem[1]).div(toTokenPrices[j][1]).toNumber(),
            high: BN(fromTokenItem[2]).div(toTokenPrices[j][2]).toNumber(),
            low: BN(fromTokenItem[3]).div(toTokenPrices[j][3]).toNumber(),
            close: BN(fromTokenItem[4]).div(toTokenPrices[j][4]).toNumber(),
          }
          tempObj[fromTokenPrices[j][0]] = mergedValue
        }
      }

      for (const property in tempObj) {
        if (!Array.isArray(tempObj[property])) {
          prices.push(tempObj[property])
        }
      }

    } else if ((fromTokenPrices.length > 0) && (toTokenPrices === null)) {
      for (let i = 0; i < fromTokenPrices.length; i++) {
        prices.push({
          time: fromTokenPrices[i][0],
          open: BN(fromTokenPrices[i][1]).toNumber(),
          high: BN(fromTokenPrices[i][2]).toNumber(),
          low: BN(fromTokenPrices[i][3]).toNumber(),
          close: BN(fromTokenPrices[i][4]).toNumber(),
        })
      }
    }
    return prices;
  }

  const handleSwapConfigChange = () => {
    setTokenPairs(createTokenPairList());
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
          {/*<TokenPairSelector tokenPairs={tokenPairs} selectedPair={selectedPair} handleTokenPairChange={handleTokenPairChange}/>*/}
          {/*<ChartPriceDetails priceDetails={priceDetails}/>*/}
        </div>
        <div className="trading-view-body">
          {/*<ChartViewOption selectedViewMode={selectedViewMode} handleViewModeChange={handleViewModeChange}/>*/}
          <div className="chart"  ref={chartContainerRef}/>
          {/*<ChartRangeSelector timeRangeList={timeRangeList} handleRangeChange={handleRangeChange}/>*/}
        </div>
      </div>
    );
}

