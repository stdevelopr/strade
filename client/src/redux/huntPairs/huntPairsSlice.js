import { createSlice } from "@reduxjs/toolkit";
import { huntMACD } from "../../thunks/huntPairs";

const huntPairsSlice = createSlice({
  name: "huntPairs",
  initialState: {
    all: []
  },
  reducers: {
    getHuntPairs: (state, action) => {
      state.all = action.payload;
    }
  },
  extraReducers: {
    [huntMACD.pending]: (state, action) => {
      state.loading = true;
    },
    [huntMACD.fulfilled]: (state, action) => {
      state.loading = false;
      state.all = action.payload;
    },
    [huntMACD.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    }
  }
});
export const huntPairsReducer = huntPairsSlice.reducer;

export default huntPairsSlice;
