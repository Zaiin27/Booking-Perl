import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaCreditCard,
  FaMobile,
  FaWallet,
  FaLock,
} from "react-icons/fa";

const SubscribePage = () => {
  const navigate = useNavigate();
  const { planName } = useParams();
  const { user } = useSelector((state) => state.auth);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("jazzcash");
  const [mobileNumber, setMobileNumber] = useState("");

  useEffect(() => {
    if (!user) {
      toast.error("Please login to subscribe");
      navigate("/login");
      return;
    }
    fetchPlan();
    checkCurrentSubscription();
  }, [planName, user]);

  const checkCurrentSubscription = async () => {
    if (!user) return;
    
    try {
      const token = user?.token || localStorage.getItem("auth_token");
      const response = await axios.get("/api/v1/plans/my-subscription", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (response.data.success && response.data.data.isActive) {
        const currentPlan = response.data.data.plan?.name || response.data.data.subscription?.planName;
        if (currentPlan === planName) {
          toast.info(`You already have an active ${planName} subscription!`, {
            duration: 5000,
          });
          // Redirect to pricing page after 2 seconds
          setTimeout(() => {
            navigate("/pricing");
          }, 2000);
        }
      }
    } catch (error) {
      // Silently fail - user can still proceed
      console.error("Error checking subscription:", error);
    }
  };

  const fetchPlan = async () => {
    try {
      const response = await axios.get(`/api/v1/plans/${planName}`);
      if (response.data.success) {
        setPlan(response.data.data);
      } else {
        toast.error("Plan not found");
        navigate("/pricing");
      }
    } catch (error) {
      console.error("Error fetching plan:", error);
      toast.error("Failed to load plan details");
      navigate("/pricing");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      toast.error("Please login to subscribe");
      navigate("/login");
      return;
    }

    if (paymentMethod !== "stripe" && !mobileNumber) {
      toast.error(`Please enter your ${paymentMethod === "jazzcash" ? "JazzCash" : "EasyPaisa"} mobile number`);
      return;
    }

    setProcessing(true);

    try {
      // Get token from user or localStorage
      const token = user?.token || localStorage.getItem("auth_token");
      
      if (!token) {
        toast.error("Please login to subscribe");
        navigate("/login", { state: { returnTo: `/subscribe/${planName}` } });
        return;
      }

      // Create subscription with explicit token
      const response = await axios.post("/api/v1/subscriptions", {
        planName: plan.name,
        duration: plan.duration,
        paymentMethod: paymentMethod === "stripe" ? "manual" : paymentMethod,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        const subscription = response.data.data;

        if (paymentMethod === "stripe") {
          // Handle Stripe payment (if implemented)
          toast.success("Redirecting to payment...");
          // Navigate to payment page
          navigate("/order-now", {
            state: {
              subscriptionId: subscription._id,
              amount: plan.price,
              currency: plan.currency,
              planName: plan.name,
            },
          });
        } else {
          // For JazzCash/EasyPaisa, create payment first
          try {
            const paymentEndpoint = paymentMethod === "jazzcash" 
              ? "/api/v1/payments/create-jazzcash-payment"
              : "/api/v1/payments/create-easypaisa-payment";
            
            const paymentResponse = await axios.post(paymentEndpoint, {
              amount: plan.price,
              currency: plan.currency,
              subscription_id: subscription._id,
              mobile_number: mobileNumber,
              description: `Payment for ${plan.displayName} subscription`,
            }, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });

            if (paymentResponse.data.success) {
              const { transaction_id, payment_url } = paymentResponse.data.data;
              
              // Update subscription with transaction ID
              await axios.patch(`/api/v1/subscriptions/${subscription._id}`, {
                transactionId: transaction_id,
              }, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });

              toast.success("Payment initiated! Please complete payment on your mobile device.");
              
              // Open payment URL in new tab if available
              if (payment_url) {
                window.open(payment_url, '_blank');
              }
              
              // Navigate to payment verification
              navigate("/payment-verification", {
                state: {
                  subscriptionId: subscription._id,
                  paymentMethod,
                  transactionId: transaction_id,
                  amount: plan.price,
                  currency: plan.currency,
                  planName: plan.name,
                },
              });
            } else {
              toast.error("Failed to initiate payment");
            }
          } catch (error) {
            console.error("Error creating payment:", error);
            
            // Handle 401 Unauthorized
            if (error.response?.status === 401) {
              toast.error("Session expired. Please login again.");
              localStorage.removeItem("auth_token");
              navigate("/login", { state: { returnTo: `/subscribe/${planName}` } });
              return;
            }
            
            toast.error(error.response?.data?.message || "Failed to create payment");
          }
        }
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      
      // Handle 401 Unauthorized
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("auth_token");
        navigate("/login", { state: { returnTo: `/subscribe/${planName}` } });
        return;
      }
      
      // Handle already active subscription
      if (error.response?.data?.message?.includes("already have an active subscription")) {
        toast.error("You already have an active subscription!", {
          duration: 5000,
        });
        // Redirect to pricing page to see active subscription
        setTimeout(() => {
          navigate("/pricing");
        }, 2000);
        return;
      }
      
      toast.error(error.response?.data?.message || "Failed to create subscription");
    } finally {
      setProcessing(false);
    }
  };

  const formatCurrency = (amount) => {
    if (plan?.currency === "PKR" || plan?.currency === "Rs") {
      return `Rs ${amount.toLocaleString()}`;
    }
    return `$${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0F0F23] via-[#1A1A2E] to-[#16213E]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#9945FF]"></div>
      </div>
    );
  }

  if (!plan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F23] via-[#1A1A2E] to-[#16213E] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/pricing")}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all"
          >
            <FaArrowLeft className="text-white" />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Subscribe to {plan.displayName}</h1>
            <p className="text-white/70 mt-2">Complete your payment to activate your subscription</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Summary */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">Plan Details</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                <span className="text-white/70">Plan</span>
                <span className="text-white font-semibold">{plan.displayName}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                <span className="text-white/70">Duration</span>
                <span className="text-white font-semibold capitalize">{plan.duration}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                <span className="text-white/70">Properties</span>
                <span className="text-white font-semibold">
                  {plan.maxProperties === -1 ? "Unlimited" : plan.maxProperties}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg">
                <span className="text-white/70">Photos per Property</span>
                <span className="text-white font-semibold">
                  {plan.maxPhotosPerProperty === -1 ? "Unlimited" : plan.maxPhotosPerProperty}
                </span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/70">Total Amount</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
                  {formatCurrency(plan.price)}
                </span>
              </div>
              {plan.duration !== "lifetime" && (
                <p className="text-white/60 text-sm">Billed {plan.duration}</p>
              )}
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">Payment Method</h2>

            <div className="space-y-4">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-white/90 mb-3">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-1 gap-3">
                  {/* JazzCash */}
                  <div
                    onClick={() => setPaymentMethod("jazzcash")}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === "jazzcash"
                        ? "border-green-500 bg-green-500/10"
                        : "border-white/20 hover:border-green-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FaMobile className="text-green-400 text-xl" />
                      <div>
                        <h3 className="text-white font-semibold">JazzCash</h3>
                        <p className="text-white/60 text-sm">Pay with JazzCash mobile wallet</p>
                      </div>
                    </div>
                  </div>

                  {/* EasyPaisa */}
                  <div
                    onClick={() => setPaymentMethod("easypaisa")}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      paymentMethod === "easypaisa"
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-white/20 hover:border-purple-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FaWallet className="text-purple-400 text-xl" />
                      <div>
                        <h3 className="text-white font-semibold">EasyPaisa</h3>
                        <p className="text-white/60 text-sm">Pay with EasyPaisa mobile wallet</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Number Input */}
              {(paymentMethod === "jazzcash" || paymentMethod === "easypaisa") && (
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    {paymentMethod === "jazzcash" ? "JazzCash" : "EasyPaisa"} Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="03XX-XXXXXXX"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
                  />
                </div>
              )}

              {/* Security Info */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-2 text-white/70 text-sm mb-2">
                  <FaLock className="text-green-400" />
                  <span>Secure payment processing</span>
                </div>
                <p className="text-white/60 text-xs">
                  Your payment information is encrypted and secure. We never store your payment details.
                </p>
              </div>

              {/* Subscribe Button */}
              <button
                onClick={handleSubscribe}
                disabled={processing}
                className="w-full bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white font-semibold py-4 px-6 rounded-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-[#9945FF]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </span>
                ) : (
                  `Subscribe Now - ${formatCurrency(plan.price)}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscribePage;
