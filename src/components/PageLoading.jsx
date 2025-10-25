import React from "react";
import LoadingSpinner from "./LoadingSpinner";

const PageLoading = ({ 
  message = "Loading...", 
  size = "md",
  textSize = "sm",
  className = "h-64"
}) => {
  return (
    <div className="p-6">
      <div className={`flex items-center justify-center ${className}`}>
        <LoadingSpinner 
          message={message}
          size={size}
          textSize={textSize}
        />
      </div>
    </div>
  );
};

export default PageLoading;
