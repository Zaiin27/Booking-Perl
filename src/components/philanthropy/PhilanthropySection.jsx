import React, { useState } from "react";
import reviewbg from "../../assets/images/reviewbg.png";
import burgerImg from "../../assets/images/burger.png";
import scene1 from "../../assets/images/scene1.png";
import scene2 from "../../assets/images/scene2.png";
import scene3 from "../../assets/images/scene3.png";
import storyImg from "../../assets/images/storyimg.png";

const PhilanthropySection = () => {
  const [openFaq, setOpenFaq] = useState(null);

  // Using local images from assets folder
  const galleryImages = [
    {
      id: 1,
      title: "Delivery Truck",
      description: "Fresh produce delivery",
      image: scene1,
      alt: "Open back of white delivery truck with fresh produce crates",
    },
    {
      id: 2,
      title: "Volunteer Team",
      description: "Community service",
      image: scene2,
      alt: "Two volunteers in VOLUNTEER t-shirts behind donation table",
    },
    {
      id: 3,
      title: "Food Distribution",
      description: "Helping hands",
      image: storyImg,
      alt: "Woman with ID badge handing food to older man",
    },
    {
      id: 4,
      title: "Fresh Produce",
      description: "Quality ingredients",
      image: scene3,
      alt: "Person holding wooden crate with fresh produce",
    },
  ];

  return (
    <section
      className="py-20 mt-[-200px] md:mt-[-150px] xl:mt-[-160px] relative overflow-hidden"
      style={{
        background: `url(${reviewbg})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 top-24">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* BEHIND THE SCENES Label */}
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
              BEHIND THE SCENES
            </span>
          </div>

          <h2 className="text-4xl lg:text-[32px] font-inter !font-bold text-white mb-4">
            Media Gallery _ Behind The Scenes
          </h2>
          <p className="text-[15px] text-[#EDEDED] font-poppins max-w-2xl mx-auto">
            Watch how to drop food prices, pay with $FORK, and help feed others
            – in under 60 seconds.
          </p>
        </div>

        {/* Floating Background Images */}
        <div className="absolute inset-0 pointer-events-none">
          {/* burger - Top right corner, peeking behind */}
          <div
            className="absolute left-[-20px] top-40 md:w-48 md:h-48 w-32 h-32 opacity-100"
            style={{
              animation: "float 8s ease-in-out infinite",
              animationDelay: "4s",
            }}
          >
            <img
              src={burgerImg}
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

        {/* Image Gallery Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="rounded-3xl p-6 border border-white/20 bg-white/5 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {galleryImages.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:scale-105 transition-all duration-300"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="font-inter font-bold text-lg">
                          {item.title}
                        </h3>
                        <p className="text-sm text-white/80">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Load More Button */}
        <div className="text-center mb-40">
          <button className="bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white py-4 px-8 rounded-full font-inter font-bold text-lg uppercase hover:scale-105 transition-all duration-300 shadow-lg">
            Load More
          </button>
        </div>
      </div>
    </section>
  );
};

export default PhilanthropySection;
