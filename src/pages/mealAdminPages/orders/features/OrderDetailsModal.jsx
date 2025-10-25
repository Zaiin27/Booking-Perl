import React, { useState, useEffect } from "react";
import { X, Copy, ChevronDown, Eye, Edit, Trash2 } from "lucide-react";
import ConfirmModal from "../../../../components/ConfirmModal";
import { useUpdateOrderStatusMutation, useGetAdminOrderByIdQuery } from "../../../../services/admin/adminApi";
import { toastUtils } from "../../../../utils/toastUtils";

const OrderDetailsModal = ({
  isOpen,
  onClose,
  order,
  mode = "view", 
  onSave,
  onDelete,
}) => {
  const [currentMode, setCurrentMode] = useState(mode);
  
  // Get MongoDB ObjectId from the order prop
  const orderId = order?._id || order?.id || order?.order_id;
  
  // API query to fetch order details by ID
  const { 
    data: orderDetails, 
    isLoading: isLoadingOrder, 
    error: orderError 
  } = useGetAdminOrderByIdQuery(orderId, {
    skip: !isOpen || !orderId, // Only fetch when modal is open and orderId exists
  });

  // Use fetched order details or fallback to passed order prop
  // API response structure: { data: { order: {...}, payment: null, tickets: [] } }
  const fetchedOrder = orderDetails?.data?.order || orderDetails?.data || orderDetails;
  const currentOrder = fetchedOrder ? {
    ...fetchedOrder,
    // Preserve payment field from the original order prop if it's missing in API response
    payment: fetchedOrder.payment || order?.payment || "No"
  } : order;


  const [formData, setFormData] = useState({
    status: currentOrder?.status || "PENDING",
    adminNotes: currentOrder?.adminNotes || "",
    transactionHash:
      currentOrder?.transactionHash || "0x1234567890abcdef1234567890abcdef12345678",
    cartLink: currentOrder?.cart_url || currentOrder?.cartLink || "https://cart.example.com/abc123",
  });

  // API mutation for updating order status
  const [updateOrderStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isAdminStatusDropdownOpen, setIsAdminStatusDropdownOpen] =
    useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const statusOptions = [
    { value: "PENDING", label: "Pending", color: "bg-[#FDB52A]" },
    { value: "PLACED", label: "Placed", color: "bg-[#14F195]" },
    { value: "PLACED", label: "Placed", color: "bg-[#14F195]" },
    { value: "CANCELLED", label: "Cancelled", color: "bg-[#6B7280]" },
  ];

  // Update form data when order changes
  useEffect(() => {
    if (currentOrder) {
      setFormData({
        status: currentOrder.status || "PENDING",
        adminNotes: currentOrder.adminNotes || "",
        transactionHash:
          currentOrder.transactionHash || "0x1234567890abcdef1234567890abcdef12345678",
        cartLink: currentOrder.cart_url || currentOrder.cartLink || "https://cart.example.com/abc123",
      });
    }
  }, [currentOrder]);

  // Reset mode when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentMode(mode);
    }
  }, [isOpen, mode]);


  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store the original overflow value
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // Cleanup function to restore scrolling
      return () => {
        // Use setTimeout to ensure proper cleanup after modal closes
        setTimeout(() => {
          document.body.style.overflow = originalOverflow || "unset";
        }, 100);
      };
    }
  }, [isOpen]);

  const handleEditClick = () => {
    setCurrentMode("edit");
  };

  const handleCancelEdit = () => {
    setCurrentMode("view");
    // Reset form data to original order data
    setFormData({
      status: currentOrder.status || "PENDING",
      adminNotes: currentOrder.adminNotes || "",
      transactionHash:
        currentOrder.transactionHash || "0x1234567890abcdef1234567890abcdef12345678",
      cartLink: currentOrder.cart_url || currentOrder.cartLink || "https://cart.example.com/abc123",
    });
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle status update API call
  const handleStatusUpdate = async (newStatus) => {
    const orderId = currentOrder?._id || currentOrder?.order_id || currentOrder?.id;
    if (!orderId) {
      toastUtils.error("Order ID not found");
      return;
    }

    const loadingToast = toastUtils.loading(`Updating order ${orderId} status...`);
    
    try {
      await updateOrderStatus({ 
        orderId, 
        status: newStatus 
      }).unwrap();
      
      // Dismiss loading toast
      toastUtils.dismiss(loadingToast);
      
      // Show success toast
      toastUtils.success(`Order ${orderId} status updated to ${newStatus} successfully!`);
    } catch (error) {
      // Dismiss loading toast
      toastUtils.dismiss(loadingToast);
      
      // Show error toast
      toastUtils.error(`Failed to update order ${orderId} status. Please try again.`);
    }
  };

  const handleSave = async () => {
    // Check if status has changed and update it via API
    if (formData.status !== currentOrder?.status) {
      await handleStatusUpdate(formData.status);
    }

    // Call the parent onSave callback with updated data
    if (onSave) {
      onSave({ ...currentOrder, ...formData });
    }
    onClose();
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(currentOrder.id);
      onClose();
    }
    setShowDeleteConfirm(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toastUtils.success("Copied successfully!");
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(
      (option) => option.value === status
    );
    return statusOption ? statusOption.color : "bg-[#FDB52A]"; // Default to pending color
  };

  // Show loading state while fetching order details
  if (isLoadingOrder) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#171D41] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-lg">Loading order details...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there's an error fetching order details
  if (orderError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#171D41] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-400 text-lg">
              Error loading order details: {orderError?.data?.message || orderError?.message || 'Unknown error'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen || !currentOrder) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#171D41] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 flex-shrink-0">
          <h2 className="text-xl font-semibold text-white">
            {currentMode === "edit" ? "Edit Order" : "Order Details"}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto scrollbar-hide flex-1">
          {/* Order Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-inter text-[#FFFFFF]/70 mb-2">
                  Order ID
                </label>
                <p className="text-[#EDEDED] font-medium font-inter">
                  {currentOrder.order_id || currentOrder.id}
                </p>
              </div>
              <div>
                <label className="block text-[13px] font-inter text-[#FFFFFF]/70 mb-2">
                  Payment Type
                </label>
                <p className="text-[#EDEDED] font-medium font-inter">
                  {currentOrder.payment}
                </p>
              </div>
              <div>
                <label className="block text-[13px] font-inter text-[#FFFFFF]/70 mb-2">
                  Status
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[#14F195] bg-[#14F19533] text-[#14F195] text-sm font-inter font-medium`}
                    onClick={() => {
                      if (currentMode === "edit") {
                        // Close admin status dropdown if open
                        if (isAdminStatusDropdownOpen) {
                          setIsAdminStatusDropdownOpen(false);
                        }
                        setIsStatusDropdownOpen(!isStatusDropdownOpen);
                      }
                    }}
                  >
                    {statusOptions.find((s) => s.value === formData.status)
                      ?.label || formData.status}
                    {currentMode === "edit" && (
                      <ChevronDown className="w-4 h-4 text-[#14F195]" />
                    )}
                  </button>

                  {currentMode === "edit" && isStatusDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-md shadow-xl z-10 min-w-[150px]">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            handleInputChange("status", option.value);
                            setIsStatusDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm font-inter hover:bg-[#3A3A4E] transition-colors ${
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

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-inter text-[#FFFFFF]/70 mb-2">
                  Email
                </label>
                <p className="text-[#EDEDED] font-medium font-inter">
                  {currentOrder.user_id?.email || currentOrder.customerEmail}
                </p>
              </div>
              <div>
                <label className="block text-[13px] font-inter text-[#FFFFFF]/70 mb-2">
                  Timestamp
                </label>
                <p className="text-[#EDEDED] font-medium font-inter">
                  {currentOrder.createdAt ? new Date(currentOrder.createdAt).toLocaleString() : currentOrder.timestamp}
                </p>
              </div>
              <div>
                <label className="block text-[13px] font-inter text-[#FFFFFF]/70 mb-2">
                  Total Amount
                </label>
                <p className="text-[#EDEDED] font-medium font-inter">
                  ${currentOrder.total ? parseFloat(currentOrder.total).toFixed(2) : (currentOrder.amount ? parseFloat(currentOrder.amount).toFixed(2) : "0.00")}
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Hash */}
          <div>
            <label className="block text-[13px] font-inter text-[#FFFFFF]/70 mb-2">
              Transaction Hash
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.transactionHash}
                onChange={(e) =>
                  handleInputChange("transactionHash", e.target.value)
                }
                disabled={currentMode === "view"}
                className="w-full bg-[#121B36] rounded-lg px-3 py-3 pr-12 font-inter text-sm text-[#EDEDED] disabled:opacity-50 border-0 focus:outline-none"
              />
              <button
                onClick={() => copyToClipboard(formData.transactionHash)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-[#AEB9E1] hover:text-[#EDEDED] transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium border-t border-[#3A3A4E] pt-4 text-[#EDEDED] mb-4 text-[13px] font-inter">
              Cart Link
            </h3>
            <div className="bg-[#121B36] rounded-lg p-3">
              <p className="text-[#EDEDED] text-sm font-inter">
                {currentOrder.cart_url || "https://cart.example.com/abc123"}
              </p>
            </div>
          </div>

          {/* Order Items from API */}
          {currentOrder.participants && currentOrder.participants.length > 0 && (
            <div>
              <h3 className="text-lg font-medium border-t border-[#3A3A4E] pt-4 text-[#EDEDED] mb-4 text-[13px] font-inter">
                Order Items
              </h3>
              <div className="space-y-3">
                {currentOrder.participants.map((participant, index) => (
                  <div key={index} className="bg-[#121B36] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[#EDEDED] font-medium text-sm">{participant.name}</h4>
                      <span className="text-[#AEB9E1] text-xs">{participant.summary}</span>
                    </div>
                    <div className="space-y-2">
                      {participant.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between">
                          <div>
                            <p className="text-[#EDEDED] text-sm">{item.title}</p>
                            {item.addOns && item.addOns.length > 0 && (
                              <p className="text-[#AEB9E1] text-xs">Add-ons: {item.addOns.join(", ")}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-[#EDEDED] text-sm">Qty: {item.quantity}</p>
                            <p className="text-[#14F195] text-sm">${item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order Totals */}
              <div className="mt-4 bg-[#121B36] rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#AEB9E1]">Subtotal:</span>
                    <span className="text-[#EDEDED]">${currentOrder.subtotal?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#AEB9E1]">Delivery Fee:</span>
                    <span className="text-[#EDEDED]">${currentOrder.delivery_fee?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="border-t border-[#3A3A4E] pt-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span className="text-[#EDEDED]">Total:</span>
                      <span className="text-[#14F195]">${currentOrder.total?.toFixed(2) || "0.00"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin Controls */}
          <div>
            <h3 className="text-lg font-medium border-t border-[#3A3A4E] pt-4 text-[#EDEDED] mb-4 text-[13px] font-inter">
              Admin Controls
            </h3>
            <div>
              <p className="text-white text-md mb-2 text-[13px] font-inter">
                Update Status
              </p>
              <div className="relative">
                <button
                  type="button"
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[#14F195] bg-[#14F19533] text-[#14F195] text-sm font-inter font-medium`}
                  onClick={() => {
                    if (currentMode === "edit") {
                      // Close status dropdown if open
                      if (isStatusDropdownOpen) {
                        setIsStatusDropdownOpen(false);
                      }
                      setIsAdminStatusDropdownOpen(!isAdminStatusDropdownOpen);
                    }
                  }}
                >
                  {statusOptions.find((s) => s.value === formData.status)
                    ?.label || formData.status}
                  {currentMode === "edit" && (
                    <ChevronDown className="w-4 h-4 text-[#14F195]" />
                  )}
                </button>

                {currentMode === "edit" && isAdminStatusDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-md shadow-xl z-10 min-w-[150px]">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          handleInputChange("status", option.value);
                          setIsAdminStatusDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm font-inter hover:bg-[#3A3A4E] transition-colors ${
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

          {/* Internal Admin Notes */}
          <div>
            <label className="block text-[13px] font-inter text-[#FFFFFF]/70 mb-2">
              Internal Admin Notes
            </label>
            <textarea
              value={formData.adminNotes}
              onChange={(e) => handleInputChange("adminNotes", e.target.value)}
              disabled={currentMode === "view"}
              placeholder="Add Internal notes about this order..."
              rows={4}
              className="w-full bg-[#121B36] border border-[#3A3A4E] rounded-lg px-3 py-2 text-white text-md font-inter placeholder-[#AEB9E1] disabled:opacity-50 resize-none"
            />
          </div>
        </div>

        {/* Action Buttons - Fixed at Bottom */}
        <div className="flex items-center justify-end gap-3 p-6 flex-shrink-0 bg-[#171D41]">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#171D41] text-white rounded-full hover:text-white/70 transition-colors relative before:absolute before:inset-0 before:rounded-full before:p-[1px] before:bg-gradient-to-r before:from-[#9945FF] before:to-[#14F195] before:-z-10"
              style={{
                background:
                  "linear-gradient(#171D41, #171D41) padding-box, linear-gradient(90deg, #9945FF, #14F195) border-box",
                border: "1px solid transparent",
                borderRadius: "9999px",
              }}
            >
              Cancel
            </button>
            {currentMode === "edit" && (
              <button
                onClick={handleSave}
                disabled={isUpdatingStatus}
                className="px-6 py-2 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white rounded-full hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingStatus ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Are you sure?"
        itemName={currentOrder?.id || "Order"}
        itemDescription="This order will be permanently deleted from the system"
        itemDate={`Created ${currentOrder?.timestamp || "Unknown"}`}
        confirmButtonText="Delete Order"
        type="delete"
      />
    </div>
  );
};

export default OrderDetailsModal;
