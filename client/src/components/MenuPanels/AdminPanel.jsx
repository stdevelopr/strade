import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const AdminPanel = () => {
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
      <h3>Fill Database</h3>
      <button onClick={() => fetch("/api/binance/admin/fill_db/" + timeframe)}>
        Fill database
      </button>
    </div>
  );
};

export default AdminPanel;
