import { useAxios } from "../hooks";

export const AuthAPI = () => {
  const { axios } = useAxios();
  const endpoint = "auth";

  const Signin = async (data) => {
    const response = await axios.post(`${endpoint}/signin`, data).then((res) => res.data);

    return response;
  };

  const Signout = async () => {
    const response = await axios.post(`${endpoint}/signout`).then((res) => res.data);

    return response;
  };

  const Checkin = async () => {
    const response = await axios.get(`${endpoint}/checkin`).then((res) => res.data);

    return response;
  };

  return { Signin, Signout, Checkin };
};
