import React, { useState } from "react";
import { BsClock, BsShieldCheck } from "react-icons/bs";
import { IoChevronDown } from "react-icons/io5";
import reviewbg from "../../assets/images/reviewbg.png";
import {
  HiOutlineLightningBolt,
  HiOutlineCurrencyDollar,
} from "react-icons/hi";
import { FiHelpCircle } from "react-icons/fi";

const FaqSection = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "What is MealCheap?",
      answer:
        "MealCheap is a revolutionary platform that helps you save money on food delivery by using $FORK cryptocurrency. We partner with restaurants to offer exclusive discounts and cashback rewards when you pay with $FORK tokens.",
      icon: <HiOutlineLightningBolt className="text-xl" />,
    },
    {
      id: 2,
      question: "How do you save me money?",
      answer:
        "We save you money through multiple channels: exclusive restaurant partnerships, $FORK token cashback rewards, reduced delivery fees, and special promotional offers. Every transaction earns you additional $FORK tokens for future savings.",
      icon: <HiOutlineCurrencyDollar className="text-xl" />,
    },
    {
      id: 3,
      question: "How much can I save using $FORK?",
      answer:
        "Users typically save 15-30% on their food orders when using $FORK tokens. The exact savings depend on the restaurant, order size, and current promotional offers. Plus, you earn additional $FORK tokens with every purchase.",
      icon: <BsClock className="text-xl" />,
    },
    {
      id: 4,
      question: "Do I need a wallet to use $FORK?",
      answer:
        "Yes, you'll need a compatible cryptocurrency wallet to store and use $FORK tokens. We support popular wallets like MetaMask, WalletConnect, and other Web3 wallets for seamless transactions.",
      icon: <BsClock className="text-xl" />,
    },
    {
      id: 5,
      question: "How quickly will my food arrive?",
      answer:
        "Delivery times vary by restaurant and location, typically ranging from 20-45 minutes. We work with local restaurants to ensure the fastest possible delivery while maintaining food quality and safety standards.",
      icon: <BsClock className="text-xl" />,
    },
    {
      id: 6,
      question: "How much can I save using $FORK?",
      answer:
        "Users typically save 15-30% on their food orders when using $FORK tokens. The exact savings depend on the restaurant, order size, and current promotional offers. Plus, you earn additional $FORK tokens with every purchase.",
      icon: <BsClock className="text-xl" />,
    },
    {
      id: 7,
      question: "Is my payment information secure?",
      answer:
        "Meals are provided through trusted partners like the Feeding America Foundation, reaching families in need across communities.",
      icon: <BsShieldCheck className="text-xl" />,
    },
    {
      id: 8,
      question: "How can I track the impact of my purchases?",
      answer:
        "You can track your impact through our dashboard, which shows meals donated, organizations supported, and community impact metrics. Every purchase contributes to our philanthropic initiatives.",
      icon: <FiHelpCircle className="text-xl" />,
    },
    {
      id: 9,
      question: "Can I suggest an organization for future donations?",
      answer:
        "Absolutely! We welcome suggestions for organizations to partner with. You can submit recommendations through our contact form, and our team will review them for potential partnerships.",
      icon: <FiHelpCircle className="text-xl" />,
    },
    {
      id: 10,
      question: "How do I know my personal information is safe?",
      answer:
        "We use industry-standard encryption and security protocols to protect your personal information. We never share your data with third parties without your explicit consent.",
      icon: <FiHelpCircle className="text-xl" />,
    },
    {
      id: 11,
      question: "How can I get involved beyond ordering?",
      answer:
        "You can volunteer with our partner organizations, participate in community events, or become a $FORK token holder to support our mission of making food more accessible to everyone.",
      icon: <FiHelpCircle className="text-xl" />,
    },
    {
      id: 12,
      question: "Can I suggest an organization for future donations?",
      answer:
        "Absolutely! We welcome suggestions for organizations to partner with. You can submit recommendations through our contact form, and our team will review them for potential partnerships.",
      icon: <FiHelpCircle className="text-xl" />,
    },
  ];

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 top-48">
        {/* Section Header */}
        <div className="text-center mb-16">
          {/* GOT QUESTIONS Label */}
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
              GOT QUESTIONS
            </span>
          </div>

          <h2 className="text-3xl lg:text-[32px] font-inter font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[15px] text-white/80 font-inter max-w-2xl mx-auto">
            Everything you need to know about MealCheap and how we help you save
            on every order.
          </p>
        </div>

        {/* FAQ Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-72">
          {/* Left Column - 6 cards */}
          <div className="space-y-6">
            {faqs.slice(0, 6).map((faq) => (
              <div
                key={faq.id}
                className="rounded-3xl p-4 border border-[#FFFFFF3B]"
                style={{
                  background: "#FFFFFF33",
                  backdropFilter: "blur(1px)",
                  boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
                }}
              >
                <div className="relative bg-white backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300 shadow-lg">
                  {/* FAQ Header */}
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          openFaq === faq.id ? "text-white" : "text-black"
                        }`}
                        style={{
                          background:
                            openFaq === faq.id
                              ? "linear-gradient(135deg, #9945FF 0%, #14F195 100%)"
                              : "linear-gradient(90deg, rgba(153, 69, 255, 0.15) 0%, rgba(20, 241, 149, 0.15) 100%)",
                        }}
                      >
                        {faq.icon}
                      </div>

                      {/* Question */}
                      <h3 className="font-inter !font-bold text-[#111827] text-md">
                        {faq.question}
                      </h3>
                    </div>

                    {/* Arrow */}
                    <IoChevronDown
                      className={`text-2xl text-black transition-transform duration-300 ${
                        openFaq === faq.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* Answer */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === faq.id ? "max-h-96 mt-4" : "max-h-0"
                    }`}
                  >
                    <p className="text-[#374151] font-inter leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column - 5 cards */}
          <div className="space-y-6">
            {faqs.slice(6, 12).map((faq) => (
              <div
                key={faq.id}
                className="rounded-3xl p-4 border border-[#FFFFFF3B]"
                style={{
                  background: "#FFFFFF33",
                  backdropFilter: "blur(1px)",
                  boxShadow: "0px 8px 32px rgba(59, 130, 246, 0.2)",
                }}
              >
                <div className="relative bg-white backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300 shadow-lg">
                  {/* FAQ Header */}
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          openFaq === faq.id ? "text-white" : "text-black"
                        }`}
                        style={{
                          background:
                            openFaq === faq.id
                              ? "linear-gradient(135deg, #9945FF 0%, #14F195 100%)"
                              : "linear-gradient(90deg, rgba(153, 69, 255, 0.15) 0%, rgba(20, 241, 149, 0.15) 100%)",
                        }}
                      >
                        {faq.icon}
                      </div>

                      {/* Question */}
                      <h3 className="font-inter !font-bold text-[#111827] text-md">
                        {faq.question}
                      </h3>
                    </div>

                    {/* Arrow */}
                    <IoChevronDown
                      className={`text-2xl text-black transition-transform duration-300 ${
                        openFaq === faq.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* Answer */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === faq.id ? "max-h-96 mt-4" : "max-h-0"
                    }`}
                  >
                    <p className="text-[#111827] font-inter leading-relaxed border-t border-gray-100 pt-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
