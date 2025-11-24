import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../../../utils/axios";
import { toast } from "react-hot-toast";
import { 
  FaArrowLeft, 
  FaEdit, 
  FaTrash, 
  FaImage, 
  FaCalendar, 
  FaMapMarkerAlt,
  FaBuilding,
  FaTag,
  FaCheckCircle,
  FaTimesCircle,
  FaDollarSign,
  FaEnvelope,
  FaUser
} from "react-icons/fa";

const BannerAdDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [bannerAd, setBannerAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBannerAd();
  }, [id]);

  const fetchBannerAd = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = user?.token || localStorage.getItem("auth_token");
      const response = await axios.get(`/api/v1/banner-ads/${id}`, {
        headers: token ? {
          Authorization: `Bearer ${token}`
        } : {},
      });

      if (response.data.success) {
        setBannerAd(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch banner ad");
      }
    } catch (error) {
      console.error("Error fetching banner ad:", error);
      setError(error.response?.data?.message || "Failed to fetch banner ad");
      toast.error(error.response?.data?.message || "Failed to fetch banner ad");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this banner ad?")) {
      return;
    }

    try {
      const token = user?.token || localStorage.getItem("auth_token");
      const response = await axios.delete(`/api/v1/banner-ads/${id}`, {
        headers: token ? {
          Authorization: `Bearer ${token}`
        } : {},
      });
      if (response.data.success) {
        toast.success("Banner ad deleted successfully");
        navigate("/admin/banner-ads");
      }
    } catch (error) {
      console.error("Error deleting banner ad:", error);
      toast.error(error.response?.data?.message || "Failed to delete banner ad");
    }
  };

  const handleEdit = () => {
    navigate(`/admin/banner-ads/${id}/edit`);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-[#0A1330] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#14F195] mx-auto mb-4"></div>
          <p className="text-[#AEB9E1]">Loading banner ad details...</p>
        </div>
      </div>
    );
  }

  if (error || !bannerAd) {
    return (
      <div className="p-4 sm:p-6 bg-[#0A1330] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-red-400 mb-4">{error || "Banner ad not found"}</p>
          <button
            onClick={() => navigate("/admin/banner-ads")}
            className="px-4 py-2 bg-[#9945FF] text-white rounded-lg hover:bg-[#7A35DF] transition-colors"
          >
            Back to Banner Ads
          </button>
        </div>
      </div>
    );
  }

  const isExpired = bannerAd.endDate && new Date(bannerAd.endDate) < new Date();
  const isActive = bannerAd.isActive && !isExpired;

  return (
    <div className="p-4 sm:p-6 bg-[#0A1330] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/admin/banner-ads")}
            className="flex items-center gap-2 text-[#AEB9E1] hover:text-white transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Banner Ads</span>
          </button>
          <div className="flex gap-3">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-lg transition-colors"
            >
              <FaEdit />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors"
            >
              <FaTrash />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-[#171D41] rounded-lg shadow-lg border border-[#3A3A4E] overflow-hidden">
          {/* Banner Image Section */}
          <div className="relative w-full h-64 md:h-96 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900">
            {bannerAd.image ? (
              <img
                src={bannerAd.image}
                alt={bannerAd.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaImage className="text-white text-6xl opacity-50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {bannerAd.title}
              </h1>
              <p className="text-white/90 text-lg md:text-xl">
                {bannerAd.description}
              </p>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Status Card */}
                <div className="bg-[#2A2A3E] rounded-lg p-6 border border-[#3A3A4E]">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FaTag className="text-[#9945FF]" />
                    Status & Priority
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[#AEB9E1]">Status:</span>
                      <span
                        className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                          isActive
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {isActive ? (
                          <span className="flex items-center gap-2">
                            <FaCheckCircle />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <FaTimesCircle />
                            {isExpired ? "Expired" : "Inactive"}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#AEB9E1]">Priority:</span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-semibold">
                        {bannerAd.priority}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dates Card */}
                <div className="bg-[#2A2A3E] rounded-lg p-6 border border-[#3A3A4E]">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FaCalendar className="text-[#9945FF]" />
                    Dates
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-[#AEB9E1] text-sm">Start Date:</span>
                      <p className="text-white font-medium">
                        {new Date(bannerAd.startDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-[#AEB9E1] text-sm">
                        {new Date(bannerAd.startDate).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {bannerAd.endDate && (
                      <div>
                        <span className="text-[#AEB9E1] text-sm">End Date:</span>
                        <p className="text-white font-medium">
                          {new Date(bannerAd.endDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-[#AEB9E1] text-sm">
                          {new Date(bannerAd.endDate).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    )}
                    {!bannerAd.endDate && (
                      <p className="text-[#AEB9E1] text-sm italic">No end date (runs indefinitely)</p>
                    )}
                  </div>
                </div>

                {/* Property Card */}
                {bannerAd.property_id && (
                  <div className="bg-[#2A2A3E] rounded-lg p-6 border border-[#3A3A4E]">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FaBuilding className="text-[#9945FF]" />
                      Associated Property
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-[#AEB9E1] text-sm">Property Name:</span>
                        <p className="text-white font-medium">{bannerAd.property_id.name || "N/A"}</p>
                      </div>
                      {bannerAd.property_id.address && (
                        <div>
                          <span className="text-[#AEB9E1] text-sm flex items-center gap-1">
                            <FaMapMarkerAlt className="text-xs" />
                            Address:
                          </span>
                          <p className="text-white">{bannerAd.property_id.address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* CTA Button Text */}
                <div className="bg-[#2A2A3E] rounded-lg p-6 border border-[#3A3A4E]">
                  <h3 className="text-lg font-semibold text-white mb-4">Call to Action</h3>
                  <div className="space-y-2">
                    <span className="text-[#AEB9E1] text-sm">Button Text:</span>
                    <p className="text-white font-medium text-lg">{bannerAd.ctaText || "Book Now"}</p>
                  </div>
                </div>

                {/* Advertiser Information */}
                {(bannerAd.advertiserName || bannerAd.advertiserEmail || bannerAd.amountPaid) && (
                  <div className="bg-[#2A2A3E] rounded-lg p-6 border border-[#3A3A4E]">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FaUser className="text-[#9945FF]" />
                      Advertiser Information
                    </h3>
                    <div className="space-y-3">
                      {bannerAd.advertiserName && (
                        <div>
                          <span className="text-[#AEB9E1] text-sm">Advertiser Name:</span>
                          <p className="text-white font-medium">{bannerAd.advertiserName}</p>
                        </div>
                      )}
                      {bannerAd.advertiserEmail && (
                        <div>
                          <span className="text-[#AEB9E1] text-sm flex items-center gap-1">
                            <FaEnvelope className="text-xs" />
                            Email:
                          </span>
                          <p className="text-white">{bannerAd.advertiserEmail}</p>
                        </div>
                      )}
                      {bannerAd.amountPaid !== undefined && bannerAd.amountPaid > 0 && (
                        <div>
                          <span className="text-[#AEB9E1] text-sm flex items-center gap-1">
                            <FaDollarSign className="text-xs" />
                            Amount Paid:
                          </span>
                          <p className="text-white font-medium text-lg">
                            {bannerAd.currency === "USD" ? "$" : "Rs "}
                            {bannerAd.amountPaid.toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Created By */}
                {bannerAd.createdBy && (
                  <div className="bg-[#2A2A3E] rounded-lg p-6 border border-[#3A3A4E]">
                    <h3 className="text-lg font-semibold text-white mb-4">Created By</h3>
                    <div className="space-y-2">
                      <p className="text-white">{bannerAd.createdBy.name || "N/A"}</p>
                      {bannerAd.createdBy.email && (
                        <p className="text-[#AEB9E1] text-sm">{bannerAd.createdBy.email}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Timestamps */}
                <div className="bg-[#2A2A3E] rounded-lg p-6 border border-[#3A3A4E]">
                  <h3 className="text-lg font-semibold text-white mb-4">Timestamps</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-[#AEB9E1]">Created:</span>
                      <p className="text-white">
                        {new Date(bannerAd.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {bannerAd.updatedAt && (
                      <div>
                        <span className="text-[#AEB9E1]">Last Updated:</span>
                        <p className="text-white">
                          {new Date(bannerAd.updatedAt).toLocaleString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerAdDetailPage;

