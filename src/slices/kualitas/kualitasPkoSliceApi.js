import { apiSlice } from "../apiSlice";

const API_URL = "/kualitas-pko";

const KualitasPkoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getKualitasPko: builder.query({
      query: (data) => ({
        url: `${API_URL}`,
        method: "GET",
      }),
      transformResponse: (response, meta, arg) => response?.data?.kualitasPko,
      providesTags: ["kualitas-pko"],
    }),

    createKualitasPko: builder.mutation({
      query: (data) => ({
        url: `${API_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    findFirstKualitasPko: builder.query({
      query: (data) => ({
        url: `${API_URL}/find-first`,
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (response, meta, arg) => response?.data?.kualitasPko,
      providesTags: ["kualitas-pko"],
    }),
    findManyKualitasPko: builder.query({
      query: (data) => ({
        url: `${API_URL}/find-many`,
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (response, meta, arg) => response?.data?.kualitasPko,
      providesTags: ["kualitas-pko"],
    }),
  }),
});

export const {
  useGetKualitasPkoQuery,
  useCreateKualitasPkoMutation,
  useFindFirstKualitasPkoQuery,
  useFindManyKualitasPkoQuery,
} = KualitasPkoApiSlice;
