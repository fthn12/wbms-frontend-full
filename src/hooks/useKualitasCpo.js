import {
  useGetKualitasCpoQuery,
  useCreateKualitasCpoMutation,
  useFindFirstKualitasCpoQuery,
  useFindManyKualitasCpoQuery,
} from "../slices/kualitas/kualitasCpoSliceApi";

export const useKualitasCpo = () => {
  return {
    useGetKualitasCpoQuery,
    useCreateKualitasCpoMutation,
    useFindFirstKualitasCpoQuery,
    useFindManyKualitasCpoQuery,
  };
};
