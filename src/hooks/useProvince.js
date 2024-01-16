import { useGetProvincesQuery } from "../slices/master-data/provinceSliceApi";

export const useProvince = () => {
  return { useGetProvincesQuery };
};
