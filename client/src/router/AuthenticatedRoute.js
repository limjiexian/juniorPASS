import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Spinner from "../utils/Spinner";
import toast from "react-hot-toast";
import { useUserContext } from "../components/UserContext";

const AuthenticatedRoute = ({ ...props }) => {
  const { isAuthenticated, loading } = useUserContext();

  // Wait for loading to finish
  if (loading) {
    return <Spinner />;
  }

  // Handle unauthenticated users after loading completes
  if (!isAuthenticated) {
    toast.error("You have not logged in");
    return <Navigate to="/login" />;
  }

  return <Outlet {...props} />;
};

export default AuthenticatedRoute;
