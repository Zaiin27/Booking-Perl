import React from "react";
import { FaqSection, FaqHero } from "../components/faqPage";
import OfferSection from "../components/homePage/OfferSection";

const FAQPage = () => {
  return (
    <>
      {/* Hero Section */}
      <FaqHero />

      {/* FAQ Section */}
      <FaqSection />

      {/* Offer Section */}
      <OfferSection />
    </>
  );
};

export default FAQPage;
