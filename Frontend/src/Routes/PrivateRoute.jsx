import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom"; // 1. Import useLocation
import toast from "react-hot-toast";
import { useAuth } from "../Context/AuthContext";
import Loading from "../Components/Utils/Loading";

function PrivateRoute() {
  const { profileData, loading } = useAuth();
  const location = useLocation(); // 2. Get current path

  useEffect(() => {
    if (loading) {
      toast.loading("loading...", { id: "auth-toast" });
    } else {
      toast.dismiss("auth-toast");
    }
  }, [loading]);

  if (loading) {
    return <Loading />;
  }

  // Check 1: Not logged in? -> Go to Auth
  if (!profileData) {
    return <Navigate to="/auth" replace />;
  }

  // Check 2: Logged in but no Name? -> Go to Profile (Onboarding)
  // FIX: Only redirect if they are NOT ALREADY on the profile page!
  if (profileData && !profileData.name) {
    if (location.pathname !== "/profile") {
      return <Navigate to="/profile" replace />;
    }
  }

  return <Outlet />;
}

export default PrivateRoute;
