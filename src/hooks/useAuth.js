import { useSelector, useDispatch } from "react-redux";

import * as authRedux from "../slices/auth/authSlice";
// import { useSigninMutation, useSignoutMutation, useSignupMutation } from "../slices/auth/authSliceApi";

export const useAuth = () => {
  const dispatch = useDispatch();

  // get value of state
  const { user } = useSelector((state) => state.auth);

  const setCredentials = (values) => {
    dispatch(authRedux.setCredentials(values));
  };

  const clearCredentials = () => {
    dispatch(authRedux.clearCredentials());
  };

  const setToken = (value) => {
    dispatch(authRedux.setToken(value));
  };

  // return { user, setCredentials, clearCredentials, setToken, useSigninMutation, useSignoutMutation, useSignupMutation };
  return { user, setCredentials, clearCredentials, setToken };
};
