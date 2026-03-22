import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import Loading from "../Components/Utils/Loading";

function PrivateRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();



  if (loading) {

    return <Loading />;
  }

  if (!user) {

    return <Navigate to="/auth/login" replace />;
  }

  if (!user.isProfileComplete && location.pathname !== "/profile") {

    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}

export default PrivateRoute;
