import { createSlice } from "@reduxjs/toolkit";
import {
  getAllSymbols,
  getSymbolData,
  getSymbolIndicatorMACD,
  getSymbolIndicatorRSI
} from "../../thunks/symbols";

const symbolSlice = createSlice({
  name: "symbol",
  initialState: {
    allSymbols: [],
    contextSymbol: "ETHBTC",
    symbolData: null
  },
  reducers: {
    setContextSymbol: (state, action) => {
      state.contextSymbol = action.payload;
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
    [getSymbolIndicatorMACD.pending]: (state, action) => {
      state.loading = true;
    },
    [getSymbolIndicatorMACD.fulfilled]: (state, action) => {
      state.loading = false;
      state.symbolIndicatorMACD = action.payload;
    },
    [getSymbolIndicatorMACD.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    [getSymbolIndicatorRSI.pending]: (state, action) => {
      state.loading = true;
    },
    [getSymbolIndicatorRSI.fulfilled]: (state, action) => {
      state.loading = false;
      state.symbolIndicatorRSI = action.payload;
    },
    [getSymbolIndicatorRSI.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    }
  }
});
export const symbolsReducer = symbolSlice.reducer;

export default symbolSlice;
