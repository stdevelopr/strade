import React from "react";
import Radium from "radium";
import { useSelector, useDispatch } from "react-redux";

import {
  simulateTradeThunk,
  simulateTradeMACDCrossThunk,
  simulateTradeRSIThunk,
  forecast
} from "../../thunks/simulateTrade";

const SimulateTradePanel = () => {
  const dispatch = useDispatch();
  const symbol = useSelector(state => state.symbols.contextSymbol);
  const timeframe = useSelector(
    state => state.symbols.timeframes.contextTimeFrame
  );
  const simulateTrade = useSelector(state => state.simulateTrade);
  return (
    <div>
      <h3>Simulate Trade</h3>
      <br></br>
      <p>Profit</p>
      <p>{simulateTrade.profit}</p>
      <p> Ntrades</p>
      <p>{simulateTrade.buyTimes.length}</p>
      <button
        onClick={() =>
          dispatch(simulateTradeThunk({ symbol: symbol, timeframe: timeframe }))
        }
      >
        Simulate MACD Trade
      </button>
      <button
        onClick={() =>
          dispatch(
            simulateTradeMACDCrossThunk({
              symbol: symbol,
              timeframe: timeframe
            })
          )
        }
      >
        Simulate MACD Cross Trade
      </button>
      <button
        onClick={() =>
          dispatch(
            simulateTradeRSIThunk({ symbol: symbol, timeframe: timeframe })
          )
        }
      >
        Simulate RSI Trade
      </button>
      <br></br>
      <button
        onClick={() =>
          dispatch(forecast({ symbol: symbol, timeframe: timeframe }))
        }
      >
        Forecast
      </button>
    </div>
  );
};

const styles = {
  display: "grid"
};
export default SimulateTradePanel;
