import React from "react";
import {
  HeroSection,
  DiscoverSection,
  TrendingDestinationsSection,
  OrderWithFork,
  GivingBack,
  FaqSection,
  OfferSection,
  MediaGallery,
} from "../components/homePage";
import BannerAdsCarousel from "../components/homePage/BannerAdsCarousel";
import BookingSearchSection from "../components/homePage/BookingSearchSection";

const HomePage = () => {
  return (
    <>
      {/* Banner Ads Carousel with Search Section */}
      <div className="relative">
        <BannerAdsCarousel />
        {/* Fixed Search Section - Overlapping image */}
        <div className="absolute bottom-0 left-0 right-0 z-20 -mb-24 md:-mb-32 lg:-mb-40">
          <div className="bg-white">
            <BookingSearchSection />
          </div>
        </div>
      </div>

      {/* Discover Section */}
      <DiscoverSection />

      {/* Trending Destinations Section */}
      <TrendingDestinationsSection />


      {/* Offer Section */}
      <OfferSection />
    </>
  );
};  

export default HomePage;
