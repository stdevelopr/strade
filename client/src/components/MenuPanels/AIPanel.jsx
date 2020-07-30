import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { calculateExtrema } from "../../thunks/AI";

const AIPanel = () => {
  const dispatch = useDispatch();
  const timeframe = useSelector(
    state => state.symbols.timeframes.contextTimeFrame
  );
  const symbol = useSelector(state => state.symbols.contextSymbol);

  //   const pairsInfo = useSelector(state => state.huntPairs.all);

  //   useEffect(() => {
  //     dispatch(huntMACD());
  //   }, []);
  return (
    <div>
      <h3>AI section</h3>
      <button
        onClick={() =>
          dispatch(calculateExtrema({ symbol: symbol, timeframe: timeframe }))
        }
      >
        Calulate extrema
      </button>
      <button
        onClick={() =>
          fetch("api/binance/ai/prepare_data/" + symbol + "/" + timeframe).then(
            response => console.log(response)
          )
        }
      >
        Prepare Data
      </button>
    </div>
  );
};

export default AIPanel;
