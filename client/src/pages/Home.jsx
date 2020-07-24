import React, { useState } from "react";
import Dropdown from "../components/DropdownSymbols";

import SideNavMenuContainer from "../components/SideNavMenuContainer";
import PlotAreaContainer from "../components/PlotAreaContainer";
import VerticalSlide from "../components/VerticalSlideBar";
import { useSelector } from "react-redux";

const Home = () => {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <SideNavMenuContainer />
      <PlotAreaContainer />
    </div>
  );
};

export default Home;
