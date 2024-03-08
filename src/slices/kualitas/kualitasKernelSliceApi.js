import { apiSlice } from "../apiSlice";

const API_URL = "/kualitas-kernel";

const KualitasKernelApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getKualitasKernel: builder.query({
      query: (data) => ({
        url: `${API_URL}`,
        method: "GET",
      }),
      transformResponse: (response, meta, arg) =>
        response?.data?.kualitasKernel,
      providesTags: ["kualitas-kernel"],
    }),

    createKualitasKernel: builder.mutation({
      query: (data) => ({
        url: `${API_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    findFirstKualitasKernel: builder.query({
      query: (data) => ({
        url: `${API_URL}/find-first`,
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (response, meta, arg) =>
        response?.data?.sortasiKernel,
      providesTags: ["kualitas-kernel"],
    }),
    findManyKualitasKernel: builder.query({
      query: (data) => ({
        url: `${API_URL}/find-many`,
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (response, meta, arg) =>
        response?.data?.sortasiKernel,
      providesTags: ["kualitas-kernel"],
    }),
  }),
});

export const {
  useGetKualitasKernelQuery,
  useCreateKualitasKernelMutation,
  useFindFirstKualitasKernelQuery,
  useFindManyKualitasKernelQuery,
} = KualitasKernelApiSlice;
