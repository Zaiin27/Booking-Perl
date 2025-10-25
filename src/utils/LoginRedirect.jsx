import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

const LoginRedirect = ({ children }) => {
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
      
  console.log("LoginRedirect - roleName:", roleName);

  useEffect(() => {
    if (isLoggedIn && roleName) {
      // User is already logged in, check if they have a returnUrl
      if (returnUrl) {
        // If user came from a specific page, redirect them back
        console.log("LoginRedirect - Redirecting to returnUrl:", returnUrl);
        navigate(returnUrl, { replace: true });
      } else if (currentRole === "user") {
        // Regular users go to profile page instead of dashboard
        console.log("LoginRedirect - Redirecting to profile");
        navigate("/profile", { replace: true });
      } else {
        // Other roles go to their dashboard
        console.log("LoginRedirect - Redirecting to:", `/${roleName}/dashboard`);
        navigate(`/${roleName}/dashboard`, { replace: true });
      }
    } else if (isLoggedIn && !roleName) {
      console.log("LoginRedirect - User logged in but no valid role found");
    }
  }, [isLoggedIn, roleName, currentRole, navigate, returnUrl]);

  // Separate effect to watch for role changes
  useEffect(() => {
    if (isLoggedIn && currentRole && !roleName) {
      console.log("LoginRedirect - Role changed, re-evaluating redirect...");
      // This will trigger the main effect above
    }
  }, [isLoggedIn, currentRole, roleName]);

  // If user is logged in, don't render the login form (will redirect)
  if (isLoggedIn && roleName) {
    return null;
  }

  // If user is not logged in, render the login form
  return children;
};

export default LoginRedirect;
