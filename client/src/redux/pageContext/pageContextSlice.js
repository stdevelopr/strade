import { createSlice } from "@reduxjs/toolkit";

const pageContext = createSlice({
  name: "pageContext",
  initialState: {
    openSideNavMenu: false
  },
  reducers: {
    setOpenSideNavMenu: (state, action) => {
      state.openSideNavMenu = action.payload;
    }
  }
});

export const pageContextReducer = pageContext.reducer;

export default pageContext;
