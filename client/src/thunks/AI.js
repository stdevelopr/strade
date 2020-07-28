import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const calculateExtrema = createAsyncThunk(
  "ai/calculate/extrema",
  async (symbol, thunkAPI) => {
    let resp;
    await axios
      .get(
        "api/binance/ai/calculate_extrema/" +
          symbol.symbol +
          "/" +
          symbol.timeframe
      )
      .then(data => (resp = data.data));

    return resp;
  }
);
