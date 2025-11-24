import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";
import { FaArrowLeft, FaCalendarAlt, FaHotel, FaMoneyBillWave, FaClock, FaPlus, FaEye } from "react-icons/fa";

const BookingHistoryPage = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
    // Try to get bookings from localStorage if user is logged in
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setEmail(userEmail);
      fetchBookings(userEmail);
    } else {
      setSearchMode(true);
      setLoading(false);
    }
  }, []);

  const fetchBookings = async (emailParam = email, phoneParam = phone) => {
    try {
      setLoading(true);
      const params = {};
      if (emailParam) params.email = emailParam;
      if (phoneParam) params.phone = phoneParam;

      const response = await axios.get("/api/v1/bookings/history", { params });
      if (response.data.success) {
        setBookings(response.data.data.bookings);
        if (emailParam) {
          localStorage.setItem("userEmail", emailParam);
        }
      } else {
        toast.error("Failed to fetch booking history");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch booking history");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!email && !phone) {
      toast.error("Please enter email or phone number");
      return;
    }
    fetchBookings(email, phone);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "paid": return "bg-green-100 text-green-800";
      case "failed": return "bg-red-100 text-red-800";
      case "refunded": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F23] via-[#1A1A2E] to-[#16213E] pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-[#2A2A3E] text-white hover:bg-[#3A3A4E] transition"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-3xl font-bold text-white">My Bookings</h1>
        </div>

        {/* Search Form */}
        {searchMode && (
          <div className="bg-[#171D41] rounded-xl shadow-lg p-6 border border-[#3A3A4E] mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Find Your Bookings</h2>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#AEB9E1] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg text-white placeholder-[#AEB9E1] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#AEB9E1] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92-XXX-XXXXXXX"
                    className="w-full px-4 py-3 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg text-white placeholder-[#AEB9E1] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                Search Bookings
              </button>
            </form>
          </div>
        )}

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-white mt-4">Loading your bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <FaHotel className="text-6xl text-[#AEB9E1] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Bookings Found</h3>
            <p className="text-[#AEB9E1] mb-6">
              {searchMode ? "Enter your email or phone number to find your bookings" : "You haven't made any bookings yet"}
            </p>
            <button
              onClick={() => navigate("/properties")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-[#171D41] rounded-xl shadow-lg p-6 border border-[#3A3A4E]">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Booking Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-white">{booking.property_id?.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.bookingStatus)}`}>
                        {booking.bookingStatus}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-[#AEB9E1]">
                        <FaCalendarAlt className="text-blue-400" />
                        <span>{formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#AEB9E1]">
                        <FaClock className="text-green-400" />
                        <span>{calculateNights(booking.checkInDate, booking.checkOutDate)} nights</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#AEB9E1]">
                        <FaHotel className="text-purple-400" />
                        <span>{booking.totalRooms} room(s)</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#AEB9E1]">
                        <FaMoneyBillWave className="text-yellow-400" />
                        <span>${booking.totalAmount}</span>
                      </div>
                    </div>

                    {/* Room Details */}
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-white mb-2">Room Details:</h4>
                      <div className="flex flex-wrap gap-2">
                        {booking.bookedRooms.map((room, index) => (
                          <span key={index} className="px-3 py-1 bg-[#2A2A3E] text-[#AEB9E1] rounded-lg text-sm">
                            {room.quantity}x {room.roomType} (${room.pricePerRoom}/night)
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Extension History */}
                    {booking.extensionHistory && booking.extensionHistory.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-white mb-2">Extensions:</h4>
                        <div className="space-y-2">
                          {booking.extensionHistory.map((extension, index) => (
                            <div key={index} className="p-3 bg-[#2A2A3E] rounded-lg">
                              <div className="flex items-center gap-2 text-sm text-[#AEB9E1]">
                                <FaPlus className="text-green-400" />
                                <span>Extended to {formatDate(extension.newCheckOut)} (+${extension.additionalCost})</span>
                              </div>
                              {extension.reason && (
                                <p className="text-xs text-[#AEB9E1] mt-1">Reason: {extension.reason}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/booking-details/${booking.bookingReference}`)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
                    >
                      <FaEye />
                      View Details
                    </button>
                    
                    {booking.bookingStatus === "confirmed" && new Date(booking.checkOutDate) > new Date() && (
                      <button
                        onClick={() => navigate(`/extend-booking/${booking._id}`)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition text-sm"
                      >
                        <FaPlus />
                        Extend Stay
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistoryPage;
