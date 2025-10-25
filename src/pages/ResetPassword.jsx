import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import loginBg from "../assets/images/loginbg.png";
import { BiSolidCheckCircle } from "react-icons/bi";
import { EnvelopeIcon } from "../assets/icons/icons";
import { useResetPasswordMutation } from "../services/Api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // API mutation hook
  const [resetPassword, { isLoading: isApiLoading }] = useResetPasswordMutation();

  // Handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await resetPassword({
        data: {
          token: token,
          newPassword: newPassword,
          confirmPassword: confirmPassword
        }
      }).unwrap();

      // If API call is successful
      if (response) {
        setIsSuccess(true);
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setError(
        error?.data?.message || 
        error?.message || 
        "Failed to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle success redirect
  const handleSuccessRedirect = () => {
    navigate("/login");
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


      {/* Logo and Title */}
      <div className="flex flex-col items-center justify-center gap-6 mb-4 z-10">
        <svg
          width="41"
          height="40"
          viewBox="0 0 41 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.4297 0C31.4754 0 40.4297 8.9543 40.4297 20C40.4297 31.0457 31.4754 40 20.4297 40C9.38399 40 0.429688 31.0457 0.429688 20C0.429688 8.9543 9.38399 0 20.4297 0C20.4297 15 7.09635 20 0.429688 20C15.4297 20 20.4297 33.3333 20.4297 40C20.4297 25 33.763 20 40.4297 20C25.4297 20 20.4297 6.66667 20.4297 0Z"
            fill="url(#paint0_linear_573_10507)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_573_10507"
              x1="0.429688"
              y1="20"
              x2="40.4297"
              y2="20"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#9945FF" />
              <stop offset="1" stopColor="#14F195" />
            </linearGradient>
          </defs>
        </svg>
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-white text-4xl md:text-[50px] !font-bold font-inter">
            Reset{" "}
          </span>
          <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent text-4xl md:text-[50px] !font-bold font-inter">
            Password
          </span>
        </div>
      </div>

      {/* Blue Glass Effect Background */}
      <div
        className="rounded-3xl p-4 border border-[#FFFFFF3B] max-w-lg w-full mx-auto"
        style={{
          background: "#FFFFFF33",
          backdropFilter: "blur(1px)",
          boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
        }}
      >
        <div className="relative z-10 w-full max-w-lg mx-auto">
          {/* Main Card with Glass Effect */}
          <div className="relative">
            {/* Glass Effect Background */}
            <div
              className="rounded-3xl p-3 border border-[#FFFFFF3B] max-w-lg w-full absolute inset-0 mx-auto"
              style={{
                background: "#FFFFFF33",
                backdropFilter: "blur(1px)",
                boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
              }}
            ></div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 relative z-10">
              {isSuccess ? (
                <div className="text-center space-y-4">
                  <div className="flex justify-center mb-4 text-[#14F195]">
                    <BiSolidCheckCircle className="w-20 h-20" />
                  </div>
                  <h3 className="text-2xl font-medium font-inter text-[#374151]">
                    Password Reset Successful!
                  </h3>
                  <p className="text-[#374151B2] font-normal font-inter text-xl text-center">
                    Redirecting to login page...
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-center">
                    <h2 className="text-2xl font-medium font-inter text-[#374151] mb-6">
                      Reset Password
                    </h2>
                    <p className="text-[#374151B2] font-normal font-inter text-xl mb-10">
                      Enter and confirm your new password to secure your
                      account.
                    </p>
                    {!token && (
                      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-6">
                        ⚠️ Invalid reset link. Please check your email and click the reset link again.
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleResetPassword} className="space-y-6">
                    <div>
                      <label className="block text-xl font-inter font-normal text-[#374151] mb-2">
                        Password
                      </label>
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
                              strokeWidth="1.56341"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                          placeholder="Password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-5 w-5 text-[#374151] hover:text-[#374151]/80" />
                          ) : (
                            <Eye className="h-5 w-5 text-[#374151] hover:text-[#374151]/80" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xl font-inter font-normal text-[#374151] mb-2">
                        Confirm Password
                      </label>
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
                              strokeWidth="1.56341"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                          placeholder="Confirm Password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-[#374151] hover:text-[#374151]/80" />
                          ) : (
                            <Eye className="h-5 w-5 text-[#374151] hover:text-[#374151]/80" />
                          )}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={
                        isLoading ||
                        newPassword !== confirmPassword ||
                        newPassword.length < 6
                      }
                      className="w-full bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white py-3 rounded-full text-xl font-medium font-inter hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                  </form>

                  {/* Sign Up Link */}
                  <div className="text-center mt-16">
                    <span className="text-[#374151] font-inter text-xl md:text-2xl">
                      Don't have an account?{" "}
                    </span>
                    <Link
                      to="/signup"
                      className="font-normal text-xl md:text-2xl font-inter bg-[linear-gradient(90deg,_#9945FF_0%,_#14F195_100%)] bg-clip-text text-transparent"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-8 flex justify-between text-sm text-white/60 z-10">
        <div className="flex space-x-4">
          <Link to="/terms" className="hover:text-white transition-colors">
            Terms
          </Link>
          <span>•</span>
          <Link to="/privacy" className="hover:text-white transition-colors">
            Privacy
          </Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-white transition-colors">
            Docs
          </Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-white transition-colors">
            Helps
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          <span>🌐</span>
          <span>English</span>
          <span>▼</span>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
