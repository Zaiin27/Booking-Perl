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
    <div className="flex items-center justify-between gap-3 w-full mb-6 relative">
      {/* Mobile-First Search Bar */}
      {onSearchChange && (
        <div className="flex-1 max-w-md">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#AEB9E1] group-focus-within:text-[#14F195] transition-colors" />
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#171D41] border border-[#FFFFFF0D] rounded-xl text-white text-sm placeholder-[#AEB9E166] focus:outline-none focus:ring-2 focus:ring-[#14F19533] focus:border-[#14F195] transition-all shadow-lg"
            />
          </div>
        </div>
      )}

      {/* Filter Button for Mobile */}
      {filters && Array.isArray(filters) && filters.length > 0 && (
        <div className="flex items-center gap-2">
          {/* Desktop Filter Dropdowns (Horizontal) */}
          <div className="hidden lg:flex items-center gap-3">
            {filters.map((filter, index) => (
              <div key={filter.key} className="relative filter-dropdown">
                <button
                  onClick={() => toggleDropdown(filter.key)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#171D41] text-[#AEB9E1] border border-[#FFFFFF0D] rounded-xl text-sm font-medium hover:bg-[#1C244D] hover:text-white transition-all min-w-[120px]"
                >
                  <span className="truncate max-w-[100px]">
                    {filter.options.find(opt => opt.value === filter.selectedValue)?.label || filter.label}
                  </span>
                  <ChevronDown size={14} className={openDropdowns[filter.key] ? "rotate-180 transition-transform" : "transition-transform"} />
                </button>
                {openDropdowns[filter.key] && (
                  <div className="absolute top-full mt-2 right-0 bg-[#0A1330] border border-[#FFFFFF0D] rounded-xl shadow-2xl z-50 min-w-[180px] py-1 overflow-hidden">
                    {filter.options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleFilterSelect(filter.key, opt.value)}
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-white/5 transition-colors ${filter.selectedValue === opt.value ? 'text-[#14F195] bg-[#14F19511]' : 'text-white'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setShowFilterPopup(true)}
            className="lg:hidden p-2.5 bg-[#171D41] border border-[#FFFFFF0D] rounded-xl text-white shadow-lg active:scale-95 transition-all"
          >
            <Filter size={18} className={searchValue ? "text-[#14F195]" : "text-white"} />
          </button>
        </div>
      )}

      {/* Mobile Bottom Sheet for Filters */}
      {showFilterPopup && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowFilterPopup(false)}
          ></div>
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-[#121B36] rounded-t-[32px] border-t border-[#FFFFFF1A] shadow-2xl flex flex-col animate-slide-up overflow-hidden">
            {/* Handle Bar */}
            <div className="w-12 h-1.5 bg-[#FFFFFF22] rounded-full mx-auto my-4"></div>

            <div className="px-6 pb-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Filter By</h3>
                <button
                  onClick={() => setShowFilterPopup(false)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white"
                >
                  <Filter size={20} className="rotate-180" />
                </button>
              </div>

              <div className="space-y-8">
                {filters.map((filter) => (
                  <div key={filter.key}>
                    <p className="text-[#AEB9E166] text-[10px] uppercase font-bold tracking-[0.2em] mb-3 ml-1">{filter.label}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {filter.options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            handleFilterSelect(filter.key, option.value);
                            setShowFilterPopup(false);
                          }}
                          className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all ${filter.selectedValue === option.value
                              ? "bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white shadow-xl shadow-[#14F19522]"
                              : "bg-[#2A2D53] text-[#AEB9E1] border border-[#FFFFFF05]"
                            }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowFilterPopup(false)}
                className="w-full mt-10 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all border border-[#FFFFFF0D]"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReusableFilter;
