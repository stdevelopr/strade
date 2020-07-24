import React, { useState, useEffect } from "react";
import CandleStickStockScaleChart from "./CandlestickStockScaleChart";
import { useSelector, useDispatch } from "react-redux";
import Dropdown from "./DropdownSymbols";
import {
  simulateTradeThunk,
  simulateTradeMACDCrossThunk,
  simulateTradeRSIThunk
} from "../thunks/simulateTrade";
import {
  getSymbolData,
  getIndicatorMACD,
  getIndicatorRSI
} from "../thunks/symbols";

function PlotArea() {
  const [data, setData] = useState(null);
  const [displayMACD, setDisplayMACD] = useState(false);
  const [displayRSI, setDisplayRSI] = useState(false);

  const dispatch = useDispatch();
  const symbol = useSelector(state => state.symbols.contextSymbol);
  const simulateTrade = useSelector(state => state.simulateTrade);
  const symbolData = useSelector(state => state.symbols.symbolData);
  const indicatorMACD = useSelector(state => state.symbols.indicatorMACD);
  const symbolIndicatorRSI = useSelector(state => state.symbols.indicatorRSI);

  useEffect(() => {
    if (data && simulateTrade.buyTimes.length != 0)
      setLongShort(simulateTrade.buyTimes, simulateTrade.sellTimes);
  }, [simulateTrade]);

  useEffect(() => {
    dispatch(getSymbolData(symbol));
  }, [symbol]);

  useEffect(() => {
    setData(symbolData);
  }, [symbolData]);

  useEffect(() => {
    if (indicatorMACD)
      insertMacd(
        indicatorMACD.macd,
        indicatorMACD.signal,
        indicatorMACD.histogram
      );
  }, [indicatorMACD]);

  useEffect(() => {
    if (symbolIndicatorRSI) insertRSI(symbolIndicatorRSI);
  }, [symbolIndicatorRSI]);

  const setLongShort = (buy_arr, sell_arr) => {
    let new_data = [];

    // loop through the original data that is plotted
    for (let i = 0; i < data.length; i++) {
      // create a copy of the original data
      new_data.push({ ...data[i] });

      // verify if the element already has a longShort key and delete it
      if ("longShort" in new_data[i]) {
        delete new_data[i].longShort;
      }

      if (buy_arr.includes(data[i]["date"])) {
        new_data[i]["longShort"] = "LONG";
      }
      if (sell_arr.includes(data[i]["date"])) {
        new_data[i]["longShort"] = "SHORT";
      }
    }

    setData(new_data);
  };

  const insertMacd = (macd, signal, divergence) => {
    let new_data = [];
    for (let i = 0; i < data.length; i++) {
      new_data.push({ ...data[i] });
      new_data[i]["macd"] = {
        macd: macd[i],
        signal: signal[i],
        divergence: divergence[i]
      };
    }

    setData(new_data);
    setDisplayMACD(true);
  };

  const insertRSI = rsi => {
    let new_data = [];
    for (let i = 0; i < data.length; i++) {
      new_data.push({ ...data[i] });
      new_data[i]["rsi"] = rsi[i];
    }

    setData(new_data);
    setDisplayRSI(true);
  };

  if (!data) return "loading";

  return (
    <div>
      <Dropdown />
      <p>Profit {simulateTrade.profit}</p>
      <p> Ntrades {simulateTrade.buyTimes.length}</p>
      <CandleStickStockScaleChart
        data={data}
        macd={displayMACD}
        rsi={displayRSI}
      />
    </div>
  );
}

export default PlotArea;
