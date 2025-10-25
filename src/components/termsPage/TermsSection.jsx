import React from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import reviewbg from "../../assets/images/reviewbg.png";

const TermsSection = () => {
  const termsContent = [
    {
      id: 1,
      title: "Acceptance of Terms",
      content:
        'By accessing or using MealCheap / Forkward ("we," "our," or "the Service"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our Service. Continued use of the Service after changes are posted will constitute your acceptance of such changes.',
    },
    {
      id: 2,
      title: "Description of Service",
      content:
        "MealCheap / Forkward acts as a purchasing intermediary and merchant of record. When you place an order, you authorize us to place a corresponding food delivery order with third-party platforms (such as Uber Eats, DoorDash, HelloFresh, etc.) on your behalf. We process your payment directly and handle any related customer service or refund inquiries. Please note: we are not a food delivery company ourselves — we facilitate discounted orders through existing delivery platforms using our own corporate accounts.",
    },
    {
      id: 3,
      title: "User Responsibilities",

      bulletPoints: [
        "Provide accurate and complete information when placing orders (delivery addresses, contact details, etc.).",
        "Maintain the confidentiality of your account credentials.",
        "Not misuse the platform (e.g., fraudulent orders or abuse of promotions).",
        "Understand that once an order is placed and confirmed, it cannot be canceled unless otherwise stated.",
        "Ensure you have sufficient funds for payment.",
        "Report any suspicious activity immediately.",
        "Accept full responsibility for all activities under your account.",
      ],
    },
    {
      id: 4,
      title: "Order Processing and Payment Terms",
      content:
        "By submitting payment through MealCheap / Forkward, you authorize us to charge your chosen payment method for the full order amount.",
      bulletPoints: [
        "All prices are displayed in the specified currency.",
        "Prices may or may not include delivery fees, tips, or applicable taxes (unless explicitly stated).",
        "Payment must be processed before we place your order with a third-party platform.",
      ],
    },
    {
      id: 5,
      title: "Delivery and Refunds",
      content: "Once an order is delivered, we generally do not issue refunds.",
      bulletPoints: [
        "We are not liable for the actions, delays, or mistakes of third-party delivery services.",
        "Any delivery-related issues (late driver, missing items, cold food, etc.) must be directed to the respective delivery provider.",
      ],
      additionalNote:
        "Refunds are issued only at our sole discretion, usually in cases of fraud, platform errors, or undelivered orders. Dissatisfaction with food quality or delivery service does not guarantee a refund.",
    },
    {
      id: 6,
      title: "SMS/Text Message Terms",
      content:
        "By opting into MealCheap / Forkward's SMS/Text Message Service, you agree to receive recurring texts (updates, order confirmations, promotions) to the mobile number you provide.",
      bulletPoints: [
        "Message and data rates may apply.",
        "Frequency varies.",
        "You can opt out at any time by replying STOP.",
        "For help, text HELP or email us at [support@mealcheap.com].",
      ],
      additionalNote:
        "We may change short codes or numbers used to send messages. We are not responsible for delayed or undelivered texts.",
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
          className="rounded-3xl p-4 border border-[#FFFFFF3B] w-full z-50 mt-[-80px] mb-[80px]"
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
                className="flex items-center justify-center relative overflow-hidden rounded-full py-2 px-6 font-outfit font-bold text-sm transition-all duration-300 mb-4"
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
                MealCheap / Forkward — Terms of Service
              </h1>

              {/* Last Updated */}
              <p className="text-[#374151] text-[15px] font-poppins">
                Last Updated: 19-AUGUST-2025
              </p>
            </div>

            {/* Terms Content */}
            <div className="space-y-8">
              {termsContent.map((term) => (
                <div key={term.id} className="pb-6">
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
                            {term.id}
                          </span>
                        </div>
                        <h2 className="text-xl font-inter font-bold text-[#374151]">
                          {term.title}
                        </h2>
                      </div>
                      <p className="text-[#374151] text-lg font-inter leading-relaxed mb-3">
                        {term.content}
                      </p>

                      {/* Bullet Points */}
                      {term.bulletPoints && (
                        <ul className="space-y-2">
                          {term.bulletPoints.map((point, index) => (
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
                      {term.additionalNote && (
                        <div className="mt-4 p-4">
                          <p className="text-[#374151] text-lg font-inter leading-relaxed">
                            {term.additionalNote}
                          </p>
                        </div>
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

export default TermsSection;
