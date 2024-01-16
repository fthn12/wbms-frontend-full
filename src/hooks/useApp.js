import { useSelector, useDispatch } from "react-redux";

import * as appRedux from "../slices/app/appSlice";

export const useApp = () => {
  const dispatch = useDispatch();

  // get value of state
  const { themeMode, sidebar, urlPrev } = useSelector((state) => state.app);

  const toggleColorMode = () => {
    const mode = themeMode === "light" ? "dark" : "light";

    dispatch(appRedux.setThemeMode(mode));
  };

  const setSidebar = (values) => {
    dispatch(appRedux.setSidebar(values));
  };

  const setUrlPrev = (values) => {
    dispatch(appRedux.setUrlPrev(values));
  };

  return { themeMode, sidebar, urlPrev, toggleColorMode, setSidebar, setUrlPrev };
};
