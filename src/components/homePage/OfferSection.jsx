import React from "react";
import { FaCalendarAlt, FaThumbsUp, FaGlobe, FaHeadset } from "react-icons/fa";

const OfferSection = () => {
  const features = [
    {
      id: 1,
      icon: <FaCalendarAlt className="text-blue-500 text-4xl" />,
      title: "Book now, pay at the property",
      description: "FREE cancellation on most rooms"
    },
    {
      id: 2,
      icon: <FaThumbsUp className="text-orange-500 text-4xl" />,
      title: "300M+ reviews from fellow travelers",
      description: "Get trusted information from guests like you"
    },
    {
      id: 3,
      icon: <FaGlobe className="text-yellow-500 text-4xl" />,
      title: "2+ million properties worldwide",
      description: "Hotels, guest houses, apartments, and more..."
    },
    {
      id: 4,
      icon: <FaHeadset className="text-blue-400 text-4xl" />,
      title: "Trusted 24/7 customer service you can rely on",
      description: "We're always here to help"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-100 via-indigo-100 to-cyan-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-blue-300/50 to-indigo-300/50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-br from-cyan-300/50 to-teal-300/50 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-300/40 to-blue-300/40 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-sky-300/40 to-blue-300/40 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-br from-blue-300/40 to-indigo-300/40 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Our Hotel Booking Platform?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the best in hotel booking with our trusted platform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-gradient-to-br from-blue-50/90 to-indigo-50/90 backdrop-blur-sm rounded-2xl p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-blue-200/30 group"
            >
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all duration-300">
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center cursor-pointer gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <span>Start Booking Now</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
