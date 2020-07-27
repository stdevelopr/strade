import React from "react";
import Radium from "radium";
import { useSelector, useDispatch } from "react-redux";
import menuContextSlice from "../redux/menuContext/menuContextSlice";
import pageContextSlice from "../redux/pageContext/pageContextSlice";

const Sidenav = () => {
  const { setNavSideMenuContext } = menuContextSlice.actions;
  const { setOpenSideNavMenu } = pageContextSlice.actions;
  const openMenu = useSelector(state => state.pageContext.openSideNavMenu);
  const menuContext = useSelector(
    state => state.menuContext.navSideMenuContext
  );
  const dispatch = useDispatch();

  const setContext = context => {
    if (context !== menuContext) dispatch(setNavSideMenuContext(context));
    if (context === menuContext && openMenu == true)
      dispatch(setOpenSideNavMenu(false));
    else if (openMenu === false) {
      dispatch(setOpenSideNavMenu(true));
    }
  };

  const setSelectedStyle = context =>
    menuContext == context && openMenu == true ? styles.selected : {};

  return (
    <div style={styles.bar}>
      <div style={styles.content}>
        <p
          onClick={() => setContext("realTime")}
          style={setSelectedStyle("realTime")}
        >
          RealTim.
        </p>
        <p
          onClick={() => setContext("indicators")}
          style={setSelectedStyle("indicators")}
        >
          Indic.
        </p>
        <p
          onClick={() => setContext("simulateTrade")}
          style={setSelectedStyle("simulateTrade")}
        >
          Simul.
        </p>
        <p
          onClick={() => setContext("huntPairs")}
          style={setSelectedStyle("huntPairs")}
        >
          Hunt.
        </p>
      </div>
    </div>
  );
};

const styles = {
  bar: {
    background: "#272c36",
    position: "fixed",
    width: "50px",
    color: "white",
    height: "100vh"
  },
  content: {
    marginTop: "100px",
    textAlign: "center"
  },
  selected: {
    background: "red"
  }
};
export default Sidenav;
