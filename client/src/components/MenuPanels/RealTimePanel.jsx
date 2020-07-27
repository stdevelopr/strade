import React from "react";
import Radium from "radium";
import { useSelector, useDispatch } from "react-redux";

import {
  getSymbolData,
  getIndicatorMACD,
  getIndicatorRSI,
  realTimeConn,
  realTimeConnStop
} from "../../thunks/symbols";

const RealTimePanel = () => {
  const dispatch = useDispatch();
  const symbol = useSelector(state => state.symbols.contextSymbol);
  const timeframe = useSelector(
    state => state.symbols.timeframes.contextTimeFrame
  );

  return (
    <div style={styles}>
      <h3>Connect</h3>
      <button
        onClick={() =>
          dispatch(realTimeConn({ symbol: symbol, timeframe: timeframe }))
        }
      >
        Connect Real Time
      </button>
      <button onClick={() => dispatch(realTimeConnStop())}>
        Stop Connection
      </button>
    </div>
  );
};

const styles = {
  display: "grid",
  margin: "20px"
};
export default RealTimePanel;
