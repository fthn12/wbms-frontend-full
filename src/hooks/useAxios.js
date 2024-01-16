import Axios from "axios";

import { useAuth } from "./";

const { REACT_APP_WBMS_BACKEND_API_URL } = process.env;

export const useAxios = () => {
  const { setTokens, clearCredentials } = useAuth();

  const axios = Axios.create({
    baseURL: `${REACT_APP_WBMS_BACKEND_API_URL}/`,
    withCredentials: true,
  });

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error) {
      // const { setTokens, clearCredentials } = useAuth();
      const originalRequest = error.config;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const response = await refreshAccessToken();

        // axios.defaults.headers.common["Authorization"] = "Bearer " + access_token;

        if (response?.status === true) {
          const { tokens } = response.data;

          // store the new tokens
          setTokens({ tokens });

          // retry the original query with new access token
          return axios(originalRequest);
        } else {
          clearCredentials();
        }
      }

      return Promise.reject(error.response.data);
    },
  );

  const refreshAccessToken = async () => {
    const response = await axios
      .post(`auth/refresh`)
      .then((res) => res.data)
      .catch((error) => {
        return {
          status: false,
          message: error.message,
          data: {
            error: error,
          },
        };
      });

    return response;
  };

  return { axios };
};
