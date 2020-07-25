import React, { useEffect } from "react";
import Radium from "radium";
import { useSelector, useDispatch } from "react-redux";

import { huntMACD } from "../../thunks/huntPairs";

const HuntPairsPanel = () => {
  const dispatch = useDispatch();
  const symbol = useSelector(state => state.symbols.contextSymbol);
  const pairsInfo = useSelector(state => state.huntPairs.all);

  useEffect(() => {
    dispatch(huntMACD());
  }, []);
  return (
    <div style={styles}>
      <h3>Hunt</h3>
      <button onClick={() => dispatch(huntMACD())}>Refresh</button>
      {pairsInfo.map(item => {
        return (
          <div>
            {item.symbol}-{item.last_cross_index}
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  display: "grid",
  margin: "20px"
};
export default HuntPairsPanel;
