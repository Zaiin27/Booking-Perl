import toast from "react-hot-toast";
import limitedToastManager from "./limitedToastManager";

// Common toast utility functions
export const toastUtils = {
  // Success messages
  success: (message, options) => limitedToastManager.success(message, options),

  // Error messages
  error: (message, options) => limitedToastManager.error(message, options),

  // Loading messages
  loading: (message, options) => limitedToastManager.loading(message, options),

  // Dismiss specific toast
  dismiss: (toastId) => limitedToastManager.dismiss(toastId),

  // Dismiss all toasts
  dismissAll: () => limitedToastManager.dismissAll(),

  // Promise-based toasts
  promise: (promise, messages) => toast.promise(promise, messages),

  // Custom toasts
  custom: (message, options) => limitedToastManager.custom(message, options),
};

// Common toast messages
export const toastMessages = {
  // Auth messages
  login: {
    success: "Login successful! Welcome back!",
    error: "Login failed. Please check your credentials.",
    loading: "Signing you in...",
  },
  signup: {
    success:
      "Account created successfully! Please check your email for verification.",
    error: "Signup failed. Please try again.",
    loading: "Creating your account...",
  },
  logout: {
    success: "Logged out successfully!",
    error: "Logout failed. Please try again.",
  },
  forgotPassword: {
    success: "Reset instructions sent to your email!",
    error: "Failed to send reset instructions. Please try again.",
    loading: "Sending reset instructions...",
  },

  // Form messages
  form: {
    validationError: "Please fill in all required fields.",
    submitError: "Form submission failed. Please try again.",
    submitSuccess: "Form submitted successfully!",
    loading: "Submitting...",
  },

  // General messages
  general: {
    networkError: "Network error. Please check your connection and try again.",
    unexpectedError: "An unexpected error occurred. Please try again.",
    success: "Operation completed successfully!",
    error: "Something went wrong. Please try again.",
  },

  // Profile messages
  profile: {
    updateSuccess: "Profile updated successfully!",
    updateError: "Failed to update profile. Please try again.",
  },
};

// Helper function for API calls with toast
export const withToast = async (apiCall, messages = {}) => {
  const loadingToast = limitedToastManager.loading(messages.loading || "Loading...");

  try {
    const result = await apiCall();
    limitedToastManager.dismiss(loadingToast);

    if (result.success !== false) {
      limitedToastManager.success(messages.success || "Operation completed successfully!");
    } else {
      limitedToastManager.error(messages.error || "Operation failed. Please try again.");
    }

    return result;
  } catch (error) {
    limitedToastManager.dismiss(loadingToast);
    limitedToastManager.error(
      messages.error ||
        error.message ||
        "Something went wrong. Please try again."
    );
    throw error;
  }
};

// Helper function for form validation with toast
export const validateFormWithToast = (data, requiredFields) => {
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    toast.error(`Please fill in: ${missingFields.join(", ")}`);
    return false;
  }

  return true;
};

export default toastUtils;
