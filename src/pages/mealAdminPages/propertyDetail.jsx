import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../utils/axios";
import { toast } from "react-hot-toast";
import { FaArrowLeft, FaEdit, FaTrash, FaHome, FaPhone, FaEnvelope, FaClock, FaMapMarkerAlt, FaBed, FaDollarSign } from "react-icons/fa";

const PropertyDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/properties/${id}`);

      if (response.data.success) {
        setProperty(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching property:", error);
      toast.error(error.response?.data?.message || "Failed to fetch property");
      navigate("/admin/properties");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {
      const response = await axios.delete(`/api/v1/properties/${id}`);

      if (response.data.success) {
        toast.success("Property deleted successfully");
        navigate("/admin/properties");
      }
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error(error.response?.data?.message || "Failed to delete property");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A1330]">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#14F195]"></div>
          <div className="text-[#AEB9E1] text-sm font-medium">Loading property details...</div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A1330]">
        <div className="text-center">
          <div className="text-[#AEB9E1] text-xl mb-4">Property not found</div>
          <button
            onClick={() => navigate("/admin/properties")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 bg-[#0A1330] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8 mt-2">
          <button
            onClick={() => navigate("/admin/properties")}
            className="p-3 bg-[#121B36] rounded-xl border border-[#FFFFFF0D] hover:bg-[#1C244D] transition-all self-start shadow-lg"
          >
            <FaArrowLeft className="text-[#14F195]" size={14} />
          </button>

          <div className="flex-1 flex flex-col gap-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{property.name}</h1>
            <p className="text-[#AEB9E1] text-xs font-bold uppercase tracking-widest opacity-60">Property Management</p>
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => navigate(`/admin/properties/edit/${id}`)}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Core Info Card */}
            <div className="bg-[#121B36] rounded-[32px] p-6 sm:p-8 border border-[#FFFFFF0D] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#9945FF] to-[#14F195] opacity-5 blur-3xl"></div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg">
                  <FaHome className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight">Identity</h2>
                  <p className="text-[#AEB9E1] text-xs font-medium opacity-60">Basic information & status</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest">Listing Name</label>
                  <div className="text-white font-bold text-xl tracking-tight">{property.name}</div>
                </div>

                <div className="space-y-1">
                  <label className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest">Current Status</label>
                  <div>
                    <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider ${property.status === "active"
                      ? "bg-[#14F19520] text-[#14F195] border border-[#14F19540]"
                      : property.status === "inactive"
                        ? "bg-[#FF4B5520] text-[#FF4B55] border border-[#FF4B5540]"
                        : "bg-[#F7B91C20] text-[#F7B91C] border border-[#F7B91C40]"
                      }`}>
                      {property.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#FFFFFF0D]">
                <label className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest block mb-2">Location Address</label>
                <div className="flex items-start gap-3 text-white">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <FaMapMarkerAlt className="text-blue-400" size={14} />
                  </div>
                  <span className="font-medium text-sm leading-relaxed">{property.address}</span>
                </div>
              </div>

              {property.description && (
                <div className="mt-8">
                  <label className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest block mb-2">Description</label>
                  <div className="text-[#AEB9E1] bg-[#171D41] rounded-[24px] p-5 border border-[#FFFFFF0D] text-sm leading-relaxed italic">
                    "{property.description}"
                  </div>
                </div>
              )}
            </div>

            {/* Units & Pricing Card */}
            <div className="bg-[#121B36] rounded-[32px] p-6 sm:p-8 border border-[#FFFFFF0D] shadow-2xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                  <FaBed className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight">Units & Pricing</h2>
                  <p className="text-[#AEB9E1] text-xs font-medium opacity-60">Room distribution and nightly rates</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.roomTypes.map((room, index) => (
                  <div key={index} className="bg-[#171D41] rounded-[24px] p-5 border border-[#FFFFFF0D] group hover:border-[#FFFFFF1A] transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-base font-bold text-white capitalize">{room.type} Room</h3>
                      <div className="bg-[#14F19520] text-[#14F195] px-3 py-1.5 rounded-xl text-sm font-bold border border-[#14F19530]">
                        ${room.price}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#0A1330] rounded-xl p-3 border border-[#FFFFFF05]">
                        <p className="text-[#AEB9E1]/40 text-[9px] font-bold uppercase mb-1 tracking-tight">Total Capacity</p>
                        <p className="text-white font-bold text-sm">{room.count} Rooms</p>
                      </div>
                      <div className="bg-[#0A1330] rounded-xl p-3 border border-[#FFFFFF05]">
                        <p className="text-[#14F195]/40 text-[9px] font-bold uppercase mb-1 tracking-tight">Available</p>
                        <p className="text-[#14F195] font-bold text-sm">{room.available || room.count} Rooms</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[#FFFFFF0D] grid grid-cols-2 gap-4">
                <div className="text-center bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10">
                  <p className="text-blue-400 text-[10px] font-bold uppercase mb-1">Portfolio Total</p>
                  <p className="text-white text-2xl font-bold tracking-tighter">{property.totalRooms}</p>
                  <p className="text-[#AEB9E1] text-[9px] font-medium opacity-40">Total Rooms Registered</p>
                </div>
                <div className="text-center bg-green-500/5 p-4 rounded-2xl border border-green-500/10">
                  <p className="text-green-400 text-[10px] font-bold uppercase mb-1">Ready to Book</p>
                  <p className="text-white text-2xl font-bold tracking-tighter">{property.availableRooms || property.totalRooms}</p>
                  <p className="text-[#AEB9E1] text-[9px] font-medium opacity-40">Currently Available</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1 space-y-6">

            {/* Contact Details Card */}
            <div className="bg-[#121B36] rounded-[32px] p-6 sm:p-8 border border-[#FFFFFF0D] shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 blur-3xl rounded-full"></div>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <FaEnvelope className="text-[#14F195]" size={16} />
                Contact Info
              </h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest ml-1">Official Email</label>
                  <div className="text-white bg-[#171D41] rounded-2xl p-4 border border-[#FFFFFF0D] text-sm font-bold truncate">
                    {property.contactEmail}
                  </div>
                </div>

                {property.contactPhone && (
                  <div className="space-y-2">
                    <label className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest ml-1">Direct Phone</label>
                    <div className="text-white bg-[#171D41] rounded-2xl p-4 border border-[#FFFFFF0D] text-sm font-bold">
                      {property.contactPhone}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Policy & Times Card */}
            <div className="bg-[#121B36] rounded-[32px] p-6 sm:p-8 border border-[#FFFFFF0D] shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 blur-3xl rounded-full"></div>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <FaClock className="text-[#F7B91C]" size={16} />
                Timing Policy
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest text-center block">Check In</label>
                  <div className="text-white bg-[#171D41] rounded-2xl p-4 border border-[#FFFFFF0D] text-center font-bold text-sm">
                    {property.checkInTime}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest text-center block">Check Out</label>
                  <div className="text-white bg-[#171D41] rounded-2xl p-4 border border-[#FFFFFF0D] text-center font-bold text-sm">
                    {property.checkOutTime}
                  </div>
                </div>
              </div>
            </div>

            {/* Features Card */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-[#121B36] rounded-[32px] p-6 sm:p-8 border border-[#FFFFFF0D] shadow-2xl relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl rounded-full"></div>
                <h3 className="text-lg font-bold text-white mb-6">Key Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span key={index} className="bg-[#171D41] text-[#AEB9E1] px-4 py-2 rounded-xl text-xs font-bold border border-[#FFFFFF0D] hover:bg-[#1C244D] transition-all cursor-default">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
