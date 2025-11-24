import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaBed,
  FaDollarSign,
  FaClock,
  FaEnvelope,
  FaPhone,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaUsers,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";

const PropertyDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [realTimeAvailability, setRealTimeAvailability] = useState(null);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  // Keyboard navigation for image modal
  useEffect(() => {
    if (!isImageModalOpen || !property) return;

    const photos = property.photos?.filter(photo => photo) || [];
    const photosLength = photos.length || 1;

    const handleKeyPress = (e) => {
      if (e.key === "ArrowLeft") {
        setCurrentImageIndex((prev) => 
          prev === 0 ? photosLength - 1 : prev - 1
        );
      } else if (e.key === "ArrowRight") {
        setCurrentImageIndex((prev) => 
          prev === photosLength - 1 ? 0 : prev + 1
        );
      } else if (e.key === "Escape") {
        setIsImageModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isImageModalOpen, property]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/properties/${id}`);
      
      if (response.data.success) {
        const propertyData = response.data.data;
        setProperty(propertyData);
        
        // Fetch real-time availability
        try {
          const availabilityResponse = await axios.get(
            `/api/v1/properties/${id}/availability`,
            { timeout: 5000 }
          );
          if (availabilityResponse.data.success) {
            setRealTimeAvailability(availabilityResponse.data.data);
          }
        } catch (error) {
          console.error("Error fetching availability:", error);
          // Silently fail - availability is optional
        }
      }
    } catch (error) {
      console.error("Error fetching property:", error);
      toast.error(error.response?.data?.message || "Failed to fetch property details");
      navigate("/properties");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    
    const currency = property?.currency || "USD";
    
    if (currency === "PKR" || currency === "Rs" || currency === "RS" || currency === "pkr") {
      const formattedAmount = new Intl.NumberFormat("en-PK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
      return `Rs ${formattedAmount}`;
    }
    
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (property.photos?.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === (property.photos?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const openImageModal = (index) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const handleBookNow = () => {
    navigate(`/booking/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0F0F23] via-[#1A1A2E] to-[#16213E]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#9945FF] mx-auto mb-4"></div>
          <div className="text-xl text-white">Loading property details...</div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0F0F23] via-[#1A1A2E] to-[#16213E]">
        <div className="text-center">
          <div className="text-white text-2xl mb-4">Property not found</div>
          <button
            onClick={() => navigate("/properties")}
            className="bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const photos = property.photos?.filter(photo => photo) || [];
  const hasMultipleImages = photos.length > 1;

  // Calculate availability data
  const getRoomAvailability = (roomType) => {
    if (realTimeAvailability?.availability?.[roomType.type]) {
      return realTimeAvailability.availability[roomType.type];
    }
    return {
      total: roomType.count,
      available: roomType.available || roomType.count,
      booked: (roomType.count - (roomType.available || 0)),
    };
  };

  const totalAvailable = property.roomTypes?.reduce((sum, room) => {
    const availability = getRoomAvailability(room);
    return sum + availability.available;
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0F23] via-[#1A1A2E] to-[#16213E]">
      {/* Header Navigation */}
      <div className="sticky top-0 z-40 bg-[#0F0F23]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/properties")}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 hover:scale-110"
            >
              <FaArrowLeft className="text-white text-lg" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-white/80">
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link to="/properties" className="hover:text-white transition-colors">Properties</Link>
                <span>/</span>
                <span className="text-white">{property.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {photos.length > 0 ? (
            <div className="relative group">
              {/* Main Image */}
              <div 
                className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
                onClick={() => openImageModal(currentImageIndex)}
              >
                <img
                  src={photos[currentImageIndex]}
                  alt={`${property.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={handlePreviousImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                      aria-label="Previous image"
                    >
                      <FaChevronLeft className="text-white text-xl" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                      aria-label="Next image"
                    >
                      <FaChevronRight className="text-white text-xl" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {hasMultipleImages && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-sm">
                    {currentImageIndex + 1} / {photos.length}
                  </div>
                )}

                {/* Property Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 drop-shadow-2xl">
                    {property.name}
                  </h1>
                  <div className="flex items-center gap-2 text-white/90">
                    <FaMapMarkerAlt className="text-[#14F195]" />
                    <span className="text-lg">{property.address}</span>
                  </div>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {hasMultipleImages && photos.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mt-4">
                  {photos.slice(0, 6).map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-24 md:h-32 rounded-lg overflow-hidden transition-all duration-300 ${
                        currentImageIndex === index
                          ? "ring-4 ring-[#9945FF] scale-105"
                          : "opacity-70 hover:opacity-100 hover:scale-105"
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {currentImageIndex === index && (
                        <div className="absolute inset-0 bg-[#9945FF]/30"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-r from-[#9945FF] to-[#14F195] flex items-center justify-center">
              <div className="text-white text-8xl">🏨</div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                  {property.name}
                </h1>
                <div className="flex items-center gap-2 text-white/90">
                  <FaMapMarkerAlt className="text-white" />
                  <span className="text-lg">{property.address}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {property.description && (
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4">About This Property</h2>
                <p className="text-white/80 leading-relaxed text-lg">{property.description}</p>
              </div>
            )}

            {/* Room Types */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <FaBed className="text-[#9945FF]" />
                Room Types & Availability
              </h2>
              
              <div className="space-y-4">
                {property.roomTypes?.map((room, index) => {
                  const availability = getRoomAvailability(room);
                  const isAvailable = availability.available > 0;
                  
                  return (
                    <div
                      key={index}
                      className={`p-5 rounded-xl border transition-all duration-300 ${
                        isAvailable
                          ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 hover:border-green-500/50"
                          : "bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/30 opacity-75"
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <FaBed className={`text-2xl ${isAvailable ? "text-green-400" : "text-red-400"}`} />
                            <h3 className="text-xl font-bold text-white capitalize">{room.type} Room</h3>
                            {isAvailable && (
                              <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold flex items-center gap-1">
                                <FaCheckCircle /> Available
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                            <div>
                              <p className="text-white/60 text-sm">Total Rooms</p>
                              <p className="text-white font-semibold">{availability.total}</p>
                            </div>
                            <div>
                              <p className="text-white/60 text-sm">Available</p>
                              <p className={`font-semibold ${isAvailable ? "text-green-400" : "text-red-400"}`}>
                                {availability.available}
                              </p>
                            </div>
                            <div>
                              <p className="text-white/60 text-sm">Price/Night</p>
                              <p className="text-white font-semibold flex items-center gap-1">
                                <FaDollarSign className="text-[#14F195]" />
                                {formatCurrency(room.price)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {availability.booked > 0 && (
                          <div className="text-center md:text-right">
                            <p className="text-white/60 text-sm">Currently Booked</p>
                            <p className="text-white font-semibold">{availability.booked}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
                <h2 className="text-2xl font-bold text-white mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10 hover:border-[#9945FF]/50 transition-all duration-300"
                    >
                      <FaCheckCircle className="text-[#14F195]" />
                      <span className="text-white/90">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
              <div className="space-y-3">
                {property.contactEmail && (
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <FaEnvelope className="text-[#9945FF] text-xl" />
                    <a
                      href={`mailto:${property.contactEmail}`}
                      className="text-white/90 hover:text-white transition-colors"
                    >
                      {property.contactEmail}
                    </a>
                  </div>
                )}
                {property.contactPhone && (
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <FaPhone className="text-[#9945FF] text-xl" />
                    <a
                      href={`tel:${property.contactPhone}`}
                      className="text-white/90 hover:text-white transition-colors"
                    >
                      {property.contactPhone}
                    </a>
                  </div>
                )}
                {property.checkInTime && property.checkOutTime && (
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <FaClock className="text-[#9945FF] text-xl" />
                    <span className="text-white/90">
                      Check-in: {property.checkInTime} | Check-out: {property.checkOutTime}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <FaStar className="text-yellow-400" />
                  <span className="text-white font-semibold">Quick Booking</span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/70">Total Rooms</span>
                    <span className="text-white font-semibold">
                      {property.roomTypes?.reduce((sum, room) => sum + room.count, 0) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-white/70">Available Now</span>
                    <span className="text-green-400 font-semibold">{totalAvailable}</span>
                  </div>
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-white/60 text-sm mb-2">Starting from</p>
                    {property.roomTypes?.length > 0 && (
                      <p className="text-3xl font-bold bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
                        {formatCurrency(Math.min(...property.roomTypes.map(r => r.price)))}
                        <span className="text-white/60 text-lg font-normal">/night</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                disabled={totalAvailable === 0}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  totalAvailable === 0
                    ? "bg-gray-500/50 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white hover:scale-105 hover:shadow-2xl hover:shadow-[#9945FF]/50"
                }`}
              >
                {totalAvailable === 0 ? "Fully Booked" : "Book Now"}
              </button>

              {totalAvailable === 0 && (
                <p className="text-center text-white/60 text-sm mt-3">
                  All rooms are currently booked
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && photos.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <button
            onClick={closeImageModal}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all z-50"
          >
            <FaTimes className="text-white text-xl" />
          </button>
          
          <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[currentImageIndex]}
              alt={`${property.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
            />
            
            {hasMultipleImages && (
              <>
                <button
                  onClick={handlePreviousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all hover:scale-110"
                >
                  <FaChevronLeft className="text-white text-2xl" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-all hover:scale-110"
                >
                  <FaChevronRight className="text-white text-2xl" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white">
                  {currentImageIndex + 1} / {photos.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;
