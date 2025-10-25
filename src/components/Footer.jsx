import React from "react";
import { Link } from "react-router-dom";
import footerLogo from "/footerLogo.png";
import { FaDiscord, FaTwitter } from "react-icons/fa";
import { RiSendPlaneFill } from "react-icons/ri";
import { PiInstagramLogoFill } from "react-icons/pi";

const Footer = () => {
  return (
    <footer className="bg-[#060B27] border-t-[11px] border-[#343853] text-white relative overflow-hidden">
      <div className="relative z-10">
        {/* Top Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
            {/* Logo and Tagline */}
            <div className="flex-1">
              <div className="flex items-center mb-6">
                <h2 className="text-3xl font-bold text-white">
                  <span className="text-white">Booking</span>{" "}
                  <span className="text-yellow-400">Pearl</span>
                </h2>
              </div>
              <p className="text-white font-inter text-sm max-w-lg leading-relaxed">
                Experience luxury hospitality with premium accommodations and exceptional service at Booking Pearl.
              </p>

              {/* Social Media Icons */}
              <div className="flex items-center space-x-6 mt-8">
                <Link
                  to="#"
                  className="text-white hover:text-white/80 transition-colors"
                >
                  <RiSendPlaneFill className="w-6 h-6" />
                </Link>
                <Link
                  to="#"
                  className="text-white hover:text-white/80 transition-colors"
                >
                  <PiInstagramLogoFill className="w-6 h-6" />
                </Link>
                <Link
                  to="#"
                  className="text-white hover:text-white/80 transition-colors"
                >
                  <FaDiscord className="w-6 h-6" />
                </Link>
                <Link
                  to="#"
                  className="text-white hover:text-white/80 transition-colors"
                >
                  <FaTwitter className="w-6 h-6" />
                </Link>
              </div>
            </div>

            {/* Call to Action Button */}
            <div className="flex-shrink-0 flex md:self-end md:justify-end justify-center">
              <Link
                to="/properties"
                className="bg-gradient-primary text-white px-12 py-4 font-inter rounded-full font-bold text-md hover:shadow-xl transition-all duration-300 inline-block transform hover:scale-105"
              >
                START BOOKING
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div>
          <div className="max-w-7xl mx-auto px-4 border-t border-white/20 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Copyright */}
              <div className="text-white font-inter font-medium text-sm">
                © 2025 Booking Pearl. All rights reserved.
              </div>

              {/* Utility Links */}
              <div className="flex items-center justify-center gap-2 space-x-6 text-sm flex-wrap">
              
                <div className="flex items-center space-x-2 text-white">
                  <svg
                    width="16"
                    height="15"
                    viewBox="0 0 16 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                 
                  </svg>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
