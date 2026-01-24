import React from "react";
import { Link } from "react-router-dom";
import BackgroundImg from "../../assets/images/herobg.png";

const FaqHero = () => {
  return (
    <section className="relative overflow-hidden min-h-[50vh] flex items-center pt-20">
      {/* Background with Premium Gradient Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
        style={{
          backgroundImage: `url(${BackgroundImg})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-booking-blue via-booking-blue/80 to-transparent"></div>
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="custom-container relative z-10 py-20">
        <div className="max-w-3xl space-y-8 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
            <span className="flex h-2 w-2 rounded-full bg-booking-blue-light animate-pulse"></span>
            <span className="text-white text-xs font-semibold tracking-wider uppercase">Help Center</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-inter font-bold text-white leading-tight">
              How can we <br />
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                help you today?
              </span>
            </h1>
            <p className="text-lg text-white/80 font-poppins max-w-xl leading-relaxed">
              Find answers to all your questions about our premium hotel bookings, services, and policies.
            </p>
          </div>

          {/* Search Bar - Glassmorphism */}
          <div className="relative max-w-2xl group">
            <input
              type="text"
              placeholder="Search for questions (e.g. 'refund policy', 'check-in time')..."
              className="w-full bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/50 px-6 py-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-booking-blue-light transition-all duration-300 shadow-2xl group-hover:bg-white/15"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-booking-blue-light hover:bg-white text-white hover:text-booking-blue px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg">
              Search
            </button>
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center space-x-3 text-sm font-medium">
            <Link to="/" className="text-white/60 hover:text-white transition-colors">Home</Link>
            <span className="text-white/30">/</span>
            <span className="text-white">FAQ's</span>
          </nav>
        </div>
      </div>

      {/* Modern Decorator */}
      <div className="absolute bottom-0 right-0 w-1/3 h-full hidden lg:block opacity-20">
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-booking-blue-light blur-[120px] rounded-full"></div>
      </div>
    </section>
  );
};

export default FaqHero;
