import React from "react";
import { useGetOrderAnalyticsQuery } from "../../services/Api";

const SummaryCards = () => {
  const { data: analyticsData, isLoading, error } = useGetOrderAnalyticsQuery();

  // Default values if data is not available
  const monthlySavings = analyticsData?.data?.savings_this_month || 0;
  const totalOrders = analyticsData?.data?.orders_count || 0;
  const lifetimeSavings = analyticsData?.data?.total_savings || 0;
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
