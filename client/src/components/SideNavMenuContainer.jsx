import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import SideNav from "./SideNav";
import SideMenu from "./SideMenu";
import PlotArea from "./PlotArea";
import pageContextSlice from "../redux/pageContext/pageContextSlice";

const SideNavMenuContainer = () => {
  const { setOpenSideNavMenu } = pageContextSlice.actions;
  const openMenu = useSelector(state => state.pageContext.openSideNavMenu);

  const dispatch = useDispatch();
  return (
    <div>
      <SideNav />
      <SideMenu />
      <button
        style={openMenu ? styles.openButtonOpenned : styles.openButton}
        onClick={() => {
          dispatch(setOpenSideNavMenu(!openMenu));
        }}
      ></button>
    </div>
  );
};

const styles = {
  openButton: {
    position: "fixed",
    left: "70px",
    width: "24px",
    height: "10px",
    top: "10px"
  },
  openButtonOpenned: {
    position: "fixed",
    left: "300px",
    width: "24px",
    height: "10px",
    top: "10px"
  }
};

export default SideNavMenuContainer;
