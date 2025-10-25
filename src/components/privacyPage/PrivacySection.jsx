import React from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import reviewbg from "../../assets/images/reviewbg.png";

const PrivacySection = () => {
  const privacyContent = [
    {
      id: 1,
      title: "Information We Collect",
      content: "We may collect the following types of information:",
      bulletPoints: [
        "**Personal Information:** Name, email, phone number, delivery address, and payment details.",
        "**Account Information:** Login credentials, preferences, saved addresses.",
        "**Order Data:** Items ordered, delivery instructions, and transaction history.",
        "**Device & Usage Data:** IP address, browser type, operating system, and site activity.",
        "**SMS/Text Data:** If you opt in to text alerts, we may collect and store your number, opt-in/opt-out preferences, and SMS logs.",
      ],
    },
    {
      id: 2,
      title: "How We Use Your Information",
      content: "We use collected data to:",
      bulletPoints: [
        "Process and deliver your food orders.",
        "Provide customer service and support.",
        "Communicate updates, promotions, and offers.",
        "Improve our platform, services, and user experience.",
        "Ensure account and transaction security.",
        "Fulfill legal, tax, and regulatory requirements.",
        "Track and report on philanthropic meal donations.",
      ],
    },
    {
      id: 3,
      title: "Sharing of Information",
      content:
        "We do not sell or rent your personal information. However, we may share information with:",
      bulletPoints: [
        "**Delivery Platforms** (Uber Eats, DoorDash, etc.) to place and fulfill your orders.",
        "**Service Providers** (payment processors, SMS providers, hosting services) who help us operate.",
        "**Philanthropic Partners** (e.g., Feeding America Foundation) — only aggregate impact data, never your personal details.",
        "**Legal Authorities** when required by law, regulation, or to prevent fraud/abuse.",
      ],
    },
    {
      id: 4,
      title: "Cookies & Tracking Technologies",
      content: "We use cookies, pixels, and similar tools to:",
      bulletPoints: [
        "Keep you logged in.",
        "Save your preferences.",
        "Analyze traffic and improve performance.",
        "Deliver relevant promotions and offers.",
      ],
      additionalNote:
        "You can manage cookie preferences in your browser, but some features may not work properly without them.",
    },
    {
      id: 5,
      title: "Data Security",
      content:
        "We implement technical, administrative, and physical safeguards to protect your data. While no system is 100% secure, we take reasonable steps to prevent unauthorized access, disclosure, alteration, or loss of your information.",
    },
    {
      id: 6,
      title: "Data Retention",
      content:
        "We retain your information only as long as necessary to provide our services and comply with legal obligations. You may request account deletion at any time by contacting us.",
    },
    {
      id: 7,
      title: "Children's Privacy",
      content:
        "MealCheap / Forkward is not directed toward individuals under 13. We do not knowingly collect personal data from children. If we become aware that a child has provided information, we will delete it.",
    },
  ];

  return (
    <section
      className="py-20 mt-[-160px] md:mt-[-150px] xl:mt-[-160px] relative overflow-hidden"
      style={{
        background: `url(${reviewbg})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ">
        {/* Blue Glass Effect Background */}
        <div
          className="rounded-3xl p-4 border border-[#FFFFFF3B] w-full z-50 mt-[-40px] mb-[80px]"
          style={{
            background: "#FFFFFF33",
            backdropFilter: "blur(1px)",
            boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
          }}
        >
          {/* Main Terms Card */}
          <div className="rounded-3xl p-8 md:p-12 bg-white border border-white/20">
            {/* Header Section */}
            <div className="mb-8">
              {/* Check Icon */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
                }}
              >
                <FaRegCheckCircle className="text-white text-xl" />
              </div>

              {/* READ CAREFULLY Label */}
              <button
                className="flex items-center justify-center relative overflow-hidden rounded-full py-2 px-4 font-outfit font-bold text-sm transition-all duration-300 mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(153, 69, 255, 0.1) 0%, rgba(20, 241, 149, 0.1) 100%)",
                }}
              >
                {/* Gradient Border */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#9945FF] to-[#14F195] p-[1px]">
                  <div className="w-full h-full rounded-full bg-[#E9fbf6]"></div>
                </div>
                {/* Button Text */}
                <span className="relative z-10 bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
                  READ CAREFULLY
                </span>
              </button>

              {/* Main Title */}
              <h1 className="text-2xl md:text-[32px] font-inter !font-bold text-[#3B3B3B] mb-2">
                MealCheap / Forkward — Privacy Policy
              </h1>

              {/* Last Updated */}
              <p className="text-[#374151] text-[15px] font-poppins">
                Last Updated: 19-AUGUST-2025
              </p>
            </div>

            {/* Privacy Content */}
            <div className="space-y-8">
              {privacyContent.map((section) => (
                <div key={section.id} className="pb-6">
                  <div className="flex items-start gap-4">
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex justify-start items-center gap-4 w-full mb-4">
                        {/* Number Circle */}
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-white"
                          style={{
                            background:
                              "linear-gradient(90deg, rgba(153, 69, 255, 0.4) 0%, rgba(20, 241, 149, 0.4) 100%)",
                            boxShadow:
                              "0px 0px 0px 0px #00000000, 0px 0px 0px 0px #00000000, 0px 8.28px 12.42px -2.48px #0000001A, 0px 3.31px 4.97px -3.31px #0000001A",
                          }}
                        >
                          <span className="text-black font-inter font-bold text-sm">
                            {section.id}
                          </span>
                        </div>
                        <h2 className="text-lg font-inter font-semibold text-[#374151]">
                          {section.title}
                        </h2>
                      </div>
                      <p className="text-[#374151] text-lg font-inter leading-relaxed mb-3">
                        {section.content}
                      </p>

                      {/* Bullet Points */}
                      {section.bulletPoints && (
                        <ul className="space-y-2">
                          {section.bulletPoints.map((point, index) => (
                            <li
                              key={index}
                              className="text-[#374151] text-lg font-inter leading-relaxed flex items-start"
                            >
                              <span className="text-[#000000] mr-2 mt-1">
                                •
                              </span>
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: point.replace(
                                    /\*\*(.*?)\*\*/g,
                                    "<strong>$1</strong>"
                                  ),
                                }}
                              />
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Additional Note */}
                      {section.additionalNote && (
                        <p className="text-[#374151] text-lg font-inter leading-relaxed mt-3 italic">
                          {section.additionalNote}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 justify-center sm:justify-start">
              {/* LOAD MORE Button */}
              <button
                className="px-8 py-4 text-white font-inter font-bold rounded-full hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                style={{
                  background:
                    "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
                }}
              >
                LOAD MORE
              </button>

              {/* FOLLOW @MEALCHEAP Button */}
              <div
                className="rounded-full p-[2px] relative w-full sm:w-auto"
                style={{
                  background:
                    "linear-gradient(135deg, #9945FF 0%, #14F195 100%)",
                }}
              >
                <div
                  className="absolute inset-[2px] rounded-full"
                  style={{
                    background: "transparent",
                  }}
                ></div>
                {/* Button */}
                <button
                  className="flex items-center justify-center relative overflow-hidden rounded-full py-4 px-4 font-inter font-semibold text-sm transition-all duration-300 w-full"
                  style={{
                    background: "#eef5fa",
                  }}
                >
                  {/* Button Text */}
                  <FaInstagram className="text-[#14F195] text-lg mr-2" />
                  <span className="relative z-10 bg-gradient-to-r from-[#9945FF] to-[#14F195] bg-clip-text text-transparent">
                    FOLLOW @MEALCHEAP
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrivacySection;
