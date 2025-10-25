import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

const AuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.auth?.isAuthenticated);
  const currentRole = useSelector((state) => state.auth.user?.role);

  // Map API roles to route paths
  const roleName =
    currentRole === "admin"
      ? "admin"
      : currentRole === "company-owner"
      ? "company-owner"
      : currentRole === "driver"
      ? "staff"
      : currentRole === "user"
      ? "user"
      : null;

  useEffect(() => {
    // Only redirect if user is trying to access a protected route
    const protectedRoutes = [
      "/admin",
      "/staff",
      "/company-owner",
      "/user",
      "/dashboard",
    ];
    const isProtectedRoute = protectedRoutes.some((route) =>
      location.pathname.startsWith(route)
    );

    if (isProtectedRoute) {
      if (isLoggedIn && roleName) {
        navigate(`/${roleName}/dashboard`, { replace: true });
      } else if (isLoggedIn && !roleName) {
        // If logged in but role is not recognized, redirect to unauthorized
        navigate("/unauthorized", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } else {
      // For non-protected routes, redirect to home
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, roleName, navigate, location.pathname]);

  return null;
};

export default AuthRedirect;
