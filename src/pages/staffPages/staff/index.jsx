import React, { useState, useEffect, useMemo } from "react";
import { Download, Users, Bell, Search, Filter, Plus } from "lucide-react";
import { CSVLink } from "react-csv";
import ReusableFilter from "../../../components/ReusableFilter";
import ReusableTable from "../../../components/ReusableTable";
import ReusablePagination from "../../../components/ReusablePagination";
import StaffDetailsModal from "../../mealAdminPages/staff/features/StaffDetailsModal";
import ConfirmModal from "../../../components/ConfirmModal";
import { useGetAdminUsersQuery, useGetSingleStaffQuery, useActivateStaffMutation, useDeactivateStaffMutation, useUpdateStaffMutation, useChangeStaffPasswordMutation, useDeleteUserMutation } from "../../../services/admin/adminApi";
import toast from "react-hot-toast";

const StaffPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: "view", // "view" or "edit"
    staff: null,
  });
  const [deleteConfirmState, setDeleteConfirmState] = useState({
    isOpen: false,
    staff: null,
  });
  const [filters, setFilters] = useState({
    status: {
      key: "status",
      label: "All Statuses",
      selectedValue: "All Statuses",
      options: [
        { value: "All Statuses", label: "All Statuses" },
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
    role: {
      key: "role",
      label: "All Roles",
      selectedValue: "All Roles",
      options: [
        { value: "All Roles", label: "All Roles" },
        { value: "staff", label: "Staff" },
        { value: "admin", label: "Admin" },
        { value: "user", label: "User" },
      ],
    },
  });

  // Debounced search query
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);
  
  // Debounced filters
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // Loading state for filters/search
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  useEffect(() => {
    // Show loading when search changes
    if (searchQuery !== debouncedSearchQuery) {
      console.log('Staff: Search changed, setting isFilterLoading to true');
      setIsFilterLoading(true);
    }

    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 2000); // 2 seconds delay for search

    return () => clearTimeout(timer);
  }, [searchQuery, debouncedSearchQuery]);

  useEffect(() => {
    // Show loading when filters change
    if (JSON.stringify(filters) !== JSON.stringify(debouncedFilters)) {
      console.log('Staff: Filters changed, setting isFilterLoading to true');
      setIsFilterLoading(true);
    }

    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 2000); // 2 seconds delay for filters

    return () => clearTimeout(timer);
  }, [filters, debouncedFilters]);

  // API query parameters
  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: 5,
    ...(debouncedSearchQuery && { q: debouncedSearchQuery }),
    ...(debouncedFilters.status.selectedValue !== "All Statuses" && { 
      active: debouncedFilters.status.selectedValue === "Active" ? true : false
    }),
    ...(debouncedFilters.role.selectedValue !== "All Roles" && { role: debouncedFilters.role.selectedValue }),
  }), [currentPage, debouncedSearchQuery, debouncedFilters]);

  // API call
  const {
    data: usersResponse,
    error,
    isLoading,
    refetch
  } = useGetAdminUsersQuery(queryParams);

  useEffect(() => {
    if (!isLoading) {
      console.log('Staff: API completed, setting isFilterLoading to false');
      setIsFilterLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isFilterLoading) {
      const timeout = setTimeout(() => {
        console.log('Staff: Timeout: Forcing isFilterLoading to false');
        setIsFilterLoading(false);
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [isFilterLoading]);


  // Mutation hooks for status changes
  const [activateStaff, { isLoading: isActivating }] = useActivateStaffMutation();
  const [deactivateStaff, { isLoading: isDeactivating }] = useDeactivateStaffMutation();
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();
  const [changeStaffPassword, { isLoading: isChangingPassword }] = useChangeStaffPasswordMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Get single staff data for edit modal
  const staffId = modalState.staff?._id || modalState.staff?.id;
  const {
    data: singleStaffData,
    isLoading: isLoadingSingleStaff,
    error: singleStaffError
  } = useGetSingleStaffQuery(staffId, {
    skip: !staffId || !modalState.isOpen || modalState.mode !== "edit"
  });

  // Fallback to original staff data if single staff data is not available
  const finalStaffData = singleStaffData || modalState.staff;

  // Extract data from API response with proper validation
  const apiStaffData = Array.isArray(usersResponse?.data?.users) 
    ? usersResponse.data.users 
    : [];

  // Fallback static data for when API is not available
  const fallbackStaffData = [
    {
      id: "STF-001",
      name: "John Doe",
      email: "admin@example.com",
      role: "Super Admin",
      status: "Active",
    },
    {
      id: "STF-002",
      name: "Jane Smith",
      email: "manager@example.com",
      role: "Manager",
      status: "Active",
    },
    {
      id: "STF-003",
      name: "Sara Johnson",
      email: "support@example.com",
      role: "Support",
      status: "Active",
    },
    {
      id: "STF-004",
      name: "Micheal",
      email: "support2@example.com",
      role: "Support",
      status: "Inactive",
    },
    {
      id: "STF-005",
      name: "Townley",
      email: "support3@example.com",
      role: "Support",
      status: "Inactive",
    },
  ];

  // Transform API data to match table structure
  const transformApiData = (users) => {
    return users.map(user => {
      // Only use name if the 'name' key exists in the API response
      const displayName = user.hasOwnProperty('name') && user.name && user.name.trim() !== '' 
        ? user.name 
        : 'N/A'; // Show N/A when name key doesn't exist
      
      return {
        id: user.id,
        _id: user.id, // Store original ID for API calls
        name: displayName,
        email: user.email,
        role: user.role.charAt(0).toUpperCase() + user.role.slice(1), // Capitalize role
        status: user.isActive ? 'Active' : 'Inactive',
        isVerified: user.isVerified,
        createdAt: user.createdAt
      };
    });
  };

  // Use API data if available, otherwise use fallback
  const [staffData, setStaffData] = useState(
    apiStaffData.length > 0 ? transformApiData(apiStaffData) : fallbackStaffData
  );

  // Update staff data when API response changes
  useEffect(() => {
    if (apiStaffData.length > 0) {
      setStaffData(transformApiData(apiStaffData));
    } else {
      // Clear data when API returns empty array
      setStaffData([]);
    }
  }, [apiStaffData]);

  // Extract pagination info from API response
  const totalItems = usersResponse?.data?.total || staffData.length;
  const totalPages = Math.ceil(totalItems / 5);

  // Table columns configuration
  const columns = [
    { key: "name", label: "Staff Member" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
    { key: "actions", label: "", className: "w-16" },
  ];

  // Handle filter changes
  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: {
        ...prev[filterKey],
        selectedValue: value,
      },
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle search changes
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle row selection
  const handleRowClick = (row) => {
    setSelectedRow(selectedRow === row.id ? null : row.id);
  };

  // Handle view staff
  const handleViewStaff = (staff) => {
    setModalState({
      isOpen: true,
      mode: "view",
      staff: staff,
    });
  };

  // Handle edit staff
  const handleEditStaff = (staff) => {
    setModalState({
      isOpen: true,
      mode: "edit",
      staff: staff,
    });
  };

  // Handle delete staff
  const handleDeleteStaff = (staff) => {
    setDeleteConfirmState({
      isOpen: true,
      staff: staff,
    });
  };

  const confirmDeleteStaff = async () => {
    if (deleteConfirmState.staff) {
      try {
        const staffId = deleteConfirmState.staff._id || deleteConfirmState.staff.id;
        
        if (!staffId) {
          console.error("No staff ID found for deletion");
          toast.error("Failed to delete user: User ID not found.");
          return;
        }

        // Delete user via API
        await deleteUser(staffId).unwrap();

        // Show success toast
        toast.success("User deleted successfully!");
      } catch (error) {
        console.error("Error deleting user:", error?.data?.message || error?.message);
        toast.error(error?.data?.message || error?.message || "Failed to delete user");
      }
    }
    
    setDeleteConfirmState({
      isOpen: false,
      staff: null,
    });
  };

  const handleSaveStaff = async (updatedStaff) => {
    try {
      const staffId = updatedStaff.data?.id || updatedStaff._id || updatedStaff.id;
      
      if (!staffId) {
        console.error("No staff ID found for update");
        toast.error("Failed to update staff member: Staff ID not found.");
        return;
      }

      const apiData = {
        name: updatedStaff.name,
        email: updatedStaff.email,
        role: updatedStaff.role.toLowerCase(), 
        isActive: updatedStaff.status === "Active"
      };

      await updateStaff({ staffId, staffData: apiData }).unwrap();

      if (updatedStaff.newPassword && updatedStaff.newPassword.trim() !== "") {
        const passwordData = {
          oldPassword: updatedStaff.currentPassword,
          newPassword: updatedStaff.newPassword
        };
        await changeStaffPassword({ staffId, passwordData }).unwrap();
      }

      toast.success("Staff member updated successfully!");

      // Close modal only after all API calls are successful
      setModalState({ isOpen: false, mode: "view", staff: null });
    } catch (error) {
      console.error("Error updating staff:", error?.data?.message || error?.message);
      console.error("Full error:", error);
      
      // Show error toast
      toast.error(error?.data?.message || error?.message || "Failed to update staff member");
      
      // Don't close modal on error, let user see the error
    }
  };

  // Handle status change
  const handleStatusChange = async (row, newStatus) => {
    try {
      const staffId = row._id || row.id;
      
      if (!staffId) {
        console.error("No staff ID found for status change");
        return;
      }
      
      // Validate MongoDB ObjectId format
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!objectIdRegex.test(staffId)) {
        console.error("Invalid staff ID format");
        return;
      }
      
      if (newStatus === "active") {
        await activateStaff(staffId).unwrap();
        toast.success("Staff member activated successfully!");
      } else if (newStatus === "inactive") {
        await deactivateStaff(staffId).unwrap();
        toast.success("Staff member deactivated successfully!");
      }
    } catch (error) {
      console.error("Error changing staff status:", error?.data?.message || error?.message);
      toast.error(error?.data?.message || error?.message || "Failed to change staff status");
    }
  };

  // Close modal
  const closeModal = () => {
    setModalState({ isOpen: false, mode: "view", staff: null });
  };

  // Since API handles filtering and pagination, we use the data directly
  const currentData = staffData;
  const itemsPerPage = 5;

  // CSV Export Configuration
  const csvHeaders = [
    { label: "Staff Member", key: "name" },
    { label: "Email", key: "email" },
    { label: "Role", key: "role" },
    { label: "Status", key: "status" },
  ];

  // Format data for CSV export
  const csvData = Array.isArray(staffData) 
    ? staffData.map((staff) => ({
        ...staff,
      }))
    : [];

  // CSV filename with current date
  const csvFilename = `staff_export_${
    new Date().toISOString().split("T")[0]
  }.csv`;

  // Loading state
  if (isLoading) {
    return (
      <div className="p-3 lg:p-6">
        {/* Main Content */}
        <div className="bg-[#171D41] rounded-t-lg p-6">
          {/* Staff Table Header */}
          <div className="flex lg:flex-row lg:items-center justify-between mb-4 lg:mb-6 gap-3 lg:gap-0">
            <h2 className="text-xl lg:text-2xl font-bold text-white">Staff</h2>

            {/* Table Controls with ReusableFilter */}
            <div className="w-full lg:flex-1 lg:ml-8">
              <ReusableFilter
                filters={[
                  { ...filters.status, key: "status" },
                  { ...filters.role, key: "role" }
                ]}
                onFilterChange={handleFilterChange}
                searchPlaceholder="Search Staff..."
                onSearchChange={handleSearchChange}
                searchValue={searchQuery}
              />
            </div>
          </div>

          {/* Loading State */}
          <div className="bg-[#171D41] rounded-lg border border-[#EDEDED33] p-4">
            <div className="text-center py-8">
              <div className="text-white text-lg">Loading staff members...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-3 lg:p-6">
        {/* Main Content */}
        <div className="bg-[#171D41] rounded-t-lg p-6">
          {/* Staff Table Header */}
          <div className="flex lg:flex-row lg:items-center justify-between mb-4 lg:mb-6 gap-3 lg:gap-0">
            <h2 className="text-xl lg:text-2xl font-bold text-white">Staff</h2>

            {/* Table Controls with ReusableFilter */}
            <div className="w-full lg:flex-1 lg:ml-8">
              <ReusableFilter
                filters={[
                  { ...filters.status, key: "status" },
                  { ...filters.role, key: "role" }
                ]}
                onFilterChange={handleFilterChange}
                searchPlaceholder="Search Staff..."
                onSearchChange={handleSearchChange}
                searchValue={searchQuery}
              />
            </div>
          </div>

          {/* Error State */}
          <div className="bg-[#171D41] rounded-lg border border-[#EDEDED33] p-4">
            <div className="text-center py-8">
              <div className="text-red-400 text-lg">
                Error loading staff: {error?.data?.message || error?.message || 'Unknown error'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 lg:p-6">
      {/* Main Content - NO ADD STAFF BUTTON FOR STAFF ROLE */}
      <div className="bg-[#171D41] rounded-t-lg p-6">
        {/* Staff Table Header */}
        <div className="flex lg:flex-row lg:items-center justify-between mb-4 lg:mb-6 gap-3 lg:gap-0">
          <h2 className="text-xl lg:text-2xl font-bold text-white">Staff</h2>

          {/* Table Controls with ReusableFilter */}
          <div className="w-full lg:flex-1 lg:ml-8">
            <ReusableFilter
              filters={Object.values(filters)}
              onFilterChange={handleFilterChange}
              searchPlaceholder="Search Staff..."
              onSearchChange={handleSearchChange}
              searchValue={searchQuery}
            />
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-[#171D41] rounded-lg border border-[#EDEDED33] p-4">
    
          {Array.isArray(currentData) && currentData.length > 0 ? (
            <ReusableTable
              columns={columns}
              data={currentData}
              onRowClick={handleRowClick}
              selectedRow={selectedRow}
              actions={true}
              onView={handleViewStaff}
              onEdit={handleEditStaff}
              onDelete={handleDeleteStaff}
              onStatusChange={handleStatusChange}
              tableType="staff"
              isLoading={isFilterLoading || isLoading}
            />
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-lg">No staff members found</div>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="bg-[#171D41] rounded-b-lg px-3 pb-3">
        <ReusablePagination
          currentPage={currentPage}
          totalPages={totalPages || 1}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          showPageInfo={true}
        />
      </div>

      {/* Hidden CSV Export Link */}
      <div className="hidden">
        <CSVLink
          data={csvData}
          headers={csvHeaders}
          filename={csvFilename}
          className="hidden"
          id="csv-export-link"
        >
          Export
        </CSVLink>
      </div>

      {/* Staff Details Modal */}
      <StaffDetailsModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        staff={finalStaffData}
        mode={modalState.mode}
        onSave={handleSaveStaff}
        onDelete={handleDeleteStaff}
        isLoading={isLoadingSingleStaff}
        error={singleStaffError}
        isSaving={isUpdating || isChangingPassword}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmState.isOpen}
        onClose={() => setDeleteConfirmState({ isOpen: false, staff: null })}
        onConfirm={confirmDeleteStaff}
        title="Are you sure?"
        itemName={deleteConfirmState.staff?.name || "Staff Member"}
        itemDescription={`${deleteConfirmState.staff?.role || "Staff"} - ${
          deleteConfirmState.staff?.email || "No email"
        }`}
        itemDate={`Status: ${deleteConfirmState.staff?.status || "Unknown"}`}
        confirmButtonText="Delete Staff"
        type="delete"
      />
    </div>
  );
};

export default StaffPage;
