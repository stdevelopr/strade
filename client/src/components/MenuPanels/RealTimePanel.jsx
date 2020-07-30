import React, { useState, useEffect } from "react";
import Radium from "radium";
import { useSelector, useDispatch } from "react-redux";
import socketIOClient from "socket.io-client";

import {
  getSymbolData,
  getIndicatorMACD,
  getIndicatorRSI,
  realTimeConn,
  realTimeConnStop
} from "../../thunks/symbols";

const ENDPOINT = "http://localhost:3000";
const socket = socketIOClient(ENDPOINT);

const RealTimePanel = () => {
  const dispatch = useDispatch();
  const symbol = useSelector(state => state.symbols.contextSymbol);
  const timeframe = useSelector(
    state => state.symbols.timeframes.contextTimeFrame
  );

  const [response, setResponse] = useState("");
  console.log(response);
  useEffect(() => {
    // socket.on("connect", () => {
    //   console.log("connected");
    // });
    // socket.on("real_time", data => {
    //   setResponse(data["p"]);
    // });
  }, []);

  // if (socket) console.log(socket);

  return (
    <div style={styles}>
      <h3>Connect</h3>
      {response}
      <button
        onClick={() =>
          dispatch(realTimeConn({ symbol: symbol, timeframe: timeframe }))
        }
      >
        Connect Real Time
      </button>
      <button onClick={() => dispatch(realTimeConnStop())}>
        Stop Connection
      </button>

      <button onClick={() => socket.emit("real_time")}>Real Time Prices</button>
      <button onClick={() => socket.close()}>Stop connection</button>
    </div>
  );
};

const styles = {
  display: "grid",
  margin: "20px"
};
export default RealTimePanel;
