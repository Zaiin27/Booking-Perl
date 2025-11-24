import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";
import { 
  FaCheckCircle, 
  FaHotel, 
  FaCalendar, 
  FaUser, 
  FaDollarSign,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaHome
} from "react-icons/fa";

const BookingConfirmationPage = () => {
  const { bookingReference } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [bookingReference]);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const fetchBooking = async () => {
    try {
      const response = await axios.get(`/api/v1/bookings/${bookingReference}/public`);
      if (response.data.success) {
        setBooking(response.data.data);
      } else {
        toast.error("Booking not found");
        navigate("/properties");
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      toast.error("Failed to load booking details");
      navigate("/properties");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    
    const currency = booking?.currency || "USD";
    
    if (currency === "PKR" || currency === "Rs" || currency === "RS" || currency === "pkr") {
      const formattedAmount = new Intl.NumberFormat("en-PK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
      return `Rs ${formattedAmount}`;
    }
    
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#16213E] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-xl text-white font-medium">Loading booking details...</div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#16213E] flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-white font-medium">Booking not found</div>
          <button
            onClick={() => navigate("/properties")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#16213E] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Animated Success Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-8">
            {/* Outer circle animation */}
            <div 
              className={`absolute inset-0 rounded-full border-4 border-green-400 ${
                animationComplete ? 'animate-ping' : ''
              }`}
              style={{ animationDuration: '2s' }}
            ></div>
            
            {/* Middle circle animation */}
            <div 
              className={`absolute inset-2 rounded-full border-4 border-green-300 ${
                animationComplete ? 'animate-pulse' : ''
              }`}
            ></div>
            
            {/* Inner circle with checkmark */}
            <div 
              className={`relative w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-1000 ${
                animationComplete ? 'scale-100' : 'scale-0'
              }`}
            >
              <FaCheckCircle className="text-white text-6xl" />
            </div>
          </div>

          {/* Animated Text */}
          <h1 
            className={`text-5xl md:text-6xl font-bold text-white mb-4 transform transition-all duration-1000 ${
              animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Your Booking Has Been Confirmed!
          </h1>
          
          <p 
            className={`text-xl text-[#AEB9E1] transform transition-all duration-1000 delay-300 ${
              animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            We're excited to host you. Please pay the remaining amount when you arrive.
          </p>
        </div>

        {/* Booking Details Card */}
        <div 
          className={`bg-[#171D41] rounded-2xl shadow-2xl p-8 border border-[#3A3A4E] mb-8 transform transition-all duration-1000 delay-500 ${
            animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <FaHotel className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-white">Booking Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Information */}
            <div className="space-y-4">
              <div className="p-4 bg-[#2A2A3E] rounded-xl border border-[#3A3A4E]">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <FaHotel className="text-blue-400" />
                  Property Information
                </h3>
                <p className="text-white font-semibold text-lg">{booking.property_id?.name}</p>
                <p className="text-[#AEB9E1] text-sm mt-1 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-400" />
                  {booking.property_id?.address}
                </p>
              </div>

              {/* Guest Information */}
              <div className="p-4 bg-[#2A2A3E] rounded-xl border border-[#3A3A4E]">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <FaUser className="text-green-400" />
                  Guest Information
                </h3>
                <p className="text-white">{booking.guestName}</p>
                <p className="text-[#AEB9E1] text-sm mt-1 flex items-center gap-2">
                  <FaEnvelope className="text-blue-400" />
                  {booking.guestEmail}
                </p>
                <p className="text-[#AEB9E1] text-sm mt-1 flex items-center gap-2">
                  <FaPhone className="text-green-400" />
                  {booking.guestPhone}
                </p>
              </div>
            </div>

            {/* Booking Dates & Payment */}
            <div className="space-y-4">
              <div className="p-4 bg-[#2A2A3E] rounded-xl border border-[#3A3A4E]">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <FaCalendar className="text-purple-400" />
                  Booking Dates
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-[#AEB9E1] text-sm">Check-in</p>
                    <p className="text-white font-semibold">{formatDate(booking.checkInDate)}</p>
                  </div>
                  <div>
                    <p className="text-[#AEB9E1] text-sm">Check-out</p>
                    <p className="text-white font-semibold">{formatDate(booking.checkOutDate)}</p>
                  </div>
                  <div>
                    <p className="text-[#AEB9E1] text-sm">Duration</p>
                    <p className="text-white font-semibold">
                      {Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24))} night(s)
                    </p>
                  </div>
                  <div>
                    <p className="text-[#AEB9E1] text-sm">Guests</p>
                    <p className="text-white font-semibold">{booking.numberOfGuests}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl border border-green-500/30">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <FaDollarSign className="text-green-400" />
                  Payment Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#AEB9E1]">Booking Reference:</span>
                    <span className="text-white font-mono font-semibold">{booking.bookingReference}</span>
                  </div>
                  {booking.platformFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#AEB9E1]">Platform Fee:</span>
                      <span className="text-orange-400 font-semibold">{formatCurrency(booking.platformFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-green-500/30">
                    <span className="text-white font-semibold text-lg">Total Amount:</span>
                    <span className="text-green-400 font-bold text-xl">{formatCurrency(booking.totalAmount)}</span>
                  </div>
                  <div className="mt-3 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                    <p className="text-yellow-300 text-sm font-semibold">
                      💳 Payment on Arrival - Please pay when you check in
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {booking.specialRequests && (
            <div className="mt-6 pt-6 border-t border-[#3A3A4E]">
              <h3 className="text-lg font-semibold text-white mb-2">Special Requests</h3>
              <p className="text-[#AEB9E1]">{booking.specialRequests}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div 
          className={`flex flex-col sm:flex-row gap-4 justify-center transform transition-all duration-1000 delay-700 ${
            animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <button
            onClick={() => navigate("/properties")}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <FaHome className="text-xl" />
            Back to Properties
          </button>
          
          <button
            onClick={() => navigate("/booking-history")}
            className="px-8 py-4 bg-[#2A2A3E] text-white font-semibold rounded-xl hover:bg-[#3A3A4E] transition-all duration-300 border border-[#3A3A4E] hover:border-[#4A4A5E] flex items-center justify-center gap-2"
          >
            <FaCalendar className="text-xl" />
            View Booking History
          </button>
        </div>

        {/* Confetti Animation Effect */}
        {animationComplete && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `confetti-fall ${2 + Math.random() * 3}s linear forwards`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingConfirmationPage;

