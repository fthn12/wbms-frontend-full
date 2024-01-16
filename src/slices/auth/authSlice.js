import { createSlice } from "@reduxjs/toolkit";

const dataLocalStorage = localStorage.getItem("auth") ? JSON.parse(localStorage.getItem("auth")) : {};

const initialState = {
  user: dataLocalStorage?.user ? dataLocalStorage.user : null,
  at: dataLocalStorage?.at ? dataLocalStorage.at : null,
  rt: dataLocalStorage?.rt ? dataLocalStorage.rt : null,
  token: dataLocalStorage?.token ? dataLocalStorage.token : null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, tokens } = action.payload;

      state.user = user;
      state.at = tokens.access_token;
      state.rt = tokens.refresh_token;
      state.token = tokens.access_token;

      localStorage.setItem("auth", JSON.stringify(state));
    },
    clearCredentials: (state, action) => {
      state.user = null;
      state.at = null;
      state.rt = null;
      state.token = null;

      localStorage.setItem("auth", JSON.stringify(state));
      localStorage.removeItem("auth");
    },
    setToken: (state, action) => {
      const { tokens } = action.payload;

      state.at = tokens.access_token;
      state.rt = tokens.refresh_token;
      state.token = tokens.access_token;

      localStorage.setItem("auth", JSON.stringify(state));
    },
  },
});

export const { setCredentials, clearCredentials, setToken } = authSlice.actions;
// export default authSlice.reducer;
// export default authSlice;
