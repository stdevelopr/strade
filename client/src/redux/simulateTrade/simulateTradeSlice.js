import { createSlice } from "@reduxjs/toolkit";
import {
  simulateTradeThunk,
  simulateTradeMACDCrossThunk,
  simulateTradeRSIThunk
} from "../../thunks/simulateTrade";

const simulateTradeSlice = createSlice({
  name: "simulateTrade",
  initialState: {
    loading: false,
    error: "",
    buyTimes: [],
    sellTimes: [],
    profit: 0
  },
  reducers: {},
  extraReducers: {
    [simulateTradeThunk.pending]: (state, action) => {
      state.loading = true;
    },
    [simulateTradeThunk.fulfilled]: (state, action) => {
      state.loading = false;
      state.profit = action.payload.profit;
      state.buyTimes = action.payload.buyTimes;
      state.sellTimes = action.payload.sellTimes;
    },
    [simulateTradeThunk.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [simulateTradeMACDCrossThunk.pending]: (state, action) => {
      state.loading = true;
    },
    [simulateTradeMACDCrossThunk.fulfilled]: (state, action) => {
      state.loading = false;
      state.profit = action.payload.profit;
      state.buyTimes = action.payload.buyTimes;
      state.sellTimes = action.payload.sellTimes;
    },
    [simulateTradeMACDCrossThunk.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [simulateTradeRSIThunk.pending]: (state, action) => {
      state.loading = true;
    },
    [simulateTradeRSIThunk.fulfilled]: (state, action) => {
      state.loading = false;
      state.profit = action.payload.profit;
      state.buyTimes = action.payload.buyTimes;
      state.sellTimes = action.payload.sellTimes;
    },
    [simulateTradeRSIThunk.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    }
  }
});

export const simulateTradeReducer = simulateTradeSlice.reducer;

export default simulateTradeSlice;
