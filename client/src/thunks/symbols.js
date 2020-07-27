import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllSymbols = createAsyncThunk("symbols/getAll", async () => {
  let resp;
  await axios.get(`api/binance/all_symbols`).then(res => {
    resp = res.data.map(s => ({ text: s, value: s }));
  });
  return resp;
});

export const getAllTimeFrames = createAsyncThunk(
  "symbols/getTimeframes",
  async () => {
    let resp;
    await axios.get(`api/binance/all_timeframes`).then(res => {
      resp = res.data["timeframes"].map(s => ({ text: s, value: s }));
    });
    return resp;
  }
);

export const getSymbolData = createAsyncThunk(
  "symbols/getSymbolData",
  async (symbol, APIThunk) => {
    let data_arr = [];
    await axios
      .get("api/binance/get/" + symbol.symbol + "/" + symbol.timeframe)
      .then(resp => {
        for (let i = 0; i < resp.data["close_time"].length; i++) {
          data_arr.push({
            date: resp.data["close_time"][i],
            open: resp.data["open"][i],
            high: resp.data["high"][i],
            low: resp.data["low"][i],
            close: resp.data["close"][i],
            volume: resp.data["volume"][i]
          });
        }
      });
    return data_arr;
  }
);

export const getIndicatorMACD = createAsyncThunk(
  "symbols/indicator/MACD",
  async (symbol, APIThunk) => {
    let response;
    await axios
      .get("api/binance/indicator/macd/" + symbol)
      .then(res => JSON.parse(res.data.replace(/\bNaN\b/g, "null")))
      .then(
        data =>
          (response = {
            macd: data["macd"],
            signal: data["signal"],
            histogram: data["histogram"]
          })
      );
    return response;
  }
);

export const getIndicatorRSI = createAsyncThunk(
  "symbols/indicator/RSI",
  async (symbol, APIThunk) => {
    let response;
    await axios
      .get("api/binance/indicator/rsi/" + symbol)
      .then(res => JSON.parse(res.data.replace(/\bNaN\b/g, "null")))
      .then(data => (response = data["data"]));
    return response;
  }
);
