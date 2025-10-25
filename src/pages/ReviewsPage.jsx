import React from "react";
import { ReviewsSection } from "../components/homePage";
import Header from "../components/Header";

const ReviewsPage = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        {/* Reviews Section */}
        <ReviewsSection />
      </div>
    </>
  );
};

export default ReviewsPage;
