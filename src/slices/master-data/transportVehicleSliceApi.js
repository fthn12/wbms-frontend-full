import { apiSlice } from "../apiSlice";

const API_URL = "/transport-vehicles";

const transportVehicleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    eDispatchTransportVehicleSync: builder.mutation({
      query: () => ({
        url: `${API_URL}/edispatch-sync`,
        method: "GET",
      }),
      invalidatesTags: ["transport-vehicle"],
    }),

    getTransportVehicles: builder.query({
      query: () => ({
        url: `${API_URL}`,
        method: "GET",
      }),
      transformResponse: (response, meta, arg) => response?.data?.transportVehicle,
      providesTags: ["transport-vehicle"],
    }),

    getEdispatchTransportVehicles: builder.query({
      query: (data) => ({
        url: `${API_URL}/get-edispatch`,
        method: "POST",
        body: { ...data },
      }),
      transformResponse: (response, meta, arg) => response?.data?.transportVehicle,
      providesTags: ["transport-vehicle"],
    }),
  }),
});

export const {
  useEDispatchTransportVehicleSyncMutation,
  useGetTransportVehiclesQuery,
  useGetEdispatchTransportVehiclesQuery,
} = transportVehicleApiSlice;
