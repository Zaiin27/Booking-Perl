import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useGetAdminOrdersMonthlyQuery, useGetAdminDashboardWeeklyVolumeQuery } from "../../../../services/admin/adminApi";
import LoadingSpinner from "../../../../components/LoadingSpinner";

const SummaryStat = () => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Month selector state
  const [isMonthCalendarOpen, setIsMonthCalendarOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // API integration for monthly orders
  const { 
    data: monthlyOrdersData, 
    isLoading: isLoadingOrders, 
    isError: isErrorOrders, 
    error: ordersError 
  } = useGetAdminOrdersMonthlyQuery({
    month: selectedMonth.getMonth() + 1, // API expects 1-12
    year: selectedMonth.getFullYear()
  });

  // API integration for weekly volume
  const { 
    data: weeklyVolumeData, 
    isLoading: isLoadingVolume, 
    isError: isErrorVolume, 
    error: volumeError 
  } = useGetAdminDashboardWeeklyVolumeQuery({
    startDate: selectedDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
    endDate: new Date(selectedDate.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // +6 days
  });

  // Refs for click outside detection
  const weekCalendarRef = useRef(null);
  const monthCalendarRef = useRef(null);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close week calendar if clicked outside
      if (
        isCalendarOpen &&
        weekCalendarRef.current &&
        !weekCalendarRef.current.contains(event.target)
      ) {
        setIsCalendarOpen(false);
      }

      // Close month calendar if clicked outside
      if (
        isMonthCalendarOpen &&
        monthCalendarRef.current &&
        !monthCalendarRef.current.contains(event.target)
      ) {
        setIsMonthCalendarOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCalendarOpen, isMonthCalendarOpen]);

  // Process weekly volume data from API
  const processWeeklyVolumeData = (apiData) => {
    if (!apiData?.data?.dailyVolume || !Array.isArray(apiData.data.dailyVolume)) {
      // Return default data if API data is not available
      return [
        { day: "Mon", value: 0 },
        { day: "Tue", value: 0 },
        { day: "Wed", value: 0 },
        { day: "Thu", value: 0 },
        { day: "Fri", value: 0 },
        { day: "Sat", value: 0 },
        { day: "Sun", value: 0 },
      ];
    }

    // Map API data to chart format
    return apiData.data.dailyVolume.map((dayData) => ({
      day: dayData.dayOfWeek || "Mon",
      value: dayData.volume || 0,
    }));
  };

  const chartData = processWeeklyVolumeData(weeklyVolumeData);

  // Process orders data from API
  const processOrdersData = (apiData) => {
    if (!apiData?.data?.orders || !Array.isArray(apiData.data.orders)) {
      return [];
    }

    return apiData.data.orders.map((order, index) => ({
      id: order.order_id || order.id || (index + 1),
      token: order.token || order.paymentMethod || "Card",
      date: order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }) : "N/A",
      status: order.status || "PENDING",
      total: order.total ? `$${parseFloat(order.total).toFixed(2)}` : "$0.00",
    }));
  };

  const ordersData = processOrdersData(monthlyOrdersData);

  // Calendar functions
  const formatDateRange = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startStr = startOfWeek.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    });
    const endStr = endOfWeek.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return `${startStr} - ${endStr}`;
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    return { daysInMonth, startingDay };
  };

  const handleDateClick = (day) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    setSelectedDate(newDate);
    setIsCalendarOpen(false);
  };

  const handleMonthClick = (month, year) => {
    const newDate = new Date(year, month, 1);
    setSelectedMonth(newDate);
    setIsMonthCalendarOpen(false);
  };

  const isInSelectedWeek = (day) => {
    const testDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const selectedStart = new Date(selectedDate);
    selectedStart.setDate(selectedDate.getDate() - selectedDate.getDay());
    const selectedEnd = new Date(selectedStart);
    selectedEnd.setDate(selectedStart.getDate() + 6);

    return testDate >= selectedStart && testDate <= selectedEnd;
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const isSelectedMonth = (month, year) => {
    return (
      month === selectedMonth.getMonth() && year === selectedMonth.getFullYear()
    );
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = isInSelectedWeek(day);
      const isTodayDate = isToday(day);

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-8 w-8 rounded-full text-xs font-medium transition-all duration-200 ${
            isSelected
              ? "bg-[#10B981] text-white"
              : isTodayDate
              ? "bg-[#3B82F6] text-white"
              : "text-[#AEB9E1] hover:bg-[#2A2A3E]"
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const renderMonthGrid = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const currentYear = selectedMonth.getFullYear();
    const years = [currentYear - 1, currentYear, currentYear + 1];

    return (
      <div className="space-y-4">
        {/* Year Selection */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() =>
              setSelectedMonth(
                new Date(
                  selectedMonth.getFullYear() - 1,
                  selectedMonth.getMonth()
                )
              )
            }
            className="p-1 hover:bg-[#2A2A3E] rounded transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#AEB9E1]" />
          </button>
          <h4 className="text-sm font-semibold text-[#AEB9E1]">
            {selectedMonth.getFullYear()}
          </h4>
          <button
            onClick={() =>
              setSelectedMonth(
                new Date(
                  selectedMonth.getFullYear() + 1,
                  selectedMonth.getMonth()
                )
              )
            }
            className="p-1 hover:bg-[#2A2A3E] rounded transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-[#AEB9E1]" />
          </button>
        </div>

        {/* Months Grid */}
        <div className="grid grid-cols-3 gap-2">
          {months.map((month, index) => (
            <button
              key={month}
              onClick={() =>
                handleMonthClick(index, selectedMonth.getFullYear())
              }
              className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isSelectedMonth(index, selectedMonth.getFullYear())
                  ? "bg-[#10B981] text-white"
                  : "text-[#AEB9E1] hover:bg-[#2A2A3E]"
              }`}
            >
              {month}
            </button>
          ))}
        </div>

        {/* Quick Year Selection */}
        <div className="pt-3 border-t border-[#2A2A3E]">
          <div className="flex justify-between">
            {years.map((year) => (
              <button
                key={year}
                onClick={() =>
                  setSelectedMonth(new Date(year, selectedMonth.getMonth()))
                }
                className={`px-2 py-1 rounded text-xs font-medium transition-all duration-200 ${
                  year === selectedMonth.getFullYear()
                    ? "bg-[#3B82F6] text-white"
                    : "text-[#AEB9E1] hover:bg-[#2A2A3E]"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Left Column - Weekly Insights */}
      <div className="bg-[#171D41] rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">
              Weekly Insights
            </h3>
            <p className="text-xs text-[#EDEDED]">Volume over the past week</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="flex items-center gap-2 bg-[#454A67] rounded-lg px-3 py-2 cursor-pointer hover:bg-[#3A3A4E] transition-colors"
            >
              {/* <Calendar className="w-4 h-4 text-[#EDEDED]" /> */}
              <span className="text-[10px] text-[#EDEDED]">
                {formatDateRange(selectedDate)}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#EDEDED] transition-transform ${
                  isCalendarOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Fancy Calendar Dropdown */}
            {isCalendarOpen && (
              <div
                ref={weekCalendarRef}
                className="absolute top-full right-0 mt-2 bg-[#171D41] rounded-lg shadow-xl border border-[#2A2A3E] p-4 z-50 min-w-[280px]"
              >
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() - 1
                        )
                      )
                    }
                    className="p-1 hover:bg-[#2A2A3E] rounded transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-[#AEB9E1]" />
                  </button>
                  <h4 className="text-sm font-semibold text-[#AEB9E1]">
                    {currentMonth.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h4>
                  <button
                    onClick={() =>
                      setCurrentMonth(
                        new Date(
                          currentMonth.getFullYear(),
                          currentMonth.getMonth() + 1
                        )
                      )
                    }
                    className="p-1 hover:bg-[#2A2A3E] rounded transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-[#AEB9E1]" />
                  </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="h-6 flex items-center justify-center text-xs font-medium text-[#AEB9E1]"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

                {/* Week Selection Info */}
                <div className="mt-4 pt-3 border-t border-[#0B1739]">
                  <p className="text-xs text-[#AEB9E1] text-center">
                    Click any day to select that week
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-64 relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-[#AEB9E1]">
            <span>200K</span>
            <span>150K</span>
            <span>100K</span>
            <span>50K</span>
            <span>25K</span>
            <span>0K</span>
          </div>

          {/* Grid lines */}
          <div className="absolute left-8 right-0 top-0 h-full">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="absolute w-full border-t border-[#0B1739]"
                style={{ top: `${(i / 5) * 100}%` }}
              ></div>
            ))}
          </div>

          {/* Chart area with gradient fill */}
          <div className="ml-8 h-full relative">
            {isLoadingVolume ? (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner message="Loading chart data..." size="sm" textSize="xs" />
              </div>
            ) : isErrorVolume ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-red-500 text-sm text-center">
                  Error loading chart: {volumeError?.message || "Unknown error"}
                </div>
              </div>
            ) : (
              <svg
                className="w-full h-full absolute top-0 left-0"
                viewBox="0 0 414 195"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Gradient definition */}
                <defs>
                  <linearGradient
                    id="paint0_linear_2097_2693"
                    x1="0"
                    y1="97.5"
                    x2="413.075"
                    y2="97.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#9945FF" />
                    <stop offset="1" stopColor="#14F195" />
                  </linearGradient>
                </defs>

                {/* Dynamic area fill based on API data */}
                <path
                  d={`M0 195 L ${chartData.map((point, index) => {
                    const x = (index * 413.075) / (chartData.length - 1);
                    const y = 195 - (point.value / 200) * 120; // Scale to fit 0-200 range
                    return `${x} ${y}`;
                  }).join(' L ')} L 413.075 195 Z`}
                  fill="url(#paint0_linear_2097_2693)"
                  fillOpacity="0.23"
                  stroke="none"
                />

                {/* Dynamic line based on API data */}
                <path
                  d={chartData.map((point, index) => {
                    const x = (index * 413.075) / (chartData.length - 1);
                    const y = 195 - (point.value / 200) * 120; // Scale to fit 0-200 range
                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#14f195"
                  strokeOpacity="1"
                  strokeWidth="1"
                />

                {/* Data points */}
                {chartData.map((point, index) => {
                  const x = (index * 413.075) / (chartData.length - 1);
                  const y = 195 - (point.value / 200) * 120;
                  return (
                    <circle key={index} cx={x} cy={y} r="3" fill="#3B82F6" />
                  );
                })}

                {/* Highlight last point */}
                {chartData.length > 0 && (
                  <circle 
                    cx={(chartData.length - 1) * 413.075 / (chartData.length - 1)} 
                    cy={195 - (chartData[chartData.length - 1].value / 200) * 120} 
                    r="5" 
                    fill="#3B82F6" 
                  />
                )}
              </svg>
            )}

            {/* Day labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-[#AEB9E1]">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Recent Orders */}
      <div className="bg-[#171D41] rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Recent orders</h3>
          <div className="relative">
            <button
              onClick={() => setIsMonthCalendarOpen(!isMonthCalendarOpen)}
              className="flex items-center gap-2 bg-[#454A67] rounded-lg px-3 py-2 cursor-pointer hover:bg-[#3A3A4E] transition-colors"
            >
              {/* <Calendar className="w-4 h-4 text-[#AEB9E1]" /> */}
              <span className="text-[10px] text-[#EDEDED]">
                {formatMonthYear(selectedMonth)}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#EDEDED] transition-transform ${
                  isMonthCalendarOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Month Calendar Dropdown */}
            {isMonthCalendarOpen && (
              <div
                ref={monthCalendarRef}
                className="absolute top-full right-0 mt-2 bg-[#171D41] rounded-lg shadow-xl border border-[#2A2A3E] p-4 z-50 min-w-[280px]"
              >
                {renderMonthGrid()}

                {/* Month Selection Info */}
                <div className="mt-4 pt-3 border-t border-[#2A2A3E]">
                  <p className="text-xs text-[#AEB9E1] text-center">
                    Click any month to select
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Orders Table */}
        <div className={`overflow-x-auto ${ordersData.length > 5 ? 'max-h-72 overflow-y-auto admin-table-scrollbar' : ''}`}>
          {isLoadingOrders ? (
            <div className="flex items-center justify-center h-32">
              <LoadingSpinner message="Loading orders..." size="sm" textSize="xs" />
            </div>
          ) : isErrorOrders ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-red-500 text-sm text-center">
                Error loading orders: {ordersError?.message || "Unknown error"}
              </div>
            </div>
          ) : ordersData.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-[#AEB9E1] text-sm">No orders found for this month</div>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#0B1739]">
                  <th className="text-left py-3 px-2 text-sm font-medium text-white font-inter">
                    Order
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-white font-inter">
                    Token
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-white font-inter">
                    Date & Time
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-white font-inter">
                    Status
                  </th>
                  <th className="text-left py-3 px-2 text-sm font-medium text-white">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {ordersData.map((order, index) => (
                  <tr
                    key={index}
                    className="border-b border-[#0B1739] hover:bg-[#0A1330] hover:rounded-lg transition-all duration-200"
                  >
                    <td className="py-3 px-2 text-[10px] text-[#AEB9E1] font-medium font-inter">
                      {order.id}
                    </td>
                    <td className="py-3 px-2 text-[10px] text-[#AEB9E1] font-medium font-inter">
                      {order.token}
                    </td>
                    <td className="py-3 px-2 text-[10px] text-[#AEB9E1] font-medium font-inter">
                      {order.date}
                    </td>
                    <td className="py-3 px-2 text-[10px] font-inter">
                      <span
                        className={`inline-flex items-center justify-center gap-2 px-3 py-1 rounded-lg text-[10px] font-inter font-medium min-w-[80px] ${
                          order.status === "PLACED" || order.status === "COMPLETED" || order.status === "PAID"
                            ? "bg-[#14F19533] text-[#14F195] border border-[#14F195]"
                            : "bg-[#FDB52A33] text-[#FDB52A] border border-[#FDB52A]"
                        }`}
                      >
                        {(order.status === "PLACED" || order.status === "COMPLETED" || order.status === "PAID") ? (
                          <div className="w-[6px] h-[6px] bg-[#14F195] rounded-full"></div>
                        ) : (
                          <div className="w-[6px] h-[6px] bg-[#FDB52A] rounded-full"></div>
                        )}
                        {order.status === "PLACED" ? "Placed" : 
                         order.status === "COMPLETED" ? "Completed" : 
                         order.status === "PAID" ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-[10px] text-[#AEB9E1] font-medium font-inter">
                      {order.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryStat;
