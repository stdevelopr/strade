import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dropdown from "./components/DropdownSymbols";
import PlotArea from "./components/PlotArea";
import "semantic-ui-css/semantic.min.css";

export default function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      {" "}
      <Dropdown />
      <PlotArea symbol={"LTCBTC"} />
    </div>
  );
}
