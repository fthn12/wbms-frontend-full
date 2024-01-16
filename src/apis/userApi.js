import { useAxios } from "../hooks";

export const UserAPI = () => {
  const { axios } = useAxios();
  const endpoint = "users";

  const Create = async (data) => {
    const response = await axios.post(`${endpoint}`, data).then((res) => res.data);

    return response;
  };

  return { Create };
};
