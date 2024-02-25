import {
  useEDispatchDriverSyncMutation,
  useGetDriversQuery,
  useGetEdispatchDriversQuery,
} from "../slices/master-data/driverSliceApi";

export const useDriver = () => {
  return {
    useEDispatchDriverSyncMutation,
    useGetDriversQuery,
    useGetEdispatchDriversQuery,
  };
};
