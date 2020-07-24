import { createSlice } from "@reduxjs/toolkit";

const menuContextSlice = createSlice({
  name: "menuContext",
  initialState: {
    navSideMenuContext: "info"
  },
  reducers: {
    setNavSideMenuContext: (state, action) => {
      state.navSideMenuContext = action.payload;
    }
  }
});
export const menuContextReducer = menuContextSlice.reducer;

export default menuContextSlice;
