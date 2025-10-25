import React, { useState, useRef, useEffect } from "react";
import { MoreHorizontal, ChevronDown } from "lucide-react";
import ActionsMenu from "../pages/mealAdminPages/tickets/features/ActionsMenu";

const ReusableTable = ({
  columns = [],
  data = [],
  onRowClick,
  selectedRow = null,
  actions = null,
  onView = null,
  onEdit = null,  
  onDelete = null,
  onResendViaEmail = null,
  onOpenInChat = null, // New prop for open in chat callback
  onAddProperty = null, // New prop for add property callback
  onStatusChange = null, // New prop for status change callback
  tableType = "tickets", // "orders", "tickets", "staff"
  isLoading = false, // New prop for loading state
}) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState("bottom");
  const [activeStatusDropdown, setActiveStatusDropdown] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close menu if click is outside any actions menu
      if (activeMenu && !event.target.closest("[data-actions-container]")) {
        setActiveMenu(null);
      }
      // Close status dropdown if click is outside any status dropdown
      if (
        activeStatusDropdown &&
        !event.target.closest("[data-status-container]")
      ) {
        setActiveStatusDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenu, activeStatusDropdown]);

  const handleMenuClick = (e, rowId, index) => {
    e.stopPropagation();

    // Determine menu position based on row position
    const isFirstRow = index === 0;
    const isLastRow = index === data.length - 1;
    const isSecondLastRow = index === data.length - 2;

    if (isFirstRow) {
      setMenuPosition("bottom");
    } else if (isLastRow || isSecondLastRow) {
      setMenuPosition("top");
    } else {
      setMenuPosition("bottom");
    }

    setActiveMenu(activeMenu === rowId ? null : rowId);
  };

  const handleView = (row) => {
    console.log("ReusableTable handleView called with:", row);
    if (onView) {
      console.log("Calling onView callback with:", row);
      onView(row);
    }
    setActiveMenu(null);
  };

  const handleEdit = (row) => {
    console.log("ReusableTable handleEdit called with:", row);
    if (onEdit) {
      console.log("Calling onEdit callback with:", row);
      onEdit(row);
    }
    setActiveMenu(null);
  };

  const handleDelete = (row) => {
    console.log("ReusableTable handleDelete called with:", row);
    if (onDelete) {
      console.log("Calling onDelete callback with:", row);
      onDelete(row);
    }
    setActiveMenu(null);
  };

  const handleResendViaEmail = (row) => {
    console.log("ReusableTable handleResendViaEmail called with:", row);
    if (onResendViaEmail) {
      console.log("Calling onResendViaEmail callback with:", row);
      onResendViaEmail(row);
    }
    setActiveMenu(null);
  };

  const handleOpenInChat = (row) => {
    console.log("ReusableTable handleOpenInChat called with:", row);
    if (onOpenInChat) {
      console.log("Calling onOpenInChat callback with:", row);
      onOpenInChat(row);
    }
    setActiveMenu(null);
  };

  const handleStatusClick = (e, rowId) => {
    e.stopPropagation();
    setActiveStatusDropdown(activeStatusDropdown === rowId ? null : rowId);
  };

  const handleStatusChange = (e, row, newStatus) => {
    e.stopPropagation(); // Prevent row click from triggering
    if (onStatusChange) {
      onStatusChange(row, newStatus);
    }
    setActiveStatusDropdown(null);
  };

  // Define status progression for tickets
  const getTicketStatusProgression = (currentStatus) => {
    const progression = {
      OPEN: ["FULFILLED"], // Direct from OPEN to FULFILLED
      FULFILLED: [], // No further progression - no dropdown options
      RESOLVED: [], // No further progression - RESOLVED maps to FULFILLED in frontend
    };
    return progression[currentStatus] || [];
  };

  // Define status options for different table types
  const getStatusOptions = (tableType, currentStatus = null) => {
    const statusOptions = {
      orders: [
        {
          value: "PENDING",
          label: "Pending",
          color: "text-[#FDB52A]",
          bg: "bg-[#FDB52A33]",
          border: "border-[#FDB52A]",
        },
        {
          value: "PLACED",
          label: "Placed",
          color: "text-[#14F195]",
          bg: "bg-[#14F19533]",
          border: "border-[#14F195]",
        },
        {
          value: "CANCELLED",
          label: "Cancelled",
          color: "text-[#6B7280]",
          bg: "bg-[#6B728033]",
          border: "border-[#6B7280]",
        },
      ],
      tickets: [
        {
          value: "ORDERING",
          label: "Ordering",
          color: "text-[#FDB52A]",
          bg: "bg-[#FDB52A33]",
          border: "border-[#FDB52A]",
        },
        {
          value: "FULFILLED",
          label: "Fulfilled",
          color: "text-[#10B981]",
          bg: "bg-[#10B98133]",
          border: "border-[#10B981]",
        },
      ],
      staff: [
        {
          value: "active",
          label: "Active",
          color: "text-[#14F195]",
          bg: "bg-[#14F19533]",
          border: "border-[#14F195]",
        },
        {
          value: "inactive",
          label: "Inactive",
          color: "text-[#EF4444]",
          bg: "bg-[#EF444433]",
          border: "border-[#EF4444]",
        },
      ],
    };
    
    // For tickets, return progressive options based on current status
    if (tableType === "tickets" && currentStatus) {
      const availableStatuses = getTicketStatusProgression(currentStatus);
      const allTicketStatuses = statusOptions.tickets;
      
      // If current status has available progressions, show only those options
      if (availableStatuses.length > 0) {
        return allTicketStatuses.filter(status => 
          availableStatuses.includes(status.value)
        );
      }
      
      // If no progression available (like FULFILLED or CANCELLED), return empty array
      return [];
    }
    
    return statusOptions[tableType] || statusOptions.orders;
  };

  const getStatusBadge = (status, row) => {
    // Handle undefined or null status
    if (!status) {
      return (
        <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold min-w-[100px] bg-gray-100 text-gray-400 border border-gray-300">
          Unknown
        </div>
      );
    }

    const statusConfig = {
      // Order statuses (uppercase from API)
      PLACED: {
        bg: "bg-[#14F19533]",
        text: "text-[#14F195]",
        label: "Placed",
        border: "border border-[#14F195]",
      },
      PENDING: {
        bg: "bg-[#FDB52A33]",
        text: "text-[#FDB52A]",
        label: "Pending",
        border: "border border-[#FDB52A]",
      },
      CANCELLED: {
        bg: "bg-[#6B728033]",
        text: "text-[#6B7280]",
        label: "Cancelled",
        border: "border border-[#6B7280]",
      },
      // Legacy lowercase support
      fulfilled: {
        bg: "bg-[#14F19533]",
        text: "text-[#14F195]",
        label: "Fulfilled",
        border: "border border-[#14F195]",
      },
      processing: {
        bg: "bg-[#3B82F633]",
        text: "text-[#3B82F6]",
        label: "Processing",
        border: "border border-[#3B82F6]",
      },
      pending: {
        bg: "bg-[#FDB52A33]",
        text: "text-[#FDB52A]",
        label: "Pending",
        border: "border border-[#FDB52A]",
      },
      refunded: {
        bg: "bg-[#EF444433]",
        text: "text-[#EF4444]",
        label: "Refunded",
        border: "border border-[#EF4444]",
      },
      cancelled: {
        bg: "bg-[#6B728033]",
        text: "text-[#6B7280]",
        label: "Cancelled",
        border: "border border-[#6B7280]",
      },
      paid: {
        bg: "bg-[#14F19533]",
        text: "text-[#14F195]",
        label: "Paid",
        border: "border border-[#14F195]",
      },
      // Ticket statuses (uppercase from API)
      ORDERING: {
        bg: "bg-[#FDB52A33]",
        text: "text-[#FDB52A]",
        label: "Ordering",
        border: "border border-[#FDB52A]",
      },
      ORDERED_SUCCESSFULLY: {
        bg: "bg-[#14F19533]",
        text: "text-[#14F195]",
        label: "Ordered Successfully",
        border: "border border-[#14F195]",
      },
      IN_PROGRESS: {
        bg: "bg-[#3B82F633]",
        text: "text-[#3B82F6]",
        label: "Dispatch",
        border: "border border-[#3B82F6]",
      },
      FULFILLED: {
        bg: "bg-[#10B98133]",
        text: "text-[#10B981]",
        label: "Fulfilled",
        border: "border border-[#10B981]",
      },
      CANCELLED_TICKET: {
        bg: "bg-[#F59E0B33]",
        text: "text-[#F59E0B]",
        label: "Cancelled",
        border: "border border-[#F59E0B]",
      },
      // Legacy status mappings for tickets
      OPEN: {
        bg: "bg-[#EF444433]",
        text: "text-[#EF4444]",
        label: "Open",
        border: "border border-[#EF4444]",
      },
      RESOLVED: {
        bg: "bg-[#14F19533]",
        text: "text-[#14F195]",
        label: "Resolved",
        border: "border border-[#14F195]",
      },
      // Legacy lowercase support
      "in progress": {
        bg: "bg-[#3B82F633]",
        text: "text-[#3B82F6]",
        label: "In Progress",
        border: "border border-[#3B82F6]",
      },
      resolved: {
        bg: "bg-[#14F19533]",
        text: "text-[#14F195]",
        label: "Resolved",
        border: "border border-[#14F195]",
      },
      open: {
        bg: "bg-[#EF444433]",
        text: "text-[#EF4444]",
        label: "Open",
        border: "border border-[#EF4444]",
      },
      closed: {
        bg: "bg-[#6B728033]",
        text: "text-[#6B7280]",
        label: "Closed",
        border: "border border-[#6B7280]",
      },
      // Staff statuses
      active: {
        bg: "bg-[#14F19533]",
        text: "text-[#14F195]",
        label: "Active",
        border: "border border-[#14F195]",
      },
      inactive: {
        bg: "bg-[#EF444433]",
        text: "text-[#EF4444]",
        label: "Inactive",
        border: "border border-[#EF4444]",
      },
      // Property statuses
      maintenance: {
        bg: "bg-[#F59E0B33]",
        text: "text-[#F59E0B]",
        label: "Maintenance",
        border: "border border-[#F59E0B]",
      },
      // Additional property statuses
      pending: {
        bg: "bg-[#3B82F633]",
        text: "text-[#3B82F6]",
        label: "Pending",
        border: "border border-[#3B82F6]",
      },
      closed: {
        bg: "bg-[#6B728033]",
        text: "text-[#6B7280]",
        label: "Closed",
        border: "border border-[#6B7280]",
      },
    };

    // Handle special case for cancelled tickets
    let config = statusConfig[status] || (status ? statusConfig[status.toLowerCase()] : null);
    
    // If status is CANCELLED and we're dealing with tickets, use CANCELLED_TICKET
    if (status === "CANCELLED" && tableType === "tickets" && !config) {
      config = statusConfig.CANCELLED_TICKET;
    }
    
    // Fallback to PENDING if no config found
    if (!config) {
      config = statusConfig.PENDING;
    }

    // For orders and properties, show static badge without dropdown
    if (tableType === "orders" || tableType === "properties") {
      return (
        <div className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold min-w-[100px] ${
          config.bg
        } ${config.text} ${config.border || ""}`}>
          {config.label}
        </div>
      );
    }

    // For other table types (tickets, staff), show dropdown only if options available
    const statusOptions = getStatusOptions(tableType, status);

    // If no status options available (like FULFILLED or CANCELLED), show static badge
    if (statusOptions.length === 0) {
      return (
        <div className={`inline-flex items-center justify-center gap-2 px-3 py-1 rounded-lg text-[10px] font-medium min-w-[100px] ${
          config.bg
        } ${config.text} ${config.border || ""}`}>
          {config.label}
        </div>
      );
    }

    return (
      <div className="relative" data-status-container>
        <button
          onClick={(e) => handleStatusClick(e, row.id)}
          className={`inline-flex items-center justify-center gap-2 px-3 py-1 rounded-lg text-[10px] font-medium min-w-[100px] cursor-pointer hover:opacity-80 transition-opacity ${
            config.bg
          } ${config.text} ${config.border || ""}`}
        >
          {config.label}
          <ChevronDown className="w-3 h-3" />
        </button>

        {activeStatusDropdown === row.id && (
          <div className="absolute top-full left-0 mt-1 bg-[#171D41] border border-[#3A3A4E] rounded-lg shadow-xl z-20 min-w-[120px]">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={(e) => handleStatusChange(e, row, option.value)}
                className={`w-full text-left px-3 py-2 text-[10px] font-medium hover:bg-[#3A3A4E] transition-colors first:rounded-t-lg last:rounded-b-lg ${
                  status === option.value || (status && status.toLowerCase() === option.value.toLowerCase())
                    ? `${option.color} ${option.bg}`
                    : "text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const formatDiscount = (discount) => {
    return `${discount}%`;
  };

  const renderCellValue = (column, value, row) => {
    switch (column.key) {
      case "status":
        return getStatusBadge(value, row);
      case "amount":
        return formatCurrency(value);
      case "discount":
        return formatDiscount(value);
      case "name":
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">🏨</span>
            </div>
            <span className="font-medium text-white">{value}</span>
          </div>
        );
      case "address":
        return (
          <div className="text-[#AEB9E1] text-xs max-w-[200px] truncate" title={value}>
            {value}
          </div>
        );
      case "totalRooms":
        return (
          <div className="text-left">
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-500/30">
              {value}
            </span>
          </div>
        );
      case "availableRooms":
        return (
          <div className="text-left">
            <span className="bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg text-xs font-semibold border border-green-500/30">
              {value}
            </span>
          </div>
        );
      case "roomTypes":
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-wrap gap-2">
              {value.map((room, index) => (
                <span key={index} className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 px-3 py-1.5 rounded-lg text-xs font-medium border border-purple-500/30">
                  <span className="capitalize font-semibold">{room.type}</span>
                  <span className="text-white ml-1">${room.price}</span>
                </span>
              ))}
            </div>
          );
        }
        return value;
      case "contactEmail":
        return (
          <div className="text-xs">
            <div className="text-white font-medium">{value}</div>
            {row.contactPhone && (
              <div className="text-[#AEB9E1] mt-1">{row.contactPhone}</div>
            )}
          </div>
        );
      case "owner_id":
        // Handle both string ID and populated user object
        const staffId = typeof value === 'object' && value?._id ? value._id : value;
        const staffName = typeof value === 'object' && value?.name ? value.name : null;
        return (
          <div className="text-center">
            <span className="bg-orange-500/20 text-orange-400 px-3 py-1.5 rounded-lg text-xs font-semibold border border-orange-500/30">
              {staffId || "N/A"}
            </span>
            {staffName && (
              <div className="text-xs text-[#AEB9E1] mt-1 truncate max-w-[100px]" title={staffName}>
                {staffName}
              </div>
            )}
          </div>
        );
      // Booking specific cases
      case "bookingReference":
        return (
          <div className="font-mono text-sm font-semibold text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/30">
            {value}
          </div>
        );
      case "guestName":
        return (
          <div>
            <div className="font-medium text-white">{value}</div>
            <div className="text-xs text-[#AEB9E1]">{row.guestEmail}</div>
            <div className="text-xs text-[#AEB9E1]">{row.guestPhone}</div>
          </div>
        );
      case "property_id":
        return (
          <div>
            <div className="font-medium text-white">{value?.name}</div>
            <div className="text-xs text-[#AEB9E1] max-w-[200px] truncate" title={value?.address}>
              {value?.address}
            </div>
          </div>
        );
      case "checkInDate":
        return (
          <div className="text-sm">
            <div className="flex items-center gap-1 text-green-400">
              <span>→</span>
              <span>{new Date(value).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1 text-red-400">
              <span>←</span>
              <span>{new Date(row.checkOutDate).toLocaleDateString()}</span>
            </div>
            <div className="text-xs text-[#AEB9E1] mt-1">
              {Math.ceil((new Date(row.checkOutDate) - new Date(value)) / (1000 * 60 * 60 * 24))} nights
            </div>
          </div>
        );
      case "numberOfGuests":
        return (
          <div className="text-center">
            <div className="text-sm">
              <span className="font-medium text-white">{value}</span> guests
            </div>
            <div className="text-xs text-[#AEB9E1]">
              {row.totalRooms} room{row.totalRooms > 1 ? "s" : ""}
            </div>
          </div>
        );
      case "bookedRooms":
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-col gap-1">
              {value.map((room, index) => (
                <span key={index} className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                  {room.quantity}x {room.roomType}
                </span>
              ))}
            </div>
          );
        }
        return value;
      case "totalAmount":
        return (
          <div className="text-right">
            <div className="font-bold text-lg text-green-400">
              ${Number(value).toFixed(2)}
            </div>
            <div className="text-xs text-[#AEB9E1]">{row.currency || "USD"}</div>
          </div>
        );
      case "bookingStatus":
        const bookingStatusConfig = {
          pending: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Pending", border: "border-yellow-500/30" },
          confirmed: { bg: "bg-green-500/20", text: "text-green-400", label: "Confirmed", border: "border-green-500/30" },
          cancelled: { bg: "bg-red-500/20", text: "text-red-400", label: "Cancelled", border: "border-red-500/30" },
          completed: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Completed", border: "border-blue-500/30" },
          "no-show": { bg: "bg-gray-500/20", text: "text-gray-400", label: "No-show", border: "border-gray-500/30" },
        };
        const bookingConfig = bookingStatusConfig[value] || bookingStatusConfig.pending;
        return (
          <div className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold min-w-[100px] ${bookingConfig.bg} ${bookingConfig.text} ${bookingConfig.border}`}>
            {bookingConfig.label}
          </div>
        );
      case "paymentStatus":
        const paymentStatusConfig = {
          pending: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "Pending", border: "border-yellow-500/30" },
          paid: { bg: "bg-green-500/20", text: "text-green-400", label: "Paid", border: "border-green-500/30" },
          refunded: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Refunded", border: "border-blue-500/30" },
          failed: { bg: "bg-red-500/20", text: "text-red-400", label: "Failed", border: "border-red-500/30" },
        };
        const paymentConfig = paymentStatusConfig[value] || paymentStatusConfig.pending;
        return (
          <div className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold min-w-[100px] ${paymentConfig.bg} ${paymentConfig.text} ${paymentConfig.border}`}>
            {paymentConfig.label}
          </div>
        );
      case "createdAt":
        return (
          <div className="text-sm text-[#AEB9E1]">
            {new Date(value).toLocaleDateString()}
          </div>
        );
      case "actions":
        return (
          <div className="relative" data-actions-container>
            <button
              onClick={(e) => handleMenuClick(e, row._id || row.id, data.indexOf(row))}
              className="p-2 hover:bg-[#2A2A3E] rounded-lg transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-[#AEB9E1]" />
            </button>

            <ActionsMenu
              isOpen={activeMenu === (row._id || row.id)}
              onClose={() => setActiveMenu(null)}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onResendViaEmail={handleResendViaEmail}
              onOpenInChat={handleOpenInChat}
              onAddProperty={onAddProperty}
              position={menuPosition}
              rowData={row}
              tableType={tableType}
            />
          </div>
        );
      default:
        // Handle objects that might be passed as values
        if (value && typeof value === 'object' && !React.isValidElement(value)) {
          // If it's an object with id and email, display the email
          if (value.email) {
            return value.email;
          }
          // If it's an object with a name property, display the name
          if (value.name) {
            return value.name;
          }
          // If it's an object with a label property, display the label
          if (value.label) {
            return value.label;
          }
          // For any other object, convert to string representation
          return JSON.stringify(value);
        }
        return value;
    }
  };

  return (
    <div className="overflow-x-auto w-full">
      {/* Mobile/Tablet Card View */}
      <div className="block lg:hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#14F195]"></div>
            <div className="text-[#AEB9E1] text-sm font-medium">Loading...</div>
          </div>
        ) : data.length > 0 ? (
          <div className="space-y-4 p-4">
            {data.map((row, index) => (
              <div
                key={row.id || index}
                className="bg-[#2A2A3E] rounded-lg p-4 border border-[#3A3A4E] hover:bg-[#3A3A4E] transition-colors"
              >
                {/* Property Name & Status */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🏨</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{row.name}</h3>
                      <p className="text-[#AEB9E1] text-xs">{row.address}</p>
                    </div>
                  </div>
                  {getStatusBadge(row.status, row)}
                </div>

                {/* Room Info */}
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-center">
                    <p className="text-[#AEB9E1] text-xs mb-1">Total Rooms</p>
                    <span className="bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-500/30">
                      {row.totalRooms}
                    </span>
                  </div>
                  <div className="text-center">
                    <p className="text-[#AEB9E1] text-xs mb-1">Available</p>
                    <span className="bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg text-xs font-semibold border border-green-500/30">
                      {row.availableRooms}
                    </span>
                  </div>
                </div>

                {/* Room Types */}
                {row.roomTypes && Array.isArray(row.roomTypes) && (
                  <div className="mb-3">
                    <p className="text-[#AEB9E1] text-xs mb-2">Room Types</p>
                    <div className="flex flex-wrap gap-2">
                      {row.roomTypes.map((room, roomIndex) => (
                        <span key={roomIndex} className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 px-3 py-1.5 rounded-lg text-xs font-medium border border-purple-500/30">
                          <span className="capitalize font-semibold">{room.type}</span>
                          <span className="text-white ml-1">${room.price}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact */}
                <div className="mb-3">
                  <p className="text-[#AEB9E1] text-xs mb-2 font-medium">Contact Information</p>
                  <div className="bg-[#3A3A4E]/30 rounded-lg p-3">
                    <div className="text-xs">
                      <div className="text-white font-medium mb-1">{row.contactEmail}</div>
                      {row.contactPhone && (
                        <div className="text-[#AEB9E1]">{row.contactPhone}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-[#3A3A4E]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onView) onView(row);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 text-blue-400 px-3 py-2 rounded text-xs font-medium hover:bg-blue-500/30 transition"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    View
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onEdit) onEdit(row);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-yellow-500/20 text-yellow-400 px-3 py-2 rounded text-xs font-medium hover:bg-yellow-500/30 transition"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onDelete) onDelete(row);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 text-red-400 px-3 py-2 rounded text-xs font-medium hover:bg-red-500/30 transition"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-[#AEB9E1] text-sm font-medium">No data found</div>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <table className="w-full hidden lg:table table-fixed min-w-[1200px] text-left">
        <thead>
          <tr className="border-b border-[#EDEDED33]">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`text-left py-3 px-2 text-[10px] font-semibold text-white font-inter w-1/${columns.length} ${
                  column.className || ""
                }`}
                style={{ width: `${100 / columns.length}%` }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-12 px-2 text-center"
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#14F195]"></div>
                  <div className="text-[#AEB9E1] text-sm font-medium">
                    Loading...
                  </div>
                </div>
              </td>
            </tr>
          ) : data.length > 0 ? (
            data.map((row, index) => (
              <tr
                key={row.id || index}
                onClick={() => onRowClick && onRowClick(row)}
                className={`border-b border-[#EDEDED33] hover:bg-[#0A1330] hover:rounded-lg transition-all duration-200 cursor-pointer ${
                  selectedRow === row.id ? "bg-[#0A1330]" : ""
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`py-3 px-2 text-[10px] text-[#AEB9E1] font-medium font-inter w-1/${columns.length} text-left ${
                      column.className || ""
                    }`}
                    style={{ width: `${100 / columns.length}%` }}
                  >
                    {renderCellValue(column, row[column.key], row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="py-12 px-2 text-center"
              >
                <div className="text-[#AEB9E1] text-sm font-medium">
                  No data found
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReusableTable;
