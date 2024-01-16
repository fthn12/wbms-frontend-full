import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { appSlice } from "../slices/app/appSlice";
import { authSlice } from "../slices/auth/authSlice";
import { configSlice } from "../slices/config/configSlice";
import { transactionSlice } from "../slices/transaction/transactionSlice";
import { wbSlice } from "../slices/wb/wbSlice";

import { apiSlice } from "../slices/apiSlice";

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    auth: authSlice.reducer,
    configs: configSlice.reducer,
    transaction: transactionSlice.reducer,
    wb: wbSlice.reducer,

    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export default store;
export const { dispatch } = store;
