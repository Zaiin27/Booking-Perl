import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ReusablePagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 10,
  showPageInfo = false,
}) => {
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Always show first page
    rangeWithDots.push(1);

    // Calculate range around current page
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Add dots before range if there's a gap
    if (currentPage - delta > 2) {
      rangeWithDots.push("...");
    }

    // Add the range
    rangeWithDots.push(...range);

    // Add dots after range if there's a gap
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...");
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Always render pagination, even with one page
  // Ensure we have valid values
  const safeCurrentPage = Math.max(1, currentPage);
  const safeTotalPages = Math.max(1, totalPages);

  return (
    <div className="flex items-center justify-center">
      {/* Mobile Pagination */}
      <div className="flex items-center justify-between w-full sm:hidden">
        <button
          onClick={() => handlePageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            safeCurrentPage === 1
              ? "bg-[#2A2A3E] text-[#AEB9E1] cursor-not-allowed opacity-50"
              : "bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white hover:shadow-lg"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="ml-1">Prev</span>
        </button>

        <div className="flex items-center gap-1">
          <span className="text-white text-sm font-medium">
            {safeCurrentPage} of {safeTotalPages}
          </span>
        </div>

        <button
          onClick={() => handlePageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === safeTotalPages}
          className={`flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            safeCurrentPage === safeTotalPages
              ? "bg-[#2A2A3E] text-[#AEB9E1] cursor-not-allowed opacity-50"
              : "bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white hover:shadow-lg"
          }`}
        >
          <span className="mr-1">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Desktop Pagination */}
      <div className="hidden sm:flex items-center justify-center w-full">
        <div className="flex items-center justify-between w-full max-w-md">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(safeCurrentPage - 1)}
            disabled={safeCurrentPage === 1}
            className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              safeCurrentPage === 1
                ? "bg-[#2A2A3E] text-[#AEB9E1] cursor-not-allowed opacity-50"
                : "bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white hover:shadow-lg"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="ml-2">Previous</span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {getVisiblePages().map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-2 py-1 text-white font-medium text-sm">
                    ...
                  </span>
                ) : (
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 min-w-[36px] h-[36px] flex items-center justify-center ${
                      safeCurrentPage === page
                        ? "bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white shadow-lg"
                        : "text-white hover:bg-[#2A2A3E] hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(safeCurrentPage + 1)}
            disabled={safeCurrentPage === safeTotalPages}
            className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              safeCurrentPage === safeTotalPages
                ? "bg-[#2A2A3E] text-[#AEB9E1] cursor-not-allowed opacity-50"
                : "bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white hover:shadow-lg"
            }`}
          >
            <span className="mr-2">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReusablePagination;
