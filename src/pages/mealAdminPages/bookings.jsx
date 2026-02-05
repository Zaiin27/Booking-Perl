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
      className: "min-w-[160px]",
    },
    {
      key: "guestName",
      label: "Guest Info",
      className: "min-w-[200px]",
    },
    {
      key: "property_id",
      label: "Property",
      className: "min-w-[220px]",
    },
    {
      key: "checkInDate",
      label: "Check-in / Check-out",
      className: "min-w-[180px]",
    },
    {
      key: "numberOfGuests",
      label: "Guests / Rooms",
      className: "min-w-[140px]",
    },
    {
      key: "bookedRooms",
      label: "Room Types",
      className: "min-w-[140px]",
    },
    {
      key: "totalAmount",
      label: "Amount",
      className: "min-w-[120px]",
    },
    {
      key: "bookingStatus",
      label: "Booking Status",
      className: "min-w-[140px]",
    },
    {
      key: "paymentStatus",
      label: "Payment Status",
      className: "min-w-[140px]",
    },
    {
      key: "paymentType",
      label: "Payment Type",
      className: "min-w-[120px]",
    },
    {
      key: "createdAt",
      label: "Booked On",
      className: "min-w-[140px]",
    },
    // Only show actions column for admin
    ...(user?.role === 'admin' ? [{
      key: "actions",
      label: "Actions",
      className: "min-w-[100px]",
    }] : []),
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
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 bg-[#0A1330] min-h-screen">
      <div className="max-w-7xl mx-auto">


        {/* Content Card */}
        <div className="bg-[#121B36] rounded-[32px] border border-[#FFFFFF0D] shadow-2xl overflow-hidden">
          {/* Filters Area */}
          <div className="p-6 pb-2">
            <ReusableFilter
              filters={filterOptions}
              onFilterChange={handleFilterChange}
              onSearchChange={handleSearchChange}
              searchValue={filters.search}
              searchPlaceholder="Search reference, guest..."
            />
          </div>

          {/* Table Area */}
          <div className="p-0 sm:p-4">
            <ReusableTable
              columns={columns}
              data={bookings}
              isLoading={loading}
              tableType="bookings"
              onView={user?.role === 'admin' ? (row) => navigate(`/admin/bookings/${row._id}`) : null}
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

