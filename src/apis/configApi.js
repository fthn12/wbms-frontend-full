import { useAxios } from "../hooks";

export const ConfigAPI = () => {
  const { axios } = useAxios();
  const endpoint = "configs";

  const Setup = async (data) => {
    const response = await axios.post(`${endpoint}/setup`, data).then((res) => res.data);

    return response;
  };

  return { Setup };
};
