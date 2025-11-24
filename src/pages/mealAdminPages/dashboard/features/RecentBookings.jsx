import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../../utils/axios";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { Calendar, MapPin, Users, DollarSign, Eye } from "lucide-react";
import { useSelector } from "react-redux";

const RecentBookings = ({ isAdmin }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);

  // Fetch recent bookings
  useEffect(() => {
    const fetchRecentBookings = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        
        const params = {
          page: 1,
          limit: 10,
          sortBy: "createdAt",
          order: "desc",
        };

        // Add staff_id for staff members
        if (!isAdmin && user?.id) {
          params.staff_id = user.id;
        }

        const response = await axios.get("/api/v1/bookings/admin", { params });
        
        if (response.data.success) {
          setBookings(response.data.data?.bookings || []);
        } else {
          setIsError(true);
          setError(response.data.message || "Failed to fetch bookings");
        }
      } catch (err) {
        setIsError(true);
        setError(err.response?.data?.message || err.message || "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentBookings();
    
    // Refetch every 30 seconds
    const interval = setInterval(fetchRecentBookings, 30000);
    return () => clearInterval(interval);
  }, [isAdmin, user?.id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-500/20",
        text: "text-yellow-400",
        border: "border-yellow-500/30",
        label: "Pending",
      },
      confirmed: {
        bg: "bg-green-500/20",
        text: "text-green-400",
        border: "border-green-500/30",
        label: "Confirmed",
      },
      active: {
        bg: "bg-blue-500/20",
        text: "text-blue-400",
        border: "border-blue-500/30",
        label: "Active",
      },
      completed: {
        bg: "bg-gray-500/20",
        text: "text-gray-400",
        border: "border-gray-500/30",
        label: "Completed",
      },
      cancelled: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        border: "border-red-500/30",
        label: "Cancelled",
      },
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold ${config.bg} ${config.text} ${config.border} border`}
      >
        <div className={`w-2 h-2 rounded-full ${config.bg.replace("/20", "")}`}></div>
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusConfig = {
      paid: {
        bg: "bg-green-500/20",
        text: "text-green-400",
        border: "border-green-500/30",
        label: "Paid",
      },
      pending: {
        bg: "bg-yellow-500/20",
        text: "text-yellow-400",
        border: "border-yellow-500/30",
        label: "Pending",
      },
      failed: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        border: "border-red-500/30",
        label: "Failed",
      },
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;

    return (
      <span
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold ${config.bg} ${config.text} ${config.border} border`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-[#171D41] rounded-lg p-4 sm:p-6 shadow-sm border border-[#3A3A4E]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">
            Recent Bookings
          </h3>
          <p className="text-xs text-[#AEB9E1]">
            Latest booking activities
          </p>
        </div>
        <button
          onClick={() => navigate(isAdmin ? "/admin/bookings" : "/staff/bookings")}
          className="text-sm text-[#14F195] hover:text-[#14F195]/80 transition-colors"
        >
          View All
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <LoadingSpinner message="Loading bookings..." size="sm" textSize="xs" />
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-red-500 text-sm text-center">
            Error loading bookings: {error?.message || "Unknown error"}
          </div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-[#3A3A4E] mx-auto mb-2" />
            <p className="text-[#AEB9E1] text-sm">No bookings found</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {bookings.map((booking) => (
            <div
              key={booking._id || booking.id}
              className="bg-[#0A1330] rounded-lg p-4 border border-[#3A3A4E] hover:border-[#14F195]/50 transition-all duration-200 cursor-pointer"
              onClick={() =>
                navigate(
                  isAdmin
                    ? `/admin/bookings/${booking._id || booking.id}`
                    : `/staff/bookings/${booking._id || booking.id}`
                )
              }
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-white">
                      {booking.bookingReference || "N/A"}
                    </span>
                    {getStatusBadge(booking.bookingStatus)}
                    {getPaymentStatusBadge(booking.paymentStatus)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-[#AEB9E1]">
                      <Users className="w-3 h-3" />
                      <span>{booking.guestName || "N/A"}</span>
                    </div>
                    {booking.property_id && (
                      <div className="flex items-center gap-2 text-xs text-[#AEB9E1]">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">
                          {typeof booking.property_id === "object"
                            ? booking.property_id.name
                            : "Property"}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-[#AEB9E1]">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="flex items-center gap-1 text-green-400 font-semibold mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span>{formatCurrency(booking.totalAmount || 0)}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(
                        isAdmin
                          ? `/admin/bookings/${booking._id || booking.id}`
                          : `/staff/bookings/${booking._id || booking.id}`
                      );
                    }}
                    className="text-xs text-[#14F195] hover:text-[#14F195]/80 flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentBookings;
