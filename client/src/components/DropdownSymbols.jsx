import React, { useState, useEffect } from "react";
import { Dropdown } from "semantic-ui-react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";

const DropdownSymbols = () => {
  const [symbols, setSymbols] = useState([]);
  const contextSymbol = useSelector(state => state.contextSymbol);
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setSelectedSymbol(contextSymbol);
  }, [contextSymbol]);

  const handleChange = (event, data) => {
    setSelectedSymbol(data["value"]);
    dispatch({ type: "setContextSymbol", value: data["value"] });
  };

  useEffect(() => {
    axios.get(`api/binance/all_symbols`).then(res => {
      let symbols_map = res.data.map(s => ({ text: s, value: s }));
      setSymbols(symbols_map);
    });
  }, []);

  const getMacd = () => {
    axios.get("api/binance/process_macd/" + selectedSymbol);
  };
  return (
    <div>
      <Dropdown
        placeholder="Symbol"
        search
        selection
        value={contextSymbol}
        onChange={(e, data) => handleChange(e, data)}
        options={symbols}
      />
      <button onClick={() => getMacd()}>Calculate MACD</button>
    </div>
  );
};

export default DropdownSymbols;
