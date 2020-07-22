import React, { useEffect } from "react";
import { Dropdown } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import symbolSlice from "../redux/symbols/symbolsSlice";
import { getAllSymbols } from "../thunks/symbols";

const DropdownSymbols = () => {
  const dispatch = useDispatch();
  const contextSymbol = useSelector(state => state.symbols.contextSymbol);
  const allSymbols = useSelector(state => state.symbols.allSymbols);

  const { setContextSymbol } = symbolSlice.actions;

  useEffect(() => {
    dispatch(getAllSymbols());
  }, [dispatch]);

  const handleChange = (event, data) => {
    dispatch(setContextSymbol(data["value"]));
  };

  return (
    <div>
      <Dropdown
        placeholder="Symbol"
        search
        selection
        value={contextSymbol}
        onChange={(e, data) => handleChange(e, data)}
        options={allSymbols}
      />
    </div>
  );
};

export default DropdownSymbols;
