import { apiSlice } from "../apiSlice";

const API_URL = "/users";

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (data) => ({
        url: `${API_URL}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    findManyUsers: builder.query({
      query: (data) => ({
        url: `${API_URL}/find-many`,
        method: "POST",
        body: { ...data },
      }),
      providesTags: ["user"],
    }),
    findFirstUser: builder.mutation({
      query: (data) => ({
        url: `${API_URL}/find-first`,
        method: "POST",
        body: { ...data },
      }),
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: `${API_URL}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user"],
    }),
  }),
});

export const { useGetUsersQuery, useFindManyUsersQuery, useFindFirstUserMutation, useCreateUserMutation } =
  userApiSlice;
