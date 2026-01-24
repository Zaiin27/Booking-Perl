import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";
import { 
  FaCheckCircle, 
  FaHotel, 
  FaCalendar, 
  FaUser, 
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <div className="text-base sm:text-xl text-gray-900 font-medium">Loading booking details...</div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-base sm:text-xl text-gray-900 font-medium">Booking not found</div>
          <button
            onClick={() => navigate("/properties")}
            className="mt-4 px-4 sm:px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition text-sm sm:text-base"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-4 sm:py-6 md:py-12">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 max-w-4xl">
        {/* Animated Success Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <div className="relative inline-block mb-4 sm:mb-6 md:mb-8">
            {/* Outer circle animation */}
            <div 
              className={`absolute inset-0 rounded-full border-2 sm:border-4 border-green-400 ${
                animationComplete ? 'animate-ping' : ''
              }`}
              style={{ animationDuration: '2s' }}
            ></div>
            
            {/* Middle circle animation */}
            <div 
              className={`absolute inset-1 sm:inset-2 rounded-full border-2 sm:border-4 border-green-300 ${
                animationComplete ? 'animate-pulse' : ''
              }`}
            ></div>
            
            {/* Inner circle with checkmark */}
            <div 
              className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-1000 ${
                animationComplete ? 'scale-100' : 'scale-0'
              }`}
            >
              <FaCheckCircle className="text-white text-3xl sm:text-4xl md:text-6xl" />
            </div>
          </div>

          {/* Animated Text */}
          <h1 
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-4 transform transition-all duration-1000 ${
              animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            Your Booking Has Been Confirmed!
          </h1>
          
          <p 
            className={`text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 px-2 transform transition-all duration-1000 delay-300 ${
              animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            We're excited to host you. Please pay the remaining amount when you arrive.
          </p>
        </div>

        {/* Booking Details Card */}
        <div 
          className={`bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl p-4 sm:p-6 md:p-8 border border-gray-200 mb-6 sm:mb-8 transform transition-all duration-1000 delay-500 ${
            animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg sm:rounded-xl">
              <FaHotel className="text-white text-lg sm:text-xl md:text-2xl" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Booking Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Property Information */}
            <div className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border border-blue-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                  <FaHotel className="text-blue-500 text-sm sm:text-base" />
                  Property Information
                </h3>
                <p className="text-gray-900 font-semibold text-base sm:text-lg break-words">{booking.property_id?.name}</p>
                <p className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2 flex items-start gap-2">
                  <FaMapMarkerAlt className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="break-words">{booking.property_id?.address}</span>
                </p>
              </div>

              {/* Guest Information */}
              <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl border border-green-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                  <FaUser className="text-green-500 text-sm sm:text-base" />
                  Guest Information
                </h3>
                <p className="text-gray-900 font-medium text-sm sm:text-base break-words">{booking.guestName}</p>
                <p className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2 flex items-start gap-2 break-all">
                  <FaEnvelope className="text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>{booking.guestEmail}</span>
                </p>
                <p className="text-gray-600 text-xs sm:text-sm mt-1 sm:mt-2 flex items-center gap-2">
                  <FaPhone className="text-green-500 flex-shrink-0" />
                  <span>{booking.guestPhone}</span>
                </p>
              </div>
            </div>

            {/* Booking Dates & Payment */}
            <div className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg sm:rounded-xl border border-purple-100">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                  <FaCalendar className="text-purple-500 text-sm sm:text-base" />
                  Booking Dates
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Check-in</p>
                    <p className="text-gray-900 font-semibold text-sm sm:text-base">{formatDate(booking.checkInDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Check-out</p>
                    <p className="text-gray-900 font-semibold text-sm sm:text-base">{formatDate(booking.checkOutDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Duration</p>
                    <p className="text-gray-900 font-semibold text-sm sm:text-base">
                      {Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24))} night(s)
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs sm:text-sm">Guests</p>
                    <p className="text-gray-900 font-semibold text-sm sm:text-base">{booking.numberOfGuests}</p>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-lg sm:rounded-xl border border-green-200">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                  <span className="text-green-600 font-bold text-sm sm:text-base">Rs</span>
                  <span>Payment Information</span>
                </h3>
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="text-gray-600 text-xs sm:text-sm">Booking Reference:</span>
                    <span className="text-gray-900 font-mono font-semibold text-xs sm:text-sm break-all">{booking.bookingReference}</span>
                  </div>
                  {booking.platformFee > 0 && (
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-gray-600 text-xs sm:text-sm">Platform Fee:</span>
                      <span className="text-orange-600 font-semibold text-xs sm:text-sm">{formatCurrency(booking.platformFee)}</span>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 pt-2 border-t border-green-200">
                    <span className="text-gray-900 font-semibold text-sm sm:text-base sm:text-lg">Total Amount:</span>
                    <span className="text-green-600 font-bold text-base sm:text-lg md:text-xl">{formatCurrency(booking.totalAmount)}</span>
                  </div>
                  <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800 text-xs sm:text-sm font-semibold">
                      💳 Payment on Arrival - Please pay when you check in
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {booking.specialRequests && (
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Special Requests</h3>
              <p className="text-gray-600 text-sm sm:text-base break-words">{booking.specialRequests}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div 
          className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center transform transition-all duration-1000 delay-700 ${
            animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <button
            onClick={() => navigate("/properties")}
            className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <FaHome className="text-base sm:text-lg md:text-xl" />
            Back to Properties
          </button>
          
          <button
            onClick={() => navigate("/booking-history")}
            className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 bg-gray-800 text-white font-semibold rounded-lg sm:rounded-xl hover:bg-gray-900 transition-all duration-300 border border-gray-700 hover:border-gray-600 flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <FaCalendar className="text-base sm:text-lg md:text-xl" />
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

