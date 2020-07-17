import React, { useState, useEffect } from "react";
import CandleStickStockScaleChart from "./CandlestickStockScaleChart";
import axios from "axios";

function PlotArea({ symbol }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let data_dict = [];
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
      <CandleStickStockScaleChart data={data} />
    </div>
  );
}

export default PlotArea;
