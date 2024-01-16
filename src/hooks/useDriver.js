import { useEDispatchDriverSyncMutation, useGetDriversQuery } from "../slices/master-data/driverSliceApi";

export const useDriver = () => {
  return {
    useEDispatchDriverSyncMutation,
    useGetDriversQuery,
  };
};
