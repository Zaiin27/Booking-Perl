import React, { useState } from "react";
import { BsClock } from "react-icons/bs";
import { FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";
import reviewbg from "../../assets/images/reviewbg.png";
import hotdogImg from "../../assets/images/hotdog.png";
import friesImg from "../../assets/images/fries.png";
import { LiaDiscord } from "react-icons/lia";

const SupportSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <section
      className="py-20 mt-[-180px] md:mt-[-230px] xl:mt-[-150px] relative overflow-hidden"
      style={{
        background: `url(${reviewbg})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Floating Background Images */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Hotdog - Top right corner, peeking behind */}
        <div
          className="absolute right-64 top-56 w-48 h-48 opacity-100"
          style={{
            animation: "float 8s ease-in-out infinite",
            animationDelay: "4s",
          }}
        >
          <img
            src={hotdogImg}
            alt="Hotdog"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Fries - Middle right, peeking behind */}
        <div
          className="absolute right-2 top-1/2 w-48 h-48 opacity-100"
          style={{
            animation: "float 6s ease-in-out infinite",
            animationDelay: "2s",
          }}
        >
          <img
            src={friesImg}
            alt="Fries"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Floating Animation Keyframes */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 top-32">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          {/* Left Side - Title and Info Cards */}
          <div className="w-full lg:w-1/2 mb-6 lg:mb-0">
            {/* CUSTOMER SUPPORT Label */}
            <div
              className="inline-flex items-center px-4 py-2 mb-6 rounded-full relative"
              style={{
                background:
                  "linear-gradient(90deg, rgba(153, 69, 255, 0.1) 0%, rgba(20, 241, 149, 0.1) 100%)",
              }}
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(153, 69, 255, 0.3) 0%, rgba(20, 241, 149, 0.3) 100%)",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "exclude",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  padding: "1px",
                }}
              ></div>
              <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent text-sm font-inter font-medium uppercase">
                Customer Support
              </span>
            </div>

            {/* Main Title */}
            <h2 className="text-2xl lg:text-[32px] font-inter !font-bold text-white mb-6 lg:mb-0">
              Questions? We've Got <br className="hidden sm:block" /> Answers
            </h2>
          </div>

          {/* Right Side - Contact Form and Buttons */}
          <div className="w-full lg:w-1/2 lg:pl-8">
            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-4 justify-end items-end">
              <div
                className="inline-flex items-center justify-center px-6 py-3 rounded-full relative w-full sm:w-auto sm:max-w-[200px]"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(153, 69, 255, 0.1) 0%, rgba(20, 241, 149, 0.1) 100%)",
                }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(153, 69, 255, 0.3) 0%, rgba(20, 241, 149, 0.3) 100%)",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    padding: "1px",
                  }}
                ></div>
                <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent text-sm font-inter !font-extrabold uppercase">
                  Back to Ordering
                </span>
              </div>
              <button
                className="w-full sm:w-auto sm:max-w-[200px] px-6 py-3 rounded-full font-inter font-semibold text-white transition-all duration-300 hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
                }}
              >
                CHAT WITH US
              </button>
            </div>
          </div>
        </div>
        {/* section bottom */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-16 pb-48">
          {/* Left Side - Info Cards */}
          <div className="w-full lg:w-1/3 mb-8 lg:mb-0">
            {/* Info Cards */}
            <div className="space-y-6 lg:space-y-10">
              {/* Support Hours Card */}
              <div
                className="rounded-3xl p-3 border border-[#FFFFFF3B] w-full"
                style={{
                  background: "#FFFFFF33",
                  backdropFilter: "blur(1px)",
                  boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
                }}
              >
                <div className="relative overflow-hidden bg-white backdrop-blur-md rounded-2xl p-4 lg:p-6">
                  {/* Quarter-circle decorative element */}
                  <div className="absolute top-0 right-0 w-12 h-12 bg-[#EBC633] rounded-bl-full opacity-60"></div>
                  <div className="flex flex-col items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-black"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(153, 69, 255, 0.15) 0%, rgba(20, 241, 149, 0.15) 100%)",
                      }}
                    >
                      <BsClock className="text-xl" />
                    </div>
                    <div className="text-center text-center">
                      <h3 className="font-inter font-medium text-[#111827] text-lg">
                        Support Hours
                      </h3>
                      <p className="text-[#6B7280] font-inter text-sm">
                        2PM - 12AM ET
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div
                className="rounded-3xl p-3 border border-[#FFFFFF3B] w-full"
                style={{
                  background: "#FFFFFF33",
                  backdropFilter: "blur(1px)",
                  boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
                }}
              >
                <div className="relative overflow-hidden bg-white backdrop-blur-md rounded-2xl p-4 lg:p-6">
                  {/* Quarter-circle decorative element */}
                  <div className="absolute top-0 right-0 w-12 h-12 bg-[#DCFCE7] rounded-bl-full opacity-60"></div>
                  <div className="flex flex-col items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-black"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(153, 69, 255, 0.15) 0%, rgba(20, 241, 149, 0.15) 100%)",
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 30 23"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M27.4445 0.692871H2.55561C2.08411 0.692871 1.63193 0.880172 1.29853 1.21357C0.965133 1.54697 0.777832 1.99915 0.777832 2.47065V20.2484C0.777832 20.7199 0.965133 21.1721 1.29853 21.5055C1.63193 21.8389 2.08411 22.0262 2.55561 22.0262H27.4445C27.916 22.0262 28.3682 21.8389 28.7016 21.5055C29.035 21.1721 29.2223 20.7199 29.2223 20.2484V2.47065C29.2223 1.99915 29.035 1.54697 28.7016 1.21357C28.3682 0.880172 27.916 0.692871 27.4445 0.692871ZM26.0756 20.2484H4.03117L10.2534 13.8129L8.97339 12.5773L2.55561 19.2173V3.82176L13.6045 14.8173C13.9376 15.1484 14.3882 15.3343 14.8578 15.3343C15.3275 15.3343 15.7781 15.1484 16.1112 14.8173L27.4445 3.5462V19.1018L20.9023 12.5595L19.6489 13.8129L26.0756 20.2484ZM3.72005 2.47065H26.0045L14.8578 13.5551L3.72005 2.47065Z"
                          fill="black"
                        />
                      </svg>
                    </div>
                    <div className="text-center text-left md:text-center">
                      <h3 className="font-inter font-medium text-[#111827] text-lg">
                        Email
                      </h3>
                      <p className="text-[#6B7280] font-inter text-sm">
                        example@mealcheap.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Discord Card */}
              <div
                className="rounded-3xl p-3 border border-[#FFFFFF3B] w-full"
                style={{
                  background: "#FFFFFF33",
                  backdropFilter: "blur(1px)",
                  boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
                }}
              >
                <div className="relative overflow-hidden bg-white backdrop-blur-md rounded-2xl p-4 lg:p-6">
                  {/* Quarter-circle decorative element */}
                  <div className="absolute top-0 right-0 w-12 h-12 bg-[#DBEAFE] rounded-bl-full opacity-60"></div>
                  <div className="flex flex-col items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-black"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(153, 69, 255, 0.15) 0%, rgba(20, 241, 149, 0.15) 100%)",
                      }}
                    >
                      <LiaDiscord className="text-xl" />
                    </div>
                    <div className="text-center text-left md:text-center">
                      <h3 className="font-inter font-medium text-[#111827] text-lg">
                        Discord
                      </h3>
                      <p className="text-[#6B7280] font-inter text-sm">
                        Discord #Support
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right Side - Contact Form and Buttons */}
          <div className="w-full lg:w-2/3 lg:pl-8 mt-8 lg:mt-0">
            {/* Contact Form */}
            <div
              className="rounded-3xl p-4 lg:p-6 border border-[#FFFFFF3B] w-full"
              style={{
                background: "#FFFFFF33",
                backdropFilter: "blur(1px)",
                boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
              }}
            >
              <div className="bg-white rounded-2xl p-4 lg:p-8 shadow-lg">
                <h3 className="text-2xl font-inter font-bold text-[#374151] mb-2">
                  Get In Touch
                </h3>
                <p className="text-[#6B7280] font-inter text-sm mb-6">
                  Whether you need instant help or just want to leave a note,
                  we're here to listen.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-[#374151] font-inter font-medium text-sm mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#9945FF] focus:border-[#9945FF] font-inter"
                    />
                  </div>
                  {/* Email Field */}
                  <div>
                    <label className="block text-[#374151] font-inter font-medium text-sm mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#9945FF] focus:border-[#9945FF] font-inter"
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-[#374151] font-inter font-medium text-sm mb-2">
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us how we can help you?"
                      rows="4"
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#9945FF] focus:border-[#9945FF] font-inter resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="py-4 px-8 rounded-full font-inter font-bold text-white transition-all duration-300 hover:scale-105"
                    style={{
                      background:
                        "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
                    }}
                  >
                    SEND MESSAGE
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
