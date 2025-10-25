import React from "react";
import StatCard from "./features/dashboard-card";
import SummaryStat from "./features/Summary-stat";
import ServiceStatus from "./features/ServiceStatus";
import { DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
import { useGetAdminDashboardOverviewQuery } from "../../../services/admin/adminApi";
import PageLoading from "../../../components/PageLoading";

const AdminDashboard = () => {
  const { 
    data: overviewData, 
    isLoading, 
    isError, 
    error 
  } = useGetAdminDashboardOverviewQuery();

  // Show loading state
  if (isLoading) {
    return <PageLoading message="Loading dashboard..." />;
  }

  // Show error state
  if (isError) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">
            Error loading dashboard overview: {error?.message || "Unknown error"}
          </div>
        </div>
      </div>
    );
  }

  // Extract data from API response
  const totalVolume = overviewData?.data?.totalVolume 
    ? `$${overviewData.data.totalVolume.toFixed(2)}` 
    : "$0.00";
  const ordersToday = overviewData?.data?.todaySuccessfulOrdersCount?.toString() || "0";
  const solTokenRatio = "65% / 35%"; // This field is not in the API response, keeping static for now

  return (
    <div className="p-6">
      {/* <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1> */}

      {/* Stat Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Volume" value={totalVolume} icon={DollarSign} />
        <StatCard title="Orders Today" value={ordersToday} icon={ShoppingCart} />
        <StatCard
          title="SOL vs Token Ratio"
          value={solTokenRatio}
          icon={TrendingUp}
        />
      </div>

      {/* Summary Stats Section */}
      <SummaryStat />

      {/* Service Status Section */}
      <div className="mt-6">
        <ServiceStatus />
      </div>
    </div>
  );
};

export default AdminDashboard;
