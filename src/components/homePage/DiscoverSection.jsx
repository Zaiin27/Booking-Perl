import React from "react";
import { useNavigate } from "react-router-dom";


const DiscoverSection = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      name: "Apart hotel",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Spa",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      name: "Family friendly",
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      name: "Sea view",
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      name: "Pool",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop"
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16 lg:mt-0 md:mt-10 mt-20">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 px-2">
            Discover your new favourite stay
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => navigate("/properties")}
              className={`group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 cursor-pointer ${category.name === "Pool" ? "hidden md:block" : ""}`}
            >
              <div className="relative h-32 sm:h-40 md:h-56 lg:h-64 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              </div>

              {/* Category Label */}
              <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 right-2 sm:right-3 md:right-4">
                <div className="rounded-lg px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-center">
                  <span className="text-white font-semibold text-xs sm:text-sm md:text-base drop-shadow-lg">
                    {category.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DiscoverSection;
