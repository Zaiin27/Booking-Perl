import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";
import { FaArrowLeft, FaCalendarAlt, FaMoneyBillWave, FaHotel, FaClock } from "react-icons/fa";

const ExtendBookingPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [extending, setExtending] = useState(false);
  const [newCheckOutDate, setNewCheckOutDate] = useState("");
  const [reason, setReason] = useState("");
  const [additionalCost, setAdditionalCost] = useState(0);
  const [additionalNights, setAdditionalNights] = useState(0);

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/bookings/${id}`);
      if (response.data.success) {
        setBooking(response.data.data);
        // Set minimum date to current check-out date
        const currentCheckOut = new Date(response.data.data.checkOutDate);
        const minDate = new Date(currentCheckOut.getTime() + 24 * 60 * 60 * 1000); // Next day
        setNewCheckOutDate(minDate.toISOString().split('T')[0]);
      } else {
        toast.error("Booking not found");
        navigate("/booking-history");
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      toast.error("Failed to load booking details");
      navigate("/booking-history");
    } finally {
      setLoading(false);
    }
  };

  const calculateExtensionCost = () => {
    if (!booking || !newCheckOutDate) return;

    const currentCheckOut = new Date(booking.checkOutDate);
    const newCheckOut = new Date(newCheckOutDate);
    const nights = Math.ceil((newCheckOut - currentCheckOut) / (1000 * 60 * 60 * 24));
    
    let cost = 0;
    booking.bookedRooms.forEach(room => {
      cost += room.pricePerRoom * room.quantity * nights;
    });

    setAdditionalNights(nights);
    setAdditionalCost(cost);
  };

  useEffect(() => {
    calculateExtensionCost();
  }, [newCheckOutDate, booking]);

  const handleExtendBooking = async (e) => {
    e.preventDefault();
    
    if (!newCheckOutDate) {
      toast.error("Please select a new check-out date");
      return;
    }

    if (additionalNights <= 0) {
      toast.error("New check-out date must be after current check-out date");
      return;
    }

    try {
      setExtending(true);
      const response = await axios.put(`/api/v1/bookings/${id}/extend`, {
        newCheckOutDate,
        reason
      });

      if (response.data.success) {
        toast.success("Booking extended successfully!");
        navigate("/booking-history");
      } else {
        toast.error(response.data.message || "Failed to extend booking");
      }
    } catch (error) {
      console.error("Error extending booking:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to extend booking");
      }
    } finally {
      setExtending(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateNights = (checkIn, checkOut) => {
    const diffTime = Math.abs(new Date(checkOut) - new Date(checkIn));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0F23] via-[#1A1A2E] to-[#16213E] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0F23] via-[#1A1A2E] to-[#16213E] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Booking Not Found</h2>
          <button
            onClick={() => navigate("/booking-history")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-white">Extend Your Stay</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Booking Details */}
            <div className="bg-[#171D41] rounded-xl shadow-lg p-6 border border-[#3A3A4E]">
              <h2 className="text-xl font-semibold text-white mb-4">Current Booking</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{booking.property_id?.name}</h3>
                  <p className="text-[#AEB9E1]">{booking.property_id?.address}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-[#AEB9E1]">
                    <FaCalendarAlt className="text-blue-400" />
                    <span>{formatDate(booking.checkInDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#AEB9E1]">
                    <FaCalendarAlt className="text-red-400" />
                    <span>{formatDate(booking.checkOutDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#AEB9E1]">
                    <FaClock className="text-green-400" />
                    <span>{calculateNights(booking.checkInDate, booking.checkOutDate)} nights</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#AEB9E1]">
                    <FaHotel className="text-purple-400" />
                    <span>{booking.totalRooms} room(s)</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Room Details:</h4>
                  <div className="space-y-1">
                    {booking.bookedRooms.map((room, index) => (
                      <div key={index} className="flex justify-between text-sm text-[#AEB9E1]">
                        <span>{room.quantity}x {room.roomType}</span>
                        <span>${room.pricePerRoom}/night</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#3A3A4E] pt-4">
                  <div className="flex justify-between text-lg font-semibold text-white">
                    <span>Current Total:</span>
                    <span>${booking.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Extension Form */}
            <div className="bg-[#171D41] rounded-xl shadow-lg p-6 border border-[#3A3A4E]">
              <h2 className="text-xl font-semibold text-white mb-4">Extend Your Stay</h2>
              
              <form onSubmit={handleExtendBooking} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#AEB9E1] mb-2">
                    New Check-out Date
                  </label>
                  <input
                    type="date"
                    value={newCheckOutDate}
                    onChange={(e) => setNewCheckOutDate(e.target.value)}
                    min={new Date(new Date(booking.checkOutDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#AEB9E1] mb-2">
                    Reason for Extension (Optional)
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Business trip extended, vacation plans changed, etc."
                    rows={3}
                    className="w-full px-4 py-3 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg text-white placeholder-[#AEB9E1] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Cost Calculation */}
                {additionalNights > 0 && (
                  <div className="bg-[#2A2A3E] rounded-lg p-4 border border-[#3A3A4E]">
                    <h3 className="text-sm font-semibold text-white mb-3">Extension Cost Breakdown</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-[#AEB9E1]">
                        <span>Additional nights:</span>
                        <span>{additionalNights}</span>
                      </div>
                      {booking.bookedRooms.map((room, index) => (
                        <div key={index} className="flex justify-between text-[#AEB9E1]">
                          <span>{room.quantity}x {room.roomType} × {additionalNights} nights:</span>
                          <span>${room.pricePerRoom * room.quantity * additionalNights}</span>
                        </div>
                      ))}
                      <div className="border-t border-[#3A3A4E] pt-2">
                        <div className="flex justify-between text-white font-semibold">
                          <span>Additional Cost:</span>
                          <span>${additionalCost}</span>
                        </div>
                        <div className="flex justify-between text-white font-semibold">
                          <span>New Total:</span>
                          <span>${booking.totalAmount + additionalCost}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={extending || additionalNights <= 0}
                    className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition flex items-center justify-center gap-2"
                  >
                    {extending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Extending...
                      </>
                    ) : (
                      <>
                        <FaMoneyBillWave />
                        Extend Stay
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtendBookingPage;
