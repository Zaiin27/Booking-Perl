import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import LoadingSpinner from "../../../../components/LoadingSpinner";

const BookingChart = ({ bookingStatsData, isLoading, isError }) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const calendarRef = useRef(null);

  // Get date range for last 7 days
  const getLast7Days = () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);
    start.setHours(0, 0, 0, 0);
    return { start, end };
  };

  const { start: defaultStart, end: defaultEnd } = getLast7Days();
  const [dateRange, setDateRange] = useState({ start: defaultStart, end: defaultEnd });

  // Process booking stats data
  const processChartData = () => {
    if (!bookingStatsData?.data?.dailyStats || !Array.isArray(bookingStatsData.data.dailyStats)) {
      // Return default data for last 7 days
      const defaultData = [];
      const { start, end } = getLast7Days();
      const current = new Date(start);
      
      while (current <= end) {
        defaultData.push({
          date: current.toISOString().split("T")[0],
          dayOfWeek: current.toLocaleDateString("en-US", { weekday: "short" }),
          bookings: 0,
          revenue: 0,
        });
        current.setDate(current.getDate() + 1);
      }
      return defaultData;
    }

    return bookingStatsData.data.dailyStats;
  };

  const chartData = processChartData();

  // Calculate max value for scaling
  const maxBookings = Math.max(...chartData.map((d) => d.bookings || 0), 1);
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue || 0), 1);

  // Format date range
  const formatDateRange = () => {
    const start = dateRange.start.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    });
    const end = dateRange.end.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    return `${start} - ${end}`;
  };

  // Calendar functions
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
    
    // Update date range to show week starting from selected date
    const startOfWeek = new Date(newDate);
    startOfWeek.setDate(newDate.getDate() - newDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    setDateRange({ start: startOfWeek, end: endOfWeek });
  };

  const isInSelectedWeek = (day) => {
    const testDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    return testDate >= dateRange.start && testDate <= dateRange.end;
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
    const days = [];

    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = isInSelectedWeek(day);
      const isTodayDate = isToday(day);

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-8 w-8 rounded-full text-xs font-medium transition-all duration-200 ${
            isSelected
              ? "bg-[#14F195] text-white"
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

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isCalendarOpen &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target)
      ) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCalendarOpen]);

  // Calculate Y-axis labels
  const getYAxisLabels = () => {
    const max = Math.max(maxBookings, Math.ceil(maxRevenue / 100));
    const steps = 5;
    const step = Math.ceil(max / steps);
    const labels = [];
    
    for (let i = steps; i >= 0; i--) {
      labels.push(i * step);
    }
    
    return labels;
  };

  const yAxisLabels = getYAxisLabels();

  return (
    <div className="bg-[#171D41] rounded-lg p-4 sm:p-6 shadow-sm border border-[#3A3A4E]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">
            Booking Insights
          </h3>
          <p className="text-xs text-[#AEB9E1]">
            Bookings and revenue over the past week
          </p>
        </div>
        <div className="relative" ref={calendarRef}>
          <button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="flex items-center gap-2 bg-[#2A2A3E] rounded-lg px-3 py-2 cursor-pointer hover:bg-[#3A3A4E] transition-colors border border-[#3A3A4E]"
          >
            <span className="text-xs text-[#AEB9E1]">{formatDateRange()}</span>
            <ChevronDown
              className={`w-4 h-4 text-[#AEB9E1] transition-transform ${
                isCalendarOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isCalendarOpen && (
            <div className="absolute top-full right-0 mt-2 bg-[#171D41] rounded-lg shadow-xl border border-[#3A3A4E] p-4 z-50 min-w-[280px]">
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

              <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
            </div>
          )}
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-64 relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner message="Loading chart data..." size="sm" textSize="xs" />
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-500 text-sm text-center">
              Error loading chart data
            </div>
          </div>
        ) : (
          <>
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-[#AEB9E1] pr-2">
              {yAxisLabels.map((label, index) => (
                <span key={index}>{label}</span>
              ))}
            </div>

            {/* Grid lines */}
            <div className="absolute left-12 right-0 top-0 h-full">
              {yAxisLabels.map((_, i) => (
                <div
                  key={i}
                  className="absolute w-full border-t border-[#3A3A4E]"
                  style={{ top: `${(i / (yAxisLabels.length - 1)) * 100}%` }}
                ></div>
              ))}
            </div>

            {/* Chart area */}
            <div className="ml-12 h-full relative">
              <svg
                className="w-full h-full absolute top-0 left-0"
                viewBox="0 0 500 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient
                    id="bookingGradient"
                    x1="0"
                    y1="100"
                    x2="500"
                    y2="100"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#9945FF" />
                    <stop offset="1" stopColor="#14F195" />
                  </linearGradient>
                </defs>

                {/* Area fill for bookings */}
                <path
                  d={`M0 200 ${chartData
                    .map(
                      (point, index) =>
                        `L${(index * 500) / (chartData.length - 1)} ${
                          200 - ((point.bookings || 0) / maxBookings) * 180
                        }`
                    )
                    .join(" ")} L500 200 Z`}
                  fill="url(#bookingGradient)"
                  fillOpacity="0.2"
                />

                {/* Line for bookings */}
                <path
                  d={chartData
                    .map(
                      (point, index) =>
                        `${index === 0 ? "M" : "L"}${(index * 500) / (chartData.length - 1)} ${
                          200 - ((point.bookings || 0) / maxBookings) * 180
                        }`
                    )
                    .join(" ")}
                  fill="none"
                  stroke="#14F195"
                  strokeWidth="2"
                />

                {/* Data points for bookings */}
                {chartData.map((point, index) => {
                  const x = (index * 500) / (chartData.length - 1);
                  const y = 200 - ((point.bookings || 0) / maxBookings) * 180;
                  return (
                    <circle key={index} cx={x} cy={y} r="4" fill="#14F195" />
                  );
                })}
              </svg>

              {/* Day labels */}
              <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-[#AEB9E1] px-2">
                {chartData.map((point, index) => (
                  <span key={index} className="transform -rotate-45 origin-bottom-left">
                    {point.dayOfWeek?.slice(0, 3) || "N/A"}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[#3A3A4E]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#14F195]"></div>
          <span className="text-xs text-[#AEB9E1]">Bookings</span>
        </div>
      </div>
    </div>
  );
};

export default BookingChart;
