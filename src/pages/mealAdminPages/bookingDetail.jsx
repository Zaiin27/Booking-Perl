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
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 bg-[#0A1330] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => navigate(isAdmin ? "/admin/bookings" : "/staff/bookings")}
            className="flex items-center gap-2 text-[#AEB9E1] hover:text-white transition-colors mb-6 group"
          >
            <div className="bg-[#121B36] p-2 rounded-xl border border-[#FFFFFF0D] group-hover:bg-[#1C244D] transition-all">
              <FaArrowLeft className="w-3 h-3" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest opacity-60">Return</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-white px-1">Reservation</h1>
              <p className="text-[#AEB9E1] px-1 text-sm font-medium opacity-60 flex items-center gap-2">
                Ref: <span className="text-[#14F195] font-mono tracking-tighter">{booking.bookingReference || booking.booking_id}</span>
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {getStatusBadge(booking.bookingStatus, "booking")}
              {getStatusBadge(booking.paymentStatus, "payment")}
            </div>
          </div>
        </div>

        {/* Unified Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* Essential Booking Info Card */}
            <div className="bg-[#121B36] rounded-[32px] p-6 sm:p-8 border border-[#FFFFFF0D] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#9945FF] to-[#14F195] opacity-5 blur-3xl"></div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/10">
                  <FaHotel className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight">Property Details</h2>
                  <p className="text-[#AEB9E1] text-xs font-medium opacity-60">Hotel & Location information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-bold text-white tracking-tight">{booking.property_id?.name || "N/A"}</h3>
                  <div className="flex items-start gap-2 text-[#AEB9E1]">
                    <FaMapMarkerAlt className="w-4 h-4 mt-1 text-[#14F195]" />
                    <span className="text-sm font-medium leading-relaxed">{booking.property_id?.address || "N/A"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div className="bg-[#2A2D53]/30 rounded-2xl p-4 border border-[#FFFFFF05]">
                    <p className="text-[#AEB9E1]/40 text-[9px] font-bold uppercase tracking-wider mb-1">Check In</p>
                    <p className="text-white font-bold text-sm">{formatDate(booking.checkInDate)}</p>
                    <p className="text-[#14F195] text-[10px] font-bold mt-1">{booking.property_id?.checkInTime || "N/A"}</p>
                  </div>
                  <div className="bg-[#2A2D53]/30 rounded-2xl p-4 border border-[#FFFFFF05]">
                    <p className="text-[#AEB9E1]/40 text-[9px] font-bold uppercase tracking-wider mb-1">Check Out</p>
                    <p className="text-white font-bold text-sm">{formatDate(booking.checkOutDate)}</p>
                    <p className="text-red-400 text-[10px] font-bold mt-1">{booking.property_id?.checkOutTime || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Guest Profile Card */}
            <div className="bg-[#121B36] rounded-[32px] p-6 sm:p-8 border border-[#FFFFFF0D] shadow-2xl overflow-hidden">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                  <FaUsers className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight">Guest Profile</h2>
                  <p className="text-[#AEB9E1] text-xs font-medium opacity-60">Customer and occupancy details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[#AEB9E1]/40 text-[9px] font-bold uppercase tracking-wider">Full Name</p>
                  <p className="text-white font-bold text-lg">{booking.guestName || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[#AEB9E1]/40 text-[9px] font-bold uppercase tracking-wider">Status</p>
                  <p className="text-white font-bold text-lg flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse"></span>
                    {booking.numberOfGuests || 0} Guests
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[#AEB9E1]/40 text-[9px] font-bold uppercase tracking-wider">Email Contact</p>
                  <p className="text-white font-medium text-sm truncate">{booking.guestEmail || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[#AEB9E1]/40 text-[9px] font-bold uppercase tracking-wider">Phone Number</p>
                  <p className="text-white font-medium text-sm">{booking.guestPhone || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Booked Rooms Container */}
            {booking.bookedRooms && booking.bookedRooms.length > 0 && (
              <div className="bg-[#121B36] rounded-[32px] p-6 sm:p-8 border border-[#FFFFFF0D] shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center shadow-lg">
                    <FaBed className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white leading-tight">Selected Units</h2>
                    <p className="text-[#AEB9E1] text-xs font-medium opacity-60">Room types and individual pricing</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {booking.bookedRooms.map((room, index) => (
                    <div key={index} className="bg-[#2A2D53]/20 rounded-2xl p-5 border border-[#FFFFFF05] group hover:bg-[#2A2D53]/40 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                            <FaBed className="text-[#14F195]" size={16} />
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-base capitalize">{room.quantity}x {room.roomType}</h4>
                            <p className="text-[#AEB9E1]/60 text-[10px] font-bold uppercase">{room.roomType === 'single' ? 'Single' : 'Standard'} Occupancy</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold text-base">{formatCurrency(room.price || 0)}</p>
                          <p className="text-[#AEB9E1]/40 text-[10px] uppercase font-bold">Per Night</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Management Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Admin Controls */}
            {isAdmin && (
              <div className="bg-[#121B36] rounded-[32px] p-6 border border-[#FFFFFF0D] shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-6 px-1 flex items-center gap-2">
                  <span className="w-2 h-4 bg-[#9945FF] rounded-full"></span>
                  Manage Status
                </h3>

                <div className="space-y-5">
                  <div>
                    <p className="text-[#AEB9E1]/40 text-[9px] font-bold uppercase tracking-widest mb-2 ml-1">Booking State</p>
                    <div className="relative">
                      <select
                        value={booking.bookingStatus || "pending"}
                        onChange={(e) => handleStatusUpdate(e.target.value, "booking")}
                        disabled={updating}
                        className="w-full h-12 bg-[#171D41] border border-[#FFFFFF0D] rounded-2xl text-white px-4 text-sm font-bold focus:ring-[#14F195] appearance-none cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#AEB9E1]/40">
                        <FaEdit size={12} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[#AEB9E1]/40 text-[9px] font-bold uppercase tracking-widest mb-2 ml-1">Payment State</p>
                    <div className="relative">
                      <select
                        value={booking.paymentStatus || "pending"}
                        onChange={(e) => handleStatusUpdate(e.target.value, "payment")}
                        disabled={updating}
                        className="w-full h-12 bg-[#171D41] border border-[#FFFFFF0D] rounded-2xl text-white px-4 text-sm font-bold focus:ring-[#14F195] appearance-none cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#AEB9E1]/40">
                        <FaCreditCard size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Summary */}
            <div className="bg-[#121B36] rounded-[32px] p-8 border border-[#FFFFFF0D] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#14F195] opacity-5 blur-3xl rounded-full"></div>
              <h3 className="text-lg font-bold text-white mb-8 flex items-center justify-between">
                <span>Payment Info</span>
                <FaFileInvoice className="text-[#14F195]" size={14} />
              </h3>

              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#AEB9E1] font-medium">Nightly Rate</span>
                  <span className="text-white font-bold">{formatCurrency(booking.totalAmount / (nights || 1))}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#AEB9E1] font-medium">Platform Fee</span>
                  <span className="text-orange-400 font-bold">{formatCurrency(booking.platformFee || 0)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[#AEB9E1] font-medium">Calculation</span>
                  <span className="text-white font-bold">x{nights} Nights</span>
                </div>

                <div className="pt-6 border-t border-[#FFFFFF0D]">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[#AEB9E1]/40 text-[9px] font-bold uppercase mb-1">TOTAL RECEIVABLE</p>
                      <p className="text-3xl font-bold text-[#14F195] tracking-tighter">
                        {formatCurrency(booking.totalAmount || 0)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-white bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                        {booking.paymentType?.toUpperCase()}
                      </p>
                    </div>
                  </div>
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
