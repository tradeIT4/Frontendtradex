// src/components/Admin/AdminRoute.js
import { Navigate } from "react-router-dom";
import { readAuth } from "../../services/auth";

export default function AdminRoute({ children }) {
  const auth = readAuth();

  if (!auth?.token) {
    return <Navigate to="/admin/login" replace />;
  }

  if (auth.role !== "admin") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
