import { apiSlice } from "../apiSlice";

const API_URL = "/transactions";

export const transactionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    findManyTransaction: builder.query({
      query: (data) => ({
        url: `${API_URL}/find-many`,
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (response, meta, arg) => response?.data?.transaction,
      providesTags: ["transaction"],
    }),
  }),
});

export const { useFindManyTransactionQuery } = transactionApiSlice;
