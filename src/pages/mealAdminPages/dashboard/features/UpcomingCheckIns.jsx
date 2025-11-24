import React from "react";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const UpcomingCheckIns = ({ upcomingActivityData, isLoading, isError }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  // Process upcoming check-ins
  const processCheckIns = () => {
    if (!upcomingActivityData?.data?.upcomingCheckIns || !Array.isArray(upcomingActivityData.data.upcomingCheckIns)) {
      return [];
    }
    return upcomingActivityData.data.upcomingCheckIns.slice(0, 5); // Show top 5
  };

  const upcomingCheckIns = processCheckIns();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysUntil = (dateString) => {
    if (!dateString) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkIn = new Date(dateString);
    checkIn.setHours(0, 0, 0, 0);
    const diffTime = checkIn - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-[#171D41] rounded-lg p-4 sm:p-6 shadow-sm border border-[#3A3A4E] h-full">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white mb-1">
          Upcoming Check-ins
        </h3>
        <p className="text-xs text-[#AEB9E1]">
          Next scheduled check-ins
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <LoadingSpinner message="Loading..." size="sm" textSize="xs" />
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-red-500 text-sm text-center">
            Error loading data
          </div>
        </div>
      ) : upcomingCheckIns.length === 0 ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <Calendar className="w-12 h-12 text-[#3A3A4E] mx-auto mb-2" />
            <p className="text-[#AEB9E1] text-sm">No upcoming check-ins</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {upcomingCheckIns.map((booking) => {
            const daysUntil = getDaysUntil(booking.checkInDate);
            return (
              <div
                key={booking._id || booking.id}
                className="bg-[#0A1330] rounded-lg p-3 border border-[#3A3A4E] hover:border-[#14F195]/50 transition-all duration-200 cursor-pointer"
                onClick={() =>
                  navigate(
                    isAdmin
                      ? `/admin/bookings/${booking._id || booking.id}`
                      : `/staff/bookings/${booking._id || booking.id}`
                  )
                }
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-white">
                        {booking.guestName || "N/A"}
                      </span>
                      {daysUntil === 0 && (
                        <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                          Today
                        </span>
                      )}
                      {daysUntil === 1 && (
                        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">
                          Tomorrow
                        </span>
                      )}
                      {daysUntil > 1 && (
                        <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                          {daysUntil} days
                        </span>
                      )}
                    </div>
                    {booking.property_id && (
                      <div className="flex items-center gap-2 text-xs text-[#AEB9E1] mb-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">
                          {typeof booking.property_id === "object"
                            ? booking.property_id.name
                            : "Property"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#AEB9E1] pt-2 border-t border-[#3A3A4E]">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(booking.checkInDate)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{booking.numberOfGuests || 0} guests</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingCheckIns;
