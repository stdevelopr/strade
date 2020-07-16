import React, { useState, useEffect } from "react";
import CandleStickStockScaleChart from "./CandlestickStockScaleChart";
import axios from "axios";

function PlotArea({ symbol }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let data_dict = [];
    axios.get("/api/binance/extract/" + symbol).then(resp => {
      for (let i = 0; i < 500; i++) {
        data_dict.push({
          open: resp.data["o"][i],
          high: resp.data["h"][i],
          low: resp.data["l"][i],
          close: resp.data["c"][i],
          volume: resp.data["v"][i],
          date: new Date(resp.data["ct"][i])
        });
      }
      setData(data_dict);
    });
  }, []);

  if (!data) return "loading";
  return (
    <div>
      <CandleStickStockScaleChart data={data} />
    </div>
  );
}

export default PlotArea;
