import { configureStore } from "@reduxjs/toolkit";
// import simulateTradeReducer from "./redux/simulateTrade/simulateTradeReducer";
import { symbolsReducer } from "./symbols/symbolsSlice";
import { simulateTradeReducer } from "./simulateTrade/simulateTradeSlice";
import { pageContextReducer } from "./pageContext/pageContextSlice";
import { menuContextReducer } from "./menuContext/menuContextSlice";

// import { combineReducers } from "redux";

const rootReducer = {
  simulateTrade: simulateTradeReducer,
  symbols: symbolsReducer,
  pageContext: pageContextReducer,
  menuContext: menuContextReducer
};
const store = configureStore({ reducer: rootReducer });

export default store;
