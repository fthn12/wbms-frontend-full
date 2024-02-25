import { apiSlice } from "../apiSlice";

const API_URL = "/kualitas-cpo";

const KualitasCpoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getKualitasCpo: builder.query({
      query: (data) => ({
        url: `${API_URL}`,
        method: "GET",
      }),
      transformResponse: (response, meta, arg) => response?.data?.kualitasCpo,
      providesTags: ["kualitas-cpo"],
    }),

    createKualitasCpo: builder.mutation({
      query: (data) => ({
        url: `${API_URL}`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetKualitasCpoQuery, useCreateKualitasCpoMutation } = KualitasCpoApiSlice;
