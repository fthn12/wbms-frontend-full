import { apiSlice } from "../apiSlice";

const API_URL = "/storage-tanks";

const storageTankApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    eDispatchStorageTankSync: builder.mutation({
      query: () => ({
        url: `${API_URL}/edispatch-sync`,
        method: "GET",
      }),
      invalidatesTags: ["storage-tank"],
    }),

    getStorageTanks: builder.query({
      query: (data) => ({
        url: `${API_URL}`,
        method: "GET",
      }),
      transformResponse: (response, meta, arg) => response?.data?.storageTank,
      providesTags: ["storage-tank"],
    }),

    findManyStorageTanks: builder.query({
      query: (data) => ({
        url: `${API_URL}/find-many`,
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (response, meta, arg) => response?.data?.storageTank,
      providesTags: ["storage-tank"],
    }),
  }),
});

export const { useEDispatchStorageTankSyncMutation, useGetStorageTanksQuery, useFindManyStorageTanksQuery } =
  storageTankApiSlice;
