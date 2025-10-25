import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown } from "lucide-react";
import { toastUtils } from "../../../../utils/toastUtils";

const AddStaffMember = ({ isOpen, onClose, onAddStaff, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const availableRoles = [
    { value: "admin", label: "Admin" },
    { value: "staff", label: "Staff" },
    { value: "user", label: "User" },
  ];

  const roleOptions = availableRoles.sort((a, b) => a.label.localeCompare(b.label));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsRoleDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: "", email: "", role: "", password: "" });
    }
  }, [isOpen]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      toastUtils.error("Please enter a valid email address");
      return;
    }
    
    if (formData.name && formData.email && formData.role && formData.password && !isLoading) {
      onAddStaff(formData);
    }
  };

  const handleClose = () => {
    setFormData({ name: "", email: "", role: "", password: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#171D41] rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6  flex-shrink-0">
          <h2 className="text-lg font-medium text-white mb-2">Add New Staff</h2>
          <p className="text-sm text-[#AEB9E1]">
            Create a new staff record. Fill in all required fields to add new
            staff member
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1">
          {/* Form Fields */}
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
                className="w-full bg-[#121B36] border-none rounded-lg px-3 py-3 text-white text-sm font-inter placeholder-[#AEB9E1] focus:outline-none focus:border-[#14F195] transition-colors"
                placeholder="Enter staff name"
                required
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
                className="w-full bg-[#121B36] border-none rounded-lg px-3 py-3 text-white text-sm font-inter placeholder-[#AEB9E1] focus:outline-none focus:border-[#14F195] transition-colors"
                placeholder="Enter email"
                required
              />
            </div>

            {/* Role Field */}
            <div>
              <label className="block text-xs font-inter text-[#FFFFFF]/70 mb-2">
                Role
              </label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="w-full bg-[#121B36] border-none rounded-lg px-3 py-3 text-white text-sm font-inter flex items-center justify-between focus:outline-none focus:border-[#14F195] transition-colors"
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                >
                  {formData.role || "Enter Role"}
                  <ChevronDown className="w-4 h-4 text-[#AEB9E1]" />
                </button>

                {isRoleDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-[#171D41] border border-[#3A3A4E] rounded-lg shadow-xl z-20 w-full min-w-[120px]">
                    {roleOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          handleInputChange("role", option.value);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-[10px] font-medium hover:bg-[#3A3A4E] transition-colors first:rounded-t-lg last:rounded-b-lg ${
                          formData.role === option.value
                            ? "text-[#14F195] bg-[#14F19533]"
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

            {/* Password Field */}
            <div>
              <label className="block text-xs font-inter text-[#FFFFFF]/70 mb-2">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="w-full bg-[#121B36] border-none rounded-lg px-3 py-3 text-white text-sm font-inter placeholder-[#AEB9E1] focus:outline-none focus:border-[#14F195] transition-colors"
                placeholder="Enter password"
                required
              />
            </div>
          </div>
        </form>

        {/* Action Buttons - Fixed at Bottom */}
        <div className="flex items-center justify-end gap-3 p-6  flex-shrink-0 bg-[#171D41]">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 bg-[#171D41] text-white rounded-full font-inter font-medium hover:text-white/70 transition-colors relative before:absolute before:inset-0 before:rounded-full before:p-[1px] before:bg-gradient-to-r before:from-[#9945FF] before:to-[#14F195] before:-z-10"
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
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className={`px-6 py-2 font-inter font-medium rounded-full transition-all duration-200 ${
              isLoading 
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white hover:shadow-lg'
            }`}
          >
            {isLoading ? 'Adding...' : 'Add Staff'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStaffMember;
