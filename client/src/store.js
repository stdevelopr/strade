import { configureStore } from "@reduxjs/toolkit";
// import simulateTradeReducer from "./redux/simulateTrade/simulateTradeReducer";
import { symbolsReducer } from "./redux/symbols/symbolsSlice";
import { simulateTradeReducer } from "./redux/simulateTrade/simulateTradeSlice";
import { pageContextReducer } from "./redux/pageContext/pageContextSlice";

// import { combineReducers } from "redux";

const rootReducer = {
  simulateTrade: simulateTradeReducer,
  symbols: symbolsReducer,
  pageContext: pageContextReducer
};
const store = configureStore({ reducer: rootReducer });

export default store;
