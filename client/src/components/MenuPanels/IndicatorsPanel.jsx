import React from "react";
import Radium from "radium";
import { useSelector, useDispatch } from "react-redux";

import {
  getSymbolData,
  getIndicatorMACD,
  getIndicatorRSI
} from "../../thunks/symbols";

const IndicatorsPanel = () => {
  const dispatch = useDispatch();
  const symbol = useSelector(state => state.symbols.contextSymbol);
  const timeframe = useSelector(
    state => state.symbols.timeframes.contextTimeFrame
  );
  return (
    <div style={styles}>
      <h3>Indicators</h3>
      <button
        onClick={() =>
          dispatch(getIndicatorRSI({ symbol: symbol, timeframe: timeframe }))
        }
      >
        Plot RSI
      </button>
      <button
        onClick={() =>
          dispatch(getIndicatorMACD({ symbol: symbol, timeframe: timeframe }))
        }
      >
        Plot MACD
      </button>
    </div>
  );
};

const styles = {
  display: "grid",
  margin: "20px"
};
export default IndicatorsPanel;
