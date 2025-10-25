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
    <header className="relative z-50 mb-[-7.5rem]">
      {/* Navigation Bar Container */}
      <div className="relative flex justify-center py-6">
        {/* Frosted Glass Navigation Bar */}
        <div
          className="backdrop-blur-md rounded-full px-8 py-2 max-w-6xl w-full"
          style={{
            border: "1px solid #FFFFFF36",
            boxShadow:
              "0px 4px 4px 0px #FFFFFF26 inset, 0px 0px 16px 0px #FFFFFF0D inset",
            background: "#FFFFFF1A",
          }}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-xl font-outfit font-bold text-white">
                BOOKING <span className="text-yellow-400">PEARL</span>
              </Link>
            </div>

            {/* Desktop Navigation - Moved to Right Side */}
            <div className="hidden lg:flex items-center space-x-8">
              <nav className="flex items-center space-x-8">
                <Link
                  to="/"
                  className={`font-poppins font-medium   ${
                    isActive("/")
                      ? "bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent"
                      : "text-white/80 font-medium hover:text-white transition-colors"
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/properties"
                  className={`font-poppins font-medium  ${
                    isActive("/properties")
                      ? "bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent "
                      : "text-white/80 hover:text-white transition-colors"
                  }`}
                >
                  Properties
                </Link>
                <Link
                  to="/faq"
                  className={`font-poppins font-medium  ${
                    isActive("/faq")
                      ? "bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent "
                      : "text-white/80 hover:text-white transition-colors"
                  }`}
                >
                  FAQ
                </Link>
                <Link
                  to="/contact"
                  className={`font-poppins font-medium  ${
                    isActive("/contact")
                      ? "bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent "
                      : "text-white/80 hover:text-white transition-colors"
                  }`}
                >
                  Support
                </Link>
                <Link
                  to="/reviews"
                  className="text-white/80 font-poppins font-medium hover:text-white transition-colors"
                >
                  Reviews
                </Link>
              </nav>

              {/* Profile Image/Action Buttons */}
              <div className="flex items-center space-x-5 ml-3">
                {/* CONNECT WALLET Button */}
               
                {/* Conditional Button - Sign In or User Profile */}
                {isLoggedIn ? (
                  /* User Icon Button - When Logged In */
                  <Link
                    to="/profile"
                    className="w-12 h-12 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300 transform hover:scale-105"
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
                  /* Sign In Button - When Not Logged In */
                  <Link
                    to="/login"
                    className="relative overflow-hidden rounded-full px-12 py-5 min-w-[150px] group"
                  >
                    {/* Gradient Border */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195] p-[1px]">
                      {/* Inner Background */}
                      <div
                        className="w-full h-full px-6 py-3 rounded-full flex items-center justify-center"
                        style={{
                          background:
                            "linear-gradient(90deg, rgb(87, 63, 116) 0%, rgb(43, 119, 87) 100%)",
                        }}
                      >
                        {/* Text Section */}
                        <span
                          className="text-sm font-bold tracking-wide text-white text-center"
                          style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                          SIGN IN
                        </span>
                      </div>
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={toggleMenu} className="lg:hidden text-white p-2">
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
          <div className="lg:hidden absolute top-full left-4 right-4 mt-2 bg-[#1A1A2E]/95 backdrop-blur-sm border border-white/10 rounded-2xl">
            <div className="px-6 py-6 space-y-4">
              <Link
                to="/"
                className={`block font-poppins py-2 ${
                  isActive("/")
                    ? "bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent "
                    : "text-white/80 font-medium hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/properties"
                className={`block font-poppins py-2 ${
                  isActive("/properties")
                    ? "bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent "
                    : "text-white/80 font-medium hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Properties
              </Link>
              <Link
                to="/faq"
                className={`block font-poppins py-2 ${
                  isActive("/faq")
                    ? "bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent "
                    : "text-white/80 font-medium hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                to="/contact"
                className={`block font-poppins py-2 ${
                  isActive("/contact")
                    ? "bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent font-semibold "
                    : "text-white/80 font-medium hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>
              <Link
                to="/#reviews"
                className={`block font-poppins py-2 ${
                  isActive("/") && location.hash === "#reviews"
                    ? "bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent font-semibold "
                    : "text-white/80 font-medium hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Client Reviews
              </Link>
              <Link
                to="#"
                className="block text-white/80 font-poppins font-medium py-2 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Discord
              </Link>
              <div className="pt-4 space-y-3">
                <Link
                  to="#" 
                  className="block bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white px-6 py-3 rounded-full font-outfit font-semibold text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  CONNECT WALLET
                </Link>
                {isLoggedIn ? (
                  <Link
                    to="/profile"
                    className="block bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white px-6 py-3 rounded-full font-outfit font-semibold text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    PROFILE
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="block bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white px-6 py-3 rounded-full font-outfit font-semibold text-center"
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
