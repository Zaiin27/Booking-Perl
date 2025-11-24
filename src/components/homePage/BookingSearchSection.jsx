import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaBed, FaCalendarAlt, FaUsers, FaChevronDown, FaSearch } from "react-icons/fa";

const BookingSearchSection = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [searchData, setSearchData] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    adults: 2,
    children: 0,
    rooms: 1,
  });

  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowGuestDropdown(false);
      }
    };

    if (showGuestDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showGuestDropdown]);

  const handleSearch = () => {
    // Navigate to properties page with search params
    const params = new URLSearchParams({
      ...(searchData.destination && { search: searchData.destination }),
      ...(searchData.checkIn && { checkIn: searchData.checkIn }),
      ...(searchData.checkOut && { checkOut: searchData.checkOut }),
      ...(searchData.adults && { adults: searchData.adults }),
      ...(searchData.children && { children: searchData.children }),
      ...(searchData.rooms && { rooms: searchData.rooms }),
    });
    navigate(`/properties?${params.toString()}`);
  };

  const getGuestText = () => {
    const parts = [];
    if (searchData.adults > 0) {
      parts.push(`${searchData.adults} ${searchData.adults === 1 ? "adult" : "adults"}`);
    }
    if (searchData.children > 0) {
      parts.push(`${searchData.children} ${searchData.children === 1 ? "child" : "children"}`);
    }
    parts.push(`${searchData.rooms} ${searchData.rooms === 1 ? "room" : "rooms"}`);
    return parts.join(" · ");
  };

  return (
    <div className="py-4 md:py-6 lg:py-0 md:-mt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border-2 border-primary shadow-2xl p-2 md:p-3">
          <div className="flex flex-col lg:flex-row gap-2 lg:gap-0 items-stretch">
            {/* Destination */}
            <div className="flex-1 flex items-center gap-3 px-3 md:px-4 py-2 md:py-2.5 border-r-0 lg:border-r border-gray-200 rounded-lg lg:rounded-none">
              <FaBed className="text-gray-500 text-base md:text-lg flex-shrink-0" />
              <input
                type="text"
                placeholder="Where are you going?"
                value={searchData.destination}
                onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
                className="w-full outline-none text-gray-700 placeholder-gray-400 text-sm md:text-base font-medium bg-transparent focus:text-blue-600 transition-colors"
              />
            </div>

            {/* Dates */}
            <div className="flex-1 flex items-center gap-3 px-3 md:px-4 py-2 md:py-2.5 border-r-0 lg:border-r border-gray-200 rounded-lg lg:rounded-none">
              <FaCalendarAlt className="text-gray-500 text-base md:text-lg flex-shrink-0" />
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="date"
                  value={searchData.checkIn}
                  onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                  className="flex-1 outline-none text-gray-700 text-sm md:text-base cursor-pointer font-medium bg-transparent focus:text-blue-600 transition-colors"
                  placeholder="Check-in"
                />
                <span className="text-gray-400 font-medium">—</span>
                <input
                  type="date"
                  value={searchData.checkOut}
                  onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                  className="flex-1 outline-none text-gray-700 text-sm md:text-base cursor-pointer font-medium bg-transparent focus:text-blue-600 transition-colors"
                  placeholder="Check-out"
                />
              </div>
            </div>

            {/* Guests & Rooms */}
            <div className="flex-1 flex items-center gap-3 px-3 md:px-4 py-2 md:py-2.5 border-r-0 lg:border-r border-gray-200 rounded-lg lg:rounded-none relative" ref={dropdownRef}>
              <FaUsers className="text-gray-500 text-base md:text-lg flex-shrink-0" />
              <button
                onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                className="flex-1 flex items-center justify-between text-gray-700 text-sm md:text-base font-medium hover:text-blue-600 transition-colors"
              >
                <span>{getGuestText()}</span>
                <FaChevronDown className={`text-gray-400 text-xs transition-transform ${showGuestDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Guest Dropdown */}
              {showGuestDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl p-5 z-50">
                  <div className="space-y-4">
                    {/* Adults */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Adults</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setSearchData({
                              ...searchData,
                              adults: Math.max(1, searchData.adults - 1),
                            })
                          }
                          className="w-9 h-9 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-blue-50 hover:border-blue-400 transition-all font-semibold text-gray-700"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-semibold text-gray-800">{searchData.adults}</span>
                        <button
                          onClick={() =>
                            setSearchData({
                              ...searchData,
                              adults: searchData.adults + 1,
                            })
                          }
                          className="w-9 h-9 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-blue-50 hover:border-blue-400 transition-all font-semibold text-gray-700"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Children</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setSearchData({
                              ...searchData,
                              children: Math.max(0, searchData.children - 1),
                            })
                          }
                          className="w-9 h-9 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-blue-50 hover:border-blue-400 transition-all font-semibold text-gray-700"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-semibold text-gray-800">{searchData.children}</span>
                        <button
                          onClick={() =>
                            setSearchData({
                              ...searchData,
                              children: searchData.children + 1,
                            })
                          }
                          className="w-9 h-9 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-blue-50 hover:border-blue-400 transition-all font-semibold text-gray-700"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Rooms */}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Rooms</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            setSearchData({
                              ...searchData,
                              rooms: Math.max(1, searchData.rooms - 1),
                            })
                          }
                          className="w-9 h-9 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-blue-50 hover:border-blue-400 transition-all font-semibold text-gray-700"
                        >
                          -
                        </button>
                        <span className="w-10 text-center font-semibold text-gray-800">{searchData.rooms}</span>
                        <button
                          onClick={() =>
                            setSearchData({
                              ...searchData,
                              rooms: searchData.rooms + 1,
                            })
                          }
                          className="w-9 h-9 rounded-lg border-2 border-gray-300 flex items-center justify-center hover:bg-blue-50 hover:border-blue-400 transition-all font-semibold text-gray-700"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowGuestDropdown(false)}
                      className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all font-semibold shadow-md hover:shadow-lg"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 md:px-7 lg:px-9 py-2.5 md:py-3 rounded-lg font-semibold text-sm md:text-base flex items-center justify-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-100"
            >
              <FaSearch className="text-sm md:text-base" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSearchSection;

