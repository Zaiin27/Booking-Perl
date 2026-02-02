import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../../utils/axios";
import { toast } from "react-hot-toast";
import dateFormat from "dateformat";

const HotelRecentBookings = () => {
    const { user } = useSelector((state) => state.auth);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRecentBookings = async () => {
        try {
            setLoading(true);
            const params = {
                page: 1,
                limit: 5, // Just show 5 recent ones
            };

            if (user?.role === 'staff') {
                params.staff_id = user.id;
            }

            const response = await axios.get("/api/v1/bookings/admin", { params });

            if (response.data.success) {
                setBookings(response.data.data.bookings);
            }
        } catch (error) {
            console.error("Error fetching recent bookings:", error);
            // Don't toast here to avoid cluttering profile
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecentBookings();
    }, [user?.id]);

    const getStatusBadge = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case "confirmed":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#14F195]/10 text-[#14F195] border border-[#14F195]/20">
                        {status}
                    </span>
                );
            case "pending":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#FDE68A]/20 text-yellow-500 border border-[#FDE68A]/40">
                        {status}
                    </span>
                );
            case "completed":
            case "checked out":
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                        {status}
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className="max-w-6xl mx-auto mb-8">
            <div
                className="rounded-3xl p-4 border border-[#FFFFFF3B] w-full"
                style={{
                    background: "#FFFFFF33",
                    backdropFilter: "blur(1px)",
                    boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
                }}
            >
                <div className="bg-white rounded-xl p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-[#111827] font-inter">Recent Hotel Bookings</h3>

                    </div>

                    {/* Table / List */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left py-4 px-4 text-[#6B7280] font-medium font-inter text-xs uppercase tracking-wider">Guest</th>
                                    <th className="text-left py-4 px-4 text-[#6B7280] font-medium font-inter text-xs uppercase tracking-wider hidden sm:table-cell">Room</th>
                                    <th className="text-left py-4 px-4 text-[#6B7280] font-medium font-inter text-xs uppercase tracking-wider hidden md:table-cell">Dates</th>
                                    <th className="text-left py-4 px-4 text-[#6B7280] font-medium font-inter text-xs uppercase tracking-wider">Status</th>
                                    <th className="text-right py-4 px-4 text-[#6B7280] font-medium font-inter text-xs uppercase tracking-wider">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-[#6B7280] font-inter text-sm">
                                            Loading recent bookings...
                                        </td>
                                    </tr>
                                ) : bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-[#6B7280] font-inter text-sm">
                                            No recent bookings found.
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((booking) => (
                                        <tr key={booking._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195] p-[1px]">
                                                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-[#9945FF]">
                                                            {booking.guestName?.charAt(0).toUpperCase() || "G"}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-[#111827] font-inter text-sm">{booking.guestName}</div>
                                                        <div className="text-xs text-[#6B7280] font-inter sm:hidden">
                                                            {booking.bookedRooms?.map(r => `${r.quantity}x ${r.roomType}`).join(", ") || "N/A"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 hidden sm:table-cell">
                                                <span className="text-sm text-[#374151] font-inter capitalize">
                                                    {booking.bookedRooms?.map(r => `${r.quantity}x ${r.roomType}`).join(", ") || "N/A"}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 hidden md:table-cell">
                                                <div className="text-xs text-[#6B7280] font-inter">
                                                    {dateFormat(booking.checkInDate, "mmm d")} - {dateFormat(booking.checkOutDate, "mmm d")}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                {getStatusBadge(booking.bookingStatus)}
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <span className="font-bold text-[#111827] font-inter">
                                                    ${booking.totalAmount?.toLocaleString()}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotelRecentBookings;
