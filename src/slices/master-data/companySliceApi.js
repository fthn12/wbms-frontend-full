import { apiSlice } from "../apiSlice";

const API_URL = "/companies";

const CompanyApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    eDispatchCompanySync: builder.mutation({
      query: () => ({
        url: `${API_URL}/edispatch-sync`,
        method: "GET",
      }),
      invalidatesTags: ["company"],
    }),

    getCompanies: builder.query({
      query: (data) => ({
        url: `${API_URL}`,
        method: "GET",
      }),
      transformResponse: (response, meta, arg) => response?.data?.company,
      providesTags: ["company"],
    }),

    findManyCompanies: builder.query({
      query: (data) => ({
        url: `${API_URL}/find-many`,
        method: "POST",
        body: { ...data },
      }),
    }),

    findFirstCompany: builder.query({
      query: (data) => ({
        url: `${API_URL}/find-first`,
        method: "POST",
        body: { ...data },
      }),
    }),

    createCompany: builder.mutation({
      query: (data) => ({
        url: `${API_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    updateCompany: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${API_URL}/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),

    deleteCompany: builder.mutation({
      query: (id) => ({
        url: `${API_URL}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useEDispatchCompanySyncMutation,
  useGetCompaniesQuery,
  useFindManyCompaniesQuery,
  useFindFirstCompanyQuery,
  useUpdateCompanyMutation,
  useCreateCompanyMutation,
  useDeleteCompanyMutation,
} = CompanyApiSlice;
