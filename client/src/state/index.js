import { createSlice } from "@reduxjs/toolkit";

// initial redux state
const initialState = {
  mode: "dark",
  userInfo: null,
  isAuthenticated: false,
};

// reducers to get redux state data
export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setUser: (state, action) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setMode, setUser, clearUser } = globalSlice.actions;

export default globalSlice.reducer;
