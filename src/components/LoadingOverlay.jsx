import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const LoadingOverlay = ({ 
  isLoading, 
  message = "Loading...", 
  size = "sm",
  textSize = "xs",
  className = ""
}) => {
  if (!isLoading) return null;

  return (
    <div className={`absolute inset-0 bg-[#171D41] bg-opacity-95 flex items-center justify-center z-20 rounded-lg ${className}`}>
      <LoadingSpinner 
        message={message}
        size={size}
        textSize={textSize}
      />
    </div>
  );
};

export default LoadingOverlay;
