import { useGetSitesQuery, useEDispatchSiteSyncMutation } from "../slices/master-data/siteSliceApi";

export const useSite = () => {
  return { useGetSitesQuery, useEDispatchSiteSyncMutation };
};
