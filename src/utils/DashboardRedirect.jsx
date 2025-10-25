import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DashboardRedirect = () => {
  const navigate = useNavigate();
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
      : null;

  useEffect(() => {
    if (isLoggedIn && roleName) {
      navigate(`/${roleName}/dashboard`, { replace: true });
    } else if (isLoggedIn && currentRole === "user") {
      // Regular users go to profile page instead of dashboard
      navigate("/profile", { replace: true });
    } else if (isLoggedIn && !roleName) {
      // If logged in but role is not recognized, redirect to unauthorized
      navigate("/unauthorized", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  }, [isLoggedIn, roleName, currentRole, navigate]);

  return null;
};

export default DashboardRedirect;
