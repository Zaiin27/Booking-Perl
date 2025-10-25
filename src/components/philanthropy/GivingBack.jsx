import React from "react";
import StoryImg from "../../assets/images/storyimg.png";
import { FaRegHeart } from "react-icons/fa";
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
              FIRST CAMPAIGN SPOTLIGHT
            </span>
          </div>

          <h2 className="text-4xl lg:text-[32px] font-inter !font-bold text-white mb-4">
            Our First Campaign — Feeding America <br /> Foundation Partnership.
          </h2>
          <p className="text-[15px] text-[#EDEDED] font-poppins max-w-2xl mx-auto">
            Every 20 meals made with $FORK equals 200 meals donated to those in
            need.
          </p>
        </div>

        {/* Main Campaign Card */}
        <div className="max-w-7xl mx-auto mb-48">
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
                      Providing warm meals to those experiencing <br />{" "}
                      homelessness in Boston
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
                      America Feeding Foundation
                    </span>
                  </div>
                  {/* Campaign Description */}
                  <div className="mb-8">
                    <p className="text-[#374151] font-inter leading-8">
                      In our latest philanthropic initiative, we’ve partnered
                      with the Feeding America Foundation to make a real
                      difference. For every 20 meals made with $FORK, 200 meals
                      are donated to help fight hunger across communities.
                      <br /> This campaign isn’t just about meals — it’s about
                      hope, dignity, and support for families who need it most.
                      Together with our community, we’re proving that everyday
                      choices can create extraordinary impact.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white py-4 px-8 rounded-full font-inter text-md font-bold transition-all duration-300 hover:scale-105">
                      SEE FULL STORY
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GivingBack;
