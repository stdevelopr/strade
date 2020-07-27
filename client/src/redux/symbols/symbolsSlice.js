import { createSlice } from "@reduxjs/toolkit";
import {
  getAllSymbols,
  getSymbolData,
  getIndicatorMACD,
  getIndicatorRSI,
  getAllTimeFrames
} from "../../thunks/symbols";

const symbolSlice = createSlice({
  name: "symbol",
  initialState: {
    allSymbols: [],
    timeframes: {
      allTimeFrames: [],
      contextTimeFrame: "4h"
    },
    contextSymbol: "ETHBTC",
    symbolData: null
  },
  reducers: {
    setContextSymbol: (state, action) => {
      state.contextSymbol = action.payload;
    },
    setTimeFrame: (state, action) => {
      state.timeframes.contextTimeFrame = action.payload;
    }
  },
  extraReducers: {
    [getAllSymbols.pending]: (state, action) => {
      state.loading = true;
    },
    [getAllSymbols.fulfilled]: (state, action) => {
      state.loading = false;
      state.allSymbols = action.payload;
    },
    [getAllSymbols.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getAllTimeFrames.pending]: (state, action) => {
      state.timeframes.loading = true;
    },
    [getAllTimeFrames.fulfilled]: (state, action) => {
      state.timeframes.loading = false;
      state.timeframes.allTimeFrames = action.payload;
    },
    [getAllTimeFrames.rejected]: (state, action) => {
      state.timeframes.loading = false;
      state.timeframes.error = action.error.message;
    },
    [getSymbolData.pending]: (state, action) => {
      state.loading = true;
    },
    [getSymbolData.fulfilled]: (state, action) => {
      state.loading = false;
      state.symbolData = action.payload;
    },
    [getSymbolData.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getIndicatorMACD.pending]: (state, action) => {
      state.loading = true;
    },
    [getIndicatorMACD.fulfilled]: (state, action) => {
      state.loading = false;
      state.indicatorMACD = action.payload;
    },
    [getIndicatorMACD.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getIndicatorRSI.pending]: (state, action) => {
      state.loading = true;
    },
    [getIndicatorRSI.fulfilled]: (state, action) => {
      state.loading = false;
      state.indicatorRSI = action.payload;
    },
    [getIndicatorRSI.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    }
  }
});
export const symbolsReducer = symbolSlice.reducer;

export default symbolSlice;
