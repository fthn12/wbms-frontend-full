import { useGetCitiesQuery } from "../slices/master-data/citySliceApi";

export const useCity = () => {
  return { useGetCitiesQuery };
};
