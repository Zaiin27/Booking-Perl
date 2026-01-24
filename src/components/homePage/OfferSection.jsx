import React from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaThumbsUp, FaGlobe, FaHeadset } from "react-icons/fa";

const OfferSection = () => {
  const features = [
    {
      id: 1,
      icon: <FaCalendarAlt />,
      title: "Book now, pay at the property",
      description: "FREE cancellation on most rooms"
    },
    {
      id: 2,
      icon: <FaThumbsUp />,
      title: "300M+ reviews from fellow travelers",
      description: "Get trusted information from guests like you"
    },
    {
      id: 3,
      icon: <FaGlobe />,
      title: "2+ million properties worldwide",
      description: "Hotels, guest houses, apartments, and more..."
    },
    {
      id: 4,
      icon: <FaHeadset />,
      title: "Trusted 24/7 customer service you can rely on",
      description: "We're always here to help"
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white relative overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4 px-2">
            Why Choose Our Hotel Booking Platform?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Experience the best in hotel booking with our trusted platform
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-7 md:p-8 hover:shadow-xl hover:scale-105 active:scale-100 transition-all duration-300 border border-gray-200 group"
            >
              {/* Icon */}
              <div className="mb-4 sm:mb-5 md:mb-6 flex justify-center">
                <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-primary-50 group-hover:bg-primary-100 transition-all duration-300">
                  {React.cloneElement(feature.icon, { className: "text-primary text-2xl sm:text-3xl md:text-4xl" })}
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8 sm:mt-12 md:mt-16">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 active:bg-primary-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-md font-semibold text-base sm:text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-100"
          >
            <span>Start Booking Now</span>
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
