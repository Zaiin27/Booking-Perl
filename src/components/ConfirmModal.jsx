import React, { useEffect } from "react";
import { X, Trash2 } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  itemName,
  itemDescription,
  itemDate,
  confirmButtonText = "Delete",
  confirmButtonColor = "bg-red-600 hover:bg-red-700",
  type = "delete", // "delete", "warning", "info"
}) => {
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

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "delete":
        return <Trash2 className="w-6 h-6 text-red-500" />;
      default:
        return <Trash2 className="w-6 h-6 text-red-500" />;
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case "delete":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "warning":
        return "bg-yellow-600 hover:bg-yellow-700 text-white";
      case "info":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      default:
        return "bg-red-600 hover:bg-red-700 text-white";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-[#171D41] border border-[#3A3A4E] rounded-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-[#3A3A4E]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-[#AEB9E1] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Item Card */}
          <div className="bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">{getIcon()}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-lg mb-1">
                  {itemName}
                </h3>
                {itemDescription && (
                  <p className="text-[#AEB9E1] text-sm mb-2">
                    {itemDescription}
                  </p>
                )}
                {itemDate && (
                  <p className="text-[#AEB9E1] text-xs">{itemDate}</p>
                )}
              </div>
            </div>
          </div>

          {/* Warning Message */}
          <p className="text-[#AEB9E1] text-sm mb-6">
            {type === "delete"
              ? "This action cannot be undone. Are you sure you want to proceed?"
              : "Please confirm this action."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#3A3A4E] bg-[#171D41]">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-[#3A3A4E] text-[#AEB9E1] rounded-lg hover:bg-[#3A3A4E] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${getConfirmButtonStyle()}`}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
