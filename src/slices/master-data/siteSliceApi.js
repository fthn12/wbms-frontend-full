import { apiSlice } from "../apiSlice";

const API_URL = "/sites";

const siteApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    eDispatchSiteSync: builder.mutation({
      query: () => ({
        url: `${API_URL}/edispatch-sync`,
        method: "GET",
      }),
      invalidatesTags: ["site"],
    }),

    getSites: builder.query({
      query: (data) => ({
        url: `${API_URL}`,
        method: "GET",
      }),
      transformResponse: (response, meta, arg) => response?.data?.site,
      providesTags: ["site"],
    }),
  }),
});

export const { useEDispatchSiteSyncMutation, useGetSitesQuery } = siteApiSlice;
