import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";
import { FaBed, FaMapMarkerAlt, FaDollarSign, FaArrowRight, FaStar, FaSearch } from "react-icons/fa";

const PropertiesListPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch properties
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = {
        status: "active",
        search: searchTerm,
        limit: 50,
      };

      const response = await axios.get("/api/v1/properties", { params });
      
      if (response.data.success) {
        setProperties(response.data.data.properties);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [searchTerm]);

  const handleBookNow = (propertyId) => {
    navigate(`/booking/${propertyId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0F0F23] via-[#1A1A2E] to-[#16213E]">
        <div className="text-xl text-white">Loading properties...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F23] via-[#1A1A2E] to-[#16213E]">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[80vh] bg-cover bg-center pt-48 pb-10">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-96 h-96 opacity-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-6 lg:space-y-8">
              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-inter font-extrabold text-white md:leading-tight">
                <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
                  Find Your Perfect{" "}
                </span>
                Stay.
              </h1>

              {/* Sub-text */}
              <p className="text-lg lg:text-[20px] text-white/90 font-poppins leading-relaxed max-w-xl">
                Discover our collection of premium properties and book your dream accommodation.
              </p>

              {/* Breadcrumb Navigation */}
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center relative">
                  <Link
                    to="/"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                  <span className="text-white/60 mx-2">/</span>
                  <span className="text-white">Properties</span>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0071BC]"></div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="max-w-2xl mt-8">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by property name or location..."
                    className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#9945FF] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {properties.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-white/40 text-6xl mb-4">🏨</div>
            <h3 className="text-2xl font-semibold text-white mb-2">No Properties Found</h3>
            <p className="text-white/60">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div
                key={property._id}
                className="rounded-3xl p-3 border border-[#FFFFFF3B] w-full hover:scale-105 transition-all duration-300"
                style={{
                  background: "#FFFFFF33",
                  backdropFilter: "blur(1px)",
                  boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
                }}
              >
                <div className="relative bg-white backdrop-blur-md rounded-2xl overflow-hidden">
                  {/* Property Image */}
                  <div className="relative h-48 bg-gradient-to-r from-[#9945FF] to-[#14F195]">
                    {property.photos && property.photos[0] ? (
                      <img
                        src={property.photos[0]}
                        alt={property.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-white text-6xl">
                        🏨
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Available
                      </span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{property.name}</h3>
                    
                    <div className="flex items-start gap-2 text-gray-600 mb-4">
                      <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                      <p className="text-sm">{property.address}</p>
                    </div>

                    {property.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {property.description}
                      </p>
                    )}

                    {/* Room Types */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Available Rooms:</h4>
                      <div className="flex flex-wrap gap-2">
                        {property.roomTypes.map((room, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-r from-[#9945FF]/10 to-[#14F195]/10 px-3 py-2 rounded-lg text-sm border border-[#9945FF]/20"
                          >
                            <div className="flex items-center gap-2">
                              <FaBed className="text-[#9945FF]" />
                              <span className="font-medium capitalize text-gray-700">{room.type}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[#9945FF] font-bold mt-1">
                              <FaDollarSign size={12} />
                              <span>{room.price}/night</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-center mb-4 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <p className="text-gray-500 text-xs">Total Rooms</p>
                        <p className="text-lg font-bold text-gray-800">{property.totalRooms}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500 text-xs">Available</p>
                        <p className="text-lg font-bold text-green-600">
                          {property.availableRooms}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500 text-xs">Check-in</p>
                        <p className="text-lg font-bold text-gray-800">{property.checkInTime}</p>
                      </div>
                    </div>

                    {/* Book Now Button */}
                    <button
                      onClick={() => handleBookNow(property._id)}
                      disabled={property.availableRooms === 0}
                      className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                        property.availableRooms === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white hover:scale-105 transform"
                      }`}
                    >
                      {property.availableRooms === 0 ? (
                        "Fully Booked"
                      ) : (
                        <>
                          Book Now
                          <FaArrowRight />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesListPage;

