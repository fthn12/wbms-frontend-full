import { useAxios } from "../hooks";

export const TransportVehicleAPI = () => {
  const { axios } = useAxios();
  const endpoint = "transport-vehicles";

  const findMany = async (data) => {
    const response = await axios.post(`${endpoint}/find-many`, data).then((res) => res.data.data.transportVehicle);

    return response;
  };

  return { findMany };
};
