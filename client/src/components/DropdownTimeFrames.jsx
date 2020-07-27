import React, { useEffect } from "react";
import { Dropdown } from "semantic-ui-react";
import { useSelector, useDispatch } from "react-redux";
import symbolSlice from "../redux/symbols/symbolsSlice";
import { getAllTimeFrames } from "../thunks/symbols";

const DropdownTimeFrames = () => {
  const dispatch = useDispatch();
  const timeframe = useSelector(
    state => state.symbols.timeframes.contextTimeFrame
  );
  const allTimeFrames = useSelector(
    state => state.symbols.timeframes.allTimeFrames
  );

  const { setTimeFrame } = symbolSlice.actions;

  useEffect(() => {
    dispatch(getAllTimeFrames());
  }, [dispatch]);

  const handleChange = (event, data) => {
    dispatch(setTimeFrame(data["value"]));
  };

  return (
    <div>
      <Dropdown
        placeholder="Timeframe"
        selection
        value={timeframe}
        onChange={(e, data) => handleChange(e, data)}
        options={allTimeFrames}
      />
    </div>
  );
};

export default DropdownTimeFrames;
