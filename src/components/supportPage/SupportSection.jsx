import React, { useState } from "react";
import { BsClock } from "react-icons/bs";
import { FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";
import reviewbg from "../../assets/images/reviewbg.png";
import hotdogImg from "../../assets/images/hotdog.png";
import friesImg from "../../assets/images/fries.png";
import { LiaDiscord } from "react-icons/lia";

const SupportSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const contactOptions = [
    {
      title: "General Support",
      description: "Our team is available 24/7 for any booking queries.",
      icon: <FiMail className="text-2xl" />,
      action: "help@premiumhotels.com",
      link: "mailto:help@premiumhotels.com"
    },
    {
      title: "Phone Support",
      description: "Call us directly for immediate assistance.",
      icon: <BsClock className="text-2xl" />,
      action: "+1 (800) PREMIUM",
      link: "tel:+18007736486"
    },
    {
      title: "Global Offices",
      description: "Visit us at our headquarters for corporate inquiries.",
      icon: <LiaDiscord className="text-2xl" />,
      action: "New York, NY 10001",
      link: "#"
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Subtle Decorator */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-booking-blue/[0.02] -skew-x-12 transform origin-top-right"></div>

      <div className="custom-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-start">

          {/* Left Side: Contact Information */}
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-4xl font-inter font-bold text-booking-black leading-tight">
                Get in touch with our <br />
                <span className="text-booking-blue">Professional Team</span>
              </h2>
              <p className="text-lg text-booking-gray-dark font-poppins leading-relaxed max-w-lg">
                Whether you have a question about a reservation, need assistance with your account, or want to provide feedback, we're here for you.
              </p>
            </div>

            <div className="grid sm:grid-cols-1 gap-8">
              {contactOptions.map((option, index) => (
                <div key={index} className="flex items-start space-x-6 group p-4 rounded-2xl hover:bg-booking-blue/[0.03] transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-booking-blue text-white flex items-center justify-center shadow-lg shadow-booking-blue/20 group-hover:scale-110 transition-transform duration-300">
                    {option.icon}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-inter font-bold text-booking-black">{option.title}</h3>
                    <p className="text-booking-gray-dark font-poppins text-sm">{option.description}</p>
                    <a href={option.link} className="inline-block text-booking-blue font-semibold hover:underline mt-1">{option.action}</a>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Proof/Awards Placeholder */}
            <div className="pt-8 border-t border-booking-gray-medium">
              <p className="text-sm font-semibold text-booking-gray-dark uppercase tracking-widest mb-4">Recognized for Excellence</p>
              <div className="flex gap-8 items-center opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="h-8 w-24 bg-booking-gray-dark/20 rounded"></div>
                <div className="h-8 w-24 bg-booking-gray-dark/20 rounded"></div>
                <div className="h-8 w-24 bg-booking-gray-dark/20 rounded"></div>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form Card */}
          <div className="relative">
            {/* Decorative Glow */}
            <div className="absolute -inset-4 bg-booking-blue/5 blur-2xl rounded-[3rem]"></div>

            <div className="relative bg-white border border-booking-gray-medium rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-inter font-bold text-booking-black mb-2">Send us a Message</h3>
                <p className="text-booking-gray-dark font-poppins text-sm mb-10">We usually respond within 2-4 hours.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-booking-black ml-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="w-full bg-booking-gray-light/50 border-none px-6 py-4 rounded-xl focus:ring-2 focus:ring-booking-blue/20 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-booking-black ml-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        className="w-full bg-booking-gray-light/50 border-none px-6 py-4 rounded-xl focus:ring-2 focus:ring-booking-blue/20 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-booking-black ml-1">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full bg-booking-gray-light/50 border-none px-6 py-4 rounded-xl focus:ring-2 focus:ring-booking-blue/20 transition-all appearance-none"
                    >
                      <option>General Inquiry</option>
                      <option>Booking Modification</option>
                      <option>Cancellation Request</option>
                      <option>Feedback & Suggestions</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-booking-black ml-1">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="5"
                      placeholder="How can we help you?"
                      className="w-full bg-booking-gray-light/50 border-none px-6 py-4 rounded-xl focus:ring-2 focus:ring-booking-blue/20 transition-all resize-none"
                    ></textarea>
                  </div>

                  <button className="w-full bg-booking-blue hover:bg-booking-blue-dark text-white font-bold py-5 rounded-xl shadow-xl shadow-booking-blue/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                    Send Premium Inquiry
                  </button>
                </form>
              </div>

              {/* Form Bottom Decorator */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-booking-blue/5 rounded-full blur-3xl"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SupportSection;
