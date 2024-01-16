import {
  useEDispatchCompanySyncMutation,
  useGetCompaniesQuery,
  useFindFirstCompanyQuery,
  useFindManyCompaniesQuery,
  useUpdateCompanyMutation,
  useCreateCompanyMutation,
  useDeleteCompanyMutation,
} from "../slices/master-data/companySliceApi";

export const useCompany = () => {
  return {
    useEDispatchCompanySyncMutation,
    useGetCompaniesQuery,
    useFindFirstCompanyQuery,
    useFindManyCompaniesQuery,
    useUpdateCompanyMutation,
    useCreateCompanyMutation,
    useDeleteCompanyMutation,
  };
};
