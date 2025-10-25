import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../store/slices/authSlice";
import { strongPasswordRegex } from "../utils/constants";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { Check } from "lucide-react";
import { toastUtils } from "../utils/toastUtils";
import loginBg from "../assets/images/loginbg.png";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get('returnUrl');
  const { auth } = useSelector((state) => state);

  // Handle redirect after successful signup
  useEffect(() => {
    if (auth?.isAuthenticated && auth?.user) {
      const userRole = auth.user.role;
      console.log("Signup redirect - User role:", userRole);
      console.log("Signup redirect - User object:", auth.user);
      
      let navigationPath;
      
      if (returnUrl) {
        // If user came from a specific page, redirect them back
        navigationPath = returnUrl;
      } else {
        // Default navigation based on role
        if (userRole === "admin") {
          navigationPath = "/admin/dashboard";
        } else if (userRole === "company-owner") {
          navigationPath = "/company/dashboard";
        } else if (userRole === "driver") {
          navigationPath = "/driver/dashboard";
        } else if (userRole === "user") {
          navigationPath = "/profile";
        } else {
          // For any other role, also go to profile
          navigationPath = "/profile";
        }
      }
      
      console.log("Signup redirect - Navigation path:", navigationPath);
      
      // Navigate after a short delay to allow state to settle
      setTimeout(() => {
        console.log("Signup redirect - Navigating to:", navigationPath);
        navigate(navigationPath);
      }, 100);
    }
  }, [auth?.isAuthenticated, auth?.user, navigate, returnUrl]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      marketingEmails: true,
      termsAccepted: false,
    },
  });

  const onSubmit = async (values) => {
    setError(null);
    setSuccessMessage(null);
    const data = { ...values };
    // Keep confirmPassword for server validation
    // delete data.confirmPassword;
    delete data.marketingEmails;
    delete data.termsAccepted;

    data.joinAs = "customer";

    // Validate required fields
    console.log("Form data validation:", {
      name: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      nameLength: data.name?.length,
      emailLength: data.email?.length,
      passwordLength: data.password?.length,
      confirmPasswordLength: data.confirmPassword?.length,
    });

    if (!data.name || !data.email || !data.password || !data.confirmPassword) {
      console.log("Validation failed - missing fields:", {
        name: !!data.name,
        email: !!data.email,
        password: !!data.password,
        confirmPassword: !!data.confirmPassword,
      });
      toastUtils.error("Please fill in all required fields.");
      setError("Please fill in all required fields.");
      return;
    }

    // Validate password match
    if (data.password !== data.confirmPassword) {
      console.log("Password mismatch:", {
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      toastUtils.error("Passwords do not match.");
      setError("Passwords do not match.");
      return;
    }


    // Show loading toast
    const loadingToast = toastUtils.loading("Creating your account...");

    try {
      console.log("Sending signup data:", data);
      const result = await dispatch(signup(data));


      // Dismiss loading toast
      toastUtils.dismiss(loadingToast);

      if (result.type === "auth/signup/fulfilled") {
        console.log("Signup successful");
        setIsSubmitted(true);
        setSuccessMessage(
          result.payload.message ||
            "Account created successfully! Please check your email for verification."
        );
        // Optionally redirect to login after a delay
        // setTimeout(() => navigate("/login"), 3000);
      } else if (result.type === "auth/signup/rejected") {
        

        let errorMessage = "Signup failed. Please try again.";
        if (result.error && result.error.data) {
          errorMessage =
            result.error.data.message || result.error.data || errorMessage;
        } else if (result.payload && result.payload !== "Signup failed") {
          errorMessage = result.payload;
        }

        setError(errorMessage);
      } else {
        console.error("Unexpected response type:", result.type);
        setError("An unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toastUtils.dismiss(loadingToast);
      setError("An error occurred during signup. Please try again.");
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
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="flex flex-col items-center justify-center gap-6 mb-16 z-10">
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
        <div>
          <span className="text-white text-4xl md:text-[50px] !font-bold font-inter">
            Sign Up to{" "}
          </span>
          <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent text-4xl md:text-[50px] !font-bold font-inter">
            MealCheap
          </span>
        </div>
      </div>

      <div
        className="rounded-3xl p-4 border border-[#FFFFFF3B] max-w-2xl w-full"
        style={{
          background: "#FFFFFF33",
          backdropFilter: "blur(1px)",
          boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
        }}
      >
        <div className="relative z-10 w-full max-w-[760px]">
          <div className="relative">
            <div
              className="rounded-3xl p-3 border border-[#FFFFFF3B] max-w-2xl w-full absolute inset-0"
              style={{
                background: "#FFFFFF33",
                backdropFilter: "blur(1px)",
                boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
              }}
            ></div>

            <div className="bg-white rounded-2xl shadow-2xl p-8 relative z-10">
              {/* External Signup Options */}
              {/* External Signup Options */}
              <div className="mb-6">
                <h3 className="text-[#374151] font-normal text-xl md:text-2xl mb-4 text-center">
                  Sign Up with:
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 text-md font-inter font-semibold text-[#374151] hover:bg-gray-50 transition-colors">
                    <div className="w-5 h-5 items-center justify-center">
                      <svg
                        width="23"
                        height="23"
                        viewBox="0 0 23 23"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M11.4206 1.64584C16.8592 1.64584 21.2747 6.06143 21.2747 11.5C21.2747 16.9386 16.8592 21.3542 11.4206 21.3542C5.98199 21.3542 1.56641 16.9386 1.56641 11.5C1.56641 6.06143 5.98199 1.64584 11.4206 1.64584ZM12.7461 5.42251C12.7635 5.28043 12.6792 5.14476 12.5435 5.09893C12.4078 5.05309 12.2584 5.10901 12.186 5.23276L7.91524 12.5542C7.86116 12.6477 7.86024 12.7632 7.91432 12.8567C7.96749 12.9502 8.06741 13.0079 8.17557 13.0079H10.6662L10.0951 17.5775C10.0777 17.7196 10.162 17.8553 10.2977 17.9011C10.4333 17.9469 10.5827 17.891 10.6552 17.7673L14.9259 10.4458C14.98 10.3523 14.9809 10.2368 14.9268 10.1433C14.8737 10.0498 14.7737 9.99209 14.6656 9.99209H12.175L12.7461 5.42251Z"
                          fill="#F7931A"
                        />
                      </svg>
                    </div>
                    <span className="hidden sm:inline">Lightning</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 text-md font-inter font-semibold text-[#374151] hover:bg-gray-50 transition-colors">
                    <div className="w-5 h-5 items-center justify-center">
                      <svg
                        width="23"
                        height="22"
                        viewBox="0 0 23 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_535_180460)">
                          <path
                            d="M11.3069 0.257812C5.37415 0.257812 0.564697 5.06726 0.564697 11C0.564697 16.9327 5.37415 21.7422 11.3069 21.7422C17.2396 21.7422 22.0491 16.9327 22.0491 11C22.0491 5.06726 17.2396 0.257812 11.3069 0.257812ZM11.4372 16.9247C8.00401 16.9247 5.4401 14.3832 5.4401 11.0092C5.4401 7.61647 8.00409 5.07491 11.4372 5.07491C14.3935 5.07491 16.6828 7.02608 17.1412 9.88608H13.9929C13.6057 8.72927 12.6311 7.97827 11.444 7.97827C9.84685 7.97827 8.67535 9.26252 8.67535 11.0091C8.67535 12.7488 9.84685 14.0145 11.444 14.0145C12.6955 14.0145 13.6794 13.199 13.9954 11.9456H17.1737C16.7448 14.9115 14.4416 16.9247 11.4372 16.9247Z"
                            fill="#0052FF"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_535_180460">
                            <rect
                              width="22"
                              height="22"
                              fill="white"
                              transform="translate(0.306885)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <span className="hidden sm:inline">Wallet</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 text-md font-inter font-semibold text-[#374151] hover:bg-gray-50 transition-colors">
                    <div className="w-5 h-5 items-center justify-center">
                      <svg
                        width="21"
                        height="20"
                        viewBox="0 0 21 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_535_180465)">
                          <path
                            d="M7.16045 0.65781C5.16214 1.35104 3.4388 2.66682 2.24356 4.41187C1.04832 6.15693 0.444183 8.23928 0.519888 10.3531C0.595592 12.4669 1.34715 14.5007 2.66416 16.1557C3.98117 17.8108 5.79423 18.9999 7.83701 19.5484C9.49314 19.9758 11.2283 19.9945 12.8933 19.6031C14.4016 19.2643 15.796 18.5396 16.9401 17.5C18.1309 16.3849 18.9952 14.9664 19.4401 13.3969C19.9238 11.6901 20.0098 9.8952 19.6917 8.15H10.3917V12.0078H15.7776C15.67 12.6231 15.4393 13.2104 15.0994 13.7344C14.7595 14.2585 14.3174 14.7086 13.7995 15.0578C13.1418 15.4929 12.4004 15.7856 11.6229 15.9172C10.8432 16.0622 10.0433 16.0622 9.26357 15.9172C8.47324 15.7538 7.7256 15.4276 7.06826 14.9594C6.01224 14.2119 5.21932 13.1499 4.80263 11.925C4.37891 10.6772 4.37891 9.32438 4.80263 8.07656C5.09924 7.2019 5.58956 6.40552 6.23701 5.74687C6.97793 4.97929 7.91597 4.43062 8.94819 4.16105C9.98041 3.89149 11.0669 3.91145 12.0886 4.21875C12.8866 4.46373 13.6165 4.89177 14.2198 5.46875C14.8271 4.86458 15.4334 4.25885 16.0386 3.65156C16.3511 3.325 16.6917 3.01406 16.9995 2.67968C16.0785 1.82262 14.9974 1.15571 13.8183 0.717185C11.6709 -0.0625188 9.32135 -0.0834726 7.16045 0.65781Z"
                            fill="white"
                          />
                          <path
                            d="M7.16045 0.657806C9.32117 -0.08398 11.6707 -0.0635778 13.8183 0.715618C14.9977 1.15712 16.0782 1.82724 16.9979 2.68749C16.6854 3.02187 16.3558 3.33437 16.037 3.65937C15.4308 4.26458 14.825 4.8677 14.2198 5.46874C13.6165 4.89177 12.8867 4.46373 12.0886 4.21874C11.0673 3.91037 9.98079 3.88926 8.94829 4.15772C7.91579 4.42618 6.97719 4.97384 6.23545 5.74062C5.588 6.39927 5.09768 7.19564 4.80107 8.07031L1.56201 5.56249C2.7214 3.26337 4.72881 1.50472 7.16045 0.657806Z"
                            fill="#E33629"
                          />
                          <path
                            d="M0.702657 8.04688C0.876752 7.18405 1.16579 6.34848 1.56203 5.5625L4.80109 8.07656C4.37737 9.32438 4.37737 10.6772 4.80109 11.925C3.72193 12.7583 2.64224 13.5958 1.56203 14.4375C0.57008 12.463 0.267551 10.2133 0.702657 8.04688Z"
                            fill="#F8BD00"
                          />
                          <path
                            d="M10.3917 8.14844H19.6917C20.0098 9.89365 19.9237 11.6885 19.4401 13.3953C18.9952 14.9648 18.1309 16.3834 16.9401 17.4984C15.8948 16.6828 14.8448 15.8734 13.7995 15.0578C14.3177 14.7082 14.7601 14.2576 15.1 13.733C15.4399 13.2084 15.6704 12.6205 15.7776 12.0047H10.3917C10.3901 10.7203 10.3917 9.43437 10.3917 8.14844Z"
                            fill="#587DBD"
                          />
                          <path
                            d="M1.56042 14.4375C2.64063 13.6042 3.72032 12.7667 4.79949 11.925C5.217 13.1503 6.01106 14.2123 7.06824 14.9594C7.72762 15.4254 8.47688 15.7489 9.26824 15.9094C10.048 16.0544 10.8478 16.0544 11.6276 15.9094C12.4051 15.7778 13.1465 15.485 13.8042 15.05C14.8495 15.8656 15.8995 16.675 16.9448 17.4906C15.8009 18.5308 14.4064 19.2561 12.8979 19.5953C11.2329 19.9867 9.49781 19.9679 7.84167 19.5406C6.53183 19.1909 5.30836 18.5744 4.24792 17.7297C3.12552 16.8386 2.20879 15.7156 1.56042 14.4375Z"
                            fill="#319F43"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_535_180465">
                            <rect
                              width="20"
                              height="20"
                              fill="white"
                              transform="translate(0.193237)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <span className="hidden sm:inline">Google</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 text-md font-inter font-semibold text-[#374151] hover:bg-gray-50 transition-colors">
                    <div className="w-5 h-5 items-center justify-center">
                      <svg
                        width="19"
                        height="21"
                        viewBox="0 0 19 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M15.5601 20.1575C14.397 21.2656 13.1272 21.0907 11.9048 20.5657C10.6112 20.0291 9.42441 20.0058 8.05961 20.5657C6.35065 21.289 5.44869 21.079 4.42806 20.1575C-1.36343 14.2899 -0.508948 5.35432 6.06582 5.0277C7.66797 5.10935 8.78355 5.89092 9.7211 5.96091C11.1215 5.68095 12.4626 4.87605 13.9579 4.98104C15.75 5.12102 17.1029 5.82093 17.993 7.08077C14.2902 9.26216 15.1684 14.0566 18.5626 15.3981C17.8862 17.1478 17.0079 18.886 15.5482 20.1691L15.5601 20.1575ZM9.60243 4.95771C9.42441 2.35637 11.5725 0.209973 14.041 0C14.3852 3.00962 11.2639 5.24934 9.60243 4.95771Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                    <span className="hidden sm:inline">Apple</span>
                  </button>
                </div>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-xl font-inter font-normal text-[#374151] mb-2">
                    Name
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
                          d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                          stroke="#374151"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                          stroke="#374151"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Name"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                      {...register("name", {
                        required: "Name is required",
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters long",
                        },
                        maxLength: {
                          value: 50,
                          message: "Name must be less than 50 characters",
                        },
                        pattern: {
                          value: /^[a-zA-Z\s]+$/,
                          message: "Name can only contain letters and spaces",
                        },
                      })}
                    />
                  </div>
                  {errors.name && (
                    <span className="text-xs text-red-500 mt-1">
                      {errors.name.message}
                    </span>
                  )}
                </div>

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
                    {/* <Link
                      to="/forget-password"
                      className="text-lg font-inter font-normal text-[#374151] hover:text-purple-600 transition-colors"
                    >
                      Forgot Password?
                    </Link> */}
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
                        pattern: {
                          value: strongPasswordRegex,
                          message:
                            "Password must include uppercase, lowercase, and number",
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

                {/* Confirm Password Field */}
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
                          stroke-width="1.56341"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        minLength: {
                          value: 8,
                          message:
                            "Confirm password must be at least 8 characters",
                        },
                        validate: (value) =>
                          value === watch("password") ||
                          "Passwords do not match",
                      })}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <HiOutlineEyeOff className="h-5 w-5 text-[#374151] hover:text-[#374151]/80" />
                      ) : (
                        <HiOutlineEye className="h-5 w-5 text-[#374151] hover:text-[#374151]/80" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="text-xs text-red-500 mt-1">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <div className="flex items-start">
                    <button
                      type="button"
                      className={`relative w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-md transition-colors mt-0.5 ${
                        watch("marketingEmails")
                          ? "bg-gradient-to-r from-[#9945FF] to-[#14F195] border-0"
                          : "bg-white border border-gray-300 hover:border-purple-500"
                      }`}
                      onClick={() => {
                        const currentValue = watch("marketingEmails");
                        setValue("marketingEmails", !currentValue);
                      }}
                    >
                      {watch("marketingEmails") && (
                        <Check className="w-3.5 h-3.5 text-white pointer-events-none" />
                      )}
                    </button>
                    <input
                      type="checkbox"
                      className="hidden"
                      {...register("marketingEmails")}
                    />
                    <span className="ml-2 text-md text-[#374151]">
                      Get exclusive deals and product updates delivered straight
                      to your inbox. Unsubscribe anytime
                    </span>
                  </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                  <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
                    {successMessage}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
                    {error}
                  </div>
                )}

                {/* Terms and Conditions */}
                <div className="text-md text-[#374151] text-center py-8">
                  By clicking 'Create Account', you agree to our{" "}
                  <a
                    href="/terms"
                    className="font-semibold text-[#374151] hover:text-[#374151]/80"
                  >
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="font-semibold text-[#374151] hover:text-[#374151]/80"
                  >
                    Privacy Policy
                  </a>
                </div>

                {/* Create Account Button */}
                <button
                  disabled={auth.loading || isSubmitted}
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white py-4 font-medium rounded-full text-xl hover:from-[#9945FF] hover:to-[#14F195] transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {auth.loading
                    ? "Creating Account..."
                    : isSubmitted
                    ? "Account Created!"
                    : "Create Account"}
                </button>
              </form>

              {/* Login Link */}
              <div className="text-center mt-6">
                <span className="text-[#374151] text-xl md:text-2xl">
                  Already have an Account?{" "}
                </span>
                <Link
                  to="/login"
                  className="font-normal text-xl md:text-2xl bg-[linear-gradient(90deg,_#9945FF_0%,_#14F195_100%)] bg-clip-text text-transparent"
                >
                  Login
                </Link>
              </div>
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

export default SignUp;
