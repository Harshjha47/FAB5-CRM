import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import Loading from "../Components/Utils/Loading";

const PublicRouter = () => {
  const { profileData, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      toast.loading("Loading...", { id: "public-loader" });
    } else {
      toast.dismiss("public-loader");
    }
  }, [loading]);

  if (loading) {
    return <Loading />;
  }

  if (profileData) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRouter;
