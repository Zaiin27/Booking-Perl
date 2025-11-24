import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../utils/axios";
import { toast } from "react-hot-toast";
import ReusableTable from "../../components/ReusableTable";
import ReusableFilter from "../../components/ReusableFilter";
import ReusablePagination from "../../components/ReusablePagination";
import { FaPlus } from "react-icons/fa";
import PromotionForm from "./promotions/PromotionForm";

const BannerAdsPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [bannerAds, setBannerAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    search: "",
    isActive: "",
  });

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast.error("Please login to access this resource");
      navigate("/login", { state: { returnUrl: "/admin/banner-ads" } });
      return;
    }

    // Check if user has admin role
    if (user.role !== "admin" && user.role !== "superadmin") {
      toast.error("You don't have permission to access this page");
      navigate("/unauthorized");
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch banner ads when pagination or filters change
  useEffect(() => {
    if (isAuthenticated && user && (user.role === "admin" || user.role === "superadmin")) {
      fetchBannerAds();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, filters]);

  const fetchBannerAds = async () => {
    // Don't fetch if not authenticated
    if (!isAuthenticated || !user) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      };

      // Remove empty string values from params to avoid filter issues
      Object.keys(params).forEach(key => {
        if (params[key] === "" || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      // Ensure token is included
      const token = user?.token || localStorage.getItem("auth_token");
      const response = await axios.get("/api/v1/banner-ads/admin", {
        params,
        headers: token ? {
          Authorization: `Bearer ${token}`
        } : {},
      });

      if (response.data.success) {
        console.log("Banner ads fetched successfully:", response.data.data);
        setBannerAds(response.data.data.ads || []);
        setPagination({
          ...pagination,
          total: response.data.data.total || 0,
          pages: response.data.data.pages || 0,
        });
      } else {
        setError(response.data.message || "Failed to fetch banner ads");
      }
    } catch (error) {
      console.error("Error fetching banner ads:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch banner ads";
      setError(errorMessage);
      
      // Handle 401 unauthorized - redirect to login
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("auth_token");
        navigate("/login", { state: { returnUrl: "/admin/banner-ads" } });
        return;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ad) => {
    // Handle both object and ID
    const adId = ad?._id || ad?.id || ad;
    
    if (!window.confirm("Are you sure you want to delete this banner ad?")) {
      return;
    }

    try {
      const token = user?.token || localStorage.getItem("auth_token");
      const response = await axios.delete(`/api/v1/banner-ads/${adId}`, {
        headers: token ? {
          Authorization: `Bearer ${token}`
        } : {},
      });
      if (response.data.success) {
        toast.success("Banner ad deleted successfully");
        fetchBannerAds();
      }
    } catch (error) {
      console.error("Error deleting banner ad:", error);
      toast.error(error.response?.data?.message || "Failed to delete banner ad");
    }
  };

  const handleView = (ad) => {
    const adId = ad?._id || ad?.id || ad;
    navigate(`/admin/banner-ads/${adId}`);
  };

  const handleEdit = (ad) => {
    const adId = ad?._id || ad?.id || ad;
    navigate(`/admin/banner-ads/${adId}/edit`);
  };

  const handleAddNew = () => {
    setEditingAd(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAd(null);
    fetchBannerAds();
  };

  const columns = [
    {
      key: "image",
      label: "Image",
    },
    {
      key: "title",
      label: "Title",
    },
    {
      key: "property_id",
      label: "Property",
    },
    {
      key: "priority",
      label: "Priority",
    },
    {
      key: "clickCount",
      label: "Clicks",
    },
    {
      key: "isActive",
      label: "Status",
    },
    {
      key: "startDate",
      label: "Dates",
    },
    {
      key: "actions",
      label: "Actions",
    },
  ];

  // Show error message if there's an error
  if (error && !loading) {
    return (
      <div className="p-4 sm:p-6 bg-[#0A1330] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Banner Ads</h2>
          <p className="text-red-400 mb-4">{error}</p>
          <p className="text-gray-400 text-sm mb-4">
            If you see "ERR_BLOCKED_BY_CLIENT", please disable your ad blocker for this site.
          </p>
          <button
            onClick={() => {
              setError(null);
              fetchBannerAds();
            }}
            className="px-4 py-2 bg-[#9945FF] text-white rounded-lg hover:bg-[#7A35DF] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-[#0A1330] min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Banner Ads</h1>
            <p className="text-[#AEB9E1] text-sm sm:text-base">
              Manage promotional banner ads displayed on the home page
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform"
          >
            <FaPlus />
            <span>Add New Banner Ad</span>
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <ReusableFilter
            filters={filters}
            setFilters={setFilters}
            filterFields={[
              {
                name: "search",
                type: "text",
                placeholder: "Search by title or property...",
              },
              {
                name: "isActive",
                type: "select",
                placeholder: "All Status",
                options: [
                  { value: "", label: "All Status" },
                  { value: "true", label: "Active" },
                  { value: "false", label: "Inactive" },
                ],
              },
            ]}
          />
        </div>

        {/* Table */}
        <div className="bg-[#171D41] rounded-lg shadow-lg border border-[#3A3A4E] overflow-x-auto overflow-y-visible">
          <ReusableTable
            columns={columns}
            data={bannerAds}
            isLoading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            tableType="bannerAds"
            emptyMessage="No banner ads found. Click 'Add New Banner Ad' to create one."
          />
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="mt-6">
            <ReusablePagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={(page) =>
                setPagination({ ...pagination, page })
              }
            />
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <PromotionForm
            ad={editingAd}
            onClose={handleFormClose}
            onSuccess={handleFormClose}
          />
        )}
      </div>
    </div>
  );
};

export default BannerAdsPage;
