import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../../mealAdminPages/dashboard/features/dashboard-card";
import {
  Building2,
  Calendar,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  Home,
} from "lucide-react";
import {
  useGetHotelDashboardOverviewQuery,
  useGetBookingStatsByDateRangeQuery,
  useGetUpcomingActivityQuery,
} from "../../../services/admin/adminApi";
import PageLoading from "../../../components/PageLoading";
import { useSelector } from "react-redux";
import BookingChart from "../../mealAdminPages/dashboard/features/BookingChart";
import RecentBookings from "../../mealAdminPages/dashboard/features/RecentBookings";
import UpcomingCheckIns from "../../mealAdminPages/dashboard/features/UpcomingCheckIns";
import SubscriptionStatus from "../../../components/SubscriptionStatus";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Get current date range for last 7 days
  const getLast7Days = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    start.setHours(0, 0, 0, 0);
    return {
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
    };
  };

  const { startDate, endDate } = getLast7Days();

  // Fetch dashboard data (staff only sees their own data)
  const {
    data: overviewData,
    isLoading: isLoadingOverview,
    isError: isErrorOverview,
    error: overviewError,
  } = useGetHotelDashboardOverviewQuery();

  const {
    data: bookingStatsData,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = useGetBookingStatsByDateRangeQuery({ startDate, endDate });

  const {
    data: upcomingActivityData,
    isLoading: isLoadingActivity,
    isError: isErrorActivity,
  } = useGetUpcomingActivityQuery();

  // Show loading state
  if (isLoadingOverview) {
    return <PageLoading message="Loading dashboard..." />;
  }

  // Show error state
  if (isErrorOverview) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">
            Error loading dashboard: {overviewError?.message || "Unknown error"}
          </div>
        </div>
      </div>
    );
  }

  // Extract data from API response
  const dashboardData = overviewData?.data || {};
  const {
    totalProperties = 0,
    totalBookings = 0,
    todayBookings = 0,
    totalRevenue = 0,
    pendingBookings = 0,
    confirmedBookings = 0,
    activeGuests = 0,
    currency = "USD",
    totalCommission = 0,
    totalHotelRevenue = 0,
    totalUnpaidRevenue = 0,
  } = dashboardData;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="p-4 sm:p-6 bg-[#0A1330] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#9945FF] to-[#14F195] flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">My Dashboard</h1>
        </div>
        <p className="text-[#AEB9E1] text-sm sm:text-base">
          Welcome back! Here's what's happening with your property today.
        </p>
      </div>

      {/* Subscription Status */}
      <SubscriptionStatus showUpgrade={true} />

      {/* Stat Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Service Fees Commission"
          value={formatCurrency(totalCommission)}
          icon={DollarSign}
          gradient="from-purple-500 to-pink-500"
        />
        <StatCard
          title="Hotel Revenue"
          value={formatCurrency(totalHotelRevenue)}
          icon={TrendingUp}
          gradient="from-green-500 to-emerald-500"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalUnpaidRevenue)}
          icon={CheckCircle}
          gradient="from-blue-500 to-cyan-500"
        />
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Bookings"
          value={totalBookings.toString()}
          icon={TrendingUp}
          gradient="from-indigo-500 to-blue-500"
        />
        <StatCard
          title="Pending"
          value={pendingBookings.toString()}
          icon={Clock}
          gradient="from-yellow-500 to-orange-500"
        />
        <StatCard
          title="Confirmed"
          value={confirmedBookings.toString()}
          icon={CheckCircle}
          gradient="from-green-500 to-teal-500"
        />
        <StatCard
          title="Booking Rate"
          value={
            totalBookings > 0
              ? `${((confirmedBookings / totalBookings) * 100).toFixed(1)}%`
              : "0%"
          }
          icon={TrendingUp}
          gradient="from-violet-500 to-purple-500"
        />
      </div>

      {/* Charts and Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Booking Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <BookingChart
            bookingStatsData={bookingStatsData}
            isLoading={isLoadingStats}
            isError={isErrorStats}
          />
        </div>

        {/* Upcoming Check-ins - Takes 1 column */}
        <div className="lg:col-span-1">
          <UpcomingCheckIns
            upcomingActivityData={upcomingActivityData}
            isLoading={isLoadingActivity}
            isError={isErrorActivity}
          />
        </div>
      </div>

      {/* Recent Bookings Section */}
      <div className="mb-6">
        <RecentBookings isAdmin={false} />
      </div>
    </div>
  );
};

export default StaffDashboard;