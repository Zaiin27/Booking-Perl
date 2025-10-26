import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "../utils/axios";
import { FaArrowLeft, FaCheckCircle, FaMobile, FaWallet, FaSpinner } from "react-icons/fa";

const PaymentVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { booking, paymentMethod, transactionId } = location.state || {};
  
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    if (!booking || !paymentMethod || !transactionId) {
      toast.error("Invalid payment verification session");
      navigate("/properties");
      return;
    }

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setVerificationStatus('timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Start polling for payment status
    const pollPaymentStatus = async () => {
      try {
        const response = await axios.get(`/api/v1/payments/verify/${transactionId}`);
        if (response.data.success) {
          const { status } = response.data.data;
          if (status === 'completed' || status === 'success') {
            setVerificationStatus('success');
            clearInterval(timer);
            toast.success("Payment verified successfully!");
            
            // Redirect to success page after 3 seconds
            setTimeout(() => {
              navigate("/booking-success", { 
                state: { 
                  booking: booking,
                  paymentMethod: paymentMethod,
                  transactionId: transactionId
                } 
              });
            }, 3000);
          } else if (status === 'failed' || status === 'cancelled') {
            setVerificationStatus('failed');
            clearInterval(timer);
            toast.error("Payment failed or was cancelled");
          }
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    // Poll every 10 seconds
    const pollInterval = setInterval(pollPaymentStatus, 10000);
    
    // Initial check
    pollPaymentStatus();

    return () => {
      clearInterval(timer);
      clearInterval(pollInterval);
    };
  }, [booking, paymentMethod, transactionId, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPaymentMethodInfo = () => {
    switch (paymentMethod) {
      case 'jazzcash':
        return {
          name: 'JazzCash',
          icon: <FaMobile className="text-green-400 text-2xl" />,
          instructions: [
            "1. Open JazzCash app on your mobile",
            "2. Go to 'Send Money' or 'Pay Bills'",
            "3. Enter the amount: PKR " + booking.totalAmount,
            "4. Use transaction ID: " + transactionId,
            "5. Complete the payment"
          ],
          color: 'green'
        };
      case 'easypaisa':
        return {
          name: 'EasyPaisa',
          icon: <FaWallet className="text-purple-400 text-2xl" />,
          instructions: [
            "1. Open EasyPaisa app on your mobile",
            "2. Go to 'Send Money' or 'Pay Bills'",
            "3. Enter the amount: PKR " + booking.totalAmount,
            "4. Use transaction ID: " + transactionId,
            "5. Complete the payment"
          ],
          color: 'purple'
        };
      default:
        return null;
    }
  };

  const paymentInfo = getPaymentMethodInfo();

  if (!paymentInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0F0F23] via-[#1A1A2E] to-[#16213E]">
        <div className="text-white text-xl">Invalid payment method</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F23] via-[#1A1A2E] to-[#16213E]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-[#2A2A3E] text-white hover:bg-[#3A3A4E] transition"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-3xl font-bold text-white">Payment Verification</h1>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Payment Method Card */}
          <div className="bg-[#171D41] rounded-xl shadow-lg p-6 border border-[#3A3A4E] mb-6">
            <div className="flex items-center gap-4 mb-4">
              {paymentInfo.icon}
              <div>
                <h2 className="text-2xl font-semibold text-white">{paymentInfo.name} Payment</h2>
                <p className="text-[#AEB9E1]">Complete your payment to confirm booking</p>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="bg-[#2A2A3E] rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[#AEB9E1] text-sm">Transaction ID:</span>
                  <p className="text-white font-mono text-sm">{transactionId}</p>
                </div>
                <div>
                  <span className="text-[#AEB9E1] text-sm">Amount:</span>
                  <p className="text-white font-semibold">PKR {booking.totalAmount}</p>
                </div>
                <div>
                  <span className="text-[#AEB9E1] text-sm">Booking Reference:</span>
                  <p className="text-white font-mono text-sm">{booking.bookingReference}</p>
                </div>
                <div>
                  <span className="text-[#AEB9E1] text-sm">Time Remaining:</span>
                  <p className={`font-semibold ${timeLeft < 60 ? 'text-red-400' : 'text-white'}`}>
                    {formatTime(timeLeft)}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="text-center mb-6">
              {verificationStatus === 'pending' && (
                <div className="flex items-center justify-center gap-3">
                  <FaSpinner className="animate-spin text-blue-400 text-xl" />
                  <span className="text-blue-400 font-semibold">Waiting for payment confirmation...</span>
                </div>
              )}
              {verificationStatus === 'success' && (
                <div className="flex items-center justify-center gap-3">
                  <FaCheckCircle className="text-green-400 text-xl" />
                  <span className="text-green-400 font-semibold">Payment confirmed! Redirecting...</span>
                </div>
              )}
              {verificationStatus === 'failed' && (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 bg-red-400 rounded-full"></div>
                  <span className="text-red-400 font-semibold">Payment failed or cancelled</span>
                </div>
              )}
              {verificationStatus === 'timeout' && (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 bg-yellow-400 rounded-full"></div>
                  <span className="text-yellow-400 font-semibold">Payment timeout</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-[#171D41] rounded-xl shadow-lg p-6 border border-[#3A3A4E]">
            <h3 className="text-xl font-semibold text-white mb-4">Payment Instructions</h3>
            <div className="space-y-3">
              {paymentInfo.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full bg-${paymentInfo.color}-500 text-white text-xs flex items-center justify-center font-semibold flex-shrink-0 mt-0.5`}>
                    {index + 1}
                  </div>
                  <p className="text-[#AEB9E1]">{instruction}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm">
                <strong>Important:</strong> Please complete the payment within {formatTime(timeLeft)}. 
                The page will automatically refresh once your payment is confirmed.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => navigate("/properties")}
                className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
              >
                Cancel Payment
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
              >
                Refresh Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerificationPage;
