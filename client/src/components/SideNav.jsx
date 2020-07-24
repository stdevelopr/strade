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
  return (
    <div style={styles}>
      <p onClick={() => setContext("indicators")}>Indic.</p>
      <p onClick={() => setContext("simulateTrade")}>Simul.</p>
    </div>
  );
};

const styles = {
  background: "#272c36",
  position: "fixed",
  width: "50px",
  color: "white",
  height: "100vh"
};
export default Sidenav;
