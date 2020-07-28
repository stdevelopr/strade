import { createSlice } from "@reduxjs/toolkit";
import { calculateExtrema } from "../../thunks/AI";

const AISlice = createSlice({
  name: "AI",
  initialState: {
    extrema: []
  },
  reducers: {},
  extraReducers: {
    [calculateExtrema.pending]: (state, action) => {
      state.loading = true;
    },
    [calculateExtrema.fulfilled]: (state, action) => {
      state.loading = false;
      state.extrema = action.payload;
    },
    [calculateExtrema.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    }
  }
});
export const AIReducer = AISlice.reducer;

export default AISlice;
