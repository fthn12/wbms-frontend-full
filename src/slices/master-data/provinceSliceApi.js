import { apiSlice } from "../apiSlice";

const API_URL = "/provinces";

const provinceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProvinces: builder.query({
      query: (data) => ({
        url: `${API_URL}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetProvincesQuery } = provinceApiSlice;
