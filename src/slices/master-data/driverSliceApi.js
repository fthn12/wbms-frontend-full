import { apiSlice } from "../apiSlice";

const API_URL = "/drivers";

const driverApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    eDispatchDriverSync: builder.mutation({
      query: () => ({
        url: `${API_URL}/edispatch-sync`,
        method: "GET",
      }),
      invalidatesTags: ["driver"],
    }),

    getDrivers: builder.query({
      query: (data) => ({
        url: `${API_URL}`,
        method: "GET",
      }),
      transformResponse: (response, meta, arg) => response?.data?.driver,
      providesTags: ["driver"],
    }),
  }),
});

export const { useEDispatchDriverSyncMutation, useGetDriversQuery } = driverApiSlice;
