import React, { useState } from "react";
import Radium from "radium";
import { useSelector, useDispatch } from "react-redux";
import IndicatorsPanel from "./MenuPanels/IndicatorsPanel";
import SimulateTradePanel from "./MenuPanels/SimulateTradePanel";
import HuntPairsPanel from "./MenuPanels/HuntPairsPanel";
import RealTimePanel from "./MenuPanels/RealTimePanel";

const SideMenu = () => {
  const open = useSelector(state => state.pageContext.openSideNavMenu);
  const context = useSelector(state => state.menuContext.navSideMenuContext);
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
        {context == "indicators" && <IndicatorsPanel />}
        {context == "simulateTrade" && <SimulateTradePanel />}
        {context == "huntPairs" && <HuntPairsPanel />}
        {context == "realTime" && <RealTimePanel />}
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
