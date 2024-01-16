import {
  useGetUsersQuery,
  useFindManyUsersQuery,
  useFindFirstUserMutation,
  useCreateUserMutation,
} from "../slices/user/userSliceApi";

export const useUser = () => {
  return {
    useGetUsersQuery,
    useFindManyUsersQuery,
    useFindFirstUserMutation,
    useCreateUserMutation,
  };
};
