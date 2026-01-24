import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";
import { FaBed, FaMapMarkerAlt, FaArrowRight, FaStar, FaSearch, FaClock, FaUsers } from "react-icons/fa";
import PlanBadges from "../components/PlanBadges";

const PropertiesListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize states from URL parameters
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  // Extract dates from URL
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";

  // Fetch real-time availability for a property (with timeout and dates)
  const fetchPropertyAvailability = async (propertyId) => {
    try {
      const params = {};
      if (checkIn) params.checkInDate = checkIn;
      if (checkOut) params.checkOutDate = checkOut;

      const response = await axios.get(`/api/v1/properties/${propertyId}/availability`, {
        params,
        timeout: 5000 // 5 second timeout per property
      });
      return response.data.success ? response.data.data : null;
    } catch (error) {
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

        // Show properties immediately
        setProperties(propertiesData);

        // Fetch real-time availability in background
        const batchSize = 5;
        for (let i = 0; i < propertiesData.length; i += batchSize) {
          const batch = propertiesData.slice(i, i + batchSize);

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
      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        toast.error("Request timed out. Please check your connection.");
      } else {
        toast.error(error.response?.data?.message || "Failed to fetch properties");
      }
    } finally {
      setLoading(false);
    }
  };

  // Effect to sync URL search param with searchTerm state
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams]);

  // Main fetch effect
  useEffect(() => {
    fetchProperties();
  }, [searchTerm, checkIn, checkOut]);

  const handleSearchInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    // Update URL as well to keep it in sync
    const newParams = new URLSearchParams(searchParams);
    if (val) newParams.set("search", val);
    else newParams.delete("search");
    setSearchParams(newParams);
  };

  const handleBookNow = (propertyId, e) => {
    e.stopPropagation(); // Prevent card click event

    // Pass current search params to booking page
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);

    const adults = searchParams.get("adults");
    const children = searchParams.get("children");
    const rooms = searchParams.get("rooms");

    if (adults) params.set("adults", adults);
    if (children) params.set("children", children);
    if (rooms) params.set("rooms", rooms);

    navigate(`/booking/${propertyId}${params.toString() ? '?' + params.toString() : ''}`);
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
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Cinematic Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-[#0A0F1E]">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>

        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            {/* Breadcrumb - Refined */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 animate-slide-up">
              <Link to="/" className="text-white/60 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">Home</Link>
              <span className="text-white/20">/</span>
              <span className="text-white text-xs font-bold uppercase tracking-widest">Properties</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-inter font-black text-white leading-tight animate-slide-up delay-100 tracking-tighter">
              Discover <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Elite Stays</span> <br className="hidden md:block" />
              Tailored for You.
            </h1>

            <p className="text-lg md:text-xl text-slate-400 font-poppins max-w-2xl animate-slide-up delay-200 leading-relaxed italic">
              Experience the pinnacle of hospitality across our curated collection of premium properties.
            </p>

            {/* Premium Integrated Search Dashboard */}
            <div className="w-full mt-12 animate-slide-up delay-300">
              <div className="bg-white/5 backdrop-blur-2xl p-2 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col md:flex-row items-center gap-2">
                <div className="flex-1 w-full relative group">
                  <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-blue-400 transition-colors" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    placeholder="Where would you like to stay?"
                    className="w-full pl-16 pr-8 py-5 bg-transparent text-white font-poppins placeholder:text-slate-500 outline-none rounded-3xl group-hover:bg-white/5 transition-all focus:bg-white/10"
                  />
                </div>
                <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
                <div className="w-full md:w-auto px-4">
                  <div className="flex items-center gap-4 text-slate-400 cursor-default">
                    <div className="flex flex-col items-start min-w-[100px]">
                      <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Status</span>
                      <span className="text-sm text-white font-bold">Verified</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => fetchProperties()}
                  className="w-full md:w-auto px-10 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-[1.5rem] shadow-xl shadow-blue-900/40 transition-all hover:scale-105 active:scale-95 uppercase tracking-tighter"
                >
                  Explore Now
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Properties Section */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-20">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 animate-slide-up">
          <div>
            <h2 className="text-3xl font-inter font-black text-[#0F172A] mb-2 tracking-tight">Available Residences</h2>
            <p className="text-slate-500 font-poppins text-sm italic">Showing {properties.length} curated premium properties</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm text-xs font-bold text-slate-600 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Live Availability
            </div>
          </div>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 animate-slide-up">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🏝️</div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">No properties matched your search</h3>
            <p className="text-slate-500 max-w-md mx-auto italic">Try adjusting your filters or search keywords to find your perfect stay.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {properties.map((property, idx) => {
              const totalAvailable = property.roomTypes.reduce((sum, room) => {
                const availability = property.realTimeAvailability?.[room.type];
                return sum + (availability ? availability.available : room.available);
              }, 0);

              const minPrice = Math.min(...property.roomTypes.map(r => r.price));

              return (
                <div
                  key={property._id}
                  onClick={() => handlePropertyClick(property._id)}
                  className={`group relative bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:border-blue-100 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] cursor-pointer animate-slide-up flex flex-col md:flex-row`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {/* Image Container */}
                  <div className="relative w-full md:w-[40%] h-72 md:h-auto overflow-hidden">
                    {property.photos && property.photos[0] ? (
                      <img
                        src={property.photos[0]}
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-4xl">🏨</div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                    {/* Top Badges */}
                    <div className="absolute top-6 left-6 md:right-6 md:left-auto flex flex-col gap-2 items-start md:items-end">
                      {property.isFeatured && (
                        <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1.5 shadow-xl">
                          <FaStar className="text-amber-400" /> Featured
                        </div>
                      )}
                      <PlanBadges property={property} />
                    </div>

                    {/* Price Overlay (Mobile) / Branding */}
                    <div className="absolute bottom-6 left-6 right-6 md:hidden">
                      <h3 className="text-xl font-inter font-black text-white leading-tight tracking-tight line-clamp-1 mb-1">{property.name}</h3>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300">
                        <FaMapMarkerAlt size={10} />
                        <span className="truncate">{property.address.split(',').pop()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details Container */}
                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <div className="hidden md:block">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-500 mb-1">
                          <FaMapMarkerAlt size={10} />
                          <span className="truncate">{property.address.split(',').pop()}</span>
                        </div>
                        <h3 className="text-2xl font-inter font-black text-[#0F172A] leading-tight tracking-tight line-clamp-1">{property.name}</h3>
                      </div>

                      <p className="text-slate-500 text-sm font-poppins line-clamp-2 italic leading-relaxed">
                        {property.description}
                      </p>

                      {/* Room Type Bubbles */}
                      <div className="flex flex-wrap gap-2">
                        {property.roomTypes.slice(0, 3).map((room, i) => (
                          <div key={i} className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2 group/room hover:bg-white hover:border-blue-200 transition-colors">
                            <span className="text-[10px] font-black text-slate-700 uppercase">{room.type}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Footer Stats & Action */}
                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 lg:gap-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Price Fr.</span>
                          <span className="text-lg font-black text-indigo-600 tracking-tighter">Rs {minPrice.toLocaleString()}</span>
                        </div>
                        <div className="w-[1px] h-8 bg-slate-100 hidden sm:block"></div>
                        <div className="flex-col hidden sm:flex">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Status</span>
                          <span className={`text-xs font-bold ${totalAvailable > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {totalAvailable > 0 ? 'Available' : 'Sold Out'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleBookNow(property._id, e)}
                        disabled={totalAvailable === 0}
                        className={`w-12 h-12 md:w-14 md:h-14 rounded-[1.2rem] flex items-center justify-center transition-all duration-300 flex-shrink-0 ${totalAvailable === 0
                          ? 'bg-slate-100 text-slate-300'
                          : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:scale-110 active:scale-95 hover:bg-blue-700'
                          }`}
                      >
                        <FaArrowRight />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesListPage;
