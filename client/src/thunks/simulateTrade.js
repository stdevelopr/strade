import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const simulateTradeThunk = createAsyncThunk(
  "simulate/trade/macdSimple",
  async (symbol, thunkAPI) => {
    let resp = {};
    await axios.get("api/binance/simulate/macd_simple/" + symbol).then(res => {
      resp.profit = res.data.data.profit;
      resp.buyTimes = res.data.data.buy;
      resp.sellTimes = res.data.data.sell;
    });
    return resp;
  }
);

export const simulateTradeMACDCrossThunk = createAsyncThunk(
  "simulate/trade/macdCross",
  async (symbol, thunkAPI) => {
    let resp = {};
    await axios.get("api/binance/simulate/macd_cross/" + symbol).then(res => {
      resp.profit = res.data.data.profit;
      resp.buyTimes = res.data.data.buy;
      resp.sellTimes = res.data.data.sell;
    });
    return resp;
  }
);

export const simulateTradeRSIThunk = createAsyncThunk(
  "simulate/trade/RSI",
  async (symbol, thunkAPI) => {
    let resp = {};
    await axios.get("api/binance/simulate/rsi/" + symbol).then(res => {
      resp.profit = res.data.data.profit;
      resp.buyTimes = res.data.data.buy;
      resp.sellTimes = res.data.data.sell;
    });
    return resp;
  }
);

export const forecast = createAsyncThunk(
  "/prophet",
  async (symbol, thunkAPI) => {
    let resp = {};
    await axios.get("api/binance/prophet/" + symbol).then(res => {
      console.log("DATA", res.data);
    });
    return resp;
  }
);
