import React from "react";
import { Link } from "react-router-dom";
import BackgroundImg from "../../assets/images/herobg.png";

const PhilanthropyHero = () => {
  return (
    <section
      className="relative overflow-hidden min-h-[80vh] bg-cover bg-center pt-48 pb-10"
      style={{ backgroundImage: `url(${BackgroundImg})` }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Abstract fork and knife graphic */}
        <div className="absolute top-20 right-10 w-96 h-96 opacity-10"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-6 lg:space-y-8">
            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-[50px] font-inter font-extrabold text-white md:leading-tight">
              <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
                Giving Back{" "}
              </span>
              Together.
            </h1>

            {/* Sub-text */}
            <p className="text-lg lg:text-[20px] text-white/90 font-poppins leading-relaxed max-w-xl">
              Every 20 meals made with $FORK equals 200 meals donated to those
              in need.
            </p>

            {/* Breadcrumb Navigation */}
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center relative">
                <Link
                  to="/"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  Home
                </Link>
                <span className="text-white/60 mx-2">/</span>
                <span className="text-white">Philanthropy</span>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0071BC]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhilanthropyHero;
