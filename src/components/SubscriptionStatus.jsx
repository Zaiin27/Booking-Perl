import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";
import { FaCrown, FaStar, FaGift, FaRocket, FaArrowUp } from "react-icons/fa";

const SubscriptionStatus = ({ showUpgrade = true }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSubscription();
    }
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      const token = user?.token || localStorage.getItem("auth_token");
      if (!token) {
        setLoading(false);
        return;
      }
      
      const response = await axios.get("/api/v1/plans/my-subscription", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setSubscription(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
      // Handle 401 - clear token and redirect
      if (error.response?.status === 401) {
        localStorage.removeItem("auth_token");
      }
    } finally {
      setLoading(false);
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
        return null;
    }
  };

  const getPlanColor = (planName) => {
    switch (planName) {
      case "free":
        return "from-green-500 to-emerald-500";
      case "standard":
        return "from-blue-500 to-cyan-500";
      case "premium":
        return "from-yellow-500 to-orange-500";
      case "customized":
        return "from-purple-500 to-pink-500";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 mb-4">
        <div className="animate-pulse">
          <div className="h-4 bg-white/10 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-white/10 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  // If no subscription, show free plan
  const plan = subscription?.plan || { name: "free", displayName: "Free Plan (Basic)" };
  // Free plan is always considered active, or if subscription is active
  const isActive = plan.name === "free" ? true : (subscription?.isActive || false);

  return (
    <div
      className={`bg-gradient-to-r ${getPlanColor(plan.name)}/20 border border-white/20 rounded-xl p-4 mb-4`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{getPlanIcon(plan.name)}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold">{plan.displayName}</span>
              {isActive ? (
                <span className="px-2 py-0.5 bg-green-500/30 text-green-300 rounded text-xs">
                  Active
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-red-500/30 text-red-300 rounded text-xs">
                  Inactive
                </span>
              )}
            </div>
            {subscription?.subscription?.endDate && (
              <p className="text-white/70 text-sm mt-1">
                {isActive
                  ? `Renews ${new Date(subscription.subscription.endDate).toLocaleDateString()}`
                  : `Expired ${new Date(subscription.subscription.endDate).toLocaleDateString()}`}
              </p>
            )}
            {!subscription?.subscription?.endDate && plan.name !== "free" && (
              <p className="text-white/70 text-sm mt-1">Lifetime access</p>
            )}
            {plan.name === "free" && (
              <p className="text-white/70 text-sm mt-1">Always free - no expiry</p>
            )}
          </div>
        </div>
        {showUpgrade && plan.name !== "customized" && (
          <button
            onClick={() => navigate("/pricing")}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all flex items-center gap-2 text-sm font-semibold"
          >
            <FaArrowUp />
            {plan.name === "free" ? "Upgrade" : "Change Plan"}
          </button>
        )}
      </div>
    </div>
  );
};

export default SubscriptionStatus;
