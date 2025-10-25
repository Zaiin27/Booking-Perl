import React, { useState, useEffect } from "react";
import { X, ChevronDown, Eye, EyeOff } from "lucide-react";
import ConfirmModal from "../../../../components/ConfirmModal";
import { toastUtils } from "../../../../utils/toastUtils";

const StaffDetailsModal = ({
  isOpen,
  onClose,
  staff,
  mode = "view", // "view" or "edit"
  onSave,
  onDelete,
  isLoading = false,
  error = null,
  isSaving = false,
}) => {
  const [currentMode, setCurrentMode] = useState(mode);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "staff",
    status: "Active",
    currentPassword: "",
    newPassword: "",
  });

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const availableRoles = [
    { value: "admin", label: "Admin" },
    { value: "staff", label: "Staff" },
    { value: "user", label: "User" },
  ];

  const roleOptions = availableRoles.sort((a, b) => a.label.localeCompare(b.label));

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  useEffect(() => {
    if (staff) {
      const staffData = staff.data || staff;
      
      setFormData({
        name: staffData.name || staffData.email?.split('@')[0] || "",
        email: staffData.email || "",
        role: staffData.role?.toLowerCase() || "staff",
        status: staffData.isActive ? "Active" : "Inactive",
        currentPassword: "",
        newPassword: "",
      });
    }
  }, [staff]);

  // Reset mode when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentMode(mode);
    }
  }, [isOpen, mode]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function to restore scrolling
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    // Email validation
    if (field === "email") {
      // Only allow valid email characters and format
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (value && !emailRegex.test(value) && value.includes('@')) {
        // If it contains @ but is invalid, don't update
        return;
      }
    }
    
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    console.log("=== SAVE BUTTON CLICKED ===");
    console.log("Form data:", formData);
    console.log("Staff data:", staff);
    
    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      toastUtils.error("Please enter a valid email address");
      return;
    }
    
    // Don't allow save if already saving
    if (isSaving) {
      return;
    }
    
    // Validate password fields if new password is provided
    if (formData.newPassword && formData.newPassword.trim() !== "") {
      if (formData.newPassword.length < 6) {
        alert("New password must be at least 6 characters long");
        return;
      }
      if (formData.currentPassword.trim() === "") {
        alert("Please enter current password");
        return;
      }
    }

    const updatedStaff = { ...staff, ...formData };
    console.log("Updated staff data to send:", updatedStaff);

    if (onSave) {
      console.log("Calling onSave callback...");
      onSave(updatedStaff);
    }
    // Don't close modal here, let the parent handle it after API success
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(staff.id);
      onClose();
    }
    setShowDeleteConfirm(false);
  };

  if (!isOpen) return null;

  // Show loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#171D41] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-6 flex-shrink-0">
            <h2 className="text-lg font-medium text-white mb-2">
              Edit Staff Member Details
            </h2>
            <p className="text-sm text-[#AEB9E1]">
              Update staff member details and permissions
            </p>
          </div>
          <div className="p-6 flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-white text-lg">Loading staff details...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#171D41] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-6 flex-shrink-0">
            <h2 className="text-lg font-medium text-white mb-2">
              Edit Staff Member Details
            </h2>
            <p className="text-sm text-[#AEB9E1]">
              Update staff member details and permissions
            </p>
          </div>
          <div className="p-6 flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-400 text-lg">
                Error loading staff details: {error?.data?.message || error?.message || 'Unknown error'}
              </div>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-[#9945FF] text-white rounded-lg hover:opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!staff) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#171D41] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 flex-shrink-0">
          <h2 className="text-lg font-medium text-white mb-2">
            Edit Staff Member Details
          </h2>
          <p className="text-sm text-[#AEB9E1]">
            Update staff member details and permissions
          </p>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Staff Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Staff Name Field */}
            <div>
              <label className="block text-xs font-inter text-[#FFFFFF]/70 mb-2">
                Staff Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full bg-[#121B36] rounded-lg px-3 py-3 text-white text-sm font-inter placeholder-[#AEB9E1] border-none focus:outline-none focus:border-[#14F195] transition-colors"
                placeholder="Enter staff name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-inter text-[#FFFFFF]/70 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled
                className="w-full bg-[#121B36] rounded-lg px-3 py-3 text-white text-sm font-inter placeholder-[#AEB9E1] border-none focus:outline-none focus:border-[#14F195] transition-colors opacity-50 cursor-not-allowed"
                placeholder="Enter email address"
              />
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="block text-xs font-inter text-[#FFFFFF]/70 mb-2">
                Role
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="w-full bg-[#121B36] rounded-lg px-3 py-3 text-white text-sm font-inter flex items-center justify-between focus:outline-none focus:border-[#14F195] transition-colors"
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                >
                  {formData.role}
                  <ChevronDown className="w-4 h-4 text-white" />
                </button>

                {isRoleDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg shadow-xl z-10 w-full">
                    {roleOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          handleInputChange("role", option.value);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-[#3A3A4E] transition-colors rounded-lg ${
                          formData.role === option.value
                            ? "text-[#14F195] bg-[#14F19520]"
                            : "text-white"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Update Status Dropdown */}
            <div>
              <label className="block text-xs font-inter text-[#FFFFFF]/70 mb-2">
                Update Status
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="bg-[#14F19520] border border-[#14F19550] rounded-lg px-3 py-2 text-white text-sm font-inter flex items-center justify-between focus:outline-none focus:border-[#14F195] transition-colors w-[130px]"
                  onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                >
                  {formData.status}
                  <ChevronDown className="w-4 h-4 text-white" />
                </button>

                {isStatusDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg shadow-xl z-10 w-full">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          handleInputChange("status", option.value);
                          setIsStatusDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-[#3A3A4E] transition-colors rounded-lg ${
                          formData.status === option.value
                            ? "text-[#14F195] bg-[#14F19520]"
                            : "text-white"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reset Password Section */}
          <div className="space-y-4">
            <h3 className="text-lg pt-4 font-medium text-white font-inter">
              Reset Password
            </h3>

            {/* Current Password Field */}
            <div>
              <label className="block text-xs font-inter text-[#FFFFFF]/70 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    handleInputChange("currentPassword", e.target.value)
                  }
                  className="w-full bg-[#121B36] rounded-lg px-3 py-3 pr-12 text-white text-sm font-inter placeholder-[#AEB9E1] border-none focus:outline-none focus:border-[#14F195] transition-colors"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#AEB9E1] hover:text-white transition-colors"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div>
              <label className="block text-xs font-inter text-[#FFFFFF]/70 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) =>
                    handleInputChange("newPassword", e.target.value)
                  }
                  className="w-full bg-[#121B36] rounded-lg px-3 py-3 pr-12 text-white text-sm font-inter placeholder-[#AEB9E1] border-none focus:outline-none focus:border-[#14F195] transition-colors"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#AEB9E1] hover:text-white transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Fixed at Bottom */}
        <div className="flex items-center justify-end gap-3 p-6 flex-shrink-0 bg-[#171D41]">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#121B36] text-white font-medium font-inter rounded-full hover:text-white/70 transition-colors relative before:absolute before:inset-0 before:rounded-full before:p-[1px] before:bg-gradient-to-r before:from-[#9945FF] before:to-[#14F195] before:-z-10"
              style={{
                background:
                  "linear-gradient(#171D41, #171D41) padding-box, linear-gradient(90deg, #9945FF, #14F195) border-box",
                border: "1px solid transparent",
                borderRadius: "9999px",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-6 py-2 font-medium font-inter rounded-full transition-all duration-200 ${
                isSaving 
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white hover:shadow-lg'
              }`}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Are you sure?"
        itemName={staff?.name || "Staff Member"}
        itemDescription={`${staff?.role || "Staff"} - ${
          staff?.email || "No email"
        }`}
        itemDate={`Status: ${staff?.status || "Unknown"}`}
        confirmButtonText="Delete Staff"
        type="delete"
      />
    </div>
  );
};

export default StaffDetailsModal;
