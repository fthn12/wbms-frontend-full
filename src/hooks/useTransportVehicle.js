import {
  useGetTransportVehiclesQuery,
  useEDispatchTransportVehicleSyncMutation,
} from "../slices/master-data/transportVehicleSliceApi";

export const useTransportVehicle = () => {
  return { useGetTransportVehiclesQuery, useEDispatchTransportVehicleSyncMutation };
};
