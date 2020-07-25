import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import PlotArea from "./PlotArea";

const PlotAreaContainer = () => {
  const open = useSelector(state => state.pageContext.openSideNavMenu);
  let width = open ? window.screen.width - 280 : window.screen.width - 50;
  return (
    <div style={Object.assign({}, open ? styles.menuOpen : styles.menuClose)}>
      <PlotArea w={width} />
    </div>
  );
};

const styles = {
  menuOpen: {
    position: "absolute",
    left: "330px"
  },
  menuClose: {
    position: "absolute",
    marginLeft: "100px"
  }
};
export default PlotAreaContainer;
