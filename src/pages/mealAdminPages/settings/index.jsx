import React, { useState } from "react";
import { Bell, Search, Settings } from "lucide-react";
import { useGetSiteSettingsQuery, useUpdateSiteSettingsMutation } from "../../../services/admin/adminApi";
import { toastUtils } from "../../../utils/toastUtils";
import PageLoading from "../../../components/PageLoading";
import LoadingSpinner from "../../../components/LoadingSpinner";

const SystemSettings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isToggling, setIsToggling] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [timeErrors, setTimeErrors] = useState({
    startTime: "",
    endTime: "",
    general: ""
  });
  
  const { 
    data: siteSettings, 
    isLoading, 
    error 
  } = useGetSiteSettingsQuery();
  
  const [updateSiteSettings, { isLoading: isUpdating }] = useUpdateSiteSettingsMutation();

  const platformAvailable = siteSettings?.data?.ServiceAvavailable ?? true;
  const lastUpdated = siteSettings?.data?.updatedAt || siteSettings?.data?.createdAt;
  
  React.useEffect(() => {
    if (siteSettings?.data) {
      setStartTime(siteSettings.data.startTime || "");
      setEndTime(siteSettings.data.endTime || "");
      // Clear errors when data loads
      setTimeErrors({ startTime: "", endTime: "", general: "" });
    }
  }, [siteSettings]);

  // Utility function to convert 24-hour to 12-hour format with AM/PM
  const formatTimeToAMPM = (time24) => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(':');
    const hour12 = parseInt(hours);
    const ampm = hour12 >= 12 ? 'PM' : 'AM';
    const displayHour = hour12 === 0 ? 12 : hour12 > 12 ? hour12 - 12 : hour12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Utility function to validate time format
  const validateTime = (time, fieldName) => {
    if (!time) {
      return `${fieldName} is required`;
    }

    // Check if time format is valid (HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(time)) {
      return `${fieldName} must be in valid format (HH:MM)`;
    }

    const [hours, minutes] = time.split(':').map(Number);
    
    // Additional validation
    if (hours < 0 || hours > 23) {
      return `${fieldName} hours must be between 00-23`;
    }
    
    if (minutes < 0 || minutes > 59) {
      return `${fieldName} minutes must be between 00-59`;
    }

    return "";
  };

  // Comprehensive time range validation
  const validateTimeRange = (start, end) => {
    const startError = validateTime(start, "Start time");
    const endError = validateTime(end, "End time");
    
    if (startError || endError) {
      return { startError, endError, rangeError: "" };
    }

    // Convert times to minutes for comparison
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    let rangeError = "";

    // Check for same time
    if (startMinutes === endMinutes) {
      rangeError = "Start time and end time cannot be the same";
    }
    
    // Check for very short duration (less than 30 minutes)
    else if (startMinutes < endMinutes && (endMinutes - startMinutes) < 30) {
      rangeError = "Service duration must be at least 30 minutes";
    }
    
    // For overnight schedules, check minimum duration
    else if (startMinutes > endMinutes) {
      const overnightDuration = (24 * 60 - startMinutes) + endMinutes;
      if (overnightDuration < 30) {
        rangeError = "Service duration must be at least 30 minutes";
      }
      if (overnightDuration > 20 * 60) {
        rangeError = "Overnight service duration cannot exceed 20 hours";
      }
    }

    return { startError: "", endError: "", rangeError };
  };
  
  const isCurrentlyUnavailable = () => {
    if (!platformAvailable) return true;
    
    if (!startTime || !endTime) return false;
    
    const now = new Date();
    const utcTime = now.getUTCHours() * 60 + now.getUTCMinutes(); 
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    if (startMinutes > endMinutes) {
      return !(utcTime >= startMinutes || utcTime <= endMinutes);
    }
    
    return !(utcTime >= startMinutes && utcTime <= endMinutes);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePlatformToggle = async () => {
    if (isToggling || isUpdating) return;
    
    setIsToggling(true);
    const newStatus = !platformAvailable;
    
    const loadingToast = toastUtils.loading(`Updating platform availability...`);
    
    try {
      await updateSiteSettings({ 
        ServiceAvavailable: newStatus,
        startTime: startTime,
        endTime: endTime
      }).unwrap();
      
      toastUtils.dismiss(loadingToast);
      
      toastUtils.success(`Platform ${newStatus ? 'activated' : 'deactivated'} successfully!`);
      
    } catch (error) {
      toastUtils.dismiss(loadingToast);
      
      toastUtils.error(`Failed to update platform availability. Please try again.`);
      
      console.error('Failed to update site settings:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleTimeChange = (value, field) => {
    // Clear previous errors for this field
    setTimeErrors(prev => ({
      ...prev,
      [field]: "",
      general: ""
    }));

    if (field === 'startTime') {
      setStartTime(value);
      // Validate on change if end time exists
      if (endTime) {
        const validation = validateTimeRange(value, endTime);
        setTimeErrors(prev => ({
          ...prev,
          startTime: validation.startError,
          endTime: validation.endError,
          general: validation.rangeError
        }));
      }
    } else {
      setEndTime(value);
      // Validate on change if start time exists
      if (startTime) {
        const validation = validateTimeRange(startTime, value);
        setTimeErrors(prev => ({
          ...prev,
          startTime: validation.startError,
          endTime: validation.endError,
          general: validation.rangeError
        }));
      }
    }
  };

  const handleTimeUpdate = async () => {
    // Comprehensive validation before submission
    const validation = validateTimeRange(startTime, endTime);
    
    setTimeErrors({
      startTime: validation.startError,
      endTime: validation.endError,
      general: validation.rangeError
    });

    // If there are any validation errors, don't proceed
    if (validation.startError || validation.endError || validation.rangeError) {
      toastUtils.error('Please fix the validation errors before updating');
      return;
    }
    
    const loadingToast = toastUtils.loading('Updating service operating hours...');
    
    try {
      await updateSiteSettings({
        ServiceAvavailable: platformAvailable,
        startTime: startTime,
        endTime: endTime
      }).unwrap();
      
      toastUtils.dismiss(loadingToast);
      
      // Show success with AM/PM format
      const startAMPM = formatTimeToAMPM(startTime);
      const endAMPM = formatTimeToAMPM(endTime);
      toastUtils.success(`Operating hours updated: ${startAMPM} - ${endAMPM}`);
      
    } catch (error) {
      toastUtils.dismiss(loadingToast);
      toastUtils.error('Failed to update schedule. Please try again.');
      console.error('Failed to update schedule:', error);
    }
  };

  const formatLastUpdated = (dateString) => {
    if (!dateString) return "Never";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "Unknown";
    }
  };

  if (isLoading) {
    return (
      <div className="text-white overflow-hidden">
        <div className="px-3 md:px-6 py-6 h-full flex items-center justify-center">
          <PageLoading message="Loading system settings..." className="h-auto" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-white overflow-hidden">
        <div className="px-3 md:px-6 py-6 h-full flex items-center justify-center">
          <div className="text-red-400 text-lg">
            Error loading system settings
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white overflow-hidden">
      <div className="px-3 md:px-6 py-6 h-full flex items-start">
        <div className="bg-[#1A1F3A] rounded-lg p-4 md:p-6 w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-lg md:text-xl font-bold text-white mb-2">
                Platform Availability
              </h2>
              <p className="text-sm text-[#EDEDED80] leading-relaxed">
                Control whether the platform is available to users
              </p>
            </div>

            <div className="flex-shrink-0 ml-4">
              <button
                onClick={handlePlatformToggle}
                disabled={isToggling || isUpdating}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#1A1F3A] disabled:opacity-50 disabled:cursor-not-allowed ${
                  platformAvailable
                    ? "bg-gradient-to-r from-[#9945FF] to-[#14F195]"
                    : "bg-gray-600"
                }`}
              >
                {isToggling || isUpdating ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                  </div>
                ) : (
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      platformAvailable ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                )}
              </button>
            </div>
          </div>
          
          {(startTime && endTime) && (
            <div className="mt-4 p-3 rounded-lg bg-[#2A2F4A]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white font-medium">
                    Service Operating Hours
                  </p>
                  <p className="text-xs text-[#EDEDED80] mt-1">
                    Available: {formatTimeToAMPM(startTime)} - {formatTimeToAMPM(endTime)} UTC
                  </p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  isCurrentlyUnavailable() 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'bg-green-500/20 text-green-400'
                }`}>
                  {isCurrentlyUnavailable() ? 'Currently Unavailable' : 'Available'}
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t border-[#2A2F4A]">
            <h3 className="text-lg font-semibold text-white mb-4">
              Service Operating Hours
            </h3>
            <p className="text-sm text-[#EDEDED80] mb-4">
              Set daily time range when the platform should be available to users
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => handleTimeChange(e.target.value, 'startTime')}
                  className={`w-full px-3 py-2 bg-[#2A2F4A] border rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    timeErrors.startTime 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-[#3A3F5A]'
                  }`}
                />
                {timeErrors.startTime && (
                  <p className="text-red-400 text-xs mt-1">{timeErrors.startTime}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => handleTimeChange(e.target.value, 'endTime')}
                  className={`w-full px-3 py-2 bg-[#2A2F4A] border rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    timeErrors.endTime 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-[#3A3F5A]'
                  }`}
                />
                {timeErrors.endTime && (
                  <p className="text-red-400 text-xs mt-1">{timeErrors.endTime}</p>
                )}
              </div>
            </div>
            
            {/* General time range error */}
            {timeErrors.general && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{timeErrors.general}</p>
              </div>
            )}
            
            <button
              onClick={handleTimeUpdate}
              disabled={isUpdating || !startTime || !endTime || timeErrors.startTime || timeErrors.endTime || timeErrors.general}
              className="px-4 py-2 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </div>
              ) : (
                'Update Schedule'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;

