import React from "react";
import { ReviewsSection } from "../components/homePage";
import Header from "../components/Header";

const ReviewsPage = () => {
  return (
    <>
      {/* Review Hero */}
      <section className="relative overflow-hidden min-h-[40vh] flex items-center pt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-booking-blue via-booking-blue/90 to-booking-blue-light animate-gradient-xy"></div>
        <div className="custom-container relative z-10 text-center py-20">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full mx-auto">
              <span className="flex h-2 w-2 rounded-full bg-yellow-400"></span>
              <span className="text-white text-xs font-semibold tracking-wider uppercase">Guest Experiences</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-inter font-bold text-white leading-tight">
              What our <span className="text-yellow-400">Guests</span> say <br />
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                about their stay.
              </span>
            </h1>
            <p className="text-lg text-white/80 font-poppins max-w-xl mx-auto leading-relaxed">
              Real feedback from real guests who have experienced our premium services across the globe.
            </p>
          </div>
        </div>
        {/* Geometric Decorators */}
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-booking-blue-light/20 blur-[100px] rounded-full"></div>
      </section>

      <div className="min-h-screen bg-white">
        {/* Reviews Section */}
        <ReviewsSection />
      </div>
    </>
  );
};

export default ReviewsPage;
