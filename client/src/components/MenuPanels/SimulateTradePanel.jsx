import React from "react";
import Radium from "radium";
import { useSelector, useDispatch } from "react-redux";

import {
  simulateTradeThunk,
  simulateTradeMACDCrossThunk,
  simulateTradeRSIThunk
} from "../../thunks/simulateTrade";

const SimulateTradePanel = () => {
  const dispatch = useDispatch();
  const symbol = useSelector(state => state.symbols.contextSymbol);
  return (
    <div>
      <button onClick={() => dispatch(simulateTradeThunk(symbol))}>
        Simulate MACD Trade
      </button>
      <button onClick={() => dispatch(simulateTradeMACDCrossThunk(symbol))}>
        Simulate MACD Cross Trade
      </button>
      <button onClick={() => dispatch(simulateTradeRSIThunk(symbol))}>
        Simulate RSI Trade
      </button>
    </div>
  );
};

const styles = {
  display: "grid"
};
export default SimulateTradePanel;
