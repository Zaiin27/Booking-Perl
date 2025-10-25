import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../utils/axios";
import { toast } from "react-hot-toast";
import ReusableTable from "../../components/ReusableTable";
import ReusableFilter from "../../components/ReusableFilter";
import ReusablePagination from "../../components/ReusablePagination";
import { FaEye, FaCheckCircle, FaTimes, FaCalendar, FaUser } from "react-icons/fa";
import dateFormat from "dateformat";

const BookingsPage = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    bookingStatus: "",
    paymentStatus: "",
  });

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };

      // Add staff_id parameter for staff members
      if (user?.role === 'staff') {
        params.staff_id = user.id;
      }

      const response = await axios.get("/api/v1/bookings/admin", { params });
      
      if (response.data.success) {
        setBookings(response.data.data.bookings);
        setPagination({
          ...pagination,
          total: response.data.data.total,
          pages: response.data.data.pages,
        });
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error(error.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [pagination.page, pagination.limit, filters]);

  // Handle status update
  const handleStatusUpdate = async (bookingId, bookingStatus, paymentStatus) => {
    try {
      const payload = {};
      if (bookingStatus) payload.bookingStatus = bookingStatus;
      if (paymentStatus) payload.paymentStatus = paymentStatus;

      const response = await axios.patch(`/api/v1/bookings/${bookingId}/status`, payload);
      
      if (response.data.success) {
        toast.success("Status updated successfully");
        fetchBookings();
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // Handle status update functions
  const handleUpdateBookingStatus = async (bookingId, bookingStatus) => {
    await handleStatusUpdate(bookingId, bookingStatus, null);
  };

  const handleUpdatePaymentStatus = async (bookingId, paymentStatus) => {
    await handleStatusUpdate(bookingId, null, paymentStatus);
  };

  // Table columns for ReusableTable
  const columns = [
    {
      key: "bookingReference",
      label: "Booking Ref",
    },
    {
      key: "guestName",
      label: "Guest Info",
    },
    {
      key: "property_id",
      label: "Property",
    },
    {
      key: "checkInDate",
      label: "Check-in / Check-out",
    },
    {
      key: "numberOfGuests",
      label: "Guests / Rooms",
    },
    {
      key: "bookedRooms",
      label: "Room Types",
    },
    {
      key: "totalAmount",
      label: "Amount",
    },
    {
      key: "bookingStatus",
      label: "Booking Status",
    },
    {
      key: "paymentStatus",
      label: "Payment Status",
    },
    {
      key: "createdAt",
      label: "Booked On",
    },
    {
      key: "actions",
      label: "Actions",
    },
  ];

  // Filter options for ReusableFilter
  const filterOptions = [
    {
      key: "bookingStatus",
      label: "All Booking Statuses",
      selectedValue: filters.bookingStatus,
      options: [
        { value: "", label: "All Booking Statuses" },
        { value: "pending", label: "Pending" },
        { value: "confirmed", label: "Confirmed" },
        { value: "cancelled", label: "Cancelled" },
        { value: "completed", label: "Completed" },
        { value: "no-show", label: "No-show" },
      ],
    },
    {
      key: "paymentStatus",
      label: "All Payment Statuses",
      selectedValue: filters.paymentStatus,
      options: [
        { value: "", label: "All Payment Statuses" },
        { value: "pending", label: "Pending" },
        { value: "paid", label: "Paid" },
        { value: "refunded", label: "Refunded" },
        { value: "failed", label: "Failed" },
      ],
    },
  ];

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, page: 1 });
  };

  // Handle search changes
  const handleSearchChange = (value) => {
    setFilters({ ...filters, search: value });
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-[#0A1330] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Bookings Management</h1>
            <p className="text-[#AEB9E1] mt-1 text-sm sm:text-base">View and manage all property bookings</p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <ReusableFilter
            filters={filterOptions}
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
            searchValue={filters.search}
            searchPlaceholder="Search bookings by reference, name, email..."
          />
        </div>

        {/* Table */}
        <div className="bg-[#171D41] rounded-lg shadow-lg border border-[#3A3A4E] overflow-hidden">
          <div className="p-2 sm:p-4">
            <ReusableTable
              columns={columns}
              data={bookings}
              isLoading={loading}
              tableType="bookings"
              onView={(row) => navigate(`/admin/bookings/${row._id}`)}
            />
          </div>

          {/* Pagination */}
          {pagination.pages > 0 && (
            <div className="p-3 sm:p-4 border-t border-[#3A3A4E]">
              <ReusablePagination
                currentPage={pagination.page}
                totalPages={pagination.pages}
                onPageChange={(page) => setPagination({ ...pagination, page })}
                totalItems={pagination.total}
                itemsPerPage={pagination.limit}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;

