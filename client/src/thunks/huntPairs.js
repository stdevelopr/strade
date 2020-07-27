import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const huntMACD = createAsyncThunk(
  "hunt/macd",
  async (timeframe, thunkAPI) => {
    let resp;
    await axios.get("api/binance/hunt/macd/" + timeframe).then(res => {
      resp = res.data.pairs_info;
    });

    return resp;
  }
);
