import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearUser } from '../store/slices/authSlice';
import { useCheckAuthQuery } from '../services/Api';
import toast from 'react-hot-toast';


export const useAuthValidation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const { 
    data: authData, 
    isLoading, 
    error, 
    refetch,
    isError,
    isSuccess 
  } = useCheckAuthQuery(undefined, {
    skip: !localStorage.getItem('auth_token') && !user?.token,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    pollingInterval: 30000,
  });

  const canRefetch = Boolean(localStorage.getItem('auth_token') || user?.token);

  useEffect(() => {
    if (isSuccess && authData) {
      console.log('Auth validation: User authenticated successfully', authData);
      
      if (authData.isActive === false || authData.status === 'inactive') {
        console.log('Auth validation: User account is inactive, logging out');
        handleForcedLogout('Your account has been deactivated by an administrator.');
        return;
      }
      
      if (!authData.id || !authData.email) {
        console.log('Auth validation: User data incomplete, possible deletion');
        handleForcedLogout('Your account may have been modified. Please login again.');
        return;
      }
    }
  }, [isSuccess, authData]);

  useEffect(() => {
    if (isError && error) {
      console.log('Auth validation: Authentication error', error);
      
      const errorStatus = error?.status || error?.data?.status;
      const errorMessage = error?.data?.message || error?.message || '';
      
      if (errorStatus === 401) {
        if (isAuthenticated) {
          console.log('Auth validation: 401 error while authenticated, forcing logout');
          handleForcedLogout('Your session has expired. Please login again.');
        }
      } else if (errorStatus === 403) {
        console.log('Auth validation: 403 error, account may be disabled');
        handleForcedLogout('Access denied. Your account may have been disabled.');
      } else if (errorMessage.toLowerCase().includes('password') && 
                 errorMessage.toLowerCase().includes('changed')) {
        console.log('Auth validation: Password changed by admin');
        handleForcedLogout('Your password was changed by an administrator. Please login with your new password.');
      } else if (errorMessage.toLowerCase().includes('deleted') || 
                 errorMessage.toLowerCase().includes('removed')) {
        console.log('Auth validation: Account deleted');
        handleForcedLogout('Your account has been deleted by an administrator.');
      } else if (errorMessage.toLowerCase().includes('suspended') || 
                 errorMessage.toLowerCase().includes('banned')) {
        console.log('Auth validation: Account suspended');
        handleForcedLogout('Your account has been suspended by an administrator.');
      }
    }
  }, [isError, error, isAuthenticated]);

  const handleForcedLogout = useCallback((message = 'You have been logged out. Please login again.') => {
    console.log('Auth validation: Forcing logout with message:', message);
    
    if (localStorage.getItem('logout_in_progress') === 'true') {
      console.log('Auth validation: Logout already in progress, skipping duplicate');
      return;
    }
    
    localStorage.setItem('logout_in_progress', 'true');
    
    dispatch(clearUser());
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('rememberedCredentials');
    
    toast.dismiss();
    
    if (message.includes('password') && message.includes('changed')) {
      toast.error('Password Changed', {
        description: 'Your password was changed by an administrator. Please login with your new password.',
        duration: 6000,
        id: 'password-changed-toast' 
      });
    } else if (message.includes('deleted')) {
      toast.error('Account Deleted', {
        description: 'Your account has been deleted by an administrator.',
        duration: 6000,
        id: 'account-deleted-toast' 
      });
    } else if (message.includes('suspended') || message.includes('banned')) {
      toast.error('Account Suspended', {
        description: 'Your account has been suspended by an administrator.',
        duration: 6000,
        id: 'account-suspended-toast' 
      });
    } else if (message.includes('deactivated')) {
      toast.error('Account Deactivated', {
        description: 'Your account has been deactivated by an administrator.',
        duration: 6000,
        id: 'account-deactivated-toast' 
      });
    } else {
      toast.error('Session Expired', {
        description: message,
        duration: 5000,
        id: 'session-expired-toast' 
      });
    }
    
    setTimeout(() => {
      localStorage.removeItem('logout_in_progress');
    }, 2000);
    
    navigate('/login', { 
      replace: true,
      state: { 
        message: message,
        forcedLogout: true 
      }
    });
  }, [dispatch, navigate]);

  const handleUserLogout = useCallback(() => {
    console.log('Auth validation: User-initiated logout');
    
    dispatch(clearUser());
    
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('rememberedCredentials');
    
    toast.success('Logged out successfully!');
    
    navigate('/', { replace: true });
  }, [dispatch, navigate]);

  useEffect(() => {
    if (isAuthenticated && user?.token) {
      console.log('Auth validation: Validating existing session');
      refetch();
    }
  }, [isAuthenticated, user?.token, refetch]);

  return {
    authData,
    isLoading,
    error,
    isError,
    isSuccess,
    refetch,
    canRefetch,
    handleForcedLogout,
    handleUserLogout,
  };
};

export default useAuthValidation;
