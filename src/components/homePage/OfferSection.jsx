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
    <section className="py-20 bg-white relative overflow-hidden">
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
              className="bg-white rounded-2xl p-8 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-200 group"
            >
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="p-4 rounded-2xl bg-primary-50 group-hover:bg-primary-100 transition-all duration-300">
                  {React.cloneElement(feature.icon, { className: "text-primary text-4xl" })}
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
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
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-600 text-white px-8 py-4 rounded-md font-semibold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <span>Start Booking Now</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OfferSection;
