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
    <main className="w-full overflow-x-hidden">
      {/* Banner Ads Carousel with Search Section */}
      <div className="relative w-full">
        <BannerAdsCarousel />
        {/* Fixed Search Section - Overlapping image with responsive positioning */}
        <div className="absolute bottom-0 left-0 right-0 z-20 transform translate-y-1/2 sm:translate-y-2/5 md:translate-y-1/3 lg:translate-y-1/3">
          <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
            <BookingSearchSection />
          </div>
        </div>
      </div>

      {/* Spacer to prevent content overlap with search section */}
      {/* <div className="h-40 sm:h-44 md:h-48 lg:h-56 xl:h-64"></div> */}

      {/* Discover Section */}
      <section className="w-full">
        <DiscoverSection />
      </section>

      {/* Trending Destinations Section */}
      <section className="w-full">
        <TrendingDestinationsSection />
      </section>

      {/* Offer Section */}
      <section className="w-full">
        <OfferSection />
      </section>
    </main>
  );
};  

export default HomePage;
