import React from "react";
import { useSelector } from "react-redux";
import PlotArea from "./PlotArea";

const PlotAreaContainer = () => {
  const open = useSelector(state => state.pageContext.openSideNavMenu);
  return (
    <div
      style={Object.assign(
        {},
        styles.base,
        open ? styles.menuOpen : styles.menuClose
      )}
    >
      <PlotArea />
    </div>
  );
};

const styles = {
  base: {
    width: "90%"
  },
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
