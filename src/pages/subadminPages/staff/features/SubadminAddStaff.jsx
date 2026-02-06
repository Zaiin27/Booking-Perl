import React, { useState, useEffect, useRef } from "react";
import { X, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const SubadminAddStaff = ({ isOpen, onClose, onAddStaff, isLoading = false }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "staff", // Fixed to staff for subadmins
        password: "",
        paymentType: "both",
    });

    const [isPaymentTypeDropdownOpen, setIsPaymentTypeDropdownOpen] = useState(false);
    const paymentTypeDropdownRef = useRef(null);

    const paymentTypeOptions = [
        { value: "online", label: "Online Payment" },
        { value: "cash", label: "Cash Payment" },
        { value: "both", label: "Both (Online & Cash)" },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (paymentTypeDropdownRef.current && !paymentTypeDropdownRef.current.contains(event.target)) {
                setIsPaymentTypeDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setFormData({ name: "", email: "", role: "staff", password: "", paymentType: "both" });
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
            toast.error("Please enter a valid email address");
            return;
        }

        if (formData.name && formData.email && formData.password && !isLoading) {
            onAddStaff(formData);
        } else {
            toast.error("Please fill in all fields");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-[#171D41] border border-[#FFFFFF1A] rounded-[32px] w-[95%] max-w-xl max-h-[85vh] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="p-8 pb-4 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">Add New Staff</h2>
                        <p className="text-sm text-white">
                            Create a new staff record under your management.
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="text-gray-400" size={24} />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4 flex-1 overflow-y-auto admin-table-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Staff Name Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white uppercase tracking-wider ml-1">
                                Staff Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                className="w-full bg-[#0D122B] border border-[#FFFFFF1A] rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#14F195] focus:ring-1 focus:ring-[#14F195] transition-all placeholder-gray-600"
                                placeholder="Full Name"
                                required
                            />
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white uppercase tracking-wider ml-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className="w-full bg-[#0D122B] border border-[#FFFFFF1A] rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#14F195] focus:ring-1 focus:ring-[#14F195] transition-all placeholder-gray-600"
                                placeholder="email@example.com"
                                required
                            />
                        </div>

                        {/* Role Field (Read-only for subadmins) */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white uppercase tracking-wider ml-1">
                                Assigned Role
                            </label>
                            <div className="w-full bg-[#0D122B]/50 border border-[#FFFFFF0D] rounded-2xl px-4 py-3.5 text-gray-400 text-sm font-bold flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#14F195]"></div>
                                Staff Member
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white uppercase tracking-wider ml-1">
                                Access Password
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                className="w-full bg-[#0D122B] border border-[#FFFFFF1A] rounded-2xl px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#14F195] focus:ring-1 focus:ring-[#14F195] transition-all placeholder-gray-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        {/* Payment Type Field */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-semibold text-white uppercase tracking-wider ml-1">
                                Payment Capability
                            </label>
                            <div className="relative" ref={paymentTypeDropdownRef}>
                                <button
                                    type="button"
                                    className="w-full bg-[#0D122B] border border-[#FFFFFF1A] rounded-2xl px-4 py-3.5 text-white text-sm flex items-center justify-between focus:outline-none focus:border-[#14F195] transition-all"
                                    onClick={() => setIsPaymentTypeDropdownOpen(!isPaymentTypeDropdownOpen)}
                                >
                                    <span className="font-medium">
                                        {paymentTypeOptions.find(opt => opt.value === formData.paymentType)?.label}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isPaymentTypeDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isPaymentTypeDropdownOpen && (
                                    <div className="absolute top-full left-0 mt-2 bg-[#1A2242] border border-[#FFFFFF1A] rounded-2xl shadow-2xl z-20 w-full overflow-hidden animate-in slide-in-from-top-2">
                                        {paymentTypeOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => {
                                                    handleInputChange("paymentType", option.value);
                                                    setIsPaymentTypeDropdownOpen(false);
                                                }}
                                                className={`w-full text-left px-5 py-3.5 text-sm hover:bg-white/10 transition-colors ${formData.paymentType === option.value
                                                    ? "text-[#14F195] bg-[#14F1951A] font-bold"
                                                    : "text-white/80"
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

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-3.5 text-white font-bold hover:text-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-10 py-3.5 font-bold rounded-2xl transition-all duration-300 shadow-lg ${isLoading
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white hover:scale-105 active:scale-95 shadow-[#9945FF33]'
                                }`}
                        >
                            {isLoading ? 'Processing...' : 'Add Staff Member'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubadminAddStaff;
