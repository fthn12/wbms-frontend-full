import {
  useGetKualitasPkoQuery,
  useCreateKualitasPkoMutation,
  useFindFirstKualitasPkoQuery,
  useFindManyKualitasPkoQuery,
} from "../slices/kualitas/kualitasPkoSliceApi";

export const useKualitasPko = () => {
  return {
    useGetKualitasPkoQuery,
    useCreateKualitasPkoMutation,
    useFindFirstKualitasPkoQuery,
    useFindManyKualitasPkoQuery,
  };
};
