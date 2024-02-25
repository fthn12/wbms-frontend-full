import {
  useGetTransportVehiclesQuery,
  useEDispatchTransportVehicleSyncMutation,
  useGetEdispatchTransportVehiclesQuery,
} from "../slices/master-data/transportVehicleSliceApi";

export const useTransportVehicle = () => {
  return {
    useGetTransportVehiclesQuery,
    useEDispatchTransportVehicleSyncMutation,
    useGetEdispatchTransportVehiclesQuery,
  };
};
