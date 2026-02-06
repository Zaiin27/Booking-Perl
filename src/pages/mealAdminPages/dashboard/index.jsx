import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "./features/dashboard-card";
import {
  Building2,
  Calendar,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  TrendingUp,
  CreditCard,
  Hotel,
  Wallet,
  Receipt,
} from "lucide-react";
import {
  useGetHotelDashboardOverviewQuery,
  useGetBookingStatsByDateRangeQuery,
  useGetUpcomingActivityQuery,
} from "../../../services/admin/adminApi";
import PageLoading from "../../../components/PageLoading";
import { useSelector } from "react-redux";
import BookingChart from "./features/BookingChart";
import RecentBookings from "./features/RecentBookings";
import UpcomingCheckIns from "./features/UpcomingCheckIns";
import SubscriptionStatus from "../../../components/SubscriptionStatus";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

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

  // Fetch dashboard data
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
    totalCommissionOnline = 0,
    totalCommissionOnArrival = 0,
    totalCommission = 0,
    todayCommissionOnline = 0,
    todayCommissionOnArrival = 0,
    currency = "PKR",
  } = dashboardData;

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    const numericAmount = parseFloat(amount) || 0;

    // Support for PKR/Rs (Pakistani Rupees)
    if (currency?.toUpperCase() === "PKR" || currency?.toUpperCase() === "RS") {
      const formattedAmount = new Intl.NumberFormat("en-PK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numericAmount);
      return `Rs ${formattedAmount}`;
    }

    // Default to USD format
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  };

  return (
    <div className="p-4 sm:p-6 bg-[#0A1330] min-h-screen pb-24 md:pb-6">
      {/* Mobile Welcome Section */}
      <div className="md:hidden mb-6 mt-2">
        <h2 className="text-2xl font-bold text-white">Hey, {user?.name?.split(' ')[0] || 'Admin'}! 👋</h2>
        <p className="text-[#AEB9E1] text-sm opacity-60">Here's your business performance today.</p>
      </div>

      {/* Subscription Status */}
      <div className="mb-6">
        <SubscriptionStatus showUpgrade={true} />
      </div>

      {/* Stat Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title={isAdmin ? "Total Properties" : "My Properties"}
          value={totalProperties.toString()}
          icon={Building2}
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={DollarSign}
          gradient="from-green-500 to-emerald-500"
        />
        <StatCard
          title="Today's Bookings"
          value={todayBookings.toString()}
          icon={Calendar}
          gradient="from-purple-500 to-pink-500"
        />
        <StatCard
          title="Total Bookings"
          value={totalBookings.toString()}
          icon={TrendingUp}
          gradient="from-indigo-500 to-blue-500"
        />
      </div>

      {/* Secondary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
        {isAdmin ? (
          <>
            <StatCard
              key="total-online-commission"
              title="Total Online Commission"
              value={formatCurrency(totalCommissionOnline)}
              icon={CreditCard}
              gradient="from-blue-500 to-cyan-500"
            />
            <StatCard
              key="total-on-arrival-commission"
              title="Total On Arrival Commission"
              value={formatCurrency(totalCommissionOnArrival)}
              icon={Hotel}
              gradient="from-orange-500 to-red-500"
            />
          </>
        ) : (
          <>
            <StatCard
              title="Total Bookings"
              value={totalBookings.toString()}
              icon={TrendingUp}
              gradient="from-indigo-500 to-blue-500"
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
          </>
        )}
      </div>

      {/* Commission and Revenue Overview Row - Only for Admin */}
      {isAdmin && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
          <StatCard
            key="total-commission"
            title="Total Commission"
            value={formatCurrency(totalCommission)}
            icon={Wallet}
            gradient="from-purple-500 to-pink-500"
          />
          <StatCard
            key="total-revenue-bookings"
            title="Total Revenue from Bookings"
            value={formatCurrency(totalRevenue)}
            icon={Receipt}
            gradient="from-green-500 to-emerald-500"
          />
        </div>
      )}

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
        <RecentBookings isAdmin={isAdmin} />
      </div>
    </div>
  );
};

export default AdminDashboard;