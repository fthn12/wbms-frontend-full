import { useGetKualitasCpoQuery, useCreateKualitasCpoMutation } from "../slices/kualitas/kualitasCpoSliceApi";

export const useKualitasCpo = () => {
  return { useGetKualitasCpoQuery, useCreateKualitasCpoMutation };
};
