import React from "react";
import { BsLightningCharge, BsLightningChargeFill } from "react-icons/bs";
import bgimg from "../../assets/images/bgimg.png";
import { FaHamburger, FaInstagram, FaUtensils } from "react-icons/fa";
import { FaPlay } from "react-icons/fa6";
import friesImg from "../../assets/images/fries.png";
import burgerImg from "../../assets/images/burger.png";
import OrderWithForkVideo from "../../assets/images/vidScreen.jpg";

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
        {/* Call to Action Card */}
        <div className="max-w-7xl mx-auto mb-24">
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
                  Let’s Make Difference Together with $FORK?
                  <br />
                  Every 20 meals converted into 200 meals toward them. Join our
                  mission!
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
