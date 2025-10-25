import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStripe, useElements } from '@stripe/react-stripe-js';
import StripeCardElement from "../StripeCardElement.jsx";
import { toast } from "react-hot-toast";
import axios from "../../utils/axios";
import { FaArrowLeft, FaCheckCircle, FaCreditCard, FaHotel } from "react-icons/fa";

const BookingPaymentForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingReference = searchParams.get('booking');
  
  const stripe = useStripe();
  const elements = useElements();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState(null);

  // Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingReference) {
        toast.error("No booking reference found");
        navigate("/properties");
        return;
      }

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

    fetchBooking();
  }, [bookingReference, navigate]);

  const handlePayment = async () => {
    if (!stripe || !elements) {
      toast.error("Stripe is not loaded yet. Please try again.");
      return;
    }

    const cardElement = elements.getElement('cardNumber');
    if (!cardElement) {
      toast.error("Card element not found. Please try again.");
      return;
    }

    if (cardError) {
      toast.error(cardError);
      return;
    }

    setProcessing(true);

    try {
      // Create payment intent for booking
      const response = await axios.post("/api/v1/payments/create-booking-payment-intent", {
        amount: booking.totalAmount,
        currency: "usd",
        booking_reference: booking.bookingReference,
        booking_id: booking.booking_id,
        description: `Payment for booking ${booking.bookingReference}`,
      });

      if (response.data.success) {
        const { client_secret } = response.data.data;
        
        const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
          payment_method: {
            card: cardElement,
          }
        });

        if (error) {
          console.log("Stripe confirmation error:", error);
          toast.error(error.message);
        } else if (paymentIntent.status === 'succeeded') {
          toast.success("Payment processed successfully! Your booking is confirmed.");
          navigate("/booking-success", { 
            state: { 
              booking: booking,
              paymentIntent: paymentIntent 
            } 
          });
        } else {
          toast.error("Payment was not successful. Please try again.");
        }
      } else {
        toast.error("Failed to create payment intent. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0F0F23] via-[#1A1A2E] to-[#16213E]">
        <div className="text-white text-xl">Loading booking details...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0F0F23] via-[#1A1A2E] to-[#16213E]">
        <div className="text-white text-xl">Booking not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F23] via-[#1A1A2E] to-[#16213E] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/properties")}
            className="p-3 bg-[#2A2A3E] text-[#AEB9E1] rounded-full hover:bg-[#3A3A4E] transition"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white">Complete Your Payment</h1>
            <p className="text-[#AEB9E1] mt-2">Booking Reference: {booking.bookingReference}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <div className="bg-[#171D41] rounded-xl shadow-lg p-6 border border-[#3A3A4E]">
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
              <FaHotel className="text-blue-400" />
              Booking Summary
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white">{booking.property_id?.name}</h3>
                <p className="text-[#AEB9E1]">{booking.property_id?.address}</p>
              </div>
              
              <div className="border-t border-[#3A3A4E] pt-4">
                <div className="flex justify-between text-[#AEB9E1] mb-2">
                  <span>Guest:</span>
                  <span className="text-white">{booking.guestName}</span>
                </div>
                <div className="flex justify-between text-[#AEB9E1] mb-2">
                  <span>Check-in:</span>
                  <span className="text-white">{new Date(booking.checkInDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-[#AEB9E1] mb-2">
                  <span>Check-out:</span>
                  <span className="text-white">{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-[#AEB9E1] mb-2">
                  <span>Guests:</span>
                  <span className="text-white">{booking.numberOfGuests}</span>
                </div>
                <div className="flex justify-between text-[#AEB9E1] mb-2">
                  <span>Rooms:</span>
                  <span className="text-white">{booking.totalRooms}</span>
                </div>
              </div>

              <div className="border-t border-[#3A3A4E] pt-4">
                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total Amount:</span>
                  <span>${booking.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-[#171D41] rounded-xl shadow-lg p-6 border border-[#3A3A4E]">
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
              <FaCreditCard className="text-green-400" />
              Payment Details
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#AEB9E1] mb-2">
                  Card Information
                </label>
                <StripeCardElement
                  onError={(error) => setCardError(error.message)}
                  onSuccess={() => setCardError(null)}
                />
                {cardError && (
                  <p className="text-red-400 text-sm mt-2">{cardError}</p>
                )}
              </div>

              <div className="bg-[#2A2A3E] rounded-lg p-4 border border-[#3A3A4E]">
                <div className="flex items-center gap-2 text-[#AEB9E1] mb-2">
                  <FaCheckCircle className="text-green-400" />
                  <span className="text-sm">Secure payment powered by Stripe</span>
                </div>
                <p className="text-xs text-[#AEB9E1]">
                  Your payment information is encrypted and secure. We never store your card details.
                </p>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing || !stripe || !elements}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <FaCreditCard />
                    Pay ${booking.totalAmount}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPaymentForm;
