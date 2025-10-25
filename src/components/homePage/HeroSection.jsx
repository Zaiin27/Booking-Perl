import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoLocationOutline, IoCalendarOutline, IoPeopleOutline } from "react-icons/io5";
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaUsers } from "react-icons/fa";

const HeroSection = () => {
  const [searchData, setSearchData] = useState({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    rooms: 1
  });

  return (
    <section className="relative overflow-hidden min-h-[100vh] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              <span className="text-white font-medium text-sm">
                🏆 #1 Hotel Booking Platform
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Hotel Stay
              </span>
            </h1>

            {/* Sub-text */}
            <p className="text-xl text-white/80 leading-relaxed max-w-lg">
              Discover luxury hotels, resorts, and unique accommodations worldwide. Book with confidence and save up to 50% on your next stay.
            </p>

            {/* Feature List */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <IoLocationOutline className="text-blue-400 w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-semibold">50+ Countries</p>
                  <p className="text-white/60 text-sm">Worldwide coverage</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <IoMdCheckmarkCircleOutline className="text-green-400 w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-semibold">Instant Booking</p>
                  <p className="text-white/60 text-sm">No waiting time</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <IoPeopleOutline className="text-purple-400 w-5 h-5" />
                </div>
                <div>
                  <p className="text-white font-semibold">24/7 Support</p>
                  <p className="text-white/60 text-sm">Always here to help</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/properties"
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center flex items-center justify-center gap-2"
              >
                <FaSearch className="w-5 h-5" />
                Search Hotels
              </Link>
              <button className="border-2 border-white/30 bg-white/10 backdrop-blur-md text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2">
                <IoCalendarOutline className="w-5 h-5" />
                View Deals
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-white/80 text-sm">4.9/5 from 50,000+ guests</span>
              </div>
              <div className="text-white/60 text-sm">•</div>
              <div className="text-white/80 text-sm">Trusted by 1M+ travelers</div>
            </div>
          </div>

          {/* Hotel Search Form */}
          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-lg">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                <h3 className="text-white text-xl font-bold mb-6">Find Your Perfect Stay</h3>
                
                <div className="space-y-4">
                  {/* Location */}
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Where are you going?"
                      value={searchData.location}
                      onChange={(e) => setSearchData({...searchData, location: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                  </div>

                  {/* Check-in & Check-out */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                      <input
                        type="date"
                        value={searchData.checkIn}
                        onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
                        className="w-full pl-10 pr-3 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <label className="absolute -top-2 left-3 bg-slate-900 px-2 text-xs text-white/80">Check-in</label>
                    </div>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                      <input
                        type="date"
                        value={searchData.checkOut}
                        onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
                        className="w-full pl-10 pr-3 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <label className="absolute -top-2 left-3 bg-slate-900 px-2 text-xs text-white/80">Check-out</label>
                    </div>
                  </div>

                  {/* Guests & Rooms */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <FaUsers className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                      <select
                        value={searchData.guests}
                        onChange={(e) => setSearchData({...searchData, guests: parseInt(e.target.value)})}
                        className="w-full pl-10 pr-3 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        {[1,2,3,4,5,6].map(num => (
                          <option key={num} value={num} className="bg-slate-800">{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>
                    <div className="relative">
                      <IoLocationOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
                      <select
                        value={searchData.rooms}
                        onChange={(e) => setSearchData({...searchData, rooms: parseInt(e.target.value)})}
                        className="w-full pl-10 pr-3 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        {[1,2,3,4,5].map(num => (
                          <option key={num} value={num} className="bg-slate-800">{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Search Button */}
                  <Link
                    to="/properties"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <FaSearch className="w-5 h-5" />
                    Search Hotels
                  </Link>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-white font-bold text-lg">2M+</p>
                      <p className="text-white/60 text-sm">Properties</p>
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">50+</p>
                      <p className="text-white/60 text-sm">Countries</p>
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">24/7</p>
                      <p className="text-white/60 text-sm">Support</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
