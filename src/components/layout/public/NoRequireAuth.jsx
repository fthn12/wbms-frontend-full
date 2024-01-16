import { useLocation, Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../../hooks";

const NoRequireAuth = (props) => {
  // const location = useLocation();

  const auth = useAuth();

  // pasti ke NoRequireAuth dl, jd pasti kebaca from history nya
  // const from = location.state?.from?.pathname || "/wb";

  return !auth?.user ? <Outlet /> : <Navigate to="/wb" />;

  // return <Outlet />;
};

export default NoRequireAuth;
