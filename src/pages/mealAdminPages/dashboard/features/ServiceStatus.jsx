import React, { useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { useGetSiteSettingsQuery, useUpdateSiteSettingsMutation } from "../../../../services/admin/adminApi";
import { toastUtils } from "../../../../utils/toastUtils";
import LoadingSpinner from "../../../../components/LoadingSpinner";

const ServiceStatus = () => {
  const [isToggling, setIsToggling] = useState(false);
  
  // API queries
  const { 
    data: siteSettings, 
    isLoading, 
    error 
  } = useGetSiteSettingsQuery();
  
  const [updateSiteSettings, { isLoading: isUpdating }] = useUpdateSiteSettingsMutation();

  // Extract service availability from API response
  const isServiceActive = siteSettings?.data?.ServiceAvavailable ?? true;
  const lastUpdated = siteSettings?.data?.updatedAt || siteSettings?.data?.createdAt;

  const toggleService = async () => {
    if (isToggling || isUpdating) return;
    
    setIsToggling(true);
    const newStatus = !isServiceActive;
    
    const loadingToast = toastUtils.loading(`Updating service status...`);
    
    try {
      await updateSiteSettings({ 
        ServiceAvavailable: newStatus 
      }).unwrap();
      
      // Dismiss loading toast
      toastUtils.dismiss(loadingToast);
      
      // Show success toast
      toastUtils.success(`Service ${newStatus ? 'activated' : 'deactivated'} successfully!`);
      
    } catch (error) {
      // Dismiss loading toast
      toastUtils.dismiss(loadingToast);
      
      // Show error toast
      toastUtils.error(`Failed to update service status. Please try again.`);
      
      console.error('Failed to update site settings:', error);
    } finally {
      setIsToggling(false);
    }
  };

  // Format last updated date
  const formatLastUpdated = (dateString) => {
    if (!dateString) return "Never";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "Unknown";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-[#171D41] rounded-lg p-6">
        <div className="flex items-center justify-center h-32">
          <LoadingSpinner message="Loading service status..." size="sm" textSize="xs" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-[#171D41] rounded-lg p-6">
        <div className="flex items-center justify-center h-32">
          <div className="text-red-400 text-lg">
            Error loading service status
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#171D41] rounded-lg p-6">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-white text-xl font-semibold font-inter mb-2">
            Service Status
          </h2>
          <p className="text-[#EDEDEDB2] text-xs font-inter">
            Current service availability and controls
          </p>
        </div>

        {/* Status Badge */}
        <div className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
          isServiceActive 
            ? 'bg-[#14F19533] border border-[#14F19580]' 
            : 'bg-red-500/20 border border-red-500/30'
        }`}>
          <span className={`text-sm font-medium ${
            isServiceActive ? 'text-[#14F195]' : 'text-red-400'
          }`}>
            {isServiceActive ? 'Active' : 'Inactive'}
          </span>
          <FaCircleCheck className={`w-4 h-4 ${
            isServiceActive ? 'text-[#14F195]' : 'text-red-400'
          }`} />
        </div>
      </div>

      {/* Service Toggle Section */}
      <div className="flex items-center gap-4 mb-6">
        {/* Toggle Switch */}
        <button
          onClick={toggleService}
          disabled={isToggling || isUpdating}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            isServiceActive
              ? "bg-gradient-to-r from-[#9945FF] to-[#14F195]"
              : "bg-gray-600"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isServiceActive ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>

        {/* Status Text */}
        <div>
          <span className="text-white text-sm font-inter">
            {isServiceActive
              ? "Service is running normally"
              : "Service is currently offline"}
          </span>
          <p className="text-[#EDEDEDB2] text-xs">
            {isToggling || isUpdating ? 'Updating...' : 'Click to toggle service status'}
          </p>
        </div>
      </div>

      {/* Last Updated Info */}
      <div className="text-[#EDEDEDB2] text-xs font-inter">
        Last updated: {formatLastUpdated(lastUpdated)}
      </div>
    </div>
  );
};

export default ServiceStatus;
