import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStripe, useElements } from '@stripe/react-stripe-js';
import StripeCardElement from "../StripeCardElement.jsx";
import { toast } from "react-hot-toast";
import axios from "../../utils/axios";
import { FaArrowLeft, FaCheckCircle, FaCreditCard, FaHotel, FaMobile, FaWallet } from "react-icons/fa";

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
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [mobileNumber, setMobileNumber] = useState('');

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
    setProcessing(true);

    try {
      if (paymentMethod === 'stripe') {
        await handleStripePayment();
      } else if (paymentMethod === 'jazzcash') {
        await handleJazzCashPayment();
      } else if (paymentMethod === 'easypaisa') {
        await handleEasyPaisaPayment();
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const handleStripePayment = async () => {
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
  };

  const handleJazzCashPayment = async () => {
    if (!mobileNumber) {
      toast.error("Please enter your JazzCash mobile number");
      return;
    }

    const response = await axios.post("/api/v1/payments/create-jazzcash-payment", {
      amount: booking.totalAmount,
      currency: "PKR",
      booking_reference: booking.bookingReference,
      booking_id: booking.booking_id,
      mobile_number: mobileNumber,
      description: `Payment for booking ${booking.bookingReference}`,
    });

    if (response.data.success) {
      const { transaction_id, payment_url } = response.data.data;
      
      // Show JazzCash payment instructions
      toast.success("JazzCash payment initiated! Please complete payment on your mobile device.");
      
      // Open JazzCash payment URL in new tab
      if (payment_url) {
        window.open(payment_url, '_blank');
      }
      
      // Navigate to payment verification page
      navigate("/payment-verification", { 
        state: { 
          booking: booking,
          paymentMethod: 'jazzcash',
          transactionId: transaction_id
        } 
      });
    } else {
      toast.error(response.data.message || "Failed to initiate JazzCash payment");
    }
  };

  const handleEasyPaisaPayment = async () => {
    if (!mobileNumber) {
      toast.error("Please enter your EasyPaisa mobile number");
      return;
    }

    const response = await axios.post("/api/v1/payments/create-easypaisa-payment", {
      amount: booking.totalAmount,
      currency: "PKR",
      booking_reference: booking.bookingReference,
      booking_id: booking.booking_id,
      mobile_number: mobileNumber,
      description: `Payment for booking ${booking.bookingReference}`,
    });

    if (response.data.success) {
      const { transaction_id, payment_url } = response.data.data;
      
      // Show EasyPaisa payment instructions
      toast.success("EasyPaisa payment initiated! Please complete payment on your mobile device.");
      
      // Open EasyPaisa payment URL in new tab
      if (payment_url) {
        window.open(payment_url, '_blank');
      }
      
      // Navigate to payment verification page
      navigate("/payment-verification", { 
        state: { 
          booking: booking,
          paymentMethod: 'easypaisa',
          transactionId: transaction_id
        } 
      });
    } else {
      toast.error(response.data.message || "Failed to initiate EasyPaisa payment");
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
              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-[#AEB9E1] mb-3">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {/* Stripe Option */}
                  <div 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === 'stripe' 
                        ? 'border-blue-500 bg-blue-500/10' 
                        : 'border-[#3A3A4E] hover:border-blue-400'
                    }`}
                    onClick={() => setPaymentMethod('stripe')}
                  >
                    <div className="flex items-center gap-3">
                      <FaCreditCard className="text-blue-400 text-xl" />
                      <div>
                        <h3 className="text-white font-semibold">Credit/Debit Card</h3>
                        <p className="text-[#AEB9E1] text-sm">Pay securely with Stripe</p>
                      </div>
                    </div>
                  </div>

                  {/* JazzCash Option */}
                  <div 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === 'jazzcash' 
                        ? 'border-green-500 bg-green-500/10' 
                        : 'border-[#3A3A4E] hover:border-green-400'
                    }`}
                    onClick={() => setPaymentMethod('jazzcash')}
                  >
                    <div className="flex items-center gap-3">
                      <FaMobile className="text-green-400 text-xl" />
                      <div>
                        <h3 className="text-white font-semibold">JazzCash</h3>
                        <p className="text-[#AEB9E1] text-sm">Pay with JazzCash mobile wallet</p>
                      </div>
                    </div>
                  </div>

                  {/* EasyPaisa Option */}
                  <div 
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === 'easypaisa' 
                        ? 'border-purple-500 bg-purple-500/10' 
                        : 'border-[#3A3A4E] hover:border-purple-400'
                    }`}
                    onClick={() => setPaymentMethod('easypaisa')}
                  >
                    <div className="flex items-center gap-3">
                      <FaWallet className="text-purple-400 text-xl" />
                      <div>
                        <h3 className="text-white font-semibold">EasyPaisa</h3>
                        <p className="text-[#AEB9E1] text-sm">Pay with EasyPaisa mobile wallet</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Number Input for JazzCash/EasyPaisa */}
              {(paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') && (
                <div>
                  <label className="block text-sm font-medium text-[#AEB9E1] mb-2">
                    {paymentMethod === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'} Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="03XX-XXXXXXX"
                    className="w-full px-4 py-3 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg text-white placeholder-[#AEB9E1] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-[#AEB9E1] text-xs mt-1">
                    Enter your {paymentMethod === 'jazzcash' ? 'JazzCash' : 'EasyPaisa'} registered mobile number
                  </p>
                </div>
              )}

              {/* Stripe Card Information */}
              {paymentMethod === 'stripe' && (
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
              )}

              <div className="bg-[#2A2A3E] rounded-lg p-4 border border-[#3A3A4E]">
                <div className="flex items-center gap-2 text-[#AEB9E1] mb-2">
                  <FaCheckCircle className="text-green-400" />
                  <span className="text-sm">
                    {paymentMethod === 'stripe' && "Secure payment powered by Stripe"}
                    {paymentMethod === 'jazzcash' && "Secure payment via JazzCash"}
                    {paymentMethod === 'easypaisa' && "Secure payment via EasyPaisa"}
                  </span>
                </div>
                <p className="text-xs text-[#AEB9E1]">
                  {paymentMethod === 'stripe' && "Your payment information is encrypted and secure. We never store your card details."}
                  {paymentMethod === 'jazzcash' && "Your payment will be processed securely through JazzCash. You'll receive a confirmation SMS."}
                  {paymentMethod === 'easypaisa' && "Your payment will be processed securely through EasyPaisa. You'll receive a confirmation SMS."}
                </p>
              </div>

              <button
                onClick={handlePayment}
                disabled={processing || (paymentMethod === 'stripe' && (!stripe || !elements))}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    {paymentMethod === 'stripe' && <FaCreditCard />}
                    {paymentMethod === 'jazzcash' && <FaMobile />}
                    {paymentMethod === 'easypaisa' && <FaWallet />}
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
