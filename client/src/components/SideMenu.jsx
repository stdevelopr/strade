import React, { useState } from "react";
import Radium from "radium";
import { useSelector, useDispatch } from "react-redux";
import {
  simulateTradeThunk,
  simulateTradeMACDCrossThunk,
  simulateTradeRSIThunk
} from "../thunks/simulateTrade";
import {
  getSymbolData,
  getIndicatorMACD,
  getIndicatorRSI
} from "../thunks/symbols";

const SideMenu = () => {
  const open = useSelector(state => state.pageContext.openSideNavMenu);
  const dispatch = useDispatch();
  const symbol = useSelector(state => state.symbols.contextSymbol);
  return (
    <div
      style={Object.assign({}, styles.base, open ? styles.open : styles.close)}
    >
      <div
        style={Object.assign(
          {},
          { marginTop: "100px" },
          open ? { display: "inline-grid" } : { display: "none" }
        )}
      >
        <button onClick={() => dispatch(simulateTradeThunk(symbol))}>
          Simulate MACD Trade
        </button>
        <button onClick={() => dispatch(simulateTradeMACDCrossThunk(symbol))}>
          Simulate MACD Cross Trade
        </button>
        <button onClick={() => dispatch(simulateTradeRSIThunk(symbol))}>
          Simulate RSI Trade
        </button>
        <button onClick={() => dispatch(getIndicatorRSI(symbol))}>
          Plot RSI
        </button>
        <button onClick={() => dispatch(getIndicatorMACD(symbol))}>
          Plot MACD
        </button>
      </div>
    </div>
  );
};

const styles = {
  base: {
    position: "fixed",
    top: "0px",
    left: "50px",
    background: "#f4f5f7",
    height: "100vh",
    textAlign: "center"
  },
  open: {
    width: "260px"
  },
  close: {
    width: "30px"
  }
};
export default SideMenu;
