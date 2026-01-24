import React from "react";
import { Link } from "react-router-dom";
import BackgroundImg from "../../assets/images/herobg.png";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";

const SupportHero = () => {
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
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="custom-container relative z-10 py-20">
        <div className="max-w-3xl space-y-8 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
            <span className="flex h-2 w-2 rounded-full bg-booking-blue-light"></span>
            <span className="text-white text-xs font-semibold tracking-wider uppercase">Contact Services</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-inter font-bold text-white leading-tight">
              We're Here <br />
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                to assist you.
              </span>
            </h1>
            <p className="text-lg text-white/80 font-poppins max-w-xl leading-relaxed">
              Our professional support team is dedicated to providing you with the best hotel booking experience.
            </p>
          </div>

          {/* Quick Stats/Features */}
          <div className="flex flex-wrap gap-8 pt-4">
            <div className="flex items-center space-x-3 text-white">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <IoMdCheckmarkCircleOutline className="text-xl text-booking-blue-light" />
              </div>
              <span className="font-medium">24/7 Support</span>
            </div>
            <div className="flex items-center space-x-3 text-white">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <IoMdCheckmarkCircleOutline className="text-xl text-booking-blue-light" />
              </div>
              <span className="font-medium">Global Access</span>
            </div>
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center space-x-3 text-sm font-medium pt-4">
            <Link to="/" className="text-white/60 hover:text-white transition-colors">Home</Link>
            <span className="text-white/30">/</span>
            <span className="text-white">Support</span>
          </nav>
        </div>
      </div>

      {/* Modern Decorator */}
      <div className="absolute top-1/2 -right-20 w-80 h-80 bg-booking-blue-light/20 blur-[100px] rounded-full"></div>
    </section>
  );
};

export default SupportHero;
