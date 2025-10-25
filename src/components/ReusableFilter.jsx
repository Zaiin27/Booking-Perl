import React, { useState } from "react";
import { ChevronDown, Search, Filter } from "lucide-react";

const ReusableFilter = ({
  filters = [],
  onFilterChange,
  searchPlaceholder = "Order ID ...",
  onSearchChange,
  searchValue = "",
}) => {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [showSearchPopup, setShowSearchPopup] = useState(false);
  const [showFilterPopup, setShowFilterPopup] = useState(false);

  const toggleDropdown = (filterKey) => {
    setOpenDropdowns((prev) => {
      // Close all other dropdowns first
      const newState = {};
      Object.keys(prev).forEach((key) => {
        newState[key] = false;
      });

      // Toggle the clicked dropdown
      newState[filterKey] = !prev[filterKey];

      return newState;
    });
  };

  const handleFilterSelect = (filterKey, value) => {
    onFilterChange(filterKey, value);
    setOpenDropdowns((prev) => ({
      ...prev,
      [filterKey]: false,
    }));
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".filter-dropdown")) {
        setOpenDropdowns({});
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-row items-center justify-end gap-2 lg:gap-4 w-full mb-4">
      {/* Search Bar with Filter Icon */}
      {onSearchChange && (
        <>
          {/* Search Icon for Small and Medium Screens */}
          <button
            onClick={() => setShowSearchPopup(!showSearchPopup)}
            className="xl:hidden p-2 bg-[#454A67] rounded-lg text-white hover:bg-[#3A3A4E] transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Search Bar for Large Screens */}
          <div className="hidden xl:block relative w-auto min-w-[300px] max-w-[350px]">
            <div className="relative">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
              >
                <path
                  d="M17.5 17.5L12.5 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z"
                  stroke="#EDEDED80"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-[#454A67] rounded-lg text-white text-[10px] placeholder-[#EDEDED80] focus:outline-none focus:ring-2 focus:ring-[#14F195] focus:border-transparent"
              />
            </div>
          </div>

          {/* Search Popup for Small and Medium Screens */}
          {showSearchPopup && (
            <div className="xl:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-24">
              <div className="bg-[#171D41] rounded-lg p-4 w-11/12 max-w-md">
                <div className="relative">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
                  >
                    <path
                      d="M17.5 17.5L12.5 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z"
                      stroke="#EDEDED80"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-[#454A67] rounded-lg text-white text-sm placeholder-[#EDEDED80] focus:outline-none focus:ring-2 focus:ring-[#14F195] focus:border-transparent"
                    autoFocus
                  />
                  <button
                    onClick={() => setShowSearchPopup(false)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Filter Dropdowns */}
      <div className="flex items-center gap-1 lg:gap-4 w-auto justify-end">
        {/* Filter Icon for Small and Medium Screens */}
        {filters && Array.isArray(filters) && filters.length > 0 && (
          <button
            onClick={() => setShowFilterPopup(!showFilterPopup)}
            className="xl:hidden p-2 bg-transparent hover:bg-[#3A3A4E] text-white rounded-lg border border-[#EDEDED80] transition-colors"
          >
            <Filter className="w-5 h-5" />
          </button>
        )}

        {/* Filter Dropdowns for Large Screens */}
        {filters && Array.isArray(filters) && filters.map((filter, index) => (
          <div
            key={filter.key}
            className="relative filter-dropdown hidden xl:block"
          >
            <button
              onClick={() => toggleDropdown(filter.key)}
              className="flex items-center gap-2 bg-transparent hover:bg-[#3A3A4E] text-white px-4 py-2.5 rounded-lg border border-[#EDEDED80] transition-colors min-w-[140px] justify-between whitespace-nowrap text-sm"
            >
              <span className="font-medium truncate">
                {filter.options.find(opt => opt.value === filter.selectedValue)?.label || filter.label}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-white transition-transform flex-shrink-0 ${
                  openDropdowns[filter.key] ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {openDropdowns[filter.key] && (
              <div
                className={`absolute top-full mt-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg shadow-xl z-50 min-w-[180px] lg:min-w-[200px] ${
                  // Position the last dropdown to the left to prevent UI disturbance
                  index === filters.length - 1 ? "right-0" : "left-0"
                }`}
              >
                {/* All Option */}
                <button
                  onClick={() => handleFilterSelect(filter.key, filter.label)}
                  className={`w-full text-left px-3 lg:px-4 py-2 text-xs lg:text-sm hover:bg-[#3A3A4E] transition-colors ${
                    filter.selectedValue === filter.label
                      ? "text-[#14F195] bg-[#14F19520]"
                      : "text-white"
                  }`}
                >
                  {filter.label}
                </button>

                {/* Dropdown Options with Scroll */}
                <div className={`${filter.options.length > 10 ? 'max-h-[300px] overflow-y-auto' : ''}`}>
                  {filter.options.map((option) => {
                    // Don't show the "All" option if it matches the filter label
                    if (option.value === filter.label || option.label === filter.label) {
                      return null;
                    }
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleFilterSelect(filter.key, option.value)}
                        className={`w-full text-left px-3 lg:px-4 py-2 text-xs lg:text-sm hover:bg-[#3A3A4E] transition-colors ${
                          filter.selectedValue === option.value
                            ? "text-[#14F195] bg-[#14F19520]"
                            : "text-white"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Filter Popup for Small and Medium Screens */}
        {showFilterPopup && (
          <div className="xl:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-24">
            <div className="bg-[#171D41] rounded-lg p-4 w-11/12 max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setShowFilterPopup(false)}
                  className="text-white hover:text-gray-300"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {filters && Array.isArray(filters) && filters.map((filter) => (
                  <div key={filter.key} className="relative">
                    <label className="block text-[#14F195] text-sm font-medium mb-2">
                      {filter.label}
                    </label>
                    <button
                      onClick={() => toggleDropdown(filter.key)}
                      className="w-full flex items-center justify-between bg-[#454A67] text-white px-3 py-2 rounded-lg border border-[#EDEDED80] transition-colors"
                    >
                      <span className="font-medium truncate">
                        {filter.options.find(opt => opt.value === filter.selectedValue)?.label || filter.label}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-white transition-transform ${
                          openDropdowns[filter.key] ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu in Popup */}
                    {openDropdowns[filter.key] && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg shadow-xl z-10">
                        {/* All Option */}
                        <button
                          onClick={() => {
                            handleFilterSelect(filter.key, filter.label);
                            setShowFilterPopup(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-[#3A3A4E] transition-colors ${
                            filter.selectedValue === filter.label
                              ? "text-[#14F195] bg-[#14F19520]"
                              : "text-white"
                          }`}
                        >
                          {filter.label}
                        </button>
                        
                        {/* Dropdown Options with Scroll */}
                        <div className={`${filter.options.length > 10 ? 'max-h-[300px] overflow-y-auto' : ''}`}>
                          {filter.options.map((option) => {
                            // Don't show the "All" option if it matches the filter label
                            if (option.value === filter.label || option.label === filter.label) {
                              return null;
                            }
                            return (
                              <button
                                key={option.value}
                                onClick={() => {
                                  handleFilterSelect(filter.key, option.value);
                                  setShowFilterPopup(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-[#3A3A4E] transition-colors ${
                                  filter.selectedValue === option.value
                                    ? "text-[#14F195] bg-[#14F19520]"
                                    : "text-white"
                                }`}
                              >
                                {option.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReusableFilter;
