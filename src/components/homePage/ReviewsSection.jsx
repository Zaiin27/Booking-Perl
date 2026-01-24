import React from "react";
import { FaStar } from "react-icons/fa";
import ChRoseImg from "../../assets/images/ch-rose.jpg";
import SarahJImg from "../../assets/images/sarah-j.png";
import DavidRImg from "../../assets/images/David-r.png";
import reviewbg from "../../assets/images/reviewbg.png";


const ReviewsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Marcus Thompson",
      location: "London, UK",
      avatar: ChRoseImg,
      testimonial:
        "An absolutely breathtaking experience. The attention to detail in the suite was remarkable, and the concierge service was world-class. Truly a premium stay that exceeded all expectations.",
      rating: 5,
      date: "Oct 2025"
    },
    {
      id: 2,
      name: "Sophia Chen",
      location: "Singapore",
      avatar: SarahJImg,
      testimonial:
        "The best booking experience I've had. The interface is so smooth, and finding a premium hotel with their curated list was effortless. I highly recommend it for luxury travelers.",
      rating: 4.5,
      date: "Nov 2025"
    },
    {
      id: 3,
      name: "David Rodriguez",
      location: "Miami, FL",
      avatar: DavidRImg,
      testimonial:
        "Professionalism at its finest. From the moment I booked to the check-out, everything was handled with care. The real-time updates and support were incredibly helpful.",
      rating: 5,
      date: "Dec 2025"
    },
    {
      id: 4,
      name: "Elena Petrova",
      location: "Paris, France",
      avatar: ChRoseImg,
      testimonial:
        "I've used many booking platforms, but this one stands out for its premium selection. Every hotel they list is a gem. Reliable, fast, and stunning UI.",
      rating: 4.8,
      date: "Jan 2026"
    }
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.floor(rating);
          const isHalf = !isFilled && starValue - 0.5 <= rating;

          return (
            <FaStar
              key={index}
              className={`text-sm ${isFilled ? "text-yellow-400" : isHalf ? "text-yellow-400 opacity-70" : "text-booking-gray-medium"
                }`}
            />
          );
        })}
        <span className="ml-2 text-xs font-bold text-booking-black">{rating}</span>
      </div>
    );
  };

  return (
    <section id="reviews" className="py-24 bg-white">
      <div className="custom-container">
        {/* Gallery Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-4 max-w-2xl">
            <h2 className="text-4xl font-inter font-bold text-booking-black leading-tight">
              Honest Feedback from our <br />
              <span className="text-booking-blue">Global Community</span>
            </h2>
            <p className="text-booking-gray-dark font-poppins">
              Over 10,000+ travelers trust us for their luxury stays worldwide.
            </p>
          </div>
          <div className="flex items-center space-x-4 bg-booking-gray-light px-6 py-4 rounded-2xl">
            <div className="text-right">
              <p className="text-sm font-bold text-booking-black">Excellent</p>
              <p className="text-xs text-booking-gray-dark">Based on 4,200 reviews</p>
            </div>
            <div className="h-10 w-[1px] bg-booking-gray-medium"></div>
            <div className="flex items-center text-booking-blue font-bold text-2xl">
              4.9 <FaStar className="ml-2 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`group relative bg-white border border-booking-gray-medium rounded-3xl p-8 hover:border-booking-blue hover:shadow-2xl transition-all duration-500 ${index % 2 !== 0 ? "lg:translate-y-8" : ""
                }`}
            >
              {/* Profile Wrapper */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-booking-blue rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h4 className="font-inter font-bold text-booking-black text-sm">{testimonial.name}</h4>
                  <p className="text-booking-gray-dark text-[10px] font-semibold uppercase tracking-wider">{testimonial.location}</p>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {renderStars(testimonial.rating)}
                <p className="text-booking-black font-poppins text-sm leading-loose italic">
                  "{testimonial.testimonial}"
                </p>
                <div className="flex justify-between items-center pt-4 border-t border-booking-gray-light">
                  <span className="text-[10px] font-bold text-booking-gray-dark uppercase">{testimonial.date}</span>
                  <span className="text-[10px] font-bold text-booking-blue uppercase tracking-widest">Verified Stay</span>
                </div>
              </div>

              {/* Hover Effect Reveal */}
              <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-10 transition-opacity duration-500 transform scale-150 rotate-12">
                <FaStar className="text-booking-blue text-4xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Review Action */}
        <div className="mt-24 text-center space-y-8 bg-booking-black rounded-[3rem] md:p-16 px-2 py-10 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="grid grid-cols-12 h-full gap-4">
              {[...Array(60)].map((_, i) => (
                <div key={i} className="h-2 w-2 bg-white rounded-full"></div>
              ))}
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <h3 className="text-3xl md:text-4xl font-inter font-bold text-white">Share your experience with us</h3>
            <p className="text-white/60 font-poppins max-w-xl mx-auto">
              Your feedback helps us maintain our premium standards and provide better services for our community.
            </p>
            <button className="bg-white text-booking-black hover:bg-booking-blue hover:text-white px-12 py-5 rounded-2xl font-bold transition-all duration-300 shadow-xl shadow-white/5 active:scale-95">
              Write a Review
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
