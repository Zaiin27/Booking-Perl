import React from "react";
import PrivacyHero from "../components/privacyPage/PrivacyHero";
import PrivacySection from "../components/privacyPage/PrivacySection";

const PrivacyPage = () => {
  return (
    <>
      {/* Hero Section */}
      <PrivacyHero />

      {/* Terms Section */}
      <PrivacySection />
    </>
  );
};

export default PrivacyPage;
