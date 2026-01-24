import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { FaArrowRight } from "react-icons/fa";

const BannerAdsCarousel = () => {
  const navigate = useNavigate();
  const [bannerAds, setBannerAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Default static banner image
  const defaultBannerImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&h=1080&fit=crop";

  useEffect(() => {
    fetchBannerAds();
  }, []);

  useEffect(() => {
    if (autoPlay && bannerAds.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % bannerAds.length);
      }, 5000); // Change slide every 5 seconds

      return () => clearInterval(interval);
    }
  }, [autoPlay, bannerAds.length]);

  const fetchBannerAds = async () => {
    try {
      const response = await axios.get("/api/v1/banner-ads");
      if (response.data.success) {
        console.log("Banner ads fetched:", response.data.data);
        setBannerAds(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching banner ads:", error);
      // Set empty array on error so component doesn't break
      setBannerAds([]);
    }
  };

  const handleDotClick = (index) => {
    setAutoPlay(false);
    setCurrentIndex(index);
  };

  const handleBookNow = async (ad) => {
    const propertyId = ad.property_id?._id || ad.property_id;
    const adId = ad._id || ad.id;
    
    if (!propertyId) {
      console.error("Property ID not found for ad:", ad);
      return;
    }

    // Track click if ad has an ID
    if (adId) {
      try {
        await axios.post(`/api/v1/banner-ads/${adId}/click`);
        console.log("Click tracked for banner ad:", adId);
      } catch (error) {
        console.error("Error tracking click:", error);
        // Don't block navigation if click tracking fails
      }
    }

    // Navigate to property page
    navigate(`/properties/${propertyId}`);
  };

  // Show static banner when no API data
  if (bannerAds.length === 0) {
    return (
      <div className="relative w-full h-[400px] sm:h-[450px] md:h-[550px] lg:h-[70vh] xl:h-[85vh] overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <img
            src={defaultBannerImage}
            alt="Booking Pearl"
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20"></div>
        </div>
      </div>
    );
  }

  const currentAd = bannerAds[currentIndex];

  return (
    <div className="relative w-full h-[400px] sm:h-[450px] md:h-[550px] lg:h-[70vh] xl:h-[85vh] overflow-hidden">
      {/* Carousel Container */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
        }}
      >
        {bannerAds.map((ad, index) => (
          <div
            key={ad._id || index}
            className="min-w-full h-full relative flex-shrink-0"
          >
            {/* Full Width Background Image */}
            <div className="absolute inset-0 w-full h-full">
              {ad.image ? (
                <img
                  src={ad.image}
                  alt={ad.title || "Banner"}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              ) : (
                <img
                  src={defaultBannerImage}
                  alt={ad.title || "Booking Pearl"}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              )}
              {/* Dark Overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20 sm:bg-black/40"></div>
            </div>

            {/* Content Overlay - Text and Button */}
            <div className="relative z-10 w-full h-full flex items-end sm:items-center px-4 sm:px-6 lg:px-8 pb-8 sm:pb-0 -mt-32 md:-mt-20 lg:-mt-0">
              <div className="container mx-auto w-full">
                <div className="max-w-2xl space-y-3 sm:space-y-4 md:space-y-6">
                  {/* Title */}
                  {ad.title && (
                    <div>
                      <h2 className="text-4xl sm:text-3xl  md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 text-white drop-shadow-lg">
                        {ad.title}
                      </h2>
                    </div>
                  )}

                  {/* Description */}
                  {ad.description && (
                    <p className="text-white/95 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed drop-shadow-md hidden sm:block">
                      {ad.description}
                    </p>
                  )}

                  {/* CTA Button - Only show when API data is available */}
                  {bannerAds.length > 0 && (
                    <div className="pt-2">
                      <button
                        onClick={() => handleBookNow(ad)}
                        className="group relative bg-primary hover:bg-primary-600 active:bg-primary-700 text-white px-4 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-lg font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 hover:scale-105 active:scale-100 hover:shadow-2xl flex items-center gap-2 sm:gap-3 border border-white/20  "
                      >
                        <span className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full flex items-center justify-center">
                          <FaArrowRight className="text-xs sm:text-sm" />
                        </span>
                        <span>{ad.ctaText || "Book Now"}</span>
                      </button>
                    </div>
                  )}

                  {/* Property Info (if available) */}
                  {ad.property_id && (
                    <div className="text-white/90 text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2 pt-1">
                      <span className="text-base sm:text-base">📍</span>
                      <p className="truncate drop-shadow-md">{ad.property_id.address || ad.property_id.name}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots Indicator */}
      {bannerAds.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {bannerAds.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-primary w-6 sm:w-8"
                  : "bg-white/40 hover:bg-white/60 w-2 sm:w-3"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerAdsCarousel;
