import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaHotel, FaCalendar, FaUser, FaCreditCard } from "react-icons/fa";

const BookingSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, paymentIntent } = location.state || {};

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0F0F23] via-[#1A1A2E] to-[#16213E]">
        <div className="text-white text-xl">No booking information found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F23] via-[#1A1A2E] to-[#16213E] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-6">
            <FaCheckCircle className="text-white text-4xl" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Booking Confirmed!</h1>
          <p className="text-[#AEB9E1] text-lg">
            Your payment has been processed successfully. Your booking is now confirmed.
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-[#171D41] rounded-xl shadow-lg p-8 border border-[#3A3A4E] mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
            <FaHotel className="text-blue-400" />
            Booking Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Property Information</h3>
                <p className="text-[#AEB9E1]">{booking.property_id?.name}</p>
                <p className="text-[#AEB9E1] text-sm">{booking.property_id?.address}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <FaUser className="text-green-400" />
                  Guest Information
                </h3>
                <p className="text-[#AEB9E1]">{booking.guestName}</p>
                <p className="text-[#AEB9E1]">{booking.guestEmail}</p>
                <p className="text-[#AEB9E1]">{booking.guestPhone}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <FaCalendar className="text-purple-400" />
                  Stay Details
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#AEB9E1]">Check-in:</span>
                    <span className="text-white">{new Date(booking.checkInDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#AEB9E1]">Check-out:</span>
                    <span className="text-white">{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#AEB9E1]">Guests:</span>
                    <span className="text-white">{booking.numberOfGuests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#AEB9E1]">Rooms:</span>
                    <span className="text-white">{booking.totalRooms}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <FaCreditCard className="text-yellow-400" />
                  Payment Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#AEB9E1]">Booking Reference:</span>
                    <span className="text-white font-mono">{booking.bookingReference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#AEB9E1]">Total Amount:</span>
                    <span className="text-white font-semibold">${booking.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#AEB9E1]">Payment Status:</span>
                    <span className="text-green-400 font-semibold">Paid</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#AEB9E1]">Booking Status:</span>
                    <span className="text-green-400 font-semibold">Confirmed</span>
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
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/properties")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Book Another Property
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-[#2A2A3E] hover:bg-[#3A3A4E] text-[#AEB9E1] font-semibold py-3 px-6 rounded-lg transition border border-[#3A3A4E]"
          >
            Back to Home
          </button>
        </div>

        {/* Contact Information */}
        <div className="mt-12 text-center">
          <p className="text-[#AEB9E1] mb-2">
            Need help? Contact the property directly:
          </p>
          <p className="text-white font-semibold">{booking.property_id?.contactEmail}</p>
          <p className="text-white font-semibold">{booking.property_id?.contactPhone}</p>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessPage;
