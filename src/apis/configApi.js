import { useAxios } from "../hooks";

export const ConfigAPI = () => {
  const { axios } = useAxios();
  const endpoint = "configs";

  const Setup = async (data) => {
    const response = await axios.post(`${endpoint}/setup`, data).then((res) => res.data);

    return response;
  };

  const getById = async (id) => {
    const response = await axios.get(`${endpoint}/${id}`).then((res) => res.data);
    return response;
  };

  const updateById = async (id, data) => {
    const response = await axios.patch(`${endpoint}/${id}`, data).then((res) => res.data);
    return response;
  };

  return { Setup, getById, updateById };
};
