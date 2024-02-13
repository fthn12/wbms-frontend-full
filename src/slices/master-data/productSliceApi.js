import { apiSlice } from "../apiSlice";

const API_URL = "/products";

const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    eDispatchProductSync: builder.mutation({
      query: () => ({
        url: `${API_URL}/edispatch-sync`,
        method: "GET",
      }),
      invalidatesTags: ["product"],
    }),

    getProducts: builder.query({
      query: (data) => ({
        url: `${API_URL}`,
        method: "GET",
      }),
      transformResponse: (response, meta, arg) => response?.data?.product,
      providesTags: ["product"],
    }),
    findManyProduct: builder.query({
      query: (data) => ({
        url: `${API_URL}/find-many`,
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (response, meta, arg) => response?.data?.product,
      providesTags: ["product"],
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: `${API_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${API_URL}/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `${API_URL}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useEDispatchProductSyncMutation,
  useGetProductsQuery,
  useFindManyProductQuery,
  useUpdateProductMutation,
  useCreateProductMutation,
  useDeleteProductMutation,
} = productApiSlice;
