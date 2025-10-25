import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import loginBg from "../assets/images/loginbg.png";
import { BiSolidCheckCircle } from "react-icons/bi";
import { EnvelopeIcon } from "../assets/icons/icons";
import { useForgetPasswordMutation } from "../services/Api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState(["", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // API mutation hook
  const [forgetPassword, { isLoading: isApiLoading }] = useForgetPasswordMutation();

  // Handle email submission
  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await forgetPassword({
        data: {
          email: email
        }
      }).unwrap();

      // If API call is successful
      if (response) {
        setCurrentStep(2);
      }
    } catch (error) {
      // Handle API error
      console.error("Forgot password error:", error);
      setError(
        error?.data?.message || 
        error?.message || 
        "Failed to send reset link. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle code input
  const handleCodeChange = (index, value) => {
    // Only allow digits
    const digitOnly = value.replace(/[^0-9]/g, "");

    if (digitOnly.length <= 1) {
      const newCode = [...resetCode];
      newCode[index] = digitOnly;
      setResetCode(newCode);

      // Auto-focus next input
      if (digitOnly && index < 4) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  // Handle code verification
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const code = resetCode.join("");
    if (code.length !== 5) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(3);
    }, 1000);
  };

  // Handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword || newPassword.length < 6) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      // Redirect to login after successful password reset
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }, 1000);
  };

  // Handle resend code
  const handleResendCode = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Show success message
      console.log("Code resent successfully");
    }, 1000);
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
      <div className="flex flex-col items-center justify-center gap-6 mb-8 z-10">
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
        <div className="flex items-center justify-center gap-2 mb-10">
          <span className="text-white text-4xl md:text-[50px] !font-bold font-inter">
            Forget{" "}
          </span>
          <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent text-4xl md:text-[50px] !font-bold font-inter">
            Password
          </span>
        </div>
      </div>

      {/* Blue Glass Effect Background */}
      <div
        className="rounded-3xl p-4 border border-[#FFFFFF3B] max-w-2xl w-full mx-auto"
        style={{
          background: "#FFFFFF33",
          backdropFilter: "blur(1px)",
          boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
        }}
      >
        <div className="relative z-10 w-full max-w-2xl mx-auto">
          {/* Main Card with Glass Effect */}
          <div className="relative">
            {/* Glass Effect Background */}
            <div
              className="rounded-3xl p-3 border border-[#FFFFFF3B] max-w-2xl w-full absolute inset-0 mx-auto"
              style={{
                background: "#FFFFFF33",
                backdropFilter: "blur(1px)",
                boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
              }}
            ></div>

            <div className="bg-white  rounded-2xl shadow-2xl p-8 relative z-10">
              {/* Step 1: Email Input */}
              {currentStep === 1 && (
                <div>
                  <div className="text-center">
                    <h2 className="text-2xl font-medium font-inter text-[#374151] mb-6">
                      Reset Password
                    </h2>
                    <p className="text-[#374151B2] font-normal font-inter text-xl mb-10">
                      Enter your email address, and we’ll send you a password
                      reset link to create a new password.
                    </p>
                  </div>
                  <form onSubmit={handleSendCode} className="space-y-6">
                    <div>
                      <label className="block text-xl font-inter font-normal text-[#374151] mb-2">
                        Enter Email
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                          <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                        </div>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (error) setError(""); // Clear error when user starts typing
                          }}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Email"
                          required
                        />
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading || isApiLoading || !email}
                      className="w-full bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white py-3 rounded-full text-xl font-medium font-inter hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading || isApiLoading ? "Sending..." : "Send Link"}
                    </button>

                    <Link
                      to="/login"
                      className="w-full relative py-7 rounded-full text-xl font-medium font-inter transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-full p-[2px]">
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center px-6">
                          <span className="text-black relative z-10 text-xl font-medium font-inter flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                          </span>
                        </div>
                      </div>
                    </Link>
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

              {/* Step 2: Code Verification */}
              {currentStep === 2 && (
                <div className="text-center">
                  <h2 className="text-2xl font-medium font-inter text-[#374151] mb-16">
                    Reset Password
                  </h2>

                  {/* Success Icon */}
                  <div className="flex justify-center mb-2 text-[#14F195]">
                    <BiSolidCheckCircle className="w-16 h-16" />
                  </div>

                  <p className="text-[#374151] w-[70%] mx-auto font-normal font-inter text-xl mb-8 text-center">
                    Check your inbox—we've sent you a password reset link at <strong>{email}</strong>. Click
                    the link to create a new password.
                  </p>

                  {/* <form onSubmit={handleVerifyCode} className="space-y-6 mb-16">
                    <div>
                      <div className="flex justify-center gap-3">
                        {resetCode.map((digit, index) => (
                          <div key={index} className="relative w-12 h-12">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-full p-[2px]">
                              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                <input
                                  id={`code-${index}`}
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  maxLength="1"
                                  value={digit}
                                  onChange={(e) =>
                                    handleCodeChange(index, e.target.value)
                                  }
                                  className="w-full h-full text-center text-lg font-semibold bg-transparent border-0 outline-none focus:outline-none"
                                  placeholder=""
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white py-3 rounded-full text-xl font-medium font-inter hover:shadow-lg transition-all duration-200"
                    >
                      {isLoading ? "Verifying..." : "Continue"}
                    </button>

                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isLoading}
                      className="w-full relative py-7 rounded-full text-xl font-medium font-inter transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-full p-[2px]">
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center px-6">
                          <span className="text-black relative z-10 text-xl font-medium font-inter flex items-center gap-2">
                            {isLoading ? "Sending..." : "Resend Code"}
                          </span>
                        </div>
                      </div>
                    </button>
                  </form> */}

                  {/* Sign Up Link */}
                  <div className="text-center mt-6">
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

              {/* Step 3: Password Reset */}
              {currentStep === 3 && (
                <div>
                  <div className="text-center">
                    <h2 className="text-2xl font-medium font-inter text-[#374151] mb-6">
                      Reset Password
                    </h2>
                    <p className="text-[#374151B2] font-normal font-inter text-xl mb-10">
                      Enter and confirm your new password to secure your
                      account.
                    </p>
                  </div>
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
                  )}

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

      {/* Footer */}
      <div className="w-full max-w-2xl mx-auto mt-8 text-[#94A3B8] text-base z-10 px-2">
        <div className="flex flex-wrap items-center justify-between gap-y-2">
          {/* Left links */}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <a href="/terms" className="hover:text-white transition-colors">
              Terms
            </a>
            <span>•</span>
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </a>
            <span>•</span>
            <a href="/docs" className="hover:text-white transition-colors">
              Docs
            </a>
            <span>•</span>
            <a href="/help" className="hover:text-white transition-colors">
              Help
            </a>
          </div>

          {/* Right language selector */}
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>English</span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
