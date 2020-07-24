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
  return (
    <div style={styles}>
      <button onClick={() => dispatch(getIndicatorRSI(symbol))}>
        Plot RSI
      </button>
      <button onClick={() => dispatch(getIndicatorMACD(symbol))}>
        Plot MACD
      </button>
    </div>
  );
};

const styles = {
  display: "grid"
};
export default IndicatorsPanel;
