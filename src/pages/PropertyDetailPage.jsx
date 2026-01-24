import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaBed,
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <div className="text-xl text-gray-900">Loading property details...</div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-gray-900 text-2xl mb-4">Property not found</div>
          <button
            onClick={() => navigate("/properties")}
            className="bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform"
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
    <div className="min-h-screen bg-white">
      {/* Header Navigation */}
      <div className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate("/properties")}
              className="p-2 sm:p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-300 hover:scale-110"
            >
              <FaArrowLeft className="text-gray-700 text-base sm:text-lg" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 flex-wrap">
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                <span>/</span>
                <Link to="/properties" className="hover:text-primary transition-colors">Properties</Link>
                <span>/</span>
                <span className="text-gray-900 truncate">{property.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          {photos.length > 0 ? (
            <div className="relative group">
              {/* Main Image */}
              <div 
                className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg cursor-pointer"
                onClick={() => openImageModal(currentImageIndex)}
              >
                <img
                  src={photos[currentImageIndex]}
                  alt={`${property.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); handlePreviousImage(); }}
                      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/90 hover:bg-white backdrop-blur-md rounded-full transition-all duration-300 hover:scale-110"
                      aria-label="Previous image"
                    >
                      <FaChevronLeft className="text-gray-900 text-base sm:text-xl" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-white/90 hover:bg-white backdrop-blur-md rounded-full transition-all duration-300 hover:scale-110"
                      aria-label="Next image"
                    >
                      <FaChevronRight className="text-gray-900 text-base sm:text-xl" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                {hasMultipleImages && (
                  <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1.5 sm:py-2 bg-black/70 backdrop-blur-md rounded-full text-white text-xs sm:text-sm">
                    {currentImageIndex + 1} / {photos.length}
                  </div>
                )}

                {/* Property Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2 drop-shadow-2xl">
                    {property.name}
                  </h1>
                  <div className="flex items-center gap-2 text-white text-sm sm:text-base md:text-lg">
                    <FaMapMarkerAlt className="text-green-400 flex-shrink-0" />
                    <span className="truncate">{property.address}</span>
                  </div>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {hasMultipleImages && photos.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-3 mt-3 sm:mt-4">
                  {photos.slice(0, 6).map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-16 sm:h-20 md:h-24 lg:h-32 rounded-lg overflow-hidden transition-all duration-300 ${
                        currentImageIndex === index
                          ? "ring-2 sm:ring-4 ring-primary scale-105"
                          : "opacity-70 hover:opacity-100 hover:scale-105"
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {currentImageIndex === index && (
                        <div className="absolute inset-0 bg-primary/30"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="relative h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-gradient-to-r from-primary to-primary-600 flex items-center justify-center">
              <div className="text-white text-6xl sm:text-8xl">🏨</div>
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-2">
                  {property.name}
                </h1>
                <div className="flex items-center gap-2 text-white text-sm sm:text-base md:text-lg">
                  <FaMapMarkerAlt className="text-white flex-shrink-0" />
                  <span className="truncate">{property.address}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 md:space-y-8">
            {/* Description */}
            {property.description && (
              <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">About This Property</h2>
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg">{property.description}</p>
              </div>
            )}

            {/* Room Types */}
            <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <FaBed className="text-primary" />
                Room Types & Availability
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                {property.roomTypes?.map((room, index) => {
                  const availability = getRoomAvailability(room);
                  const isAvailable = availability.available > 0;
                  
                  return (
                    <div
                      key={index}
                      className={`p-4 sm:p-5 rounded-lg sm:rounded-xl border transition-all duration-300 ${
                        isAvailable
                          ? "bg-green-50 border-green-200 hover:border-green-300"
                          : "bg-red-50 border-red-200 opacity-75"
                      }`}
                    >
                      <div className="flex flex-col gap-3 sm:gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <FaBed className={`text-xl sm:text-2xl ${isAvailable ? "text-green-600" : "text-red-600"}`} />
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 capitalize">{room.type} Room</h3>
                            {isAvailable && (
                              <span className="px-2 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                <FaCheckCircle className="text-xs" /> Available
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-2 sm:mt-3">
                            <div>
                              <p className="text-gray-600 text-xs sm:text-sm">Total Rooms</p>
                              <p className="text-gray-900 font-semibold text-sm sm:text-base">{availability.total}</p>
                            </div>
                            <div>
                              <p className="text-gray-600 text-xs sm:text-sm">Available</p>
                              <p className={`font-semibold text-sm sm:text-base ${isAvailable ? "text-green-600" : "text-red-600"}`}>
                                {availability.available}
                              </p>
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                              <p className="text-gray-600 text-xs sm:text-sm">Price/Night</p>
                              <p className="text-gray-900 font-semibold text-sm sm:text-base flex items-center gap-1">
                                <span className="text-primary">Rs</span>
                                {formatCurrency(room.price)}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {availability.booked > 0 && (
                          <div className="text-left sm:text-center md:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200 sm:border-0">
                            <p className="text-gray-600 text-xs sm:text-sm">Currently Booked</p>
                            <p className="text-gray-900 font-semibold text-sm sm:text-base">{availability.booked}</p>
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
              <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {property.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 sm:p-3 bg-white rounded-lg border border-gray-200 hover:border-primary transition-all duration-300"
                    >
                      <FaCheckCircle className="text-green-600 text-sm sm:text-base flex-shrink-0" />
                      <span className="text-gray-700 text-xs sm:text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Contact Information</h2>
              <div className="space-y-2 sm:space-y-3">
                {property.contactEmail && (
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg">
                    <FaEnvelope className="text-primary text-base sm:text-xl flex-shrink-0" />
                    <a
                      href={`mailto:${property.contactEmail}`}
                      className="text-gray-700 hover:text-primary transition-colors text-sm sm:text-base break-all"
                    >
                      {property.contactEmail}
                    </a>
                  </div>
                )}
                {property.contactPhone && (
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg">
                    <FaPhone className="text-primary text-base sm:text-xl flex-shrink-0" />
                    <a
                      href={`tel:${property.contactPhone}`}
                      className="text-gray-700 hover:text-primary transition-colors text-sm sm:text-base"
                    >
                      {property.contactPhone}
                    </a>
                  </div>
                )}
                {property.checkInTime && property.checkOutTime && (
                  <div className="flex items-start sm:items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white rounded-lg">
                    <FaClock className="text-primary text-base sm:text-xl flex-shrink-0 mt-0.5 sm:mt-0" />
                    <span className="text-gray-700 text-xs sm:text-sm">
                      <span className="block sm:inline">Check-in: {property.checkInTime}</span>
                      <span className="hidden sm:inline"> | </span>
                      <span className="block sm:inline">Check-out: {property.checkOutTime}</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 lg:top-24 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-lg">
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <FaStar className="text-yellow-500" />
                  <span className="text-gray-900 font-semibold text-base sm:text-lg">Quick Booking</span>
                </div>
                
                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 text-sm sm:text-base">Total Rooms</span>
                    <span className="text-gray-900 font-semibold text-sm sm:text-base">
                      {property.roomTypes?.reduce((sum, room) => sum + room.count, 0) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 text-sm sm:text-base">Available Now</span>
                    <span className="text-green-600 font-semibold text-sm sm:text-base">{totalAvailable}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 sm:pt-4">
                    <p className="text-gray-600 text-xs sm:text-sm mb-2">Starting from</p>
                    {property.roomTypes?.length > 0 && (
                      <p className="text-2xl sm:text-3xl font-bold text-primary">
                        {formatCurrency(Math.min(...property.roomTypes.map(r => r.price)))}
                        <span className="text-gray-600 text-base sm:text-lg font-normal">/night</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleBookNow}
                disabled={totalAvailable === 0}
                className={`w-full py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 ${
                  totalAvailable === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-primary hover:bg-primary-600 text-white hover:scale-105 hover:shadow-lg"
                }`}
              >
                {totalAvailable === 0 ? "Fully Booked" : "Book Now"}
              </button>

              {totalAvailable === 0 && (
                <p className="text-center text-gray-600 text-xs sm:text-sm mt-3">
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
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 sm:p-4"
          onClick={closeImageModal}
        >
          <button
            onClick={closeImageModal}
            className="absolute top-2 sm:top-4 right-2 sm:right-4 p-2 sm:p-3 bg-white/90 hover:bg-white rounded-full transition-all z-50"
          >
            <FaTimes className="text-gray-900 text-lg sm:text-xl" />
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
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-white/90 hover:bg-white backdrop-blur-md rounded-full transition-all hover:scale-110"
                >
                  <FaChevronLeft className="text-gray-900 text-xl sm:text-2xl" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-white/90 hover:bg-white backdrop-blur-md rounded-full transition-all hover:scale-110"
                >
                  <FaChevronRight className="text-gray-900 text-xl sm:text-2xl" />
                </button>
                <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 px-3 sm:px-4 py-1.5 sm:py-2 bg-black/70 backdrop-blur-md rounded-full text-white text-xs sm:text-sm">
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
