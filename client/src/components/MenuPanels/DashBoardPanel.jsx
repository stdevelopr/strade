import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const DashBoardPanel = () => {
  const [balance, setBalance] = useState("");
  const [assetsList, setAssetsList] = useState([]);
  //   const dispatch = useDispatch();
  //   const timeframe = useSelector(
  //     state => state.symbols.timeframes.contextTimeFrame
  //   );
  const symbol = useSelector(state => state.symbols.contextSymbol);

  //   const pairsInfo = useSelector(state => state.huntPairs.all);

  //   useEffect(() => {
  //     dispatch(huntMACD());
  //   }, []);
  const get_balance = () => {
    fetch("/api/binance/dashboard/balance")
      .then(res => res.text())
      .then(r => setBalance(r));
  };

  const get_assets = () => {
    fetch("/api/binance/dashboard/assets")
      .then(res => res.json())
      .then(r => setAssetsList(r));
  };

  const get_trade_history = () => {
    fetch("/api/binance/dashboard/trade_history/" + symbol).then(res =>
      console.log(res)
    );
  };
  return (
    <div>
      <h3>Dashboard</h3>
      <h2>Balance</h2>
      <p>{balance}</p>
      <button onClick={() => get_balance()}>Balance</button>
      <button onClick={() => get_assets()}>Assets</button>
      <button onClick={() => get_trade_history()}>Trade history</button>
      {assetsList.map(item => {
        return (
          <div>
            <p>{item.asset}</p>
            <p>free: {item.free}</p>
            <p>locked: {item.locked}</p>
            ----------------
          </div>
        );
      })}
    </div>
  );
};

export default DashBoardPanel;
