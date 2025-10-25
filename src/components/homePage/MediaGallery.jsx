import React from "react";
import reviewbg from "../../assets/images/reviewbg.png";
import hotdogImg from "../../assets/images/hotdog.png";
import friesImg from "../../assets/images/fries.png";
import galleryImagesData from "../../data/galleryImages.json";
import {
  Delicious_Food_Collection, Fresh_Ingredients, Gourmet_Experience, Culinary_Art, Tasty_Delights, Food_Presentation,
  Restaurant_Quality, Behind_The_Scenes, Kitchen_Magic, Food_Preparation,
  Quality_Meals, Fresh_and_Tasty,food,pasta,burger1,cock,pizza,wrap,tasty,boxs,cam,lint,candy,apart,FG2
} from "../../assets/images/index.js";

const MediaGallery = () => {
  // Gallery images array - only first 12 images
  const galleryImages = [
    Delicious_Food_Collection, Fresh_Ingredients, Gourmet_Experience, Culinary_Art, Tasty_Delights, Food_Presentation,
    Restaurant_Quality, Behind_The_Scenes, Kitchen_Magic, Food_Preparation,
    Quality_Meals, Fresh_and_Tasty,food,pasta,burger1,cock,pizza,wrap,tasty,boxs,cam,lint,candy,apart,FG2
  ];

  return (
    <section
      className="py-20 mt-[-200px] md:mt-[-190px] xl:mt-[-140px] relative overflow-hidden"
      style={{
        background: `url(${reviewbg})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Floating Background Images */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        {/* Hotdog - Top right corner, peeking behind */}
       

      </div>


      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 top-16 sm:top-20 md:top-16">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-6">
          <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-[#9945FF]/10 border border-[#9945FF]/20 mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent text-sm sm:text-base">
              Real Orders
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-inter font-bold text-white mb-4 sm:mb-6 px-4">
          See What People Are Ordering
          </h2>
          <div className="flex items-center justify-center space-x-4 px-4">
            <p className="text-base sm:text-lg text-white/70 font-poppins max-w-3xl">
              Real orders from real customers saving big with MealCheap
            </p>
          </div>
        </div>

        {/* Main Content Container with Light Gray Background */}
        <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto">
          <div
            className="rounded-3xl p-4 sm:p-6"
          
          >
            {/* Image Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-2 sm:p-4">
              {galleryImagesData.galleryImages.slice(0, 25).map((image, index) => (
                <div
                  key={image.id}
                  className="w-full h-[6rem] sm:h-[7rem] lg:h-[10rem] xl:h-[10rem] rounded-lg border border-white/20 hover:border-[#9945FF]/50 transition-all duration-300 flex items-center justify-center shadow-sm hover:shadow-md overflow-hidden"
                >
                  <img 
                    src={galleryImages[index]} 
                    alt={image.alt} 
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden text-gray-400 text-xs sm:text-sm">Image {image.id}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaGallery;
