import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import * as authRedux from "./auth/authSlice";

const { REACT_APP_WBMS_BACKEND_API_URL } = process.env;

const baseQuery = fetchBaseQuery({
  baseUrl: `${REACT_APP_WBMS_BACKEND_API_URL}`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    // ini jika ingin dengan strategy gabungan cookies dan barrier token
    // const { token } = getState().auth;
    // if (token) {
    //   headers.set("authorization", `Bearer ${token}`);
    // }

    return headers;
  },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // ini jika ingin dengan strategy gabungan cookies dan barrier token
    // const { rt } = api.getState().auth;
    // api.dispatch(setToken(rt));

    // send refresh token to get new access token
    const refreshResult = await baseQuery({ url: "/auth/refresh", method: "POST" }, api, extraOptions);

    if (refreshResult?.data && refreshResult?.data?.status) {
      const { tokens } = refreshResult.data.data;
      const user = api.getState().auth.user;

      // store the new token
      api.dispatch(authRedux.setCredentials({ tokens, user }));

      // retry the original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(authRedux.clearCredentials());
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  // global configuration for the api
  refetchOnFocus: true,
  tagTypes: ["transaction", "province", "city", "product", "site", "storage-tank", "transport-vehicle", "user"],
  endpoints: (builder) => ({}),
});

// export default apiSlice;
