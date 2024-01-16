import { createSlice } from "@reduxjs/toolkit";

const dataLocalStorage = localStorage.getItem("transaction") ? JSON.parse(localStorage.getItem("transaction")) : {};

const initialState = {
  wbTransaction: dataLocalStorage?.wbTransaction ? dataLocalStorage.wbTransaction : null,
  openedTransaction: dataLocalStorage?.openedTransaction ? dataLocalStorage.openedTransaction : null,
};

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setWbTransaction: (state, action) => {
      const transaction = action.payload;

      state.wbTransaction = { ...state.wbTransaction, ...transaction };

      localStorage.setItem("transaction", JSON.stringify(state));
    },
    clearWbTransaction: (state, action) => {
      state.wbTransaction = null;

      localStorage.setItem("transaction", JSON.stringify(state));
    },
    setOpenedTransaction: (state, action) => {
      const transaction = action.payload;

      state.openedTransaction = { ...state.openedTransaction, ...transaction };

      localStorage.setItem("transaction", JSON.stringify(state));
    },
    clearOpenedTransaction: (state, action) => {
      state.openedTransaction = null;

      localStorage.setItem("transaction", JSON.stringify(state));
    },
  },
});

export const { setWbTransaction, clearWbTransaction, setOpenedTransaction, clearOpenedTransaction } =
  transactionSlice.actions;
