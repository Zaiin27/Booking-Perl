import React from "react";

const DiscoverSection = () => {
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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Discover your new favourite stay
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
               <div className="relative h-64 overflow-hidden">
                 <img
                   src={category.image}
                   alt={category.name}
                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                   loading="lazy"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
               </div>
               
               {/* Category Label */}
               <div className="absolute bottom-4 left-4 right-4">
                 <div className="rounded-lg px-4 py-2 text-center ">
                   <span className="text-white font-semibold text-sm">
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
