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
  onPayCommission = null, // New prop for pay commission callback
  onStatusChange = null, // New prop for status change callback
  tableType = "tickets", // "orders", "tickets", "staff"
  isLoading = false, // New prop for loading state
}) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState("bottom");
  const [activeStatusDropdown, setActiveStatusDropdown] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close menu if click is outside the actions container
      if (activeMenu && !event.target.closest("[data-actions-container]")) {
        console.log("Closing menu due to outside click");
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

  useEffect(() => {
    console.log("activeMenu changed to:", activeMenu);
  }, [activeMenu]);

  const handleMenuClick = (e, rowId, index) => {
    e.stopPropagation();
    e.preventDefault();

    // Convert rowId to string for consistent comparison
    const rowIdStr = String(rowId);
    console.log("Menu clicked:", { rowId, rowIdStr, index, currentActiveMenu: activeMenu, tableType });

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

    const currentActiveMenuStr = activeMenu ? String(activeMenu) : null;
    const newActiveMenu = currentActiveMenuStr === rowIdStr ? null : rowIdStr;
    console.log("Setting activeMenu from", activeMenu, "to", newActiveMenu);
    setActiveMenu(newActiveMenu);
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
        <div className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold min-w-[100px] ${config.bg
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
        <div className={`inline-flex items-center justify-center gap-2 px-3 py-1 rounded-lg text-[10px] font-medium min-w-[100px] ${config.bg
          } ${config.text} ${config.border || ""}`}>
          {config.label}
        </div>
      );
    }

    return (
      <div className="relative" data-status-container>
        <button
          onClick={(e) => handleStatusClick(e, row.id)}
          className={`inline-flex items-center justify-center gap-2 px-3 py-1 rounded-lg text-[10px] font-medium min-w-[100px] cursor-pointer hover:opacity-80 transition-opacity ${config.bg
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
                className={`w-full text-left px-3 py-2 text-[10px] font-medium hover:bg-[#3A3A4E] transition-colors first:rounded-t-lg last:rounded-b-lg ${status === option.value || (status && status.toLowerCase() === option.value.toLowerCase())
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
          <div className="text-[#AEB9E1] text-xs break-words" title={value}>
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
              <div className="text-xs text-[#AEB9E1] mt-1 break-words" title={staffName}>
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
          <div className="space-y-1">
            <div className="font-semibold text-white text-sm break-words">{value}</div>
            <div className="text-xs text-[#AEB9E1] break-words" title={row.guestEmail}>{row.guestEmail}</div>
            <div className="text-xs text-[#AEB9E1] break-words">{row.guestPhone}</div>
          </div>
        );
      case "property_id":
        return (
          <div className="space-y-1">
            <div className="font-semibold text-white text-sm break-words">{value?.name}</div>
            <div className="text-xs text-[#AEB9E1] break-words" title={value?.address}>
              {value?.address}
            </div>
          </div>
        );
      case "checkInDate":
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <span className="text-xs">📅</span>
              <span className="font-medium">{new Date(value).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <span className="text-xs">📅</span>
              <span className="font-medium">{new Date(row.checkOutDate).toLocaleDateString()}</span>
            </div>
            <div className="text-xs text-[#AEB9E1] bg-blue-500/20 px-2 py-1 rounded-full text-center">
              {Math.ceil((new Date(row.checkOutDate) - new Date(value)) / (1000 * 60 * 60 * 24))} nights
            </div>
          </div>
        );
      case "numberOfGuests":
        return (
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-sm">
              <span className="text-xs">👥</span>
              <span className="font-semibold text-white">{value}</span>
              <span className="text-[#AEB9E1]">guests</span>
            </div>
            <div className="text-xs text-[#AEB9E1] bg-purple-500/20 px-2 py-1 rounded-full">
              {row.totalRooms} room{row.totalRooms > 1 ? "s" : ""}
            </div>
          </div>
        );
      case "bookedRooms":
        if (Array.isArray(value)) {
          return (
            <div className="flex flex-col gap-1">
              {value.map((room, index) => (
                <span key={index} className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 px-3 py-1.5 rounded-lg text-xs font-semibold border border-purple-500/30 text-center">
                  {room.quantity}x {room.roomType}
                </span>
              ))}
            </div>
          );
        }
        return value;
      case "totalAmount":
        return (
          <div className="text-center space-y-1">
            <div className="font-bold text-lg text-green-400">
              ${Number(value).toFixed(2)}
            </div>
            <div className="text-xs text-[#AEB9E1] bg-green-500/20 px-2 py-1 rounded-full">
              {row.currency || "USD"}
            </div>
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
      case "paymentType":
        const paymentTypeConfig = {
          online: { bg: "bg-blue-500/20", text: "text-blue-400", label: "Online", border: "border-blue-500/30", icon: "💳" },
          on_arrival: { bg: "bg-orange-500/20", text: "text-orange-400", label: "On Arrival", border: "border-orange-500/30", icon: "🏨" },
        };
        const typeConfig = paymentTypeConfig[value] || paymentTypeConfig.online;
        return (
          <div className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${typeConfig.bg} ${typeConfig.text} ${typeConfig.border}`}>
            <span className="text-xs">{typeConfig.icon}</span>
            <span className="text-xs">{typeConfig.label}</span>
          </div>
        );
      case "createdAt":
        return (
          <div className="text-center space-y-1">
            <div className="text-sm font-medium text-white">
              {new Date(value).toLocaleDateString()}
            </div>
            <div className="text-xs text-[#AEB9E1] bg-gray-500/20 px-2 py-1 rounded-full">
              {new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        );
      // Banner Ad specific cases
      case "image":
        return (
          <div className="w-20 h-20 rounded-lg overflow-hidden">
            {value ? (
              <img
                src={value}
                alt={row.title || "Banner"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <span className="text-gray-400 text-2xl">📷</span>
              </div>
            )}
          </div>
        );
      case "title":
        return (
          <div>
            <div className="font-semibold text-white">{value}</div>
            {row.description && (
              <div className="text-sm text-gray-400 line-clamp-1">{row.description}</div>
            )}
          </div>
        );
      case "priority":
        return (
          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm font-semibold">
            {value}
          </span>
        );
      case "clickCount":
        const clickLimit = row.clickLimit;
        const isLimitReached = clickLimit !== null && clickLimit !== undefined && value >= clickLimit;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-sm font-semibold ${isLimitReached
                ? "bg-red-500/20 text-red-400"
                : "bg-green-500/20 text-green-400"
                }`}>
                {value || 0} clicks
              </span>
            </div>
            {clickLimit !== null && clickLimit !== undefined && (
              <div className="text-xs text-[#AEB9E1]">
                Limit: {clickLimit} {isLimitReached && "✓ Reached"}
              </div>
            )}
            {(!clickLimit || clickLimit === null) && (
              <div className="text-xs text-[#AEB9E1]">Unlimited</div>
            )}
          </div>
        );
      case "isActive":
        const isExpired = row.endDate && new Date(row.endDate) < new Date();
        return (
          <div className="flex flex-col gap-1">
            <span
              className={`px-2 py-1 rounded text-xs font-semibold ${value && !isExpired
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
                }`}
            >
              {value && !isExpired ? "Active" : "Inactive"}
            </span>
            {isExpired && (
              <span className="text-xs text-red-400">Expired</span>
            )}
          </div>
        );
      case "startDate":
        return (
          <div className="text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <span className="text-xs">📅</span>
              <span>Start: {new Date(value).toLocaleDateString()}</span>
            </div>
            {row.endDate && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs">📅</span>
                <span>End: {new Date(row.endDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        );
      case "actions":
        const rowId = row._id || row.id;
        const rowIdStr = String(rowId);
        const activeMenuStr = activeMenu ? String(activeMenu) : null;
        const isMenuOpen = activeMenuStr === rowIdStr;
        return (
          <div className="relative z-[100]" data-actions-container style={{ position: 'relative' }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                console.log("Actions button clicked for row:", { rowId, rowIdStr, activeMenu, activeMenuStr, isMenuOpen });
                handleMenuClick(e, rowId, data.indexOf(row));
              }}
              className="p-2 hover:bg-[#2A2A3E] rounded-lg transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-[#AEB9E1]" />
            </button>

            {isMenuOpen && (
              <ActionsMenu
                isOpen={isMenuOpen}
                onClose={() => {
                  console.log("Closing menu for row:", rowIdStr);
                  setActiveMenu(null);
                }}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onResendViaEmail={handleResendViaEmail}
                onOpenInChat={handleOpenInChat}
                onAddProperty={onAddProperty}
                onPayCommission={onPayCommission}
                position={menuPosition}
                rowData={row}
                tableType={tableType}
              />
            )}
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
    <div className="overflow-x-auto overflow-y-visible w-full scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      {/* Mobile/Tablet Card View */}
      {/* Mobile/Tablet Card View - Stunning App Experience */}
      <div className="block lg:hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-16">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-[#14F195] animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-b-2 border-l-2 border-[#9945FF] animate-spin-slow"></div>
              </div>
            </div>
            <div className="text-[#AEB9E1] text-sm font-medium tracking-wide">Loading data...</div>
          </div>
        ) : data.length > 0 ? (
          <div className="space-y-5 p-4">
            {data.map((row, index) => {
              const rowId = row._id || row.id;

              // Staff Card
              if (tableType === "staff") {
                return (
                  <div key={rowId || index} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
                    <div className="relative bg-[#171D41] rounded-2xl p-5 border border-[#FFFFFF0D] shadow-2xl overflow-hidden">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#2A2D53] flex items-center justify-center relative">
                            <span className="text-xl font-bold text-white">
                              {row.name?.charAt(0).toUpperCase() || "S"}
                            </span>
                            {row.status === "Active" && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#14F195] border-4 border-[#171D41]"></div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-base leading-tight">{row.name}</h3>
                            <p className="text-[#AEB9E1] text-xs mt-0.5">{row.email}</p>
                          </div>
                        </div>
                        {getStatusBadge(row.status, row)}
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-5">
                        <div className="bg-[#2A2D53]/50 rounded-xl p-3 border border-[#FFFFFF05]">
                          <p className="text-[#AEB9E1]/60 text-[10px] uppercase font-bold tracking-wider mb-1">Role</p>
                          <p className="text-white text-xs font-semibold">{row.role}</p>
                        </div>
                        <div className="bg-[#2A2D53]/50 rounded-xl p-3 border border-[#FFFFFF05]">
                          <p className="text-[#AEB9E1]/60 text-[10px] uppercase font-bold tracking-wider mb-1">Created</p>
                          <p className="text-white text-xs font-semibold">
                            {new Date(row.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-[#FFFFFF0D]">
                        <button
                          onClick={(e) => { e.stopPropagation(); onView?.(row); }}
                          className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-all active:scale-95"
                        >
                          View
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onEdit?.(row); }}
                          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white text-xs font-bold shadow-lg shadow-[#14F19522] transition-all active:scale-95"
                        >
                          Edit
                        </button>
                        <div className="relative" data-actions-container>
                          <button
                            onClick={(e) => handleMenuClick(e, rowId, index)}
                            className="bg-[#2A2D53] p-2.5 rounded-xl text-white hover:bg-[#323664] transition-all"
                          >
                            <MoreHorizontal size={18} />
                          </button>
                          {activeMenu === String(rowId) && (
                            <div className="absolute bottom-full right-0 mb-2 z-50">
                              <ActionsMenu
                                isOpen={true}
                                onClose={() => setActiveMenu(null)}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onResendViaEmail={handleResendViaEmail}
                                onOpenInChat={handleOpenInChat}
                                onAddProperty={onAddProperty}
                                onPayCommission={onPayCommission}
                                position="top"
                                rowData={row}
                                tableType={tableType}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Booking Card
              if (tableType === "bookings") {
                const nights = Math.ceil((new Date(row.checkOutDate) - new Date(row.checkInDate)) / (1000 * 60 * 60 * 24));
                return (
                  <div key={rowId || index} className="bg-[#171D41] rounded-2xl p-5 border border-[#FFFFFF0D] shadow-xl relative overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-[#14F195] tracking-[0.2em] uppercase mb-1">
                          Ref: {row.bookingReference?.split('-').pop()}
                        </span>
                        <h3 className="font-semibold text-white text-base leading-tight">{row.guestName}</h3>
                      </div>
                      {getStatusBadge(row.bookingStatus, row)}
                    </div>

                    <div className="bg-[#2A2D53]/30 rounded-2xl p-4 mb-4 border border-[#FFFFFF05]">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-col">
                          <p className="text-[#AEB9E1]/60 text-[10px] uppercase font-bold mb-1">Check In</p>
                          <p className="text-white text-xs font-semibold">{new Date(row.checkInDate).toLocaleDateString()}</p>
                        </div>
                        <div className="h-8 w-px bg-[#FFFFFF0D]"></div>
                        <div className="flex flex-col text-right">
                          <p className="text-[#AEB9E1]/60 text-[10px] uppercase font-bold mb-1">Check Out</p>
                          <p className="text-white text-xs font-semibold">{new Date(row.checkOutDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-[#FFFFFF0D] flex justify-between items-center">
                        <span className="text-[#AEB9E1] text-[10px] font-medium">{nights} Nights • {row.numberOfGuests} Guests</span>
                        <span className="text-[#14F195] font-bold text-sm">${row.totalAmount}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <span className="text-xs">💳</span>
                        </div>
                        <span className="text-[#AEB9E1] text-xs capitalize">{row.paymentType} • {row.paymentStatus}</span>
                      </div>
                      <button
                        onClick={() => onView?.(row)}
                        className="p-2.5 rounded-xl bg-[#2A2D53] text-white hover:bg-[#323664] transition-all"
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </div>
                );
              }

              // Properties Card
              if (tableType === "properties") {
                return (
                  <div key={rowId || index} className="bg-[#171D41] rounded-2xl overflow-hidden border border-[#FFFFFF0D] shadow-xl group">
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={row.photos?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                        alt={row.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#171D41] to-transparent opacity-60"></div>
                      <div className="absolute top-4 left-4">
                        {getStatusBadge(row.status, row)}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-semibold text-lg leading-tight truncate">{row.name}</h3>
                        <p className="text-[#AEB9E1] text-xs flex items-center gap-1 mt-1">
                          <span className="text-sm">📍</span> {row.address}
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex gap-4">
                          <div className="flex flex-col">
                            <span className="text-[#AEB9E1]/60 text-[10px] uppercase font-bold">Rooms</span>
                            <span className="text-white text-xs font-bold">{row.totalRooms} Total</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[#AEB9E1]/60 text-[10px] uppercase font-bold">Avail</span>
                            <span className="text-[#14F195] text-xs font-bold">{row.availableRooms} Left</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[#AEB9E1]/60 text-[10px] uppercase font-bold block">Avg. Price</span>
                          <span className="text-white font-bold text-sm">${row.roomTypes?.[0]?.price || 0}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => onView?.(row)} className="flex-1 py-2.5 rounded-xl bg-[#2A2D53] text-white text-xs font-bold">View Details</button>
                        <button onClick={() => onEdit?.(row)} className="px-3 rounded-xl bg-white/10 text-white"><span className="text-sm">⚙️</span></button>
                      </div>
                    </div>
                  </div>
                );
              }

              // Tickets Card
              if (tableType === "tickets") {
                return (
                  <div key={rowId || index} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-500"></div>
                    <div className="relative bg-[#171D41] rounded-2xl p-5 border border-[#FFFFFF0D] shadow-2xl overflow-hidden">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <span className="text-lg">🎫</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-sm leading-tight">#{row.id}</h3>
                            <p className="text-[#AEB9E1] text-[10px] truncate max-w-[120px]">{row.subject}</p>
                          </div>
                        </div>
                        {getStatusBadge(row.status, row)}
                      </div>

                      <div className="bg-[#2A2D53]/30 rounded-xl p-3 mb-4 border border-[#FFFFFF05]">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[#AEB9E1]/60 text-[10px] font-bold uppercase">Customer</span>
                          <span className="text-white text-[10px] font-medium">{row.customerName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#AEB9E1]/60 text-[10px] font-bold uppercase">Last Update</span>
                          <span className="text-[#AEB9E1] text-[10px]">{row.lastUpdated}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); onOpenInChat?.(row); }}
                          className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-[10px] font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                          <span>💬</span> Open Chat
                        </button>
                        <div className="relative" data-actions-container>
                          <button
                            onClick={(e) => handleMenuClick(e, rowId, index)}
                            className="bg-[#2A2D53] p-2.5 rounded-xl text-white hover:bg-[#323664] transition-all h-full"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          {activeMenu === String(rowId) && (
                            <div className="absolute bottom-full right-0 mb-2 z-50">
                              <ActionsMenu
                                isOpen={true}
                                onClose={() => setActiveMenu(null)}
                                onView={handleView}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onResendViaEmail={handleResendViaEmail}
                                onOpenInChat={handleOpenInChat}
                                onAddProperty={onAddProperty}
                                onPayCommission={onPayCommission}
                                position="top"
                                rowData={row}
                                tableType={tableType}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Orders Card
              if (tableType === "orders") {
                return (
                  <div key={rowId || index} className="bg-[#171D41] rounded-2xl p-5 border border-[#FFFFFF0D] shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <span className="text-4xl text-white">📦</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-cyan-400 tracking-wider mb-1">ORDER #{row.order_id}</span>
                        <h3 className="font-semibold text-white text-sm truncate max-w-[150px]">{row.customer_email}</h3>
                      </div>
                      {getStatusBadge(row.status, row)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex flex-col">
                        <span className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase mb-1">Total Amount</span>
                        <span className="text-white font-bold text-base">${row.amount?.toFixed(2)}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase mb-1">Payment</span>
                        <span className="text-[#14F195] font-bold text-xs uppercase">{row.payment}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#FFFFFF0D]">
                      <span className="text-[#AEB9E1] text-[10px] font-medium">{row.timestamp}</span>
                      <div className="flex gap-2">
                        <button onClick={() => onView?.(row)} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold transition-all">View</button>
                        <button onClick={(e) => handleMenuClick(e, rowId, index)} className="p-2 rounded-lg bg-[#2A2D53] text-white"><MoreHorizontal size={14} /></button>
                      </div>
                    </div>
                  </div>
                );
              }

              // Contacts Card
              if (tableType === "contacts") {
                return (
                  <div key={rowId || index} className="bg-[#171D41] rounded-2xl p-5 border border-[#FFFFFF0D] shadow-xl hover:bg-[#1C244D] transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                          <span className="text-lg">📧</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-sm">{row.name}</h3>
                          <p className="text-[#AEB9E1] text-[10px]">{row.email}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-lg font-bold uppercase ${row.status === 'unread' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                        {row.status}
                      </span>
                    </div>

                    <div className="bg-[#0A1330]/50 rounded-xl p-3 mb-4">
                      <p className="text-white text-[11px] font-bold mb-1 truncate">{row.subject}</p>
                      <p className="text-[#AEB9E1] text-[10px] line-clamp-2 italic leading-relaxed">"{row.message}"</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-[#AEB9E1]/60 font-bold uppercase">{new Date(row.createdAt).toLocaleDateString()}</span>
                        <span className="text-[9px] text-[#AEB9E1]/40 uppercase">{new Date(row.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <button
                        onClick={() => alert(`Full Message:\n\n${row.message}`)}
                        className="px-4 py-2 rounded-xl bg-[#2A2D53] text-white text-[10px] font-bold hover:bg-white/10 transition-all flex items-center gap-2"
                      >
                        Read Full
                      </button>
                    </div>
                  </div>
                );
              }

              // Default Fallback Card
              return (
                <div
                  key={rowId || index}
                  className="bg-[#171D41] rounded-2xl p-5 border border-[#FFFFFF0D] shadow-xl hover:bg-[#1C244D] transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-xl">
                        {tableType === "orders" ? "📦" : tableType === "tickets" ? "🎫" : "📄"}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm">{row.name || row.title || row.bookingReference || "N/A"}</h3>
                        <p className="text-[#AEB9E1] text-[10px] mt-0.5">{row.email || row.guestEmail || row.type || tableType}</p>
                      </div>
                    </div>
                    {getStatusBadge(row.status || row.bookingStatus, row)}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#FFFFFF0D]">
                    <div className="text-xs text-[#AEB9E1]">
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "No date"}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.stopPropagation(); onView?.(row); }} className="px-4 py-1.5 rounded-lg bg-[#2A2D53] text-white text-[10px] font-bold">View</button>
                      <button onClick={(e) => handleMenuClick(e, rowId, index)} className="p-1.5 rounded-lg bg-white/5 text-white"><MoreHorizontal size={14} /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="w-20 h-20 bg-[#171D41] rounded-full flex items-center justify-center mb-4 border border-[#FFFFFF0D]">
              <span className="text-4xl filter grayscale opacity-40">📂</span>
            </div>
            <h3 className="text-white font-bold text-lg mb-1">No Records Found</h3>
            <p className="text-[#AEB9E1] text-sm max-w-xs">We couldn't find any data to display here at the moment.</p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <table className="w-full hidden lg:table table-auto text-left border-separate border-spacing-0">
        <thead>
          <tr className="border-b border-[#EDEDED33]">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`text-left py-5 px-6 text-sm font-semibold text-white font-inter ${column.className || ""
                  }`}
                style={{
                  width: `${100 / columns.length}%`,
                  minWidth: column.className ? column.className.replace('min-w-[', '').replace(']', '') : '140px',
                  maxWidth: column.key === 'paymentType' ? '150px' : '300px',
                  overflow: 'visible'
                }}
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
                className={`border-b border-[#EDEDED33] hover:bg-[#0A1330] hover:rounded-lg transition-all duration-200 cursor-pointer my-2 ${selectedRow === row.id ? "bg-[#0A1330]" : ""
                  }`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`py-5 px-6 text-sm text-[#AEB9E1] font-medium font-inter text-left ${column.className || ""
                      } ${column.key === 'actions' ? 'overflow-visible' : ''}`}
                    style={{
                      width: `${100 / columns.length}%`,
                      minWidth: column.className ? column.className.replace('min-w-[', '').replace(']', '') : '140px',
                      maxWidth: column.key === 'actions' ? 'none' : (column.key === 'paymentType' ? '150px' : 'none'),
                      overflow: 'visible',
                      wordWrap: 'break-word'
                    }}
                  >
                    <div className="break-words">
                      {renderCellValue(column, row[column.key], row)}
                    </div>
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
