import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ role, children }) {
  const storedRole = localStorage.getItem("role");
  const uid = localStorage.getItem("uid");

  // If not logged in
  if (!storedRole || !uid) {
    if (role === "user") return <Navigate to="/auth-user-login" />;
    if (role === "vendor") return <Navigate to="/auth-vendor-login" />;
    if (role === "admin") return <Navigate to="/admin-login" />;
  }

  // If logged in but role mismatch
  if (storedRole !== role) {
    if (role === "user") return <Navigate to="/auth-user-login" />;
    if (role === "vendor") return <Navigate to="/auth-vendor-login" />;
    if (role === "admin") return <Navigate to="/admin-login" />;
  }

  return children;
}
