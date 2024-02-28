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
    findFirstKualitasCpo: builder.query({
      query: (data) => ({
        url: `${API_URL}/find-first`,
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (response, meta, arg) => response?.data?.kualitasCpo,
      providesTags: ["kualitas-cpo"],
    }),
    findManyKualitasCpo: builder.query({
      query: (data) => ({
        url: `${API_URL}/find-many`,
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (response, meta, arg) => response?.data?.kualitasCpo,
      providesTags: ["kualitas-cpo"],
    }),
  }),
});

export const {
  useGetKualitasCpoQuery,
  useCreateKualitasCpoMutation,
  useFindFirstKualitasCpoQuery,
  useFindManyKualitasCpoQuery,
} = KualitasCpoApiSlice;
