import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { Check } from "lucide-react";
import { toastUtils } from "../utils/toastUtils";
import loginBg from "../assets/images/loginbg.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Load saved credentials on component mount
  useEffect(() => {
    const savedCredentials = localStorage.getItem("rememberedCredentials");
    if (savedCredentials) {
      try {
        const { email, password, rememberMe } = JSON.parse(savedCredentials);
        setValue("email", email);
        setValue("password", password);
        setValue("rememberMe", rememberMe);
      } catch (error) {
        console.error("Error loading saved credentials:", error);
        localStorage.removeItem("rememberedCredentials");
      }
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    setError(null);
    const { rememberMe, ...credentials } = data;

    console.log("Attempting login with credentials:", credentials);

    // Show loading toast
    const loadingToast = toastUtils.loading("Signing you in...");

    try {
      const res = await dispatch(login(credentials));
      console.log("Login response:", res);

      // Dismiss loading toast
      toastUtils.dismiss(loadingToast);

      if (res.type === "auth/login/fulfilled") {
        // Handle Remember Me functionality
        if (rememberMe) {
          localStorage.setItem(
            "rememberedCredentials",
            JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              rememberMe: true,
            })
          );
          console.log("Credentials saved for Remember Me");
        } else {
          localStorage.removeItem("rememberedCredentials");
          console.log("Credentials removed from Remember Me");
        }

        const user = res.payload.user;
        const roleName =
          user?.role === "admin"
            ? "admin"
            : user?.role === "company-owner"
            ? "company-owner"
            : user?.role === "driver"
            ? "staff"
            : "user"; // Default to user role
        
        // Determine navigation path
        let navigationPath;
        if (returnUrl) {
          // If user came from a specific page, redirect them back
          navigationPath = returnUrl;
        } else {
          // Default navigation based on role
          navigationPath = 
            user?.role === "admin" || user?.role === "company-owner" || user?.role === "driver"
              ? `/${roleName}/dashboard`
              : "/profile"; // Navigate to profile for regular users
        }
        
        console.log(
          "Login successful, navigating to:", 
          navigationPath
        );

        // Show success toast
        toastUtils.success(`Welcome back, ${user?.name || user?.email}!`);
        
        // Navigate after a small delay to ensure Redux state is updated
        setTimeout(() => {
          navigate(navigationPath);
        }, 100);
      } else if (res.type === "auth/login/rejected") {
        console.error("Login rejected:", res.payload);
        // Extract message from payload if it's an object
        const errorMessage = typeof res.payload === 'object' && res.payload?.message 
          ? res.payload.message 
          : res.payload || "Login failed. Please check your credentials.";
        setError(errorMessage);
      } else {
        console.error("Unexpected response type:", res.type);
        setError("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toastUtils.dismiss(loadingToast);
      setError("An error occurred during login. Please try again.");
    }
  };

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
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/40"></div>
      {/* <div className="absolute inset-0 bg-black/40"></div> */}
      {/* Logo and Title */}
      <div className="flex flex-col items-center justify-center gap-6 mb-16 z-10">
       
        <div>
          <span className="text-white text-4xl md:text-[50px] !font-bold font-inter">
            Log In to{" "}
          </span>
          <span className="text-white text-4xl md:text-[50px] !font-bold font-inter">
            Booking{" "}
            <span className="text-yellow-400">
              Pearl
            </span>
          </span>
        </div>
      </div>

      {/* Blue Glass Effect Background */}
      <div
        className="rounded-3xl p-4 border border-[#FFFFFF3B] max-w-2xl w-full"
        style={{
          background: "#FFFFFF33",
          backdropFilter: "blur(1px)",
          boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
        }}
      >
        <div className="relative z-10 w-full max-w-2xl">
          {/* Login Card with Glass Effect */}
          <div className="relative">
            {/* Glass Effect Background - Same as HeroSection */}
            <div
              className="rounded-3xl p-3 border border-[#FFFFFF3B] max-w-2xl w-full absolute inset-0"
              style={{
                background: "#FFFFFF33",
                backdropFilter: "blur(1px)",
                boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
              }}
            ></div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 relative z-10">

              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-xl font-inter font-normal text-[#374151] mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.04705 20.1615C5.70751 18.6054 7.24954 17.5141 9.04647 17.5141H15.5607C17.3576 17.5141 18.8996 18.6054 19.5601 20.1615M16.6464 9.3713C16.6464 11.7698 14.7021 13.7141 12.3036 13.7141C9.90511 13.7141 7.96076 11.7698 7.96076 9.3713C7.96076 6.97283 9.90511 5.02848 12.3036 5.02848C14.7021 5.02848 16.6464 6.97283 16.6464 9.3713ZM23.1606 12.0856C23.1606 18.0817 18.2998 22.9426 12.3036 22.9426C6.3074 22.9426 1.44653 18.0817 1.44653 12.0856C1.44653 6.08938 6.3074 1.22852 12.3036 1.22852C18.2998 1.22852 23.1606 6.08938 23.1606 12.0856Z"
                          stroke="#374151"
                          stroke-width="1.56341"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Please enter a valid email address",
                        },
                        minLength: {
                          value: 5,
                          message: "Email must be at least 5 characters long",
                        },
                        maxLength: {
                          value: 100,
                          message: "Email must be less than 100 characters",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <span className="text-xs text-red-500 mt-1">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xl font-inter font-normal text-[#374151]">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15.3026 8.93026V6.75885C15.3026 3.76076 12.8722 1.33032 9.87411 1.33032C6.87602 1.33032 4.44559 3.76075 4.44559 6.75885V8.93026M9.87411 13.8159V15.9873M6.39986 20.873H13.3484C15.1725 20.873 16.0846 20.873 16.7813 20.518C17.3942 20.2057 17.8925 19.7075 18.2047 19.0946C18.5598 18.3979 18.5598 17.4858 18.5598 15.6616V14.1416C18.5598 12.3175 18.5598 11.4054 18.2047 10.7087C17.8925 10.0958 17.3942 9.59753 16.7813 9.28526C16.0846 8.93026 15.1725 8.93026 13.3484 8.93026H6.39986C4.5757 8.93026 3.66363 8.93026 2.96689 9.28526C2.35403 9.59753 1.85575 10.0958 1.54348 10.7087C1.18848 11.4054 1.18848 12.3175 1.18848 14.1416V15.6616C1.18848 17.4858 1.18848 18.3979 1.54348 19.0946C1.85575 19.7075 2.35403 20.2057 2.96689 20.518C3.66363 20.873 4.5757 20.873 6.39986 20.873Z"
                          stroke="#374151"
                          stroke-width="1.56341"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                        maxLength: {
                          value: 128,
                          message: "Password must be less than 128 characters",
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <HiOutlineEyeOff className="h-5 w-5 text-[#374151] hover:text-[#374151]/80" />
                      ) : (
                        <HiOutlineEye className="h-5 w-5 text-[#374151] hover:text-[#374151]/80" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-xs text-red-500 mt-1">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <button
                    type="button"
                    className={`relative w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-md transition-colors ${
                      watch("rememberMe")
                        ? "bg-gradient-to-r from-[#9945FF] to-[#14F195] border-0"
                        : "bg-white border border-gray-300 hover:border-purple-500"
                    }`}
                    onClick={() => {
                      const currentValue = watch("rememberMe");
                      setValue("rememberMe", !currentValue);
                    }}
                  >
                    {watch("rememberMe") && (
                      <Check className="w-3.5 h-3.5 text-white pointer-events-none" />
                    )}
                  </button>
                  <input
                    type="checkbox"
                    className="hidden"
                    {...register("rememberMe")}
                  />
                  <span className="ml-2 text-lg font-inter font-normal text-[#374151]">
                    Remember Me
                  </span>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
                    {error}
                  </div>
                )}

                {/* Login Button */}
                <button
                  disabled={auth.loading}
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white py-4 font-medium rounded-full text-xl hover:from-[#9945FF] hover:to-[#14F195] transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {auth.loading ? "Signing In..." : "Log In"}
                </button>
              </form>

            </div>
          </div>
        </div>
      </div>
   
    </div>
  );
};

export default Login;
