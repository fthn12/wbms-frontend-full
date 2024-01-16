import { useLocation, Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../../../hooks";

const RequireAuth = (props) => {
  // const { allowedRoles } = props;
  // const { menu } = props;
  const location = useLocation();

  const { user } = useAuth();

  // return auth?.roles?.find((role) => allowedRoles?.includes(role)) ? (
  // return auth?.role[menu] > 0 ? (
  //   <Outlet />
  // ) : auth?.user ? (
  //   <Navigate to="/500" state={{ from: location }} replace />
  // ) : (
  //   <Navigate to="/signin" state={{ from: location }} replace />
  // );
  return user ? <Outlet /> : <Navigate to="/signin" state={{ from: location }} />;
};

export default RequireAuth;
