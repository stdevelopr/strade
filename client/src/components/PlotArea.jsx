import React, { useState, useEffect } from "react";
import CandleStickStockScaleChart from "./CandlestickStockScaleChart";
import axios from "axios";

function PlotArea({ symbol }) {
  const [data, setData] = useState(null);
  const [profit, setProfit] = useState("");
  const [displayMACD, setDisplayMACD] = useState(false);
  const [displayRSI, setDisplayRSI] = useState(false);

  const setLongShort = (buy_arr, sell_arr) => {
    let new_data = [];

    // loop through the original data that is plotted
    for (let i = 0; i < data.length; i++) {
      // create a copy of the original data
      new_data.push(data[i]);

      // verify if the element already has a longShort key and delete it
      if ("longShort" in new_data[i]) {
        delete new_data[i].longShort;
      }

      if (buy_arr.includes(data[i]["date"].getTime())) {
        new_data[i]["longShort"] = "LONG";
      }
      if (sell_arr.includes(data[i]["date"].getTime())) {
        new_data[i]["longShort"] = "SHORT";
      }
    }

    setData(new_data);
  };

  const insertMacd = (macd, signal, divergence) => {
    let new_data = [];
    for (let i = 0; i < data.length; i++) {
      new_data.push(data[i]);
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
      new_data.push(data[i]);
      new_data[i]["rsi"] = rsi[i];
    }

    setData(new_data);
    setDisplayRSI(true);
  };
  const downloadSymbol = () => {
    axios.get("api/binance/trade/" + symbol).then(res => {
      setLongShort(res.data["data"]["buy"], res.data["data"]["sell"]);
      setProfit(res.data["data"]["profit"]);
    });
  };

  const simulateMACDCrossTrade = () => {
    axios.get("api/binance/simulate/macd_cross/" + symbol).then(res => {
      setLongShort(res.data["data"]["buy"], res.data["data"]["sell"]);
      setProfit(res.data["data"]["profit"]);
    });
  };

  const simulateRSITrade = () => {
    axios.get("api/binance/simulate/rsi/" + symbol).then(res => {
      setLongShort(res.data["data"]["buy"], res.data["data"]["sell"]);
      setProfit(res.data["data"]["profit"]);
    });
  };

  const getMACD = symbol => {
    axios
      .get("api/binance/macd/" + symbol)
      .then(res => JSON.parse(res.data.replace(/\bNaN\b/g, "null")))
      .then(data =>
        insertMacd(data["macd"], data["signal"], data["divergence"])
      );
  };

  const getRSI = symbol => {
    axios
      .get("api/binance/rsi/" + symbol)
      .then(res => JSON.parse(res.data.replace(/\bNaN\b/g, "null")))
      .then(data => insertRSI(data["data"]));
  };

  useEffect(() => {
    let data_dict = [];
    let annot = [];
    axios.get("api/binance/get/" + symbol).then(resp => {
      for (let i = 0; i < resp.data["close_time"].length; i++) {
        data_dict.push({
          date: new Date(resp.data["close_time"][i]),
          open: resp.data["open"][i],
          high: resp.data["high"][i],
          low: resp.data["low"][i],
          close: resp.data["close"][i],
          volume: resp.data["volume"][i]
        });
      }
      setData(data_dict);
    });
  }, [symbol]);

  if (!data) return "loading";

  return (
    <div style={{ width: "98%", margin: "auto" }}>
      <button onClick={() => downloadSymbol()}>Simulate MACD Trade</button>

      <button onClick={() => simulateMACDCrossTrade()}>
        Simulate MACD Cross Trade
      </button>
      <button onClick={() => simulateRSITrade()}>Simulate RSI Trade</button>
      <button onClick={() => getRSI(symbol)}>Plot RSI</button>
      <button onClick={() => getMACD(symbol)}>Plot MACD</button>
      <CandleStickStockScaleChart
        data={data}
        macd={displayMACD}
        rsi={displayRSI}
      />
      <h3>Profit {profit}</h3>
    </div>
  );
}

export default PlotArea;
