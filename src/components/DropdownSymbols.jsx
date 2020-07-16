import React, { useState, useEffect } from "react";
import { Dropdown } from "semantic-ui-react";
import axios from "axios";

const DropdownSymbols = () => {
  const [symbols, setSymbols] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const handleChange = (event, data) => {
    setSelectedSymbol(data["value"]);
  };

  useEffect(() => {
    axios.get(`api/binance/all_symbols`).then(res => {
      let symbols_map = res.data.map(s => ({ text: s, value: s }));
      setSymbols(symbols_map);
    });
  }, []);

  const downloadSymbol = () => {
    axios.get("api/binance/trade/" + selectedSymbol).then(res => {
      console.log(res.data);
    });
  };

  const getMacd = () => {
    axios.get("api/binance/process_macd/" + selectedSymbol);
  };
  return (
    <div>
      <Dropdown
        placeholder="Symbol"
        search
        selection
        onChange={(e, data) => handleChange(e, data)}
        options={symbols}
      />

      <button onClick={() => downloadSymbol()}>Trade</button>
      <button onClick={() => getMacd()}>Calculate MACD</button>
    </div>
  );
};

export default DropdownSymbols;
