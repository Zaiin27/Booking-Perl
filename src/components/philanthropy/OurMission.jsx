import React from "react";
import { BsLightningChargeFill } from "react-icons/bs";
import bgimg from "../../assets/images/bgimg.png";
import { FaHamburger, FaInstagram, FaUtensils } from "react-icons/fa";
import { FaPlay } from "react-icons/fa6";
import friesImg from "../../assets/images/fries.png";
import burgerImg from "../../assets/images/burger.png";
import OrderWithForkVideo from "../../assets/images/vidScreen.jpg";
import { RxLightningBolt } from "react-icons/rx";

const OurMission = () => {
  return (
    <section
      className="py-20 mt-[-150px] md:mt-[-120px] xl:mt-[-150px] relative overflow-hidden"
      style={{
        background: `url(${bgimg})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 top-28">
        {/* Top Section - Coming Up Next */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-16">
          {/* Left Side - Campaign Info */}
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0 lg:pr-12">
            {/* COMING UP NEXT Label */}
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
                Coming Up Next
              </span>
            </div>

            {/* Main Title */}
            <h2 className="text-3xl lg:text-4xl font-inter !font-bold text-white mb-6">
              Next Campaign Coming Soon
            </h2>

            {/* Description */}
            <p className="text-white/90 font-inter text-lg mb-8 leading-relaxed">
              We're already planning our next act of giving — bigger, better,
              and with more meals to share. Stay tuned as we continue our
              mission to fight hunger together.
            </p>

            {/* Get Involved Button */}
            <button className="bg-white py-4 px-8 rounded-full font-inter font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 relative">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #9945FF 0%, #14F195 100%)",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "exclude",
                  WebkitMask:
                    "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  padding: "1px",
                }}
              ></div>
              <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent relative z-10">
                GET INVOLVED
              </span>
              <RxLightningBolt className="text-lg relative z-10 text-[#EBC633]" />
            </button>
          </div>

          {/* Right Side - Smartphone Mockup */}
          <div className="w-full lg:w-1/2 relative">
            {/* Floating Background Images */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Hotdog - Top right corner, peeking behind */}
              <div
                className="absolute right-[-100px] top-[-60px] w-48 h-48 opacity-100"
                style={{
                  animation: "float 8s ease-in-out infinite",
                  animationDelay: "4s",
                }}
              >
                <img
                  src={burgerImg}
                  alt="Hotdog"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Burger - Bottom left corner, peeking behind */}
              <div
                className="absolute left-[-80px] bottom-[-20px] w-48 h-48 opacity-100"
                style={{
                  animation: "float 6s ease-in-out infinite",
                  animationDelay: "0s",
                }}
              >
                <img
                  src={friesImg}
                  alt="Burger"
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
            {/* Main Video Section */}
            <div className="max-w-7xl mx-auto mb-16">
              <div
                className="rounded-3xl p-6 border border-[#FFFFFF3B] max-w-7xl w-full"
                style={{
                  background: "#FFFFFF33",
                  backdropFilter: "blur(1px)",
                  boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
                }}
              >
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                  {/* Phone Mockup */}
                  <div className="relative mx-auto">
                    {/* Phone Frame */}
                    <div className="relative">
                      <div className="bg-white rounded-2xl overflow-hidden">
                        <img
                          src={OrderWithForkVideo}
                          alt="Order With Fork Video"
                          className="rounded-2xl w-full h-[45vh] object-cover"
                        />
                      </div>
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-full flex items-center justify-center shadow-2xl">
                        <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Card */}
        <div className="max-w-7xl mx-auto mb-24">
          <div
            className="rounded-3xl pt-6 px-6 border border-[#FFFFFF3B] max-w-7xl w-full"
            style={{
              background: "#FFFFFF33",
              backdropFilter: "blur(1px)",
              boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
            }}
          >
            <div className="bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl lg:text-2xl font-inter !font-bold text-white mb-4">
                  Join Our Mission
                </h3>
                <p className="text-white/90 font-inter text-lg mb-8 max-w-2xl mx-auto">
                  Let’s Make Difference Together with $FORK? <br />
                  Every 20 meals made with $FORK equals 200 meals donated to
                  those in need.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center">
                  <button className="bg-transparent border-2 border-[#EBC633] py-4 px-6 sm:px-8 rounded-full font-inter font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 relative w-full sm:w-auto sm:max-w-[280px]">
                    <FaInstagram className="text-lg relative z-10 text-[#EBC633]" />
                    <span className="text-[#EBC633] bg-transparent relative z-10 text-sm sm:text-base">
                      Follow @MealCheap
                    </span>
                  </button>
                  <button className="bg-white py-5 px-6 sm:px-8 rounded-full font-inter font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 relative w-full sm:w-auto sm:max-w-[300px]">
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, #9945FF 0%, #14F195 100%)",
                        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        maskComposite: "exclude",
                        WebkitMask:
                          "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        padding: "1px",
                      }}
                    ></div>
                    <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent relative z-10 text-sm sm:text-base">
                      START SAVING & GIVING
                    </span>
                    <BsLightningChargeFill
                      className="text-lg relative z-10 text-[#9945FF]"
                      style={{
                        background:
                          "linear-gradient(90deg, #9945FF 0%, #14F195 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurMission;
