import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthProvider";

function ProtectedRoute({ allowedRoles = [] }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Wait until AuthProvider finishes checking the existing session
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // User is not logged in
  if (!user) {
    return (
      <Navigate
        to="/request-otp"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // User is logged in but doesn't have the required role
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role?.toUpperCase())
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;