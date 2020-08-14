import React, { useEffect } from "react";
import Radium from "radium";
import { useSelector, useDispatch } from "react-redux";

import { huntMACD } from "../../thunks/huntPairs";

const HuntPairsPanel = () => {
  const dispatch = useDispatch();
  const timeframe = useSelector(
    state => state.symbols.timeframes.contextTimeFrame
  );
  const pairsInfo = useSelector(state => state.huntPairs.all);

  useEffect(() => {
    dispatch(huntMACD());
  }, []);
  return (
    <div style={styles}>
      <h3>Hunt</h3>
      <button onClick={() => dispatch(huntMACD(timeframe))}>Refresh</button>
      {pairsInfo.map(item => {
        if (item.last_cross_index <= 4 && item.last_cross_index != null) {
          return (
            <div>
              {item.symbol}-{item.last_cross_index}
            </div>
          );
        }
      })}
    </div>
  );
};

const styles = {
  display: "grid",
  margin: "20px"
};
export default HuntPairsPanel;
