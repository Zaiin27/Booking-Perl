import React, { useState, useEffect } from "react";
import { X, Copy, ChevronDown, Eye, Edit, Trash2 } from "lucide-react";
import ConfirmModal from "../../../../components/ConfirmModal";
import { useGetTicketByIdQuery, useUpdateTicketStatusMutation, useUpdateTicketAdminNotesMutation, useUpdateOrderStatusMutation } from "../../../../services/admin/adminApi";
import { toastUtils } from "../../../../utils/toastUtils";

const TicketDetailsModal = ({
  isOpen,
  onClose,
  ticket,
  mode = "view", 
  onSave,
  onDelete,
}) => {
  const [currentMode, setCurrentMode] = useState(mode);
  
  const ticketId = ticket?._id || ticket?.id || ticket?.ticket_id;
  
  const { 
    data: ticketDetails, 
    isLoading: isLoadingTicket, 
    error: ticketError 
  } = useGetTicketByIdQuery(ticketId, {
    skip: !isOpen || !ticketId, // Only fetch when modal is open and ticketId exists
  });

  const currentTicket = ticketDetails?.data?.ticket || ticketDetails?.data || ticketDetails || ticket;

  const [formData, setFormData] = useState({
    status: currentTicket?.status || "ORDERING",
    adminNotes: currentTicket?.adminNotes || "",
    transactionHash:
      currentTicket?.transactionHash || "0x1234567890abcdef1234567890abcdef12345678",
    cartLink: currentTicket?.cartLink || "https://cart.example.com/abc123",
    createdAt: currentTicket?.createdAt || "15/01/2024, 15:30:00",
  });

  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isAdminStatusDropdownOpen, setIsAdminStatusDropdownOpen] =
    useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hasNotesChanged, setHasNotesChanged] = useState(false);

  const [updateTicketStatus, { isLoading: isUpdatingStatus }] = useUpdateTicketStatusMutation();
  
  const [updateTicketAdminNotes, { isLoading: isUpdatingNotes }] = useUpdateTicketAdminNotesMutation();
  
  const [updateOrderStatus, { isLoading: isUpdatingOrderStatus }] = useUpdateOrderStatusMutation();

  const getTicketStatusProgression = (currentStatus) => {
    const progression = {
      ORDERING: ["DISPATCH"],
      DISPATCH: ["FULFILLED"],
      FULFILLED: [], 
      PENDING: ["DISPATCH"], 
      OPEN: ["DISPATCH"], 
      ORDERED_SUCCESSFULLY: ["DISPATCH"], 
      IN_PROGRESS: ["FULFILLED"], 
      RESOLVED: [],
    };
    return progression[currentStatus] || [];
  };

  const allStatusOptions = [
    { value: "ORDERING", label: "Ordering", color: "bg-[#FDB52A]" },
    { value: "DISPATCH", label: "Dispatch", color: "bg-[#3B82F6]" },
    { value: "FULFILLED", label: "Fulfilled", color: "bg-[#10B981]" },
  ];

  const getStatusOptions = (currentStatus) => {
    const availableStatuses = getTicketStatusProgression(currentStatus);
    
    if (availableStatuses.length > 0) {
      return allStatusOptions.filter(status => 
        availableStatuses.includes(status.value)
      );
    }
    
    return [];
  };

  // Get status options for the current ticket
  const statusOptions = getStatusOptions(formData.status);

  // Map backend status to frontend status for display
  const mapBackendToFrontendStatus = (backendStatus) => {
    if (backendStatus === "IN_PROGRESS") {
      return "DISPATCH";
    } else if (backendStatus === "RESOLVED") {
      return "FULFILLED";
    }
    return backendStatus;
  };

  // Update form data when ticket changes
  useEffect(() => {
    if (currentTicket) {
      const frontendStatus = mapBackendToFrontendStatus(currentTicket.status);
      setFormData({
        status: frontendStatus || "ORDERING",
        adminNotes: currentTicket.adminNotes || "",
        transactionHash:
          currentTicket.transactionHash ||
          "0x1234567890abcdef1234567890abcdef12345678",
        cartLink: currentTicket.cartLink || "https://cart.example.com/abc123",
        createdAt: currentTicket.createdAt || "15/01/2024, 15:30:00",
      });
    }
  }, [currentTicket]);

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
        document.body.style.overflow = originalOverflow || "unset";
      };
    }
  }, [isOpen]);

  const handleEditClick = () => {
    setCurrentMode("edit");
  };

  const handleCancelEdit = () => {
    setCurrentMode("view");
    setFormData({
      status: currentTicket.status || "ORDERING",
      adminNotes: currentTicket.adminNotes || "",
      transactionHash:
        currentTicket.transactionHash || "0x1234567890abcdef1234567890abcdef12345678",
      cartLink: currentTicket.cartLink || "https://cart.example.com/abc123",
      createdAt: currentTicket.createdAt || "15/01/2024, 15:30:00",
    });
    setHasNotesChanged(false);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    
    if (field === "adminNotes") {
      setHasNotesChanged(value !== (currentTicket?.adminNotes || ""));
    }
  };

  const handleStatusUpdate = async (newStatus, showToast = true) => {
    const ticketId = currentTicket?.ticket_id || currentTicket?.id || currentTicket?._id;
    const orderId = currentTicket?.order_id || currentTicket?.orderId;
    if (!ticketId) {
      toastUtils.error("Ticket ID not found");
      return;
    }

    const loadingToast = showToast ? toastUtils.loading(`Updating ticket ${ticketId} status...`) : null;
    
    try {
      let backendStatus = newStatus;
      if (newStatus === "DISPATCH") {
        backendStatus = "IN_PROGRESS";
      } else if (newStatus === "FULFILLED") {
        backendStatus = "RESOLVED";
      }
      
      await updateTicketStatus({ 
        ticketId, 
        status: backendStatus 
      }).unwrap();
      
      if (showToast) {
        if (newStatus === "FULFILLED" && orderId) {
          try {
            await updateOrderStatus({
              orderId,
              status: "PLACED"
            }).unwrap();
            
            toastUtils.dismiss(loadingToast);
            toastUtils.success(`Ticket status updated to Fulfilled and order status updated to Placed successfully!`);
          } catch (orderError) {
            console.error('Failed to update order status:', orderError);
            toastUtils.dismiss(loadingToast);
            toastUtils.success(`Ticket status updated successfully! (Order status update failed)`);
          }
        } else {
          toastUtils.dismiss(loadingToast);
          toastUtils.success(`Ticket ${ticketId} status updated to ${newStatus} successfully!`);
        }
      }
    } catch (error) {
      if (showToast) {
        toastUtils.dismiss(loadingToast);
        toastUtils.error(`Failed to update ticket ${ticketId} status. Please try again.`);
      }
    }
  };

  const handleAdminNotesUpdate = async () => {
    const ticketId = currentTicket?._id || currentTicket?.id;
    if (!ticketId) {
      toastUtils.error("Ticket ID not found");
      return;
    }

    console.log("Updating admin notes for ticket:", {
      ticketId,
      ticketData: currentTicket,
      adminNotes: formData.adminNotes
    });

    const loadingToast = toastUtils.loading("Updating admin notes...");
    
    try {
      await updateTicketAdminNotes({ 
        ticketId, 
        adminNotes: formData.adminNotes 
      }).unwrap();
      
      toastUtils.dismiss(loadingToast);
      
      toastUtils.success("Admin notes updated successfully!");
      
      setHasNotesChanged(false);
    } catch (error) {
      toastUtils.dismiss(loadingToast);
      
      console.error("Admin notes update error:", error);
      
      const errorMessage = error?.data?.message || error?.message || "Failed to update admin notes. Please try again.";
      toastUtils.error(errorMessage);
    }
  };

  const handleSave = async () => {
    const statusChanged = formData.status !== currentTicket?.status;
    const notesChanged = hasNotesChanged;

    if (statusChanged) {
      // Only show status toast if notes haven't changed (to avoid duplicate toasts)
      await handleStatusUpdate(formData.status, !notesChanged);
    }

    if (notesChanged) {
      await handleAdminNotesUpdate();
    }

    if (onSave) {
      onSave({ ...currentTicket, ...formData });
    }
    onClose();
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(currentTicket.id);
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
    return statusOption ? statusOption.color : "bg-[#FDB52A]";
  };

  // Show loading state while fetching ticket details
  if (isLoadingTicket) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#171D41] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-lg">Loading ticket details...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if there's an error fetching ticket details
  if (ticketError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#171D41] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-400 text-lg">
              Error loading ticket details: {ticketError?.data?.message || ticketError?.message || 'Unknown error'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen || !currentTicket) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#171D41] rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 flex-shrink-0">
          <h2 className="text-xl font-semibold text-white">
            {currentMode === "edit" ? "Edit Ticket" : "Ticket Information"}
          </h2>
          <div className="flex items-center gap-3">
            {currentMode === "view" && (
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors text-sm font-medium"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto scrollbar-hide flex-1">
          {/* Ticket Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-inter text-[#FFFFFF]/70 mb-2">
                  Ticket ID
                </label>
                <p className="text-[#EDEDED] font-medium font-inter">
                  {currentTicket.ticket_id || currentTicket.id}
                </p>
              </div>
              <div>
                <label className="block text-[13px] font-inter text-[#FFFFFF]/70 mb-2">
                  Order ID
                </label>
                <p className="text-[#EDEDED] font-medium font-inter">
                  {currentTicket.order_id || currentTicket.orderId}
                </p>
              </div>
              <div>
                <label className="block text-[13px] font-inter text-[#FFFFFF]/70 mb-2">
                  Assigned Staff
                </label>
                <p className="text-[#EDEDED] font-medium font-inter">
                  {currentTicket.claimed_by ? 
                    (currentTicket.claimed_by.name || "--") : 
                    "--"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-inter text-[#FFFFFF]/70 mb-2">
                  Customer Email
                </label>
                <p className="text-[#EDEDED] font-medium font-inter">
                  {currentTicket.user_id?.email || currentTicket.customer_email || currentTicket.customerEmail}
                </p>
              </div>
              <div>
                <label className="block text-[13px] font-inter text-[#FFFFFF]/70 mb-2">
                  Status
                </label>
                <div className="relative">
                  <button
                    type="button"
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-md border border-[#14F195] bg-[#14F19533] text-[#14F195] text-sm font-inter font-medium ${
                      statusOptions.length === 0 ? 'cursor-default' : 'cursor-pointer'
                    }`}
                    onClick={() => {
                      if (currentMode === "edit" && statusOptions.length > 0) {
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
                    {currentMode === "edit" && statusOptions.length > 0 && (
                      <ChevronDown className="w-4 h-4 text-[#14F195]" />
                    )}
                  </button>

                  {currentMode === "edit" && isStatusDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-md shadow-xl z-10 min-w-[150px]">
                      {getStatusOptions(formData.status).map((option) => (
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
              <div>
                <label className="block text-[13px] font-inter text-[#FFFFFF]/70 mb-2">
                  Created
                </label>
                <p className="text-[#EDEDED] font-medium font-inter">
                  {currentTicket.createdAt ? new Date(currentTicket.createdAt).toLocaleString() : formData.createdAt}
                </p>
              </div>
              <div>
                <label className="block text-[13px] font-inter text-[#FFFFFF]/70 mb-2">
                  Last Updated
                </label>
                <p className="text-[#EDEDED] font-medium font-inter">
                  {currentTicket.updatedAt ? new Date(currentTicket.updatedAt).toLocaleString() : "N/A"}
                </p>
              </div>
            </div>
          </div>


        

          {/* Admin Notes */}
          <div>
            <label className="block text-[13px] font-inter text-[#FFFFFF]/70 mb-2">
              Internal Admin Notes
            </label>
            <textarea
              value={formData.adminNotes}
              onChange={(e) => handleInputChange("adminNotes", e.target.value)}
              disabled={currentMode === "view"}
              placeholder="Add Internal notes about this ticket..."
              rows={4}
              className="w-full bg-[#121B36] border border-[#3A3A4E] rounded-lg px-3 py-2 text-white text-md font-inter placeholder-[#AEB9E1] disabled:opacity-50 resize-none"
            />
          </div>
        </div>

        {/* Action Buttons - Fixed at Bottom */}
        <div className="flex items-center justify-end gap-3 p-6 flex-shrink-0 bg-[#171D41]">
          <div className="flex gap-3">
            <button
              onClick={currentMode === "edit" ? handleCancelEdit : onClose}
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
            {currentMode === "edit" && (
              <button
                onClick={handleSave}
                disabled={isUpdatingStatus || isUpdatingNotes}
                className="px-6 py-2 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white rounded-full hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(isUpdatingStatus || isUpdatingNotes) ? "Saving..." : "Save Changes"}
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
        itemName={currentTicket?.ticket_id || currentTicket?.id || "Ticket"}
        itemDescription={
          currentTicket?.subject ||
          "This ticket will be permanently deleted from the system"
        }
        itemDate={`Created ${currentTicket?.createdAt ? new Date(currentTicket.createdAt).toLocaleString() : "Unknown"}`}
        confirmButtonText="Delete Ticket"
        type="delete"
      />
    </div>
  );
};

export default TicketDetailsModal;
