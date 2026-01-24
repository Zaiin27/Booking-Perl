import React from "react";
import { Link } from "react-router-dom";
import {
  Lahore,
  Islamabad,
  Karachi,
  Rawalpindi,
  Faisalabad,
} from "../../assets/images";

const TrendingDestinationsSection = () => {
  const destinations = [
    {
      id: 1,
      name: "Lahore",
      flag: "🇵🇰",
      image: Lahore,
      description: "Historical city with rich culture",
      price: "From $45/night",
      code: "PK",
    },
    {
      id: 2,
      name: "Islamabad",
      flag: "🇵🇰",
      image: Islamabad,
      description: "Modern capital city",
      price: "From $55/night",
      code: "PK",
    },
    {
      id: 3,
      name: "Karachi",
      flag: "🇵🇰",
      image: Karachi,
      description: "Business hub of Pakistan",
      price: "From $40/night",
      code: "PK",
    },
    {
      id: 4,
      name: "Rawalpindi",
      flag: "🇵🇰",
      image: Rawalpindi,
      description: "Lively city near the capital",
      price: "From $35/night",
      code: "PK",
    },
    {
      id: 5,
      name: "Faisalabad",
      flag: "🇵🇰",
      image: Faisalabad,
      description: "Industrial center with rich history",
      price: "From $30/night",
      code: "PK",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white relative overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Section Header - Exact match from image */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 px-2">
            Trending destinations
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Most popular choices for travelers from Pakistan
          </p>
        </div>

        {/* Destinations Grid - 2 images in first row, 3 images in second row on desktop; responsive on mobile */}
        <div className="space-y-4 sm:space-y-6 md:space-y-8">
          {/* First row - 2 cards on desktop, 1 on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {destinations.slice(0, 2).map((dest) => (
              <div key={dest.id}>
                <Link
                  to="/properties"
                  className="group relative bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 block border-0"
                >
                  <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    {/* Text format: "PK Lahore" */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-white drop-shadow-lg">
                        {dest.code} {dest.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Second row - 3 cards on desktop, 1 on mobile, 2 on tablet */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {destinations.slice(2, 5).map((dest) => (
              <div key={dest.id}>
                <Link
                  to="/properties"
                  className="group relative bg-white rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 block border-0"
                >
                  <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    {/* Text format: "PK Karachi" */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                      <h3 className="text-base sm:text-lg md:text-xl font-bold text-white drop-shadow-lg">
                        {dest.code} {dest.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingDestinationsSection;
