import { Navigate, Outlet } from "react-router-dom";
import { homePathFor, useAuth } from "../context/AuthContext";

/**
 * Only lets logged-in users with the required role through.
 * (This is a UX guard only - the real security is enforced by the backend.)
 */
export default function ProtectedRoute({ role, children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={homePathFor(user.role)} replace />;

  return children ?? <Outlet />;
}
