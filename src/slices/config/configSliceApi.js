import { createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";
import { apiSlice } from "../apiSlice";

const { REACT_APP_WBMS_BACKEND_API_URL } = process.env;
const API_URL = "/configs";

export const getConfigs = createAsyncThunk("configs", async (arg, thunkAPI) => {
  const axios = Axios.create({
    baseURL: `${REACT_APP_WBMS_BACKEND_API_URL}/`,
    withCredentials: true,
  });

  try {
    const response = await axios.get(`${API_URL}`);

    return response.data;
  } catch (error) {
    const message = (error?.response && error.response?.data) || error?.message;

    // rejectWithValue sends the error message as a payload
    return thunkAPI.rejectWithValue(message);
  }
});

const configApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getENV: builder.query({
      query: (data) => ({
        url: `${API_URL}/env`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetENVQuery } = configApiSlice;
