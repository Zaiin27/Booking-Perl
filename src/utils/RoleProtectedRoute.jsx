// components/RoleProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const RoleProtectedRoute = ({ allowedRoles, children }) => {
    const user = useSelector((state) => state.auth.user?.role);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const location = useLocation();
    
    // Allow "user" role to access without authentication
    if (allowedRoles.includes("user") && !isAuthenticated) {
        return children;
    }
    
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(user)) {
        return <Navigate to="/unauthorized" replace />;
    }
    return children;
};

export default RoleProtectedRoute;
