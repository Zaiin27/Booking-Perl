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

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

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
