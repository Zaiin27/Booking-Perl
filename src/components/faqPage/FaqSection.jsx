import React, { useState } from "react";
import { BsClock, BsShieldCheck } from "react-icons/bs";
import { IoChevronDown } from "react-icons/io5";
import reviewbg from "../../assets/images/reviewbg.png";
import {
  HiOutlineLightningBolt,
  HiOutlineCurrencyDollar,
} from "react-icons/hi";
import { FiHelpCircle } from "react-icons/fi";
import { Link } from "react-router-dom";

const FaqSection = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState("General");

  const categories = ["General", "Booking", "Amenities", "Policies", "Payment"];

  const faqs = [
    {
      id: 1,
      category: "General",
      question: "What is your check-in and check-out time?",
      answer: "Standard check-in time is at 3:00 PM and check-out is at 11:00 AM. Early check-in and late check-out can be requested, subject to availability.",
      icon: <BsClock className="text-xl" />,
    },
    {
      id: 2,
      category: "General",
      question: "Do you offer airport shuttle services?",
      answer: "Yes, we provide 24/7 airport shuttle services. Please contact our concierge desk 24 hours in advance to schedule your pickup or drop-off.",
      icon: <HiOutlineLightningBolt className="text-xl" />,
    },
    {
      id: 3,
      category: "Booking",
      question: "Can I cancel my reservation?",
      answer: "Cancellation policies vary by rate type. Most flexible bookings can be cancelled up to 24 hours before arrival without penalty. Please check your booking confirmation for specific details.",
      icon: <HiOutlineCurrencyDollar className="text-xl" />,
    },
    {
      id: 4,
      category: "Booking",
      question: "Do I need a credit card to book?",
      answer: "Yes, a valid credit card is required to guarantee your reservation. We also accept debit cards and digital payments at the time of check-in.",
      icon: <BsShieldCheck className="text-xl" />,
    },
    {
      id: 5,
      category: "Amenities",
      question: "Is there high-speed Wi-Fi available?",
      answer: "Complimentary high-speed Wi-Fi is available in all guest rooms and public areas for all our guests.",
      icon: <FiHelpCircle className="text-xl" />,
    },
    {
      id: 6,
      category: "Amenities",
      question: "Do you have a fitness center and pool?",
      answer: "Yes, our state-of-the-art fitness center and heated indoor pool are open daily from 6:00 AM to 10:00 PM for all guests.",
      icon: <FiHelpCircle className="text-xl" />,
    },
    {
      id: 7,
      category: "Policies",
      question: "Is the hotel pet-friendly?",
      answer: "Yes, we welcome well-behaved pets. A small nightly fee applies, and specific pet-friendly rooms are allocated. Please notify us in advance.",
      icon: <BsShieldCheck className="text-xl" />,
    },
    {
      id: 8,
      category: "Policies",
      question: "What is your smoking policy?",
      answer: "Our hotel is 100% smoke-free. Smoking is only permitted in designated outdoor areas. A cleaning fee will be charged for smoking in guest rooms.",
      icon: <BsShieldCheck className="text-xl" />,
    },
    {
      id: 9,
      category: "Payment",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, Amex), debit cards, and secure online payments. Cash payments are accepted at the front desk upon check-out.",
      icon: <HiOutlineCurrencyDollar className="text-xl" />,
    },
    {
      id: 10,
      category: "Payment",
      question: "Can I pay for my stay in advance?",
      answer: "Yes, you can choose 'Pay Now' during the booking process or contact our reservations team to arrange a pre-payment link.",
      icon: <HiOutlineCurrencyDollar className="text-xl" />,
    },
  ];

  const filteredFaqs = faqs.filter(faq => faq.category === activeCategory);

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <section className="py-24 bg-white relative">
      <div className="custom-container">
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveCategory(category);
                setOpenFaq(null);
              }}
              className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 ${activeCategory === category
                ? "bg-booking-blue text-white shadow-xl shadow-booking-blue/20 scale-105"
                : "bg-booking-gray-light text-booking-gray-dark hover:bg-booking-gray-medium"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Grid - Clean & Minimal */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className={`group rounded-2xl border transition-all duration-300 ${openFaq === faq.id
                ? "border-booking-blue bg-booking-blue/[0.02] shadow-lg"
                : "border-booking-gray-medium hover:border-booking-blue/50"
                }`}
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => toggleFaq(faq.id)}
              >
                <div className="flex items-center gap-5">
                  <div className={`p-3 rounded-xl transition-colors duration-300 ${openFaq === faq.id ? "bg-booking-blue text-white" : "bg-booking-gray-light text-booking-blue"
                    }`}>
                    {faq.icon}
                  </div>
                  <h3 className={`text-lg font-inter font-bold transition-colors ${openFaq === faq.id ? "text-booking-blue" : "text-booking-black"
                    }`}>
                    {faq.question}
                  </h3>
                </div>
                <IoChevronDown
                  className={`text-2xl transition-transform duration-300 ${openFaq === faq.id ? "rotate-180 text-booking-blue" : "text-booking-gray-dark"
                    }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === faq.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                <div className="px-6 pb-6 pt-0 ml-16">
                  <p className="text-booking-gray-dark font-poppins leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-20">
              <p className="text-booking-gray-dark">No questions found in this category.</p>
            </div>
          )}
        </div>

        {/* Help Banner */}
        <div className="mt-20 p-10 rounded-[2rem] bg-gradient-to-r from-booking-blue to-booking-blue-light text-white text-center shadow-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl font-inter font-bold">Still have questions?</h2>
            <p className="text-white/80 max-w-xl mx-auto font-poppins">
              Can't find the answer you're looking for? Our premium support team is here to help you 24/7.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/support" className="bg-white text-booking-blue hover:bg-booking-gray-light px-10 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg">
                Contact Support
              </Link>
              <a href="tel:+1234567890" className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 px-10 py-4 rounded-xl font-bold transition-all duration-300">
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
