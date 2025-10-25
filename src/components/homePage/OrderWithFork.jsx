import React from "react";
import OrderWithForkVideo from "../../assets/images/vidScreen.jpg";
import bgimg from "../../assets/images/bgimg.png";

const OrderWithFork = () => {
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
              Decentralized Dining Explained
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-inter !font-bold text-white mb-4">
            Ordering with $FORK? It's This Easy.
          </h2>
          <p className="text-xl text-white/80 font-inter max-w-2xl mx-auto">
            Watch how to drop food prices, pay with $FORK, and help feed others
            - in under 60 seconds.
          </p>
        </div>

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

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto mb-28 justify-center mb-40">
          {/* 60+ Meals Donated */}
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
                60+
              </div>
              <div className="text-[#374151] font-inter font-medium text-sm mb-1">
                Meals Donated
              </div>
              <div className="text-[#374151] font-inter text-xs">
                And counting...
              </div>
            </div>
          </div>

          {/* $1,000+ Community Impact */}
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
                $1,000+
              </div>
              <div className="text-[#374151] font-inter font-medium text-sm mb-1">
                Community Impact
              </div>
              <div className="text-[#374151] font-inter text-xs">
                Real change
              </div>
            </div>
          </div>

          {/* 100% Transparent */}
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
                100%
              </div>
              <div className="text-[#374151] font-inter font-medium text-sm mb-1">
                Transparent
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

export default OrderWithFork;
