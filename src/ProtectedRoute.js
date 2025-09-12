// src/components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("authToken");

  if (!token) {
    toast.warn("Please login or register first.");
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
