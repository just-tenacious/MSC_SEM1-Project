import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children, adminOnly = false , fallback=null }) => {
  const token = localStorage.getItem("token");
  const isAdmin = Number(localStorage.getItem("is_admin")); // 2 = admin

  // ✅ Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Admin-only route
  if (adminOnly && isAdmin !== 2) {
    return <Navigate to="/dashboard" replace />; // redirect non-admins
  }

  return children;
};

export default ProtectedRoutes;
