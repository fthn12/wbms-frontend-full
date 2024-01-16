import {
  useEDispatchStorageTankSyncMutation,
  useGetStorageTanksQuery,
  useFindManyStorageTanksQuery,
} from "../slices/master-data/storageTankSliceApi";

export const useStorageTank = () => {
  return {
    useEDispatchStorageTankSyncMutation,
    useGetStorageTanksQuery,
    useFindManyStorageTanksQuery,
  };
};
