import React from "react";

const LoadingSpinner = ({ 
  message = "Loading...", 
  size = "md", 
  textSize = "sm",
  className = "",
  showMessage = true 
}) => {
  // Size configurations
  const sizeClasses = {
    xs: "h-4 w-4",
    sm: "h-6 w-6", 
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  // Text size configurations
  const textSizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-[#14F195] ${sizeClasses[size]}`}></div>
      {showMessage && (
        <div className={`text-white ${textSizeClasses[textSize]}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;
