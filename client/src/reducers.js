import axios from "axios";
import { simulateMACDSimpleTrade } from "./tradeActions/simulate";

const initialState = { contextSymbol: "ETHBTC", simulateTradeProfit: 0 };

export default function symbolReducer(state = initialState, action) {
  if (action.type === "setContextSymbol") {
    return {
      contextSymbol: action.value
    };
  }
  if (action.type === "simulateTradeMacdSimple") {
    const ns = { ...state, isFetching: true };
    simulateMACDSimpleTrade(ns);
    return ns;
  }
  if (action.type === "simulateTradeMacdSimpleResponse") {
    return {
      ...state,
      simulateTradeProfit: state.simulateTradeProfit + 1
    };
  }
  return state;
}

// axios.get("api/binance/trade/" + symbol).then(res => {
//   new_data = setLongShort(res.data["data"]["buy"], res.data["data"]["sell"]);
//   setProfit(res.data["data"]["profit"]);
//   setNtrades(res.data["data"]["buy"].length);
// });
