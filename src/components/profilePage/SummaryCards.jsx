import React from "react";
import { useSelector } from "react-redux";
import { useGetOrderAnalyticsQuery } from "../../services/Api";
import { useGetHotelDashboardOverviewQuery } from "../../services/admin/adminApi";

const SummaryCards = () => {
  const { user } = useSelector((state) => state.auth);
  const isStaff = user?.role === "staff";

  // Fetch data based on role
  const {
    data: analyticsData,
    isLoading: isLoadingUserAnim,
    error: userError
  } = useGetOrderAnalyticsQuery(undefined, { skip: isStaff });

  const {
    data: hotelData,
    isLoading: isLoadingStaffAnim,
    error: staffError,
  } = useGetHotelDashboardOverviewQuery(undefined, { skip: !isStaff });

  const isLoading = isStaff ? isLoadingStaffAnim : isLoadingUserAnim;

  // Default values for standard users
  const monthlySavings = analyticsData?.data?.savings_this_month || 0;
  const totalOrders = analyticsData?.data?.orders_count || 0;
  const lifetimeSavings = analyticsData?.data?.total_savings || 0;

  // Values for staff members
  const hotelOverview = hotelData?.data || {};
  const totalCommission = hotelOverview.totalCommission || 0;
  const totalHotelRevenue = hotelOverview.totalHotelRevenue || 0;
  const totalUnpaidRevenue = hotelOverview.totalUnpaidRevenue || 0;
  const currency = hotelOverview.currency || "USD";

  // Format currency helper
  const formatValue = (amount) => {
    if (isStaff) {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
      }).format(amount);
    }
    return `$${amount}`;
  };

  if (isStaff) {
    return (
      <div className="max-w-6xl mx-auto mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Service Fees Card */}
          <div
            className="rounded-3xl p-3 border border-[#FFFFFF3B] w-full"
            style={{
              background: "#FFFFFF33",
              backdropFilter: "blur(1px)",
              boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
            }}
          >
            <div className="relative bg-white backdrop-blur-md rounded-2xl p-6 text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 bg-[#FDE68A] rounded-bl-full opacity-60"></div>
              <div className="text-4xl font-inter font-bold mb-2 bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
                {isLoading ? "..." : formatValue(totalCommission)}
              </div>
              <div className="text-[#374151] font-inter font-medium text-sm mb-1">
                Service Fees Commission
              </div>
            </div>
          </div>

          {/* Hotel Revenue Card */}
          <div
            className="rounded-3xl p-3 border border-[#FFFFFF3B] w-full"
            style={{
              background: "#FFFFFF33",
              backdropFilter: "blur(1px)",
              boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
            }}
          >
            <div className="relative bg-white backdrop-blur-md rounded-2xl p-6 text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 bg-[#DCFCE7] rounded-bl-full opacity-60"></div>
              <div className="text-4xl font-inter font-bold mb-2 bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
                {isLoading ? "..." : formatValue(totalHotelRevenue)}
              </div>
              <div className="text-[#374151] font-inter font-medium text-sm mb-1">
                Hotel Revenue
              </div>
            </div>
          </div>

          {/* Total Outstanding Card */}
          <div
            className="rounded-3xl p-3 border border-[#FFFFFF3B] w-full"
            style={{
              background: "#FFFFFF33",
              backdropFilter: "blur(1px)",
              boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
            }}
          >
            <div className="relative bg-white backdrop-blur-md rounded-2xl p-6 text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 bg-[#DBEAFE] rounded-bl-full opacity-60"></div>
              <div className="text-4xl font-inter font-bold mb-2 bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
                {isLoading ? "..." : formatValue(totalUnpaidRevenue)}
              </div>
              <div className="text-[#374151] font-inter font-medium text-sm mb-1">
                Total Revenue
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Savings Card */}
        <div
          className="rounded-3xl p-3 border border-[#FFFFFF3B] w-full"
          style={{
            background: "#FFFFFF33",
            backdropFilter: "blur(1px)",
            boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
          }}
        >
          <div className="relative bg-white backdrop-blur-md rounded-2xl p-6 text-center overflow-hidden">
            {/* Quarter-circle decorative element */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-[#FDE68A] rounded-bl-full opacity-60"></div>
            <div className="text-4xl font-inter font-bold mb-2 bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
              {isLoading ? "..." : `$${monthlySavings}`}
            </div>
            <div className="text-[#374151] font-inter font-medium text-sm mb-1">
              Your Savings this month
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div
          className="rounded-3xl p-3 border border-[#FFFFFF3B] w-full"
          style={{
            background: "#FFFFFF33",
            backdropFilter: "blur(1px)",
            boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
          }}
        >
          <div className="relative bg-white backdrop-blur-md rounded-2xl p-6 text-center overflow-hidden">
            {/* Quarter-circle decorative element */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-[#DCFCE7] rounded-bl-full opacity-60"></div>
            <div className="text-4xl font-inter font-bold mb-2 bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
              {isLoading ? "..." : String(totalOrders).padStart(2, "0")}
            </div>
            <div className="text-[#374151] font-inter font-medium text-sm mb-1">
              Orders
            </div>
          </div>
        </div>

        {/* Lifetime Savings Card */}
        <div
          className="rounded-3xl p-3 border border-[#FFFFFF3B] w-full"
          style={{
            background: "#FFFFFF33",
            backdropFilter: "blur(1px)",
            boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
          }}
        >
          <div className="relative bg-white backdrop-blur-md rounded-2xl p-6 text-center overflow-hidden">
            {/* Quarter-circle decorative element */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-[#DBEAFE] rounded-bl-full opacity-60"></div>
            <div className="text-4xl font-inter font-bold mb-2 bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
              {isLoading ? "..." : `$${lifetimeSavings}`}
            </div>
            <div className="text-[#374151] font-inter font-medium text-sm mb-1">
              Lifetime Savings
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
