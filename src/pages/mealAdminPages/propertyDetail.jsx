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
    <div className="p-3 sm:p-4 lg:p-6 bg-[#0A1330] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/admin/properties")}
            className="p-3 bg-[#171D41] rounded-lg hover:bg-[#2A2A3E] transition-colors border border-[#3A3A4E] self-start"
          >
            <FaArrowLeft className="text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{property.name}</h1>
            <p className="text-[#AEB9E1] mt-1 text-sm sm:text-base">Property Details</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/admin/properties/edit/${id}`)}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-yellow-700 hover:to-orange-700 transition"
            >
              <FaEdit />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-pink-700 transition"
            >
              <FaTrash />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-[#171D41] rounded-lg shadow-lg border border-[#3A3A4E] p-4 sm:p-6">
              <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                <FaHome className="text-blue-400" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#AEB9E1] mb-2">Property Name</label>
                  <div className="text-white font-medium">{property.name}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#AEB9E1] mb-2">Status</label>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    property.status === "active" 
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : property.status === "inactive"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                  }`}>
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-[#AEB9E1] mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-400" />
                  Address
                </label>
                <div className="text-white">{property.address}</div>
              </div>

              {property.description && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-[#AEB9E1] mb-2">Description</label>
                  <div className="text-[#AEB9E1] bg-[#2A2A3E] rounded-lg p-3 border border-[#3A3A4E]">
                    {property.description}
                  </div>
                </div>
              )}
            </div>

            {/* Room Types */}
            <div className="bg-[#171D41] rounded-lg shadow-lg border border-[#3A3A4E] p-4 sm:p-6">
              <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                <FaBed className="text-purple-400" />
                Room Types & Pricing
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.roomTypes.map((room, index) => (
                  <div key={index} className="bg-[#2A2A3E] rounded-lg p-4 border border-[#3A3A4E]">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-white capitalize">{room.type} Room</h3>
                      <span className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-purple-500/30">
                        ${room.price}/night
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-[#AEB9E1] mb-1">Total Count</label>
                        <span className="bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg text-sm font-semibold border border-blue-500/30">
                          {room.count}
                        </span>
                      </div>
                      <div>
                        <label className="block text-xs text-[#AEB9E1] mb-1">Available</label>
                        <span className="bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg text-sm font-semibold border border-green-500/30">
                          {room.available || room.count}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[#3A3A4E]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <label className="block text-sm text-[#AEB9E1] mb-2">Total Rooms</label>
                    <span className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg text-lg font-bold border border-blue-500/30">
                      {property.totalRooms}
                    </span>
                  </div>
                  <div className="text-center">
                    <label className="block text-sm text-[#AEB9E1] mb-2">Available Rooms</label>
                    <span className="bg-green-500/20 text-green-400 px-4 py-2 rounded-lg text-lg font-bold border border-green-500/30">
                      {property.availableRooms || property.totalRooms}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Information */}
            <div className="bg-[#171D41] rounded-lg shadow-lg border border-[#3A3A4E] p-4 sm:p-6">
              <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                <FaEnvelope className="text-green-400" />
                Contact Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#AEB9E1] mb-2 flex items-center gap-2">
                    <FaEnvelope className="text-green-400" />
                    Email
                  </label>
                  <div className="text-white bg-[#2A2A3E] rounded-lg p-3 border border-[#3A3A4E]">
                    {property.contactEmail}
                  </div>
                </div>
                
                {property.contactPhone && (
                  <div>
                    <label className="block text-sm font-medium text-[#AEB9E1] mb-2 flex items-center gap-2">
                      <FaPhone className="text-green-400" />
                      Phone
                    </label>
                    <div className="text-white bg-[#2A2A3E] rounded-lg p-3 border border-[#3A3A4E]">
                      {property.contactPhone}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Check-in/Check-out Times */}
            <div className="bg-[#171D41] rounded-lg shadow-lg border border-[#3A3A4E] p-4 sm:p-6">
              <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                <FaClock className="text-yellow-400" />
                Check-in/Check-out Times
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#AEB9E1] mb-2">Check-in Time</label>
                  <div className="text-white bg-[#2A2A3E] rounded-lg p-3 border border-[#3A3A4E] text-center">
                    {property.checkInTime}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#AEB9E1] mb-2">Check-out Time</label>
                  <div className="text-white bg-[#2A2A3E] rounded-lg p-3 border border-[#3A3A4E] text-center">
                    {property.checkOutTime}
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-[#171D41] rounded-lg shadow-lg border border-[#3A3A4E] p-4 sm:p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span key={index} className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 px-3 py-1.5 rounded-lg text-sm font-medium border border-blue-500/30">
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
