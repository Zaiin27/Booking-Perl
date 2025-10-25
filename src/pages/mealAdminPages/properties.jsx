import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../utils/axios";
import { toast } from "react-hot-toast";
import ReusableTable from "../../components/ReusableTable";
import ReusableFilter from "../../components/ReusableFilter";
import ReusablePagination from "../../components/ReusablePagination";
import { FaPlus, FaEdit, FaTrash, FaEye, FaHome } from "react-icons/fa";

const PropertiesPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [canAddProperty, setCanAddProperty] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    status: "",
  });

  // Check if user can create property
  const checkCanCreateProperty = async () => {
    try {
      console.log("Checking can create property for user:", user);
      console.log("User token:", user?.token);
      console.log("LocalStorage token:", localStorage.getItem('auth_token'));
      
      // Check if user is authenticated
      if (!user || !user.token) {
        console.log("User not authenticated, skipping API call");
        setCanAddProperty(false);
        return;
      }
      
      // Add manual authorization header as backup
      const token = user.token || localStorage.getItem('auth_token');
      const response = await axios.get("/api/v1/properties/can-create", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setCanAddProperty(response.data.canCreate);
        console.log("Can create property:", response.data.message);
      }
    } catch (error) {
      console.error("Error checking can create property:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      // Fallback logic based on user role
      if (user?.role === 'admin') {
        setCanAddProperty(true);
        console.log("Admin fallback: Can create properties");
      } else if (user?.role === 'staff') {
        // For staff, check if they have any properties locally
        const hasProperties = properties.length > 0;
        setCanAddProperty(!hasProperties);
        console.log("Staff fallback: Can create property =", !hasProperties, "Current properties:", properties.length);
      } else {
        setCanAddProperty(false);
      }
    }
  };

  // Fetch properties
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };

      // Add staff filtering if user is staff
      if (user?.role === 'staff') {
        params.owner_id = user.id;
      }

      const response = await axios.get("/api/v1/properties", { params });
      
      if (response.data.success) {
        const fetchedProperties = response.data.data.properties;
        setProperties(fetchedProperties);
        
        // For staff, check if they can create property based on current properties
        if (user?.role === 'staff') {
          const canCreate = fetchedProperties.length < 1;
          setCanAddProperty(canCreate);
          console.log("Staff property check: Can create =", canCreate, "Properties count:", fetchedProperties.length);
        }
        
        setPagination({
          ...pagination,
          total: response.data.data.total,
          pages: response.data.data.pages,
        });
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error(error.response?.data?.message || "Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
    checkCanCreateProperty();
    
    // Immediate check for admin - ensure button is enabled
    if (user?.role === 'admin') {
      setCanAddProperty(true);
    } else if (user?.role === 'staff') {
      // For staff, assume they can create until we fetch properties
      setCanAddProperty(true);
      console.log("Staff initial state: Can create property (will be updated after fetch)");
    }
  }, [pagination.page, pagination.limit, filters, user]);

  // Handle delete
  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {
      const response = await axios.delete(`/api/v1/properties/${propertyId}`);
      
      if (response.data.success) {
        toast.success("Property deleted successfully");
        fetchProperties();
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error(error.response?.data?.message || "Failed to delete property");
    }
  };

  // Table columns configuration for ReusableTable
  const columns = [
    {
      key: "name",
      label: "Property Name",
    },
    {
      key: "address", 
      label: "Address",
    },
    {
      key: "totalRooms",
      label: "Total Rooms",
    },
    {
      key: "availableRooms",
      label: "Available",
    },
    {
      key: "roomTypes",
      label: "Room Types",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "contactEmail",
      label: "Contact",
    },
    {
      key: "owner_id",
      label: "Staff ID",
    },
    {
      key: "actions",
      label: "Actions",
    },
  ];

  // Filter handlers
  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSearchChange = (value) => {
    setFilters(prev => ({
      ...prev,
      search: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  // Filter configuration for ReusableFilter
  const filterOptions = [
    {
      key: "status",
      label: "All Statuses",
      selectedValue: filters.status,
      options: [
        { value: "", label: "All Statuses" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
        { value: "maintenance", label: "Maintenance" },
      ],
    },
  ];

  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-[#0A1330] min-h-screen">
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Properties</h1>
            <p className="text-[#AEB9E1] mt-1 text-sm sm:text-base">Manage your hotel properties</p>
          </div>
          <button
            onClick={() => navigate(user?.role === 'staff' ? "/staff/properties/create" : "/admin/properties/create")}
            disabled={!canAddProperty}
            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 text-sm sm:text-base ${
              canAddProperty
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105"
                : "bg-gray-500 text-gray-300 cursor-not-allowed opacity-50"
            }`}
            title={!canAddProperty ? (user?.role === 'staff' ? "You already have a property. Contact admin for additional properties." : "Cannot create property") : ""}
          >
            <FaPlus />
            <span className="hidden sm:inline">Add New Property</span>
            <span className="sm:hidden">Add Property</span>
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <ReusableFilter
            filters={filterOptions}
            onFilterChange={handleFilterChange}
            onSearchChange={handleSearchChange}
            searchValue={filters.search}
            searchPlaceholder="Search properties by name or address..."
          />
        </div>

        {/* Table */}
        <div className="bg-[#171D41] rounded-lg shadow-lg border border-[#3A3A4E] overflow-hidden">
          <div className="p-2 sm:p-4">
            <ReusableTable
              columns={columns}
              data={properties}
              isLoading={loading}
              tableType="properties"
              onView={(row) => navigate(user?.role === 'staff' ? `/staff/properties/${row._id}` : `/admin/properties/${row._id}`)}
              onEdit={user?.role === 'admin' ? (row) => navigate(`/admin/properties/edit/${row._id}`) : undefined}
              onDelete={user?.role === 'admin' ? (row) => handleDelete(row._id) : undefined}
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

export default PropertiesPage;

