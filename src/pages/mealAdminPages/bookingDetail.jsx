import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../utils/axios";
import { toast } from "react-hot-toast";
import PageLoading from "../../components/PageLoading";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaUsers,
  FaBed,
  FaDollarSign,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaCheckCircle,
  FaTimes,
  FaHotel,
  FaEdit,
  FaFileInvoice,
  FaCreditCard,
} from "react-icons/fa";

const BookingDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";

  useEffect(() => {
    if (user) {
      fetchBooking();
    }
  }, [id, user]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      
      // Get token from Redux store or localStorage
      const token = user?.token || localStorage.getItem("auth_token");
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
      const response = await axios.get(`/api/v1/bookings/${id}`, { headers });
      if (response.data.success) {
        setBooking(response.data.data);
      } else {
        toast.error("Booking not found");
        navigate(isAdmin ? "/admin/bookings" : "/staff/bookings");
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      toast.error(error.response?.data?.message || "Failed to load booking details");
      navigate(isAdmin ? "/admin/bookings" : "/staff/bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status, type) => {
    try {
      setUpdating(true);
      const endpoint = type === "booking"
        ? `/api/v1/bookings/${id}/status`
        : `/api/v1/bookings/${id}/payment-status`;

      // Get token from Redux store or localStorage
      const token = user?.token || localStorage.getItem("auth_token");
      const headers = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await axios.patch(
        endpoint,
        { [type === "booking" ? "bookingStatus" : "paymentStatus"]: status },
        { headers }
      );
      
      if (response.data.success) {
        toast.success(`${type === "booking" ? "Booking" : "Payment"} status updated successfully`);
        fetchBooking(); // Refresh booking data
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    
    const currency = booking?.currency || "USD";
    
    // Support for PKR/Rs (Pakistani Rupees)
    if (currency === "PKR" || currency === "Rs" || currency === "RS" || currency === "pkr") {
      // Format PKR with comma separators and "Rs" prefix
      const formattedAmount = new Intl.NumberFormat("en-PK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
      return `Rs ${formattedAmount}`;
    }
    
    // Default to USD format
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const calculateNights = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return 0;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate - checkInDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (status, type = "booking") => {
    const statusConfig = {
      booking: {
        pending: {
          bg: "bg-yellow-500/20",
          text: "text-yellow-400",
          border: "border-yellow-500/30",
          label: "Pending",
          icon: FaClock,
        },
        confirmed: {
          bg: "bg-green-500/20",
          text: "text-green-400",
          border: "border-green-500/30",
          label: "Confirmed",
          icon: FaCheckCircle,
        },
        active: {
          bg: "bg-blue-500/20",
          text: "text-blue-400",
          border: "border-blue-500/30",
          label: "Active",
          icon: FaCheckCircle,
        },
        completed: {
          bg: "bg-gray-500/20",
          text: "text-gray-400",
          border: "border-gray-500/30",
          label: "Completed",
          icon: FaCheckCircle,
        },
        cancelled: {
          bg: "bg-red-500/20",
          text: "text-red-400",
          border: "border-red-500/30",
          label: "Cancelled",
          icon: FaTimes,
        },
      },
      payment: {
        pending: {
          bg: "bg-yellow-500/20",
          text: "text-yellow-400",
          border: "border-yellow-500/30",
          label: "Pending",
          icon: FaClock,
        },
        paid: {
          bg: "bg-green-500/20",
          text: "text-green-400",
          border: "border-green-500/30",
          label: "Paid",
          icon: FaCheckCircle,
        },
        failed: {
          bg: "bg-red-500/20",
          text: "text-red-400",
          border: "border-red-500/30",
          label: "Failed",
          icon: FaTimes,
        },
        refunded: {
          bg: "bg-purple-500/20",
          text: "text-purple-400",
          border: "border-purple-500/30",
          label: "Refunded",
          icon: FaFileInvoice,
        },
      },
    };

    const config = statusConfig[type]?.[status?.toLowerCase()] || statusConfig.booking.pending;
    const Icon = config.icon;

    return (
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${config.bg} ${config.text} ${config.border}`}>
        <Icon className="w-4 h-4" />
        <span className="font-semibold">{config.label}</span>
      </div>
    );
  };

  if (loading) {
    return <PageLoading message="Loading booking details..." />;
  }

  if (!booking) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Booking not found</div>
        </div>
      </div>
    );
  }

  const nights = calculateNights(booking.checkInDate, booking.checkOutDate);

  return (
    <div className="p-4 sm:p-6 bg-[#0A1330] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(isAdmin ? "/admin/bookings" : "/staff/bookings")}
            className="flex items-center gap-2 text-[#AEB9E1] hover:text-white transition-colors mb-4"
          >
            <FaArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Bookings</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Booking Details
              </h1>
              <p className="text-sm text-[#AEB9E1]">
                Reference: <span className="font-mono text-blue-400">{booking.bookingReference || booking.booking_id}</span>
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {getStatusBadge(booking.bookingStatus, "booking")}
              {getStatusBadge(booking.paymentStatus, "payment")}
              {booking.paymentType && (
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${
                  booking.paymentType === 'online' 
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                    : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                }`}>
                  <FaCreditCard className="w-4 h-4" />
                  <span className="font-semibold">
                    {booking.paymentType === 'online' ? '💳 Online' : '🏨 On Arrival'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Information */}
            <div className="bg-[#171D41] rounded-xl shadow-lg p-6 border border-[#3A3A4E]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                  <FaHotel className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Property Information</h2>
                  <p className="text-sm text-[#AEB9E1]">Hotel & location details</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {booking.property_id?.name || "N/A"}
                  </h3>
                  <div className="flex items-start gap-2 text-[#AEB9E1]">
                    <FaMapMarkerAlt className="w-4 h-4 mt-1 text-red-400" />
                    <span className="text-sm">{booking.property_id?.address || "N/A"}</span>
                  </div>
                </div>

                {booking.property_id?.contactEmail && (
                  <div className="flex items-center gap-2 text-[#AEB9E1]">
                    <FaEnvelope className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">{booking.property_id.contactEmail}</span>
                  </div>
                )}

                {booking.property_id?.contactPhone && (
                  <div className="flex items-center gap-2 text-[#AEB9E1]">
                    <FaPhone className="w-4 h-4 text-green-400" />
                    <span className="text-sm">{booking.property_id.contactPhone}</span>
                  </div>
                )}

                {(booking.property_id?.checkInTime || booking.property_id?.checkOutTime) && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#3A3A4E]">
                    <div>
                      <p className="text-xs text-[#AEB9E1] mb-1">Check-in Time</p>
                      <p className="text-sm font-semibold text-white">
                        {booking.property_id.checkInTime || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#AEB9E1] mb-1">Check-out Time</p>
                      <p className="text-sm font-semibold text-white">
                        {booking.property_id.checkOutTime || "N/A"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Guest Information */}
            <div className="bg-[#171D41] rounded-xl shadow-lg p-6 border border-[#3A3A4E]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <FaUsers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Guest Information</h2>
                  <p className="text-sm text-[#AEB9E1]">Booking guest details</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#AEB9E1] mb-1">Guest Name</p>
                    <p className="text-base font-semibold text-white">{booking.guestName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#AEB9E1] mb-1">Email Address</p>
                    <p className="text-base font-semibold text-white">{booking.guestEmail || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#AEB9E1] mb-1">Phone Number</p>
                    <p className="text-base font-semibold text-white">{booking.guestPhone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#AEB9E1] mb-1">Number of Guests</p>
                    <p className="text-base font-semibold text-white">{booking.numberOfGuests || 0} guests</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Dates & Rooms */}
            <div className="bg-[#171D41] rounded-xl shadow-lg p-6 border border-[#3A3A4E]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <FaCalendarAlt className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Booking Period</h2>
                  <p className="text-sm text-[#AEB9E1]">Check-in & check-out dates</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-[#0A1330] rounded-lg border border-[#3A3A4E]">
                  <FaCalendarAlt className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-xs text-[#AEB9E1] mb-1">Check-in</p>
                  <p className="text-sm font-bold text-white">{formatDate(booking.checkInDate)}</p>
                  {booking.checkInDate && (
                    <p className="text-xs text-[#AEB9E1] mt-1">
                      {new Date(booking.checkInDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>

                <div className="text-center p-4 bg-[#0A1330] rounded-lg border border-[#3A3A4E]">
                  <FaBed className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-xs text-[#AEB9E1] mb-1">Duration</p>
                  <p className="text-sm font-bold text-white">{nights} {nights === 1 ? "Night" : "Nights"}</p>
                </div>

                <div className="text-center p-4 bg-[#0A1330] rounded-lg border border-[#3A3A4E]">
                  <FaCalendarAlt className="w-6 h-6 text-red-400 mx-auto mb-2" />
                  <p className="text-xs text-[#AEB9E1] mb-1">Check-out</p>
                  <p className="text-sm font-bold text-white">{formatDate(booking.checkOutDate)}</p>
                  {booking.checkOutDate && (
                    <p className="text-xs text-[#AEB9E1] mt-1">
                      {new Date(booking.checkOutDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Room Details */}
            {booking.bookedRooms && booking.bookedRooms.length > 0 && (
              <div className="bg-[#171D41] rounded-xl shadow-lg p-6 border border-[#3A3A4E]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center">
                    <FaBed className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Room Details</h2>
                    <p className="text-sm text-[#AEB9E1]">Selected rooms & types</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {booking.bookedRooms.map((room, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-[#0A1330] rounded-lg border border-[#3A3A4E]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                          <FaBed className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-base font-semibold text-white capitalize">
                            {room.quantity}x {room.roomType || "Room"}
                          </p>
                          <p className="text-xs text-[#AEB9E1]">
                            {room.roomType === "single" ? "Single Occupancy" : "Double Occupancy"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-white">
                          {formatCurrency(room.price || 0)}/night
                        </p>
                        <p className="text-xs text-[#AEB9E1]">
                          Total: {formatCurrency((room.price || 0) * (room.quantity || 1) * nights)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Summary & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Status Actions - Only for Admin - Moved to top */}
            {isAdmin && (
              <div className="bg-[#171D41] rounded-xl shadow-lg p-6 border border-[#3A3A4E] relative z-10 overflow-visible">
                <h3 className="text-lg font-bold text-white mb-4">Manage Booking</h3>
                
                <div className="space-y-4">
                  {/* Booking Status Update */}
                  <div className="relative" style={{ zIndex: 100 }}>
                    <label className="block text-sm font-medium text-[#AEB9E1] mb-2">
                      Booking Status
                    </label>
                    <select
                      value={booking.bookingStatus || "pending"}
                      onChange={(e) => handleStatusUpdate(e.target.value, "booking")}
                      disabled={updating}
                      className="w-full px-4 py-2 bg-[#0A1330] border border-[#3A3A4E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#14F195] appearance-none cursor-pointer"
                      style={{ zIndex: 100 }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Payment Status Update */}
                  <div className="relative" style={{ zIndex: 99 }}>
                    <label className="block text-sm font-medium text-[#AEB9E1] mb-2">
                      Payment Status
                    </label>
                    <select
                      value={booking.paymentStatus || "pending"}
                      onChange={(e) => handleStatusUpdate(e.target.value, "payment")}
                      disabled={updating}
                      className="w-full px-4 py-2 bg-[#0A1330] border border-[#3A3A4E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#14F195] appearance-none cursor-pointer"
                      style={{ zIndex: 99 }}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Booking Summary - Moved below with higher z-index */}
            <div className="bg-[#171D41] rounded-xl shadow-lg p-6 border border-[#3A3A4E] sticky top-6" style={{ zIndex: 1 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                  <FaFileInvoice className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Booking Summary</h2>
              </div>

              <div className="space-y-4">
                {/* Payment Type */}
                {booking.paymentType && (
                  <div className="p-3 bg-[#0A1330] rounded-lg border border-[#3A3A4E]">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#AEB9E1]">Payment Type</span>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold ${
                        booking.paymentType === 'online' 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}>
                        <span>{booking.paymentType === 'online' ? '💳' : '🏨'}</span>
                        <span>{booking.paymentType === 'online' ? 'Online' : 'On Arrival'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Calculate base amount (total - platform fee) */}
                {(() => {
                  const baseAmount = booking.totalAmount - (booking.platformFee || 0);
                  return (
                    <>
                      {baseAmount > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-[#3A3A4E]">
                          <span className="text-sm text-[#AEB9E1]">Room Charges</span>
                          <span className="text-sm font-semibold text-white">
                            {formatCurrency(baseAmount)}
                          </span>
                        </div>
                      )}
                    </>
                  );
                })()}

                {/* Platform Fee */}
                {booking.platformFee > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-[#3A3A4E]">
                    <span className="text-sm text-[#AEB9E1]">Platform Fee</span>
                    <span className="text-sm font-semibold text-orange-400">
                      {formatCurrency(booking.platformFee)}
                    </span>
                  </div>
                )}

                {/* Commission Breakdown - Only for Admin */}
                {isAdmin && booking.commissionAmount > 0 && (
                  <>
                    <div className="pt-2 border-t border-[#3A3A4E]">
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-[#AEB9E1]">Commission ({booking.commissionPercentage || 0}%)</span>
                        <span className="text-sm font-semibold text-amber-400">
                          {formatCurrency(booking.commissionAmount || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-[#3A3A4E]">
                        <span className="text-sm text-[#AEB9E1]">Hotel Owner Amount</span>
                        <span className="text-sm font-semibold text-green-400">
                          {formatCurrency(booking.hotelOwnerAmount || 0)}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex justify-between items-center py-2 border-b border-[#3A3A4E]">
                  <span className="text-sm text-[#AEB9E1]">Nights</span>
                  <span className="text-sm font-semibold text-white">{nights}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-[#3A3A4E]">
                  <span className="text-sm text-[#AEB9E1]">Total Rooms</span>
                  <span className="text-sm font-semibold text-white">
                    {booking.totalRooms || 0}
                  </span>
                </div>

                <div className="pt-4 border-t-2 border-[#14F195]">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-white">Total Amount</span>
                    <span className="text-xl font-bold text-[#14F195]">
                      {formatCurrency(booking.totalAmount || 0)}
                    </span>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-[#AEB9E1]">
                    <FaClock className="w-3 h-3" />
                    <span>Booked on: {formatDateTime(booking.createdAt)}</span>
                  </div>
                  {booking.updatedAt && (
                    <div className="flex items-center gap-2 text-xs text-[#AEB9E1]">
                      <FaClock className="w-3 h-3" />
                      <span>Updated: {formatDateTime(booking.updatedAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;
