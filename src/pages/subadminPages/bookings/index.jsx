import React, { useState, useMemo } from "react";
import { Calendar, Search, Filter, ArrowUpRight, Download } from "lucide-react";
import ReusableFilter from "../../../components/ReusableFilter";
import ReusableTable from "../../../components/ReusableTable";
import ReusablePagination from "../../../components/ReusablePagination";
import PageLoading from "../../../components/PageLoading";
import { useGetAdminOrdersQuery } from "../../../services/admin/adminApi";

const SubadminBookings = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRow, setSelectedRow] = useState(null);

    const { data: ordersResponse, isLoading } = useGetAdminOrdersQuery({
        page: currentPage,
        limit: 10,
        ...(searchQuery && { q: searchQuery }),
    });

    const columns = [
        { key: "order_id", label: "Reference" },
        { key: "customer_name", label: "Guest" },
        { key: "customer_email", label: "Email" },
        { key: "timestamp", label: "Date" },
        { key: "amount", label: "Amount" },
        { key: "status", label: "Status" },
        { key: "payment", label: "Payment" },
    ];

    const totalItems = ordersResponse?.data?.total || 0;
    const totalPages = Math.ceil(totalItems / 10);
    const bookingsData = ordersResponse?.data?.orders || [];

    return (
        <div className="p-4 lg:p-8 space-y-8 pb-24 lg:pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Team Bookings</h2>
                    <p className="text-gray-400 mt-1">Real-time overview of all reservations managed by your team.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all border border-[#FFFFFF0D]">
                        <Download size={18} />
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-[#121B36] rounded-[32px] border border-[#FFFFFF0D] shadow-2xl overflow-hidden backdrop-blur-xl">
                <div className="p-6 border-b border-[#FFFFFF0D]">
                    <ReusableFilter
                        searchPlaceholder="Search by guest name or reference..."
                        onSearchChange={setSearchQuery}
                        searchValue={searchQuery}
                    />
                </div>

                <div className="sm:p-4 mt-2">
                    {isLoading ? (
                        <div className="py-20 flex justify-center">
                            <PageLoading message="Fetching booking records..." />
                        </div>
                    ) : bookingsData.length > 0 ? (
                        <ReusableTable
                            columns={columns}
                            data={bookingsData}
                            onRowClick={(row) => setSelectedRow(selectedRow === row._id ? null : row._id)}
                            selectedRow={selectedRow}
                            tableType="orders"
                        />
                    ) : (
                        <div className="text-center py-20 px-6">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#FFFFFF0D]">
                                <Calendar className="text-gray-600" size={32} />
                            </div>
                            <p className="text-gray-400 font-bold text-lg">No records found</p>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto">There are currently no bookings linked to your assigned staff accounts.</p>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-[#FFFFFF0D]">
                    <ReusablePagination
                        currentPage={currentPage}
                        totalPages={totalPages || 1}
                        onPageChange={setCurrentPage}
                        totalItems={totalItems}
                        itemsPerPage={10}
                    />
                </div>
            </div>
        </div>
    );
};

export default SubadminBookings;
