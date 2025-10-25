import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser, setUser } from "../../store/slices/authSlice";
import { useCheckAuthQuery } from "../../services/Api";
import toast from "react-hot-toast";

const UserProfileCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const { 
    data: authData, 
    isLoading, 
    error, 
    refetch 
  } = useCheckAuthQuery(undefined, {
    skip: !user?.token && !localStorage.getItem('auth_token'),
  });

  const { data: legacyAuthData } = useCheckAuthQuery();

  // Update Redux store with latest user data when it changes
  useEffect(() => {
    if (authData) {
      console.log('UserProfileCard: Received auth data from API:', authData);
      dispatch(setUser(authData));
    } else if (legacyAuthData) {
      console.log('UserProfileCard: Received legacy auth data from API:', legacyAuthData);
      dispatch(setUser(legacyAuthData));
    }
  }, [authData, legacyAuthData, dispatch]);

  const handleRefresh = () => {
    refetch();
    toast.success("Profile data refreshed!");
  };


  // Simple logout function
  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('rememberedCredentials');
    toast.success('Logged out successfully');
    navigate('/login', { replace: true });
  };

  return (
    <div className="max-w-6xl mx-auto mb-8">
      <div
        className="rounded-3xl p-4 border border-[#FFFFFF3B] max-w-6xl w-full"
        style={{
          background: "#FFFFFF33",
          backdropFilter: "blur(1px)",
          boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
        }}
      >
        <div className="flex flex-col lg:flex-row bg-white rounded-xl items-center justify-between p-4 sm:p-6">
          {/* Left Side - Profile Picture and User Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-4 lg:mb-0">
            {/* Profile Icon with Gradient Border */}
            <div className="flex-shrink-0">
              <div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden p-1 flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
                }}
              >
                <div className="w-full h-full rounded-full bg-[#454A67] flex items-center justify-center">
                  {/* Show logo for staff/driver users, "U" for regular users */}
                  {user?.role === 'staff' || user?.role === 'driver' ? (
                    <img
                      src="/logo.svg"
                      alt="Meal Logo"
                      className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                    />
                  ) : (
                    <span className="text-white text-lg sm:text-xl font-bold">U</span>
                  )}
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="text-center sm:text-left">
              {user?.name && (
                <h2 className="text-md md:text-lg font-bold text-[#111827] mb-1">
                  {user.name.toUpperCase()}
                </h2>
              )}
              <p className="text-[#374151B2] font-medium text-sm sm:text-base mb-1">
                {user?.email || 'No email'}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent font-semibold">
                  Role:
                </span>
                <span className="text-xs text-[#6B7280] font-medium capitalize">
                  {user?.role || 'user'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - Member Status Badge */}
          <div className="flex-shrink-0 w-full lg:w-auto">
            <button 
              onClick={handleRefresh}
              disabled={isLoading}
              className="w-full lg:w-auto bg-gradient-to-r from-[#9945FF]/10 to-[#14F195]/10 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-full font-inter font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 relative disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #9945FF 0%, #14F195 100%)",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "exclude",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  padding: "1px",
                }}
              ></div>
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex items-center justify-center relative z-10">
                <svg
                  width="12"
                  height="10"
                  viewBox="0 0 14 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="sm:w-3.5 sm:h-3"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2.97815 3.84097C3.12212 3.87964 3.24484 3.97387 3.31937 4.10297C3.39391 4.23206 3.41415 4.38546 3.37565 4.52947C3.18369 5.2459 3.20849 6.00317 3.44692 6.70551C3.68535 7.40785 4.1267 8.02371 4.71515 8.47521C5.30361 8.9267 6.01273 9.19356 6.75286 9.24202C7.49298 9.29048 8.23085 9.11838 8.87315 8.74747C8.93717 8.71054 9.00784 8.68657 9.08112 8.67695C9.1544 8.66732 9.22886 8.67223 9.30024 8.69138C9.37163 8.71053 9.43854 8.74356 9.49716 8.78857C9.55579 8.83358 9.60497 8.8897 9.6419 8.95372C9.67884 9.01774 9.7028 9.08841 9.71242 9.16169C9.72205 9.23497 9.71714 9.30942 9.69799 9.38081C9.67884 9.45219 9.64581 9.51911 9.6008 9.57773C9.55579 9.63635 9.49967 9.68553 9.43565 9.72247C8.60057 10.2043 7.64137 10.4278 6.6793 10.3646C5.71723 10.3014 4.79549 9.95446 4.03059 9.36752C3.26569 8.78058 2.69198 7.98005 2.38197 7.06711C2.07196 6.15417 2.03957 5.16981 2.2889 4.23847C2.30805 4.1671 2.34106 4.10021 2.38606 4.04161C2.43107 3.983 2.48717 3.93384 2.55118 3.89693C2.61519 3.86002 2.68584 3.83607 2.7591 3.82647C2.83236 3.81687 2.9068 3.8218 2.97815 3.84097ZM4.56065 1.27747C5.3957 0.795211 6.35501 0.571434 7.31725 0.634444C8.27949 0.697454 9.20143 1.04442 9.96645 1.63146C10.7315 2.21849 11.3052 3.01922 11.6151 3.93237C11.925 4.84552 11.9571 5.83006 11.7074 6.76147C11.6688 6.90568 11.5745 7.02866 11.4453 7.10334C11.316 7.17803 11.1624 7.19831 11.0182 7.15972C10.8739 7.12113 10.751 7.02683 10.6763 6.89757C10.6016 6.76831 10.5813 6.61468 10.6199 6.47047C10.8113 5.7542 10.7862 4.99726 10.5477 4.29526C10.3092 3.59327 9.86792 2.97771 9.27973 2.52635C8.69154 2.07499 7.98277 1.80808 7.24296 1.75934C6.50315 1.71059 5.76549 1.88219 5.12315 2.25247C4.99386 2.32706 4.84023 2.34724 4.69606 2.30856C4.55189 2.26988 4.429 2.17551 4.3544 2.04622C4.27981 1.91693 4.25964 1.7633 4.29832 1.61913C4.33699 1.47496 4.43136 1.35206 4.56065 1.27747Z"
                    fill="url(#paint0_linear_838_20510)"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M2.28964 3.60249C2.39511 3.49716 2.53808 3.43799 2.68714 3.43799C2.8362 3.43799 2.97917 3.49716 3.08464 3.60249L4.95964 5.47749C5.01491 5.52899 5.05923 5.59109 5.08998 5.66009C5.12072 5.72909 5.13725 5.80357 5.13858 5.8791C5.13992 5.95463 5.12602 6.02965 5.09773 6.09969C5.06944 6.16973 5.02733 6.23336 4.97392 6.28677C4.92051 6.34019 4.85688 6.38229 4.78684 6.41059C4.7168 6.43888 4.64178 6.45277 4.56625 6.45144C4.49072 6.4501 4.41624 6.43357 4.34724 6.40283C4.27824 6.37209 4.21614 6.32776 4.16464 6.27249L2.68714 4.79499L1.20964 6.27249C1.10301 6.37185 0.961975 6.42595 0.816249 6.42337C0.670523 6.4208 0.531484 6.36177 0.428424 6.25871C0.325365 6.15565 0.266331 6.01661 0.26376 5.87088C0.261188 5.72516 0.315281 5.58412 0.414641 5.47749L2.28964 3.60249ZM9.03964 4.72749C9.14511 4.62216 9.28808 4.56299 9.43714 4.56299C9.5862 4.56299 9.72917 4.62216 9.83464 4.72749L11.3121 6.20499L12.7896 4.72749C12.8411 4.67223 12.9032 4.6279 12.9722 4.59716C13.0412 4.56641 13.1157 4.54988 13.1912 4.54855C13.2668 4.54722 13.3418 4.56111 13.4118 4.5894C13.4819 4.61769 13.5455 4.6598 13.5989 4.71321C13.6523 4.76663 13.6944 4.83025 13.7227 4.9003C13.751 4.97034 13.7649 5.04536 13.7636 5.12088C13.7623 5.19641 13.7457 5.2709 13.715 5.3399C13.6842 5.4089 13.6399 5.471 13.5846 5.52249L11.7096 7.39749C11.6042 7.50283 11.4612 7.562 11.3121 7.562C11.1631 7.562 11.0201 7.50283 10.9146 7.39749L9.03964 5.52249C8.9343 5.41702 8.87514 5.27406 8.87514 5.12499C8.87514 4.97593 8.9343 4.83296 9.03964 4.72749Z"
                    fill="url(#paint1_linear_838_20510)"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_838_20510"
                      x1="2.12305"
                      y1="5.49957"
                      x2="11.8737"
                      y2="5.49957"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#9945FF" />
                      <stop offset="1" stop-color="#14F195" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_838_20510"
                      x1="0.263672"
                      y1="5.49999"
                      x2="13.7637"
                      y2="5.49999"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#9945FF" />
                      <stop offset="1" stop-color="#14F195" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-inter font-medium relative z-10 text-[#6B7280]">
                {isLoading ? 'Refreshing...' : 'Refresh Profile'}
              </span>
            </button>
            
            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="w-full lg:w-auto mt-3 bg-gradient-to-r from-red-500/10 to-red-600/10 text-red-600 py-2 sm:py-3 px-3 sm:px-4 rounded-full font-inter font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 relative"
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #EF4444 0%, #DC2626 100%)",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "exclude",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  padding: "1px",
                }}
              ></div>
              <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex items-center justify-center relative z-10">
                <svg 
                  className="w-3 h-3 sm:w-4 sm:h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                  />
                </svg>
              </div>
              <span className="text-xs sm:text-sm font-inter font-medium relative z-10 text-red-600">
                Logout
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
