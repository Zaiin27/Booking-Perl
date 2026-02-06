import React from "react";
import { Users, Calendar, TrendingUp, ShieldCheck, Clock, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetAdminUsersQuery, useGetHotelDashboardOverviewQuery } from "../../../services/admin/adminApi";

const SubadminDashboard = () => {
    const navigate = useNavigate();
    const { data: staffData, isLoading: isLoadingStaff } = useGetAdminUsersQuery({ role: "staff", limit: 5 });
    const { data: overviewData, isLoading: isLoadingOverview } = useGetHotelDashboardOverviewQuery();

    const stats = [
        {
            label: "My Staff",
            value: staffData?.data?.total || "0",
            icon: Users,
            color: "from-blue-600 to-indigo-600",
            trend: "Total Team"
        },
        {
            label: "Total Bookings",
            value: overviewData?.data?.totalBookings || "0",
            icon: Calendar,
            color: "from-[#9945FF] to-[#14F195]",
            trend: overviewData?.data?.todayBookings ? `+${overviewData.data.todayBookings} today` : "Live"
        },
        {
            label: "Pending",
            value: overviewData?.data?.pendingBookings || "0",
            icon: Clock,
            color: "from-orange-500 to-rose-500",
            trend: "Action Required"
        },
        {
            label: "Confirmed",
            value: overviewData?.data?.confirmedBookings || "0",
            icon: ShieldCheck,
            color: "from-emerald-500 to-teal-500",
            trend: "Confirmed"
        },
    ];

    const isLoading = isLoadingStaff || isLoadingOverview;

    return (
        <div className="p-4 lg:p-8 space-y-8 pb-24 lg:pb-8">
            {/* Welcome Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-[#121B36] to-[#1A2242] rounded-[2.5rem] p-8 lg:p-12 border border-[#FFFFFF0D] shadow-2xl">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-4">
                        Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14F195] to-[#9945FF]">Subadmin</span>
                    </h1>
                    <p className="text-white text-lg font-medium leading-relaxed">
                        Monitor your staff performance and manage bookings with precision. Everything you need is right here.
                    </p>
                </div>

                {/* Abstract shapes for premium feel */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 right-20 w-32 h-32 bg-[#14F195]/10 rounded-full blur-2xl"></div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="group bg-[#121B36]/50 backdrop-blur-md p-6 rounded-[2rem] border border-[#FFFFFF0D] hover:border-[#FFFFFF1A] transition-all duration-300 hover:scale-105 shadow-xl">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                            <stat.icon size={28} className="text-white" />
                        </div>
                        <p className="text-white text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-3xl font-black text-white tracking-tight">{stat.value}</h3>
                            <span className="text-[10px] font-bold text-[#14F195] bg-[#14F1951A] px-2 py-1 rounded-full">{stat.trend}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Staff Activity - 2/3 Width */}
                <div className="lg:col-span-2 bg-[#121B36] rounded-[2.5rem] border border-[#FFFFFF0D] shadow-2xl overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-[#FFFFFF0D] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                <Clock className="text-orange-400" size={20} />
                            </div>
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">My Staff Team</h2>
                        </div>
                        <button
                            onClick={() => navigate("/subadmin/staff")}
                            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
                        >
                            View All <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="p-4 flex-1">
                        {isLoading ? (
                            <div className="space-y-4 p-4">
                                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/5 animate-pulse rounded-2xl"></div>)}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="text-white text-[10px] uppercase font-black tracking-widest">
                                        <tr>
                                            <th className="px-6 py-4 text-left">Staff Name</th>
                                            <th className="px-6 py-4 text-left">Status</th>
                                            <th className="px-6 py-4 text-right">Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-white">
                                        {staffData?.data?.users?.map((staff, i) => (
                                            <tr key={i} className="border-t border-[#FFFFFF05] hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 flex items-center justify-center font-bold text-blue-400 group-hover:scale-110 transition-transform">
                                                            {staff.name?.charAt(0) || 'S'}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-sm tracking-tight">{staff.name || 'N/A'}</p>
                                                            <p className="text-xs text-gray-500">{staff.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${staff.isActive ? 'bg-[#14F1951A] text-[#14F195]' : 'bg-rose-500/10 text-rose-500'}`}>
                                                        {staff.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right text-xs text-white font-medium">
                                                    {new Date(staff.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* System Health / Alerts - 1/3 Width */}
                <div className="bg-gradient-to-b from-[#121B36] to-[#0A0E21] rounded-[2.5rem] border border-[#FFFFFF0D] p-8 shadow-2xl flex flex-col">
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter mb-6">Team Insights</h2>
                    <div className="space-y-6 flex-1">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-1">
                                <span className="text-white">Response Time</span>
                                <span className="text-white">{overviewData?.data?.responseTime || "0%"}</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-600 to-[#14F195] shadow-[0_0_10px_#14F19588]"
                                    style={{ width: overviewData?.data?.responseTime || "0%" }}
                                ></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-1">
                                <span className="text-white">Task Completion</span>
                                <span className="text-white">{overviewData?.data?.taskCompletion || "0%"}</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#9945FF] to-rose-400 shadow-[0_0_10px_#9945FF88]"
                                    style={{ width: overviewData?.data?.taskCompletion || "0%" }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 bg-white/5 rounded-3xl p-6 border border-[#FFFFFF0D]">
                        <p className="text-sm font-bold text-white mb-2 tracking-tight italic">Subadmin Tip:</p>
                        <p className="text-xs text-white leading-relaxed">
                            Assigned staff members can be activated or deactivated instantly from your management console.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubadminDashboard;
