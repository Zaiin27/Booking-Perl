import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { auth } = useSelector((state) => state);
  
  // Check if user is logged in (simplified logic)
  const isLoggedIn = auth?.isAuthenticated && auth?.user;
  
 

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="relative z-50 bg-white shadow-md">
      {/* Navigation Bar Container */}
      <div className="relative flex justify-center py-4">
        {/* White Navigation Bar - Booking.com Style */}
        <div className="bg-white rounded-lg px-8 py-3 max-w-6xl w-full border-b border-gray-200">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-outfit font-bold text-primary">
                BOOKING <span className="text-primary-600">PEARL</span>
              </Link>
            </div>

            {/* Desktop Navigation - Moved to Right Side */}
            <div className="hidden lg:flex items-center space-x-8">
              <nav className="flex items-center space-x-8">
                <Link
                  to="/"
                  className={`font-poppins font-medium ${
                    isActive("/")
                      ? "text-primary font-semibold border-b-2 border-primary pb-1"
                      : "text-gray-700 font-medium hover:text-primary transition-colors"
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/properties"
                  className={`font-poppins font-medium ${
                    isActive("/properties")
                      ? "text-primary font-semibold border-b-2 border-primary pb-1"
                      : "text-gray-700 hover:text-primary transition-colors"
                  }`}
                >
                  Properties
                </Link>
                <Link
                  to="/booking-history"
                  className={`font-poppins font-medium ${
                    isActive("/booking-history")
                      ? "text-primary font-semibold border-b-2 border-primary pb-1"
                      : "text-gray-700 hover:text-primary transition-colors"
                  }`}
                >
                  My Bookings
                </Link>
                <Link
                  to="/faq"
                  className={`font-poppins font-medium ${
                    isActive("/faq")
                      ? "text-primary font-semibold border-b-2 border-primary pb-1"
                      : "text-gray-700 hover:text-primary transition-colors"
                  }`}
                >
                  FAQ
                </Link>
                <Link
                  to="/contact"
                  className={`font-poppins font-medium ${
                    isActive("/contact")
                      ? "text-primary font-semibold border-b-2 border-primary pb-1"
                      : "text-gray-700 hover:text-primary transition-colors"
                  }`}
                >
                  Support
                </Link>
                <Link
                  to="/reviews"
                  className="text-gray-700 font-poppins font-medium hover:text-primary transition-colors"
                >
                  Reviews
                </Link>
              </nav>

              {/* Profile Image/Action Buttons */}
              <div className="flex items-center space-x-5 ml-3">
                {/* Conditional Button - Sign In or User Profile */}
                {isLoggedIn ? (
                  /* User Icon Button - When Logged In */
                  <Link
                    to="/profile"
                    className="w-12 h-12 bg-primary rounded-full flex items-center justify-center hover:bg-primary-600 transition-all duration-300 transform hover:scale-105 shadow-md"
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </Link>
                ) : (
                  /* Sign In Button - When Not Logged In - Booking.com Style */
                  <Link
                    to="/login"
                    className="bg-primary hover:bg-primary-600 text-white px-6 py-2.5 rounded-md font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={toggleMenu} className="lg:hidden text-gray-700 hover:text-primary p-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-4 right-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl">
            <div className="px-6 py-6 space-y-4">
              <Link
                to="/"
                className={`block font-poppins py-2 ${
                  isActive("/")
                    ? "text-primary font-semibold"
                    : "text-gray-700 font-medium hover:text-primary"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/properties"
                className={`block font-poppins py-2 ${
                  isActive("/properties")
                    ? "text-primary font-semibold"
                    : "text-gray-700 font-medium hover:text-primary"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Properties
              </Link>
              <Link
                to="/faq"
                className={`block font-poppins py-2 ${
                  isActive("/faq")
                    ? "text-primary font-semibold"
                    : "text-gray-700 font-medium hover:text-primary"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                to="/contact"
                className={`block font-poppins py-2 ${
                  isActive("/contact")
                    ? "text-primary font-semibold"
                    : "text-gray-700 font-medium hover:text-primary"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>
              <Link
                to="/#reviews"
                className={`block font-poppins py-2 ${
                  isActive("/") && location.hash === "#reviews"
                    ? "text-primary font-semibold"
                    : "text-gray-700 font-medium hover:text-primary"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Client Reviews
              </Link>
              <div className="pt-4 space-y-3 border-t border-gray-200">
                {isLoggedIn ? (
                  <Link
                    to="/profile"
                    className="block bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-md font-semibold text-center transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    PROFILE
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="block bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-md font-semibold text-center transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    SIGN IN
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
