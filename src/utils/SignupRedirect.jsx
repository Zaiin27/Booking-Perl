import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

const SignupRedirect = ({ children }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
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
    if (isLoggedIn && roleName) {
      // User is already logged in, redirect to their dashboard
      if (returnUrl) {
        // If user came from a specific page, redirect them back
        navigate(returnUrl, { replace: true });
      } else if (currentRole === "user") {
        navigate("/profile", { replace: true });
      } else {
        navigate(`/${roleName}/dashboard`, { replace: true });
      }
    }
  }, [isLoggedIn, roleName, currentRole, navigate, returnUrl]);

  // If user is logged in, don't render the signup form (will redirect)
  if (isLoggedIn && roleName) {
    return null;
  }

  // If user is not logged in, render the signup form
  return children;
};

export default SignupRedirect;
