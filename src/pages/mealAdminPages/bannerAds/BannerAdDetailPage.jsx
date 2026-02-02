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
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 bg-[#0A1330] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8 mt-2">
          <button
            onClick={() => navigate("/admin/banner-ads")}
            className="p-3 bg-[#121B36] rounded-xl border border-[#FFFFFF0D] hover:bg-[#1C244D] transition-all self-start shadow-xl"
          >
            <FaArrowLeft className="text-[#14F195]" size={14} />
          </button>

          <div className="flex-1 flex flex-col gap-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Banner Detail</h1>
            <p className="text-[#AEB9E1] text-xs font-bold uppercase tracking-widest opacity-60">Advertisement Management</p>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={handleEdit}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#F7B91C20] text-[#F7B91C] border border-[#F7B91C40] px-5 py-3 rounded-2xl font-bold hover:bg-[#F7B91C30] transition-all active:scale-95 text-sm"
            >
              <FaEdit size={14} />
              <span>Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#FF4B5520] text-[#FF4B55] border border-[#FF4B5540] px-5 py-3 rounded-2xl font-bold hover:bg-[#FF4B5530] transition-all active:scale-95 text-sm"
            >
              <FaTrash size={14} />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Global Layout Card */}
        <div className="bg-[#121B36] rounded-[40px] border border-[#FFFFFF0D] shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#9945FF] to-[#14F195] opacity-5 blur-3xl -z-10"></div>

          {/* Visual Section */}
          <div className="relative w-full h-64 md:h-[450px]">
            {bannerAd.image ? (
              <div className="w-full h-full relative group">
                <img
                  src={bannerAd.image}
                  alt={bannerAd.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121B36] via-transparent to-transparent"></div>
              </div>
            ) : (
              <div className="w-full h-full bg-[#171D41] flex items-center justify-center">
                <FaImage className="text-white text-6xl opacity-10" />
              </div>
            )}

            <div className="absolute bottom-8 left-8 right-8 space-y-3">
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${isActive ? "bg-[#14F19520] text-[#14F195] border border-[#14F19540]" : "bg-[#FF4B5520] text-[#FF4B55] border border-[#FF4B5540]"
                  }`}>
                  {isActive ? "LIVE NOW" : isExpired ? "EXPIRED" : "INACTIVE"}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/30">
                  PRIORITY {bannerAd.priority}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter leading-none">{bannerAd.title}</h1>
              <p className="text-[#AEB9E1] text-lg font-medium opacity-80 max-w-2xl">{bannerAd.description}</p>
            </div>
          </div>

          {/* Data Grid Section */}
          <div className="p-8 md:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Left Segment: Campaign Details */}
              <div className="space-y-10">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-3">
                    <span className="w-2 h-6 bg-[#9945FF] rounded-full"></span>
                    Campaign Logistics
                  </h3>

                  <div className="bg-[#171D41] rounded-[32px] p-8 border border-[#FFFFFF0D] space-y-8">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <FaCalendar className="text-blue-400" size={18} />
                      </div>
                      <div>
                        <p className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest">Duration Segment</p>
                        <div className="flex flex-col gap-1 mt-1">
                          <span className="text-white font-bold text-sm">{new Date(bannerAd.startDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                          {bannerAd.endDate ? (
                            <span className="text-[#AEB9E1] font-medium text-xs">Expires on {new Date(bannerAd.endDate).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                          ) : (
                            <span className="text-[#14F195] font-bold text-xs uppercase tracking-tighter">Unlimited Runtime</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {bannerAd.property_id && (
                      <div className="flex items-start gap-5 pt-8 border-t border-[#FFFFFF05]">
                        <div className="w-12 h-12 rounded-2xl bg-[#14F19510] flex items-center justify-center flex-shrink-0">
                          <FaBuilding className="text-[#14F195]" size={18} />
                        </div>
                        <div>
                          <p className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest">Linked Establishment</p>
                          <h4 className="text-white font-bold text-base mt-1">{bannerAd.property_id.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <FaMapMarkerAlt className="text-[#AEB9E1]/60" size={10} />
                            <span className="text-[#AEB9E1]/60 text-xs font-medium">{bannerAd.property_id.address}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-3">
                    <span className="w-2 h-6 bg-pink-500 rounded-full"></span>
                    Financial Footprint
                  </h3>
                  <div className="bg-[#171D41] rounded-[32px] p-8 border border-[#FFFFFF0D]">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest mb-2">Campaign Investment</p>
                        <p className="text-4xl font-bold text-white tracking-tighter">
                          {bannerAd.currency === "USD" ? "$" : "Rs"}
                          {bannerAd.amountPaid ? bannerAd.amountPaid.toLocaleString() : "0"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="bg-[#14F19520] px-4 py-2 rounded-2xl border border-[#14F19540]">
                          <span className="text-[#14F195] font-bold text-xs uppercase">Settled</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Segment: Engagement & Audience */}
              <div className="space-y-10">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-3">
                    <span className="w-2 h-6 bg-[#F7B91C] rounded-full"></span>
                    Conversion Anchor
                  </h3>
                  <div className="bg-[#171D41] rounded-[32px] p-8 border border-[#FFFFFF0D] flex items-center justify-between">
                    <div>
                      <p className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest mb-1">Interactive Call</p>
                      <p className="text-white font-bold text-xl tracking-tight">{bannerAd.ctaText || "Book Discovery"}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                      <FaTag className="text-[#F7B91C]" size={16} />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-3">
                    <span className="w-2 h-6 bg-blue-400 rounded-full"></span>
                    Client Profile
                  </h3>
                  <div className="bg-[#171D41] rounded-[32px] p-8 border border-[#FFFFFF0D] space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-[#0A1330] flex items-center justify-center">
                        <FaUser className="text-[#AEB9E1]" size={20} />
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg leading-tight">{bannerAd.advertiserName || "Anonymous Partner"}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <FaEnvelope className="text-blue-400" size={12} />
                          <span className="text-[#AEB9E1] text-xs font-medium">{bannerAd.advertiserEmail || "No contact shared"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[#FFFFFF05] grid grid-cols-2 gap-4 text-[10px]">
                      <div>
                        <p className="text-[#AEB9E1]/30 font-bold uppercase mb-1">System Entry</p>
                        <p className="text-[#AEB9E1] font-bold">{new Date(bannerAd.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#AEB9E1]/30 font-bold uppercase mb-1">Manager</p>
                        <p className="text-[#AEB9E1] font-bold">{bannerAd.createdBy?.name || "System"}</p>
                      </div>
                    </div>
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

