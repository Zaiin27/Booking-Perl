import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import useAuthValidation from '../hooks/useAuthValidation';
import PageLoading from './PageLoading';
import loginBg from '../assets/images/loginbg.png';


const AuthWrapper = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const { 
    isLoading, 
    isError, 
    error,
    refetch,
    canRefetch,
    handleForcedLogout 
  } = useAuthValidation();

  const protectedRoutes = [
    '/admin',
    '/staff', 
    '/company-owner',
    '/profile',
    '/dashboard'
  ];
  
  const isProtectedRoute = protectedRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  useEffect(() => {
    if (isProtectedRoute && isAuthenticated && isError) {
      console.log('AuthWrapper: Authentication error on protected route', error);
      
    }
  }, [isProtectedRoute, isAuthenticated, isError, error]);

  useEffect(() => {
    if (isProtectedRoute && isAuthenticated && canRefetch) {
      refetch?.();
    }
  }, [location.pathname, isProtectedRoute, isAuthenticated, canRefetch]);

  if (isProtectedRoute && isAuthenticated && isLoading) {
    return (
      <div
        className="min-h-screen relative flex flex-col items-center justify-center p-4"
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container mx-auto px-4 flex items-center justify-center">
          <PageLoading 
           
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
