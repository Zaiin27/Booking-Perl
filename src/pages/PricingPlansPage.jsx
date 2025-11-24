import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";
import {
  FaCheck,
  FaTimes,
  FaStar,
  FaCrown,
  FaRocket,
  FaGift,
  FaLock,
  FaChartLine,
  FaUsers,
  FaImage,
  FaHome,
  FaShieldAlt,
  FaHeadset,
  FaCode,
  FaPalette,
  FaBell,
  FaCheckCircle,
} from "react-icons/fa";

const PricingPlansPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [processingPlan, setProcessingPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
    if (user) {
      fetchMySubscription();
    }
  }, [user]);

  // Refresh subscription when returning from payment verification
  useEffect(() => {
    const locationState = window.history.state?.usr || {};
    if (locationState.subscriptionActivated) {
      fetchMySubscription();
      toast.success(`Your ${locationState.planName || 'subscription'} has been activated!`);
      // Clear the state
      window.history.replaceState({}, '');
    }
  }, []);

  // Refresh subscription status periodically
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        fetchMySubscription();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchPlans = async () => {
    try {
      const response = await axios.get("/api/v1/plans?active=true");
      if (response.data.success) {
        // Filter out "free" plan, keep "standard", "premium", and "customized"
        const filteredPlans = response.data.data.filter(
          (plan) => plan.name !== "free" && (plan.name === "standard" || plan.name === "premium" || plan.name === "customized")
        );
        setPlans(filteredPlans);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      toast.error("Failed to load plans");
    } finally {
      setLoading(false);
    }
  };

  const fetchMySubscription = async () => {
    if (!user) return; // Don't fetch if user is not logged in
    
    try {
      const token = user?.token || localStorage.getItem("auth_token");
      
      if (!token) {
        console.log("No token found, skipping subscription fetch");
        return;
      }
      
      const response = await axios.get("/api/v1/plans/my-subscription", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setCurrentSubscription(response.data.data);
        
        // Log subscription status for debugging
        if (response.data.data.isActive) {
          console.log("Active subscription found:", {
            plan: response.data.data.plan?.name || response.data.data.subscription?.planName,
            isActive: response.data.data.isActive,
            subscriptionId: response.data.data.subscription?._id
          });
        }
      }
    } catch (error) {
      // Handle 401 - token expired or invalid
      if (error.response?.status === 401) {
        console.log("Authentication failed, clearing token");
        localStorage.removeItem("auth_token");
        // Don't show error to user - they can still view plans
        return;
      }
      
      // Silently fail for other errors - user can view plans without subscription
      console.error("Error fetching subscription:", error.response?.data || error.message);
    }
  };

  const handleSelectPlan = async (plan) => {
    // Check if user is logged in
    const authToken = user?.token || localStorage.getItem("auth_token");
    if (!authToken) {
      toast.error("Please login to subscribe to a plan");
      navigate("/login", { state: { returnTo: "/pricing" } });
      return;
    }

    // If it's free plan and user already has it, do nothing
    if (plan.name === "free" && currentSubscription?.plan?.name === "free") {
      toast.info("You are already on the Free plan");
      return;
    }

    // If user already has this plan active
    if (currentSubscription?.plan?.name === plan.name && currentSubscription?.isActive) {
      toast.info(`You are already subscribed to the ${plan.displayName}`);
      return;
    }

    setProcessingPlan(plan._id || plan.name);

    try {
      if (plan.name === "free") {
        // Activate free plan directly - ensure token is sent
        const token = user?.token || localStorage.getItem("auth_token");
        const response = await axios.post(
          "/api/v1/subscriptions",
          {
            planName: "free",
            paymentMethod: "free",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          toast.success("Free plan activated successfully!");
          await fetchMySubscription();
          navigate("/properties");
        }
      } else if (plan.name === "customized") {
        // Redirect to contact/super admin for customized plan
        toast.success("Redirecting to customized plan setup...");
        navigate("/contact", {
          state: {
            message: `I'm interested in the Customized Plan. Please contact me to discuss my requirements.`,
          },
        });
      } else {
        // Check if user has active subscription
        if (currentSubscription?.isActive && currentSubscription?.subscription?.endDate) {
          const now = new Date();
          const endDate = new Date(currentSubscription.subscription.endDate);
          const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
          
          if (daysRemaining > 0) {
            // Show confirmation modal or message
            const confirmUpgrade = window.confirm(
              `You have an active subscription that expires in ${daysRemaining} day(s).\n\n` +
              `Do you want to cancel your current subscription and subscribe to ${plan.displayName}?\n\n` +
              `Note: Your current subscription will be cancelled immediately.`
            );
            
            if (!confirmUpgrade) {
              setProcessingPlan(null);
              return;
            }
            
            // Cancel current subscription first
            try {
              const token = user?.token || localStorage.getItem("auth_token");
              const cancelResponse = await axios.patch(
                `/api/v1/subscriptions/${currentSubscription.subscription._id}/cancel`,
                { reason: `Upgrading to ${plan.displayName}` },
                {
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              );
              
              if (cancelResponse.data.success) {
                toast.success("Current subscription cancelled. Redirecting to new plan...");
                // Wait a bit then navigate
                setTimeout(() => {
                  navigate(`/subscribe/${plan.name}`, {
                    state: { plan },
                  });
                }, 1000);
                return;
              }
            } catch (cancelError) {
              console.error("Error cancelling subscription:", cancelError);
              toast.error("Failed to cancel current subscription. Please try again.");
              setProcessingPlan(null);
              return;
            }
          }
        }
        
        // Redirect to payment page for paid plans
        navigate(`/subscribe/${plan.name}`, {
          state: { plan },
        });
      }
    } catch (error) {
      console.error("Error selecting plan:", error);
      
      // If 401, redirect to login
      if (error.response?.status === 401) {
        toast.error("Please login to continue");
        navigate("/login", { state: { returnTo: "/pricing" } });
      } else if (error.response?.data?.message?.includes("already have an active subscription")) {
        // Handle active subscription error
        const errorMessage = error.response.data.message;
        toast.error(errorMessage, {
          duration: 6000,
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to process plan selection");
      }
    } finally {
      setProcessingPlan(null);
    }
  };

  const getPlanIcon = (planName) => {
    switch (planName) {
      case "free":
        return <FaGift className="text-green-400" />;
      case "standard":
        return <FaStar className="text-blue-400" />;
      case "premium":
        return <FaCrown className="text-yellow-400" />;
      case "customized":
        return <FaRocket className="text-purple-400" />;
      default:
        return <FaHome className="text-gray-400" />;
    }
  };

  const getPlanBadge = (planName) => {
    const currentPlanName = currentSubscription?.plan?.name || currentSubscription?.planName || "free";
    const isCurrentPlan = currentPlanName === planName && currentSubscription?.isActive;

    if (isCurrentPlan) {
      // Calculate days remaining
      const endDate = currentSubscription?.subscription?.endDate;
      let daysRemaining = null;
      if (endDate) {
        const now = new Date();
        const end = new Date(endDate);
        daysRemaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
      }

      return (
        <span className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg animate-pulse">
          ✓ Active{daysRemaining !== null && daysRemaining > 0 ? ` (${daysRemaining}d)` : ''}
        </span>
      );
    }
    return null;
  };

  const getFeatureIcon = (enabled) => {
    return enabled ? (
      <FaCheck className="text-green-400 text-sm" />
    ) : (
      <FaTimes className="text-gray-500 text-sm" />
    );
  };

  const renderFeature = (label, enabled) => (
    <div className="flex items-center gap-3 py-2">
      {getFeatureIcon(enabled)}
      <span className={enabled ? "text-white/90" : "text-white/50"}>{label}</span>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0F0F23] via-[#1A1A2E] to-[#16213E]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#9945FF]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F23] via-[#1A1A2E] to-[#16213E] py-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Choose Your{" "}
            <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
              Perfect Plan
            </span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Select a plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Current Active Plan Display */}
        {currentSubscription && currentSubscription.isActive && (
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-xl p-6 backdrop-blur-md shadow-2xl">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <FaCheckCircle className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      ✓ Active Plan: {currentSubscription.plan?.displayName || currentSubscription.subscription?.planName || "Free Plan"}
                    </h3>
                    <p className="text-white/70 text-sm mt-1">
                      {currentSubscription.subscription?.endDate 
                        ? (() => {
                            const now = new Date();
                            const endDate = new Date(currentSubscription.subscription.endDate);
                            const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
                            return daysRemaining > 0 
                              ? `Expires in ${daysRemaining} day(s) - ${endDate.toLocaleDateString()}`
                              : `Expired on ${endDate.toLocaleDateString()}`;
                          })()
                        : currentSubscription.subscription?.planName === "free"
                        ? "Lifetime access"
                        : "Currently active"}
                    </p>
                    {currentSubscription.subscription?.planName && (
                      <p className="text-green-400 text-xs mt-1 font-semibold">
                        Plan ID: {currentSubscription.subscription?._id?.toString().substring(0, 8)}...
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse shadow-lg">
                    ✓ ACTIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Plans Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const isCustomized = plan.name === "customized";
            const currentPlanName = currentSubscription?.plan?.name || currentSubscription?.planName || "free";
            const isCurrentPlan = currentPlanName === plan.name && currentSubscription?.isActive;

            return (
              <div
                key={plan._id || plan.name}
                className={`relative bg-white/5 backdrop-blur-md rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:scale-105 flex flex-col h-full ${
                  isCurrentPlan
                    ? "border-[#14F195] shadow-2xl shadow-[#14F195]/20"
                    : plan.name === "premium"
                    ? "border-purple-500/50"
                    : "border-white/10"
                }`}
              >
                {getPlanBadge(plan.name)}

                {/* Plan Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{getPlanIcon(plan.name)}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{plan.displayName}</h3>
                      <p className="text-white/60 text-sm">{plan.description}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-4">
                    {plan.name === "customized" ? (
                      <div>
                        <p className="text-3xl font-bold text-white">Custom</p>
                        <p className="text-white/60 text-sm">Contact us for pricing</p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-4xl font-bold text-white">
                          {plan.price === 0 ? "Free" : `Rs ${plan.price.toLocaleString()}`}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-white/60 text-sm ml-2">
                            /{plan.duration === "monthly" ? "month" : plan.duration}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="p-6 space-y-4 flex-1 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                  {/* Property Limits */}
                  <div className="border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FaHome className="text-[#9945FF]" />
                      <span className="text-white font-semibold">Properties</span>
                    </div>
                    {plan.maxProperties === -1 ? (
                      <p className="text-green-400 font-semibold">Unlimited</p>
                    ) : (
                      <p className="text-white/90">{plan.maxProperties} property</p>
                    )}
                  </div>

                  {/* Photo Limits */}
                  <div className="border-b border-white/10 pb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FaImage className="text-[#9945FF]" />
                      <span className="text-white font-semibold">Photos per Property</span>
                    </div>
                    {plan.maxPhotosPerProperty === -1 ? (
                      <p className="text-green-400 font-semibold">Unlimited</p>
                    ) : (
                      <p className="text-white/90">{plan.maxPhotosPerProperty} photos</p>
                    )}
                  </div>

                  {/* Key Features */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-3">
                      <FaStar className="text-[#9945FF]" />
                      <span className="text-white font-semibold">Key Features</span>
                    </div>
                    {plan.features?.basicInfoDisplay &&
                      renderFeature("Basic Information Display", true)}
                    {plan.features?.contactForm &&
                      renderFeature("Contact Form", plan.features.contactForm)}
                    {plan.features?.priorityVisibility &&
                      renderFeature(
                        <span className="flex items-center gap-2">
                          Priority Visibility <FaRocket className="text-blue-400" />
                        </span>,
                        plan.features.priorityVisibility
                      )}
                    {plan.features?.featuredPlacement &&
                      renderFeature(
                        <span className="flex items-center gap-2">
                          Featured Placement <FaStar className="text-yellow-400" />
                        </span>,
                        plan.features.featuredPlacement
                      )}
                    {plan.features?.homepageFeatured &&
                      renderFeature(
                        <span className="flex items-center gap-2">
                          Homepage Featured <FaCrown className="text-purple-400" />
                        </span>,
                        plan.features.homepageFeatured
                      )}
                    {plan.features?.emailNotifications &&
                      renderFeature(
                        <span className="flex items-center gap-2">
                          Email Notifications <FaBell className="text-green-400" />
                        </span>,
                        plan.features.emailNotifications
                      )}
                    {plan.features?.reviewManagement &&
                      renderFeature(
                        <span className="flex items-center gap-2">
                          Review Management <FaHeadset className="text-blue-400" />
                        </span>,
                        plan.features.reviewManagement
                      )}
                    {plan.features?.bookingManagement &&
                      renderFeature(
                        <span className="flex items-center gap-2">
                          Booking Management <FaChartLine className="text-green-400" />
                        </span>,
                        plan.features.bookingManagement
                      )}
                    {plan.features?.discountPromotions &&
                      renderFeature(
                        <span className="flex items-center gap-2">
                          Discount Promotions <FaGift className="text-yellow-400" />
                        </span>,
                        plan.features.discountPromotions
                      )}
                    {plan.features?.customBranding &&
                      renderFeature(
                        <span className="flex items-center gap-2">
                          Custom Branding <FaPalette className="text-purple-400" />
                        </span>,
                        plan.features.customBranding
                      )}
                    {plan.features?.apiAccess &&
                      renderFeature(
                        <span className="flex items-center gap-2">
                          API Access <FaCode className="text-blue-400" />
                        </span>,
                        plan.features.apiAccess
                      )}
                    {plan.features?.teamAccess &&
                      renderFeature(
                        <span className="flex items-center gap-2">
                          Team Access <FaUsers className="text-green-400" />
                        </span>,
                        plan.features.teamAccess
                      )}
                    {plan.features?.dedicatedAccountManager &&
                      renderFeature(
                        <span className="flex items-center gap-2">
                          Dedicated Manager <FaHeadset className="text-yellow-400" />
                        </span>,
                        plan.features.dedicatedAccountManager
                      )}
                  </div>

                  {/* Badges */}
                  {(plan.badges?.verified ||
                    plan.badges?.trustedHost ||
                    plan.badges?.premium) && (
                    <div className="border-t border-white/10 pt-4 mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FaShieldAlt className="text-[#9945FF]" />
                        <span className="text-white font-semibold">Badges</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {plan.badges.verified && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs border border-blue-500/30">
                            ✓ Verified
                          </span>
                        )}
                        {plan.badges.trustedHost && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs border border-green-500/30">
                            ✓ Trusted Host
                          </span>
                        )}
                        {plan.badges.premium && (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs border border-yellow-500/30">
                            ⭐ Premium
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Analytics */}
                  {(plan.analytics?.basic || plan.analytics?.advanced) && (
                    <div className="border-t border-white/10 pt-4 mt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <FaChartLine className="text-[#9945FF]" />
                        <span className="text-white font-semibold">Analytics</span>
                      </div>
                      {plan.analytics.basic && (
                        <p className="text-green-400 text-sm">✓ Basic Analytics</p>
                      )}
                      {plan.analytics.advanced && (
                        <p className="text-green-400 text-sm">✓ Advanced Analytics</p>
                      )}
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <div className="p-6 border-t border-white/10">
                  <button
                    onClick={() => handleSelectPlan(plan)}
                    disabled={processingPlan === (plan._id || plan.name) || isCurrentPlan}
                    className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                      isCurrentPlan
                        ? "bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed"
                        : isCustomized
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
                        : plan.name === "premium"
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/50"
                        : "bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white hover:scale-105 hover:shadow-lg hover:shadow-[#9945FF]/50"
                    }`}
                  >
                    {processingPlan === (plan._id || plan.name) ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </span>
                    ) : isCurrentPlan ? (
                      "Current Plan"
                    ) : isCustomized ? (
                      "Contact Us"
                    ) : plan.price === 0 ? (
                      "Get Started Free"
                    ) : (
                      "Subscribe Now"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/80">
            <div>
              <h3 className="font-semibold text-white mb-2">Can I upgrade or downgrade anytime?</h3>
              <p className="text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">What payment methods do you accept?</h3>
              <p className="text-sm">
                We accept JazzCash, EasyPaisa, and Stripe (for international payments).
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Is there a contract or commitment?</h3>
              <p className="text-sm">
                No contracts. Cancel anytime. Your subscription continues until the end of the billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">Need a custom solution?</h3>
              <p className="text-sm">
                Contact us for the Customized Plan. We'll work with you to create a tailored solution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlansPage;
