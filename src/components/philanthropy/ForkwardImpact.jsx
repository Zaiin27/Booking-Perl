import React from "react";
import bgimg from "../../assets/images/bgimg.png";
import hotdogImg from "../../assets/images/hotdog.png";
import friesImg from "../../assets/images/fries.png";

const ForkwardImpact = () => {
  return (
    <section
      className="py-20 mt-[-140px] md:mt-[-110px] xl:mt-[-150px] relative overflow-hidden"
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
          {/* DECENTRALIZED DINING EXPLAINED Label */}
          <div
            className="inline-flex items-center px-4 py-2 mb-6  rounded-full relative"
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
              Save 70% on every order
            </span>
          </div>

          <h2 className="text-2xl lg:text-[32px] font-inter !font-bold text-white mb-4">
            Forkward Impact Counters
          </h2>
          <p className="text-[15px] text-white/80 font-inter max-w-2xl mx-auto">
            Live stats to highlight program reach and transparency
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-28 justify-center mb-40">
          {/* Floating Background Images */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Hotdog - Top right corner, peeking behind */}
            <div
              className="absolute right-[240px] top-[110px] w-40 h-40 opacity-100"
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

            {/* Burger - Bottom left corner, peeking behind */}
            <div
              className="absolute right-[-50px] bottom-[-20px] w-40 h-40 opacity-100"
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
          {/* 03+ Meals Donated */}
          <div
            className="rounded-3xl p-3 border border-[#FFFFFF3B] w-full"
            style={{
              background: "#FFFFFF33",
              backdropFilter: "blur(1px)",
              boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
            }}
          >
            <div className="relative bg-white backdrop-blur-md rounded-2xl p-6 text-center overflow-hidden">
              {/* Quarter-circle decorative element */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-[#FDE68A] rounded-bl-full opacity-60"></div>
              <div className="text-4xl font-inter font-bold mb-2 bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
                03+
              </div>
              <div className="text-[#374151] font-inter font-medium text-sm mb-1">
                Partner Organizations
              </div>
              <div className="text-[#374151] font-inter text-xs">
                And counting...
              </div>
            </div>
          </div>

          {/* 200+ Meals Donated */}
          <div
            className="rounded-3xl p-3 border border-[#FFFFFF3B] w-full"
            style={{
              background: "#FFFFFF33",
              backdropFilter: "blur(1px)",
              boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
            }}
          >
            <div className="relative bg-white backdrop-blur-md rounded-2xl p-6 text-center overflow-hidden">
              {/* Quarter-circle decorative element */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-[#DCFCE7] rounded-bl-full opacity-60"></div>
              <div className="text-4xl font-inter font-bold mb-2 bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
                200+
              </div>
              <div className="text-[#374151] font-inter font-medium text-sm mb-1">
                Meals Donated
              </div>
              <div className="text-[#374151] font-inter text-xs">
                Real change
              </div>
            </div>
          </div>

          {/* 100+ Transparent */}
          <div
            className="rounded-3xl p-3 border border-[#FFFFFF3B] w-full"
            style={{
              background: "#FFFFFF33",
              backdropFilter: "blur(1px)",
              boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
            }}
          >
            <div className="relative bg-white backdrop-blur-md rounded-2xl p-6 text-center overflow-hidden">
              {/* Quarter-circle decorative element */}
              <div className="absolute top-0 right-0 w-12 h-12 bg-[#DBEAFE] rounded-bl-full opacity-60"></div>
              <div className="text-4xl font-inter font-bold mb-2 bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
                100+
              </div>
              <div className="text-[#374151] font-inter font-medium text-sm mb-1">
                Lives Impacted
              </div>
              <div className="text-[#374151] font-inter text-xs">
                Every meal tracked
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForkwardImpact;
