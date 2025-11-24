import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";
import { FaBed, FaMapMarkerAlt, FaDollarSign, FaArrowRight, FaStar, FaSearch, FaClock, FaUsers } from "react-icons/fa";
import PlanBadges from "../components/PlanBadges";

const PropertiesListPage = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch real-time availability for a property (with timeout)
  const fetchPropertyAvailability = async (propertyId) => {
    try {
      const response = await axios.get(`/api/v1/properties/${propertyId}/availability`, {
        timeout: 5000 // 5 second timeout per property
      });
      return response.data.success ? response.data.data : null;
    } catch (error) {
      // Silently fail - don't block the UI if availability fetch fails
      // This allows properties to show even if some availability data fails to load
      return null;
    }
  };

  // Fetch properties with real-time availability (optimized)
  const fetchProperties = async () => {
    try {
      setLoading(true);
      const params = {
        status: "active",
        search: searchTerm,
        limit: 10,
      };

      // Fetch with timeout configuration
      const response = await axios.get("/api/v1/properties", { 
        params,
        timeout: 15000 // 15 second timeout
      });
      
      if (response.data.success) {
        const propertiesData = response.data.data.properties;
        
        // Show properties immediately (fast initial render)
        setProperties(propertiesData);
        
        // Fetch real-time availability in background (non-blocking)
        // Process in smaller batches to avoid overwhelming the server
        const batchSize = 5;
        for (let i = 0; i < propertiesData.length; i += batchSize) {
          const batch = propertiesData.slice(i, i + batchSize);
          
          // Process batch in parallel
          const availabilityPromises = batch.map(async (property) => {
            const availabilityData = await fetchPropertyAvailability(property._id);
            if (availabilityData) {
              return {
                propertyId: property._id,
                roomTypes: availabilityData.property.roomTypes,
                realTimeAvailability: availabilityData.availability
              };
            }
            return null;
          });
          
          const availabilityResults = await Promise.all(availabilityPromises);
          
          // Update properties state with availability data
          setProperties((prevProperties) => {
            return prevProperties.map((prop) => {
              const availabilityResult = availabilityResults.find(
                (result) => result && result.propertyId === prop._id
              );
              if (availabilityResult) {
                return {
                  ...prop,
                  roomTypes: availabilityResult.roomTypes,
                  realTimeAvailability: availabilityResult.realTimeAvailability
                };
              }
              return prop;
            });
          });
        }
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      
      // If it's a timeout, show a more specific message
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        toast.error("Request timed out. Please check your connection and try again.");
      } else {
        toast.error(error.response?.data?.message || "Failed to fetch properties");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [searchTerm]);

  const handleBookNow = (propertyId, e) => {
    e.stopPropagation(); // Prevent card click event
    navigate(`/booking/${propertyId}`);
  };

  const handlePropertyClick = (propertyId) => {
    navigate(`/properties/${propertyId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0F0F23] via-[#1A1A2E] to-[#16213E]">
        <div className="text-xl text-white">Loading properties...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-6 lg:space-y-8">
              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-inter font-extrabold text-white md:leading-tight">
                Find Your Perfect Stay.
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
                </div>
              </div>

              {/* Search Bar */}
              <div className="max-w-2xl mt-8">
                <div className="relative">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by property name or location..."
                    className="w-full pl-12 pr-6 py-4 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-md"
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
            <div className="text-gray-400 text-6xl mb-4">🏨</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Properties Found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div
                key={property._id}
                onClick={() => handlePropertyClick(property._id)}
                className="rounded-lg border border-gray-200 w-full hover:scale-105 transition-all duration-300 cursor-pointer bg-white shadow-md hover:shadow-xl"
              >
                <div className="relative bg-white rounded-lg overflow-hidden">
                  {/* Property Image */}
                  <div className="relative h-48 bg-gray-200">
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
                    <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                      <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Available
                      </span>
                      {property.isFeatured && (
                        <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <FaStar /> Featured
                        </span>
                      )}
                      {property.isPriority && (
                        <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Priority
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-2xl font-bold text-gray-800">{property.name}</h3>
                      <PlanBadges property={property} />
                    </div>
                    
                    <div className="flex items-start gap-2 text-gray-600 mb-4">
                      <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                      <p className="text-sm">{property.address}</p>
                    </div>

                    {property.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {property.description}
                      </p>
                    )}

                    {/* Room Types with Real-time Availability */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FaClock className="text-blue-500" />
                        Room Availability:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {property.roomTypes.map((room, index) => {
                          const availability = property.realTimeAvailability?.[room.type];
                          const isAvailable = availability ? availability.available > 0 : room.available > 0;
                          const availableCount = availability ? availability.available : room.available;
                          const bookedCount = availability ? availability.booked : (room.count - room.available);
                          
                          return (
                            <div
                              key={index}
                              className={`px-3 py-2 rounded-lg text-sm border transition-all duration-300 ${
                                isAvailable 
                                  ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:border-green-300" 
                                  : "bg-gradient-to-r from-red-50 to-pink-50 border-red-200"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <FaBed className={isAvailable ? "text-green-600" : "text-red-500"} />
                                <span className="font-medium capitalize text-gray-700">{room.type}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  isAvailable 
                                    ? "bg-green-100 text-green-700" 
                                    : "bg-red-100 text-red-700"
                                }`}>
                                  {availableCount} available
                                </span>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center gap-1 text-[#9945FF] font-bold">
                                  <FaDollarSign size={12} />
                                  <span>{room.price}/night</span>
                                </div>
                                {bookedCount > 0 && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <FaUsers size={10} />
                                    <span>{bookedCount} booked</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Real-time Stats */}
                    <div className="flex justify-between items-center mb-4 pt-4 border-t border-gray-200">
                      <div className="text-center">
                        <p className="text-gray-500 text-xs">Total Rooms</p>
                        <p className="text-lg font-bold text-gray-800">
                          {property.roomTypes.reduce((sum, room) => sum + room.count, 0)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500 text-xs">Available</p>
                        <p className="text-lg font-bold text-green-600">
                          {property.roomTypes.reduce((sum, room) => {
                            const availability = property.realTimeAvailability?.[room.type];
                            return sum + (availability ? availability.available : room.available);
                          }, 0)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500 text-xs">Booked</p>
                        <p className="text-lg font-bold text-red-600">
                          {property.roomTypes.reduce((sum, room) => {
                            const availability = property.realTimeAvailability?.[room.type];
                            return sum + (availability ? availability.booked : (room.count - room.available));
                          }, 0)}
                        </p>
                      </div>
                    </div>

                    {/* Book Now Button with Real-time Availability */}
                    <button
                      onClick={(e) => handleBookNow(property._id, e)}
                      disabled={(() => {
                        const totalAvailable = property.roomTypes.reduce((sum, room) => {
                          const availability = property.realTimeAvailability?.[room.type];
                          return sum + (availability ? availability.available : room.available);
                        }, 0);
                        return totalAvailable === 0;
                      })()}
                      className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                        (() => {
                          const totalAvailable = property.roomTypes.reduce((sum, room) => {
                            const availability = property.realTimeAvailability?.[room.type];
                            return sum + (availability ? availability.available : room.available);
                          }, 0);
                          return totalAvailable === 0;
                        })()
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-primary hover:bg-primary-600 text-white hover:scale-105 transform"
                      }`}
                    >
                      {(() => {
                        const totalAvailable = property.roomTypes.reduce((sum, room) => {
                          const availability = property.realTimeAvailability?.[room.type];
                          return sum + (availability ? availability.available : room.available);
                        }, 0);
                        return totalAvailable === 0 ? "Fully Booked" : (
                          <>
                            Book Now
                            <FaArrowRight />
                          </>
                        );
                      })()}
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

