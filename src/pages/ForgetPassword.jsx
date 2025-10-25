import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slices/authSlice";
import ReusableInput from "../components/ReusableInput";
import { main_logo } from "../assets/logos";
import {
  lock,
  poly_layer,
  polygon_one,
  polygon_three,
  polygon_two,
  white_lock,
} from "../assets/icons";
import { CornerUpLeft } from "lucide-react";
import { useForgetPasswordMutation } from "../services/Api";
import toast from "react-hot-toast";

const ForgetPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [forgetPassword] = useForgetPasswordMutation();
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitted(true);
    const formData = {
      email: data.email,
    };
    setError(null);
    setSuccessMessage(null);

    // Show loading toast
    const loadingToast = toast.loading("Sending reset instructions...");

    try {
      const res = await forgetPassword({ data: formData }).unwrap();
      console.log(res, "res in forget password");

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (res.success) {
        setIsSubmitted(false);
        // Show success toast
        toast.success(res?.message || "Reset instructions sent to your email!");
        setSuccessMessage(res?.message);
        reset();
      } else {
        setIsSubmitted(false);
        toast.error(res?.error || "Failed to send reset instructions");
        setError(res?.error);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.dismiss(loadingToast);
      const errorMessage =
        error.data?.error ||
        "Failed to send reset instructions. Please try again.";
      toast.error(errorMessage);
      setError(errorMessage);
      setIsSubmitted(false);
    }
  };

  return (
    <div className="bg-primary relative flex items-center justify-center min-h-screen">
      <img
        src={polygon_one}
        alt=""
        className="absolute top-0 right-0 md:h-auto h-[30%] "
      />
      <img
        src={polygon_two}
        alt=""
        className="absolute bottom-0 left-0 md:h-auto h-[20%] "
      />
      <img
        src={polygon_three}
        alt=""
        className="absolute bottom-0 left-[40%] translate-x-[-50%]"
      />
      <img
        src={poly_layer}
        alt=""
        className="absolute top-4 right-[8%] z-0 md:w-[10.875rem] w-[6.875rem] md:h-auto h-[15%] "
      />
      <img
        src={poly_layer}
        alt=""
        className="absolute md:bottom-[8%] bottom-[1%] left-[10%] z-0 md:w-[6.875rem] w-[4.875rem] md:h-auto h-[20%] "
      />
      <div className="md:max-w-4xl w-full md:mx-auto z-10 ">
        {/* Right Panel (Login Form) */}
        <div className="flex flex-1 justify-center items-center py-12 md:px-0 px-8">
          <div className="w-full md:max-w-[24.4375rem] md:md:bg-white bg-transparent  rounded-2xl md:shadow-lg md:p-8 p-0">
            <img
              src={main_logo}
              alt="Logo"
              className="w-28 mb-6 block md:hidden"
            />
            <img src={lock} alt="Logo" className="w-12 mb-6 hidden md:block " />
            <img
              src={white_lock}
              alt="Logo"
              className="w-12 mb-6 block md:hidden "
            />
            <div className="mb-8">
              <h2 className="text-[1.3413rem] font-bold md:text-primary text-white mb-2">
                Forgot Password?
              </h2>
              <div className="text-[0.6813rem] md:text-primary text-white font-normal mb-6 tracking-wide">
                No worries, we’ll send you the reset instructions.
              </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="">
              {successMessage ? (
                <span className="text-xs text-green mt-1">
                  {successMessage}
                </span>
              ) : (
                <>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      placeholder=" "
                      className="px-4 py-3 rounded-md border-[0.0531rem] md:border-primary md:focus:border-primary focus:border-white focus:ring-1 focus:ring-primary md:text-primary text-white w-full h-12 md:bg-white bg-transparent peer placeholder-transparent"
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                        maxLength: {
                          message: "E-Mail must be less than 50 characters",
                          value: 50,
                        },
                      })}
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-4 -top-2.5 md:bg-white bg-primary px-1 text-[0.6813rem] md:text-primary text-white transition-all 
                                                  peer-placeholder-shown:top-3.5 md:peer-placeholder-shown:text-primary peer-placeholder-shown:text-white 
                                                  peer-focus:-top-2.5 peer-focus:text-[0.6813rem] md:peer-focus:text-primary peer-focus:text-white"
                    >
                      Email
                    </label>
                    {errors.email && (
                      <span className="text-xs text-red-500 mt-1">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  {error && (
                    <span className="text-xs block py-1 text-red mt-1">
                      {error}
                    </span>
                  )}
                  <br />
                  <button
                    disabled={auth.loading}
                    type="submit"
                    className="w-full bg-secondary text-white py-4 font-bold rounded-md text-[0.6813rem] font-inter hover:bg-secondary-600 transition-colors"
                  >
                    {isSubmitted ? "Loading..." : "Reset Password"}
                  </button>
                </>
              )}
              <Link
                to="/"
                className="flex gap-1 items-center w-fit mt-4 text-[0.6813rem] md:text-primary text-white hover:underline font-medium"
              >
                <svg
                  width="14"
                  height="12"
                  viewBox="0 0 14 12"
                  className="hidden md:block"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.16646 4.83569L0.903902 5.09825L0.64209 4.83569L0.903902 4.57314L1.16646 4.83569ZM13.4042 10.7691C13.4042 10.8675 13.3651 10.9618 13.2955 11.0313C13.226 11.1009 13.1317 11.14 13.0333 11.14C12.935 11.14 12.8406 11.1009 12.7711 11.0313C12.7015 10.9618 12.6625 10.8675 12.6625 10.7691H13.4042ZM4.6123 8.80664L0.903902 5.09825L1.42901 4.57314L5.13741 8.28153L4.6123 8.80664ZM0.903902 4.57314L4.6123 0.864746L5.13741 1.38985L1.42901 5.09825L0.903902 4.57314ZM1.16646 4.46486H8.58324V5.20653H1.16646V4.46486ZM13.4042 9.28577V10.7691H12.6625V9.28577H13.4042ZM8.58324 4.46486C9.86183 4.46486 11.088 4.97277 11.9921 5.87687C12.8962 6.78096 13.4042 8.00718 13.4042 9.28577H12.6625C12.6625 8.20389 12.2327 7.16632 11.4677 6.40131C10.7027 5.63631 9.66512 5.20653 8.58324 5.20653V4.46486Z"
                    fill="#191D31"
                  />
                </svg>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  className="md:hidden block"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.35452 6.59307L2.14614 6.80144L1.93835 6.59307L2.14614 6.38469L2.35452 6.59307ZM12.067 11.3021C12.067 11.3802 12.0359 11.455 11.9807 11.5102C11.9256 11.5654 11.8507 11.5964 11.7726 11.5964C11.6946 11.5964 11.6197 11.5654 11.5645 11.5102C11.5093 11.455 11.4783 11.3802 11.4783 11.3021H12.067ZM5.0893 9.7446L2.14614 6.80144L2.56289 6.38469L5.50605 9.32785L5.0893 9.7446ZM2.14614 6.38469L5.0893 3.44153L5.50605 3.85828L2.56289 6.80144L2.14614 6.38469ZM2.35452 6.29875H8.24084V6.88738H2.35452V6.29875ZM12.067 10.1249V11.3021H11.4783V10.1249H12.067ZM8.24084 6.29875C9.25559 6.29875 10.2288 6.70186 10.9463 7.41939C11.6638 8.13693 12.067 9.11011 12.067 10.1249H11.4783C11.4783 9.26623 11.1372 8.44276 10.5301 7.83562C9.92294 7.22847 9.09947 6.88738 8.24084 6.88738V6.29875Z"
                    fill="white"
                  />
                </svg>
                Back to Sign In
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
