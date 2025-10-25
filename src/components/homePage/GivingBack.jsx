import React from "react";
import { BsLightningCharge } from "react-icons/bs";
import StoryImg from "../../assets/images/storyimg.png";
import { FaRegHeart } from "react-icons/fa";
import InstagramIcon from "../../assets/icons/InstagramIcon.svg";
import bgimg from "../../assets/images/bgimg.png";

const GivingBack = () => {
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 top-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* GIVING BACK Label */}
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
            <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent text-sm font-inter font-medium">
              GIVING BACK
            </span>
          </div>

          <h2 className="text-4xl lg:text-[32px] font-inter !font-bold text-white mb-4">
            Let's Make Difference Together with $FORK?
          </h2>
          <p className="text-[15px] text-[#EDEDED] font-poppins max-w-2xl mx-auto">
            Every 20 meals made with $FORK is 200 meals toward them.
          </p>
        </div>

        {/* Main Campaign Card */}
        <div className="max-w-7xl mx-auto mb-16">
          <div
            className="rounded-3xl p-6 border border-[#FFFFFF3B] max-w-7xl w-full"
            style={{
              background: "#FFFFFF33",
              backdropFilter: "blur(1px)",
              boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
            }}
          >
            <div className="relative bg-white backdrop-blur-md rounded-2xl border border-[#16A34A82] overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                {/* Left Section - Image and Campaign Overview */}
                <div className="lg:w-1/2 relative">
                  {/* Campaign Image */}
                  <div className="relative h-64 lg:h-full">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={StoryImg}
                        alt="Giving Back"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Success Story Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-gradient-to-r from-[#9945FF] to-[#14F195]  text-white px-3 py-1 rounded-full text-xs font-inter font-medium">
                      SUCCESS STORY
                    </div>
                  </div>

                  {/* Campaign Title Overlay */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-inter !font-bold mb-1">
                      Feeding America Campaign
                    </h3>
                    <p className="text-lg font-inter text-[#EDEDED] opacity-90">
                      Providing warm meals to those experiencing homelessness in
                      Boston
                    </p>
                  </div>
                </div>

                {/* Right Section - Campaign Statistics and Actions */}
                <div className="lg:w-1/2 p-6 lg:p-8">
                  {/* Campaign Header */}
                  <div className="flex items-center mb-6">
                    <div
                      className="mr-3 p-3 rounded-full flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(153, 69, 255, 0.15) 0%, rgba(20, 241, 149, 0.15) 100%)",
                      }}
                    >
                      <FaRegHeart className="text-xl" />
                    </div>
                    <span className="text-lg font-inter font-semibold text-[#374151]">
                      Our First Campaign
                    </span>
                  </div>
                  {/* Campaign Description */}
                  <div className="mb-8">
                    <p className="text-[#374151] font-inter mb-4">
                      Partnered with{" "}
                      <span className="text-[#16A34A] font-semibold">
                        Feeding America Foundation
                      </span>
                      :
                    </p>
                    <p className="text-[#374151] font-inter">
                      "Every 20 meals made with $FORK is 200 meals toward them"
                    </p>
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-2 bg-gradient-to-r from-[#9945FF]/20 to-[#14F195]/20 rounded-xl text-center p-4 mb-8">
                    <div className="text-center border-r border-white">
                      <div className="text-3xl font-inter font-bold text-[#111827] mb-1">
                        20
                      </div>
                      <div className="text-sm font-medium font-inter text-[#374151]">
                        Every Meals Provided
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-inter font-bold text-[#111827] mb-1">
                        200+
                      </div>
                      <div className="text-sm font-medium font-inter text-[#374151]">
                        $FORK Meal
                      </div>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white py-4 px-5 rounded-full font-inter text-md font-bold transition-all duration-300 hover:scale-105">
                      SEE FULL STORY
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-[#9945FF]/10 to-[#14F195]/10 text-white py-4 px-5 rounded-full font-inter font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 relative">
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
                      <img
                        src={InstagramIcon}
                        alt="Instagram"
                        className="w-5 h-5 relative z-10"
                      />
                      <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent text-sm font-inter font-extrabold relative z-10">
                        FOLLOW @MEALCHEAP
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action Card */}
        <div className="max-w-7xl mx-auto mb-40">
          <div
            className="rounded-3xl p-6 border border-[#FFFFFF3B] max-w-7xl w-full"
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
                <p className="text-white/90 font-inter text-lg mb-8 max-w-xl mx-auto">
                  Every order helps us give back. Start saving and making a
                  difference today.
                </p>
                <button className="bg-white py-4 px-8 rounded-full font-inter font-bold flex items-center justify-center gap-2 mx-auto transition-all duration-300 hover:scale-105 relative">
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
                    START SAVING & GIVING
                  </span>
                  <BsLightningCharge
                    className="text-lg relative z-10"
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
    </section>
  );
};

export default GivingBack;
