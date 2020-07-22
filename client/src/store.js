import { configureStore } from "@reduxjs/toolkit";
// import simulateTradeReducer from "./redux/simulateTrade/simulateTradeReducer";
import { symbolsReducer } from "./redux/symbols/symbolsSlice";
import { simulateTradeReducer } from "./redux/simulateTrade/simulateTradeSlice";

// import { combineReducers } from "redux";

const rootReducer = {
  simulateTrade: simulateTradeReducer,
  symbols: symbolsReducer
};
const store = configureStore({ reducer: rootReducer });

export default store;
