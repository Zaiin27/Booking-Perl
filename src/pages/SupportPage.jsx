import React from "react";
import { SupportHero, SupportSection } from "../components/supportPage";
import OfferSection from "../components/homePage/OfferSection";

const SupportPage = () => {
  return (
    <>
      {/* Hero Section */}
      <SupportHero />

      {/* FAQ Section */}
      <SupportSection />

      {/* Offer Section */}
      <OfferSection />
    </>
  );
};

export default SupportPage;
