import { createSlice } from "@reduxjs/toolkit";

import { getConfigs } from "./configSliceApi";

const dataLocalStorage = localStorage.getItem("configs") ? JSON.parse(localStorage.getItem("configs")) : {};

const initialState = {
  ENV: dataLocalStorage?.ENV ? dataLocalStorage.ENV : null,
  WBMS: dataLocalStorage?.WBMS ? dataLocalStorage.WBMS : null,

  PROGRESS_STATUS: dataLocalStorage?.PROGRESS_STATUS ? dataLocalStorage.PROGRESS_STATUS : null,
  PKS_PROGRESS_STATUS: dataLocalStorage?.PKS_PROGRESS_STATUS ? dataLocalStorage.PKS_PROGRESS_STATUS : null,
  T30_PROGRESS_STATUS: dataLocalStorage?.T30_PROGRESS_STATUS ? dataLocalStorage.T30_PROGRESS_STATUS : null,
  BULKING_PROGRESS_STATUS: dataLocalStorage?.BULKING_PROGRESS_STATUS ? dataLocalStorage.BULKING_PROGRESS_STATUS : null,

  MD_SOURCE: dataLocalStorage?.MD_SOURCE ? dataLocalStorage.MD_SOURCE : null,
  ROLES: dataLocalStorage?.ROLES ? dataLocalStorage.ROLES : null,
  SITE_TYPES: dataLocalStorage?.SITE_TYPES ? dataLocalStorage.SITE_TYPES : null,

  VA_SCC_MODEL: dataLocalStorage?.VA_SCC_MODEL ? dataLocalStorage.VA_SCC_MODEL : null,
  SCC_MODEL: dataLocalStorage?.SCC_MODEL ? dataLocalStorage.SCC_MODEL : null,
  RSPO_SCC_MODEL: dataLocalStorage?.RSPO_SCC_MODEL ? dataLocalStorage.RSPO_SCC_MODEL : null,
  ISCC_SCC_MODEL: dataLocalStorage?.ISCC_SCC_MODEL ? dataLocalStorage.ISCC_SCC_MODEL : null,
};

export const configSlice = createSlice({
  name: "configs",
  initialState,
  reducers: {
    setConfigs: (state, action) => {
      const configs = action.payload;

      state = { ...state, ...configs };

      localStorage.setItem("configs", JSON.stringify(state));

      // harus pakai ini kl memory assignmentnya dirubah
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getConfigs.pending, (state) => {
      // console.log("getConfigs loading");
    });

    builder.addCase(getConfigs.fulfilled, (state, action) => {
      const response = action.payload;

      state.WBMS = { ...response.data };

      localStorage.setItem("configs", JSON.stringify(state));
    });

    builder.addCase(getConfigs.rejected, (state, action) => {
      console.log("getConfigs error:", action.payload);
    });
  },
});

export const { setConfigs } = configSlice.actions;
