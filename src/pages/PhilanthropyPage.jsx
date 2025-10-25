import React from "react";
import {
  PhilanthropySection,
  PhilanthropyHero,
  ForkwardImpact,
  GivingBack,
  OurMission,
} from "../components/philanthropy";

const PhilanthropyPage = () => {
  return (
    <>
      {/* Hero Section */}
      <PhilanthropyHero />

      {/* Forkward Impact Section */}
      <ForkwardImpact />

      {/* Giving Back Section */}
      <GivingBack />

      {/* Philanthropy Section */}
      <PhilanthropySection />

      {/* Our Mission Section */}
      <OurMission />
    </>
  );
};

export default PhilanthropyPage;
