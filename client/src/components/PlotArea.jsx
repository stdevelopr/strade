import React, { useState, useEffect } from "react";
import CandleStickStockScaleChart from "./CandlestickStockScaleChart";
import axios from "axios";

function PlotArea({ symbol }) {
  const [data, setData] = useState(null);
  const [profit, setProfit] = useState("");

  const setLongShort = (buy_arr, sell_arr) => {
    let new_data = [];
    for (let i = 0; i < data.length; i++) {
      new_data.push(data[i]);
      if (buy_arr.includes(data[i]["date"].getTime())) {
        new_data[i]["longShort"] = "LONG";
      }
      if (sell_arr.includes(data[i]["date"].getTime())) {
        new_data[i]["longShort"] = "SHORT";
      }
    }

    setData(new_data);
  };
  const downloadSymbol = () => {
    axios.get("api/binance/trade/" + symbol).then(res => {
      setLongShort(res.data["data"]["buy"], res.data["data"]["sell"]);
      setProfit(res.data["data"]["profit"]);
    });
  };

  useEffect(() => {
    let data_dict = [];
    let annot = [];
    axios.get("/api/binance/get/" + symbol).then(resp => {
      for (let i = 0; i < resp.data["close_time"].length; i++) {
        data_dict.push({
          open: resp.data["open"][i],
          high: resp.data["high"][i],
          low: resp.data["low"][i],
          close: resp.data["close"][i],
          volume: resp.data["volume"][i],
          date: new Date(resp.data["close_time"][i])
        });
      }
      setData(data_dict);
    });
  }, [symbol]);

  if (!data) return "loading";

  return (
    <div style={{ width: "98%", margin: "auto" }}>
      <button onClick={() => downloadSymbol()}>Simulate MACD Trade</button>
      <CandleStickStockScaleChart data={data} />
      <h3>Profit {profit}</h3>
    </div>
  );
}

export default PlotArea;
