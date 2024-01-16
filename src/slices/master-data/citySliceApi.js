import { apiSlice } from "../apiSlice";

const API_URL = "/cities";

const cityApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCities: builder.query({
      query: (data) => ({
        url: `${API_URL}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetCitiesQuery } = cityApiSlice;
