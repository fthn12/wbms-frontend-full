import { createSlice } from "@reduxjs/toolkit";

const dataLocalStorage = localStorage.getItem("wb") ? JSON.parse(localStorage.getItem("wb")) : {};

const initialState = {
  weight: dataLocalStorage?.weight ? dataLocalStorage.weight : -1,
  lastChange: dataLocalStorage?.lastChange ? dataLocalStorage.lastChange : 0,
  isStable: dataLocalStorage?.isStable ? dataLocalStorage.isStable : false,
  onProcessing: dataLocalStorage?.onProcessing ? dataLocalStorage.onProcessing : false,
  canStartScalling: dataLocalStorage?.canStartScalling ? dataLocalStorage.canStartScalling : false,
};

export const wbSlice = createSlice({
  name: "wb",
  initialState,
  reducers: {
    setWb: (state, action) => {
      // dengan cara ini harus return value
      state = { ...state, ...action.payload };

      localStorage.setItem("wb", JSON.stringify(state));

      return state;
    },
    resetWb: (state, action) => {
      state = {
        weight: -1,
        lastChange: 0,
        isStable: false,
        onProcessing: false,
        canStartScalling: false,
      };

      localStorage.setItem("wb", JSON.stringify(state));
    },
  },
});

export const { setWb, resetWb } = wbSlice.actions;
