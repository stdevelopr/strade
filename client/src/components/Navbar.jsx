import React from "react";
import DropdownList from "./DropdownList.jsx";
import IndicatorsList from "./IndicatorsList.jsx";
import NeuralNetworkMenu from "./NeuralNetworkMenu.jsx";
import CrossPlotIndicators from "./CrossPlotIndicators.jsx";
import ChartTypeSelector from "./ChartTypeSelector.jsx";
import { withApollo } from "@apollo/react-hoc";
import { useQuery } from "@apollo/react-hooks";
import { GET_CHART_STATE } from "../graphql/queries/get_data.graphql";

const Navbar = ({ client }) => {

  return (
    <div style={{ backgroundColor: "gray", display: "flex" }}>
      <h1>NAVBAR</h1>
      <ChartTypeSelector />
      <DropdownList />
      <IndicatorsList />
      <CrossPlotIndicators />
      <NeuralNetworkMenu />
    </div>
  );
};

export default withApollo(Navbar);
