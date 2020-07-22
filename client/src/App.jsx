import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import Dropdown from "./components/DropdownSymbols";
import PlotArea from "./components/PlotArea";
import "semantic-ui-css/semantic.min.css";

// import { configureStore } from "@reduxjs/toolkit";
import store from "./store";

import { useSelector } from "react-redux";
// const store = configureStore({ reducer: rootReducer });

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <div>
          <Switch>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </Provider>
  );
}

function Home() {
  const symbol = useSelector(state => state.symbols.contextSymbol);
  return (
    <div>
      {" "}
      <Dropdown />
      <PlotArea symbol={symbol} />
    </div>
  );
}
