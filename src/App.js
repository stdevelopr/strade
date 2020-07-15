import React from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <button
        onClick={() => {
          fetch("/binance/trade/ETCBTC")
            .then(response => response.json())
            .then(response => console.log(response));
        }}
      >
        Click
      </button>
    </div>
  );
}

export default App;
