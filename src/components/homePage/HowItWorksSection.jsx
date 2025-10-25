import React from "react";
import { Link } from "react-router-dom";

const TrendingDestinationsSection = () => {
  const destinations = [
    {
      id: 1,
      name: "Lahore",
      flag: "🇵🇰",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      description: "Historical city with rich culture",
      price: "From $45/night"
    },
    {
      id: 2,
      name: "Islamabad",
      flag: "🇵🇰",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop",
      description: "Modern capital city",
      price: "From $55/night"
    },
    {
      id: 3,
      name: "Karachi",
      flag: "🇵🇰",
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop",
      description: "Business hub of Pakistan",
      price: "From $40/night"
    },
    {
      id: 4,
      name: "Dubai",
      flag: "🇦🇪",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop",
      description: "Luxury shopping destination",
      price: "From $120/night"
    },
    {
      id: 5,
      name: "Kuala Lumpur",
      flag: "🇲🇾",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop",
      description: "Modern Asian metropolis",
      price: "From $65/night"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header - Exact match from image */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Trending destinations
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Most popular choices for travelers from Pakistan
          </p>
        </div>

        {/* Destinations Grid - 2 images in first row, 3 images in second row */}
        <div className="space-y-8">
          {/* First row - 2 cards */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Link
                to="/properties"
                className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 block border-0"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={destinations[0].image}
                    alt={destinations[0].name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Text format: "PK Lahore" */}
                  <div className="absolute top-4 left-4">
                    <h3 className="text-xl font-bold text-white">
                      PK {destinations[0].name}
                    </h3>
                  </div>
                </div>
              </Link>
            </div>

            <div>
              <Link
                to="/properties"
                className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 block border-0"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={destinations[1].image}
                    alt={destinations[1].name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Text format: "PK Islamabad" */}
                  <div className="absolute top-4 left-4">
                    <h3 className="text-xl font-bold text-white">
                      PK {destinations[1].name}
                    </h3>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Second row - 3 cards */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <Link
                to="/properties"
                className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 block border-0"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={destinations[2].image}
                    alt={destinations[2].name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Text format: "PK" only */}
                  <div className="absolute top-4 left-4">
                    <h3 className="text-xl font-bold text-white">
                      PK
                    </h3>
                  </div>
                </div>
              </Link>
            </div>

            <div>
              <Link
                to="/properties"
                className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 block border-0"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={destinations[3].image}
                    alt={destinations[3].name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Text format: "MY Kuala Lumpur" */}
                  <div className="absolute top-4 left-4">
                    <h3 className="text-xl font-bold text-white">
                      MY {destinations[3].name}
                    </h3>
                  </div>
                </div>
              </Link>
            </div>

            <div>
              <Link
                to="/properties"
                className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 block border-0"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={destinations[4].image}
                    alt={destinations[4].name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Text format: "AE Dubai" */}
                  <div className="absolute top-4 left-4">
                    <h3 className="text-xl font-bold text-white">
                      AE {destinations[4].name}
                    </h3>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingDestinationsSection;
