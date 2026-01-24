import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useContactSupportMutation } from "../services/Api";
import { toastUtils } from "../utils/toastUtils";
import { FiPhone, FiMail, FiMapPin, FiGlobe, FiShield, FiStar } from "react-icons/fi";
import BackgroundImg from "../assets/images/herobg.png";

const ContactPage = () => {
  const [contactSupport, { isLoading }] = useContactSupportMutation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toastUtils.error("Please enter both first and last name");
      return;
    }

    if (!formData.email.trim()) {
      toastUtils.error("Please enter your email address");
      return;
    }

    if (!formData.message.trim()) {
      toastUtils.error("Please enter your message");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toastUtils.error("Please enter a valid email address");
      return;
    }

    try {
      const contactData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      };

      const result = await contactSupport(contactData);

      if (result.data) {
        toastUtils.success("Message sent successfully! We'll get back to you soon.");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        });
      } else if (result.error) {
        let errorMessage = "Failed to send message. Please try again.";

        if (result.error.data?.message) {
          errorMessage = result.error.data.message;
        } else if (result.error.data?.error) {
          errorMessage = result.error.data.error;
        }

        toastUtils.error(errorMessage);
      }
    } catch (error) {
      toastUtils.error("Network error. Please try again.");
    }
  };

  const contactOptions = [
    {
      title: "Call Us",
      info: "+92 300 1234567",
      subInfo: "24/7 dedicated support line",
      icon: <FiPhone className="text-2xl" />,
      link: "tel:+923001234567"
    },
    {
      title: "Email Us",
      info: "support@bookingpearl.com",
      subInfo: "Response within 2 hours",
      icon: <FiMail className="text-2xl" />,
      link: "mailto:support@bookingpearl.com"
    },
    {
      title: "Our Location",
      info: "Main Boulevard, Gulberg III",
      subInfo: "Lahore, Pakistan",
      icon: <FiMapPin className="text-2xl" />,
      link: "#"
    },
    {
      title: "Global Offices",
      info: "Visit our Website",
      subInfo: "Available in 40+ countries",
      icon: <FiGlobe className="text-2xl" />,
      link: "https://bookingpearl.com"
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative overflow-hidden min-h-[45vh] flex items-center pt-20">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-110"
          style={{ backgroundImage: `url(${BackgroundImg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-booking-blue via-booking-blue/80 to-transparent"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="custom-container relative z-10 py-20">
          <div className="max-w-3xl space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
              <span className="flex h-2 w-2 rounded-full bg-booking-blue-light animate-pulse"></span>
              <span className="text-white text-xs font-semibold tracking-wider uppercase">Contact Services</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-inter font-bold text-white leading-tight">
              Get in touch with <br />
              <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                World-class Support.
              </span>
            </h1>
            <p className="text-lg text-white/80 font-poppins max-w-xl leading-relaxed">
              We're here to ensure your premium booking experience is seamless and exceptional from start to finish.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="py-24 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-booking-blue/[0.01] -skew-x-12 transform origin-top-right"></div>

        <div className="custom-container">
          <div className="grid lg:grid-cols-2 gap-20 items-start">

            {/* Left Side: Contact Information Cards */}
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-inter font-bold text-booking-black">Reach out to <span className="text-booking-blue">Booking Pearl</span></h2>
                <p className="text-booking-gray-dark font-poppins max-w-lg">
                  Our professional team is available around the clock to assist you with any inquiries, modifications, or specialized requests.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {contactOptions.map((option, index) => (
                  <a
                    key={index}
                    href={option.link}
                    className="group p-8 rounded-[2rem] border border-booking-gray-medium bg-white hover:border-booking-blue hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-booking-blue/5 text-booking-blue flex items-center justify-center group-hover:bg-booking-blue group-hover:text-white transition-all duration-300 mb-6">
                      {option.icon}
                    </div>
                    <h3 className="text-lg font-inter font-bold text-booking-black mb-2">{option.title}</h3>
                    <p className="text-booking-blue font-semibold text-sm mb-1">{option.info}</p>
                    <p className="text-booking-gray-dark text-xs font-poppins">{option.subInfo}</p>
                  </a>
                ))}
              </div>

              {/* Trust Indicators */}
              <div className="pt-10 border-t border-booking-gray-light">
                <p className="text-sm font-bold text-booking-gray-dark uppercase tracking-widest mb-6">Trusted Worldwide</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center text-center space-y-2 p-4 bg-booking-gray-light/50 rounded-2xl">
                    <div className="w-8 h-8 text-booking-blue"><FiShield className="w-full h-full" /></div>
                    <span className="text-[10px] font-bold text-booking-black uppercase">Secure Payments</span>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2 p-4 bg-booking-gray-light/50 rounded-2xl">
                    <div className="w-8 h-8 text-booking-blue"><FiStar className="w-full h-full" /></div>
                    <span className="text-[10px] font-bold text-booking-black uppercase">Premium Quality</span>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2 p-4 bg-booking-gray-light/50 rounded-2xl">
                    <div className="w-8 h-8 text-booking-blue"><FiGlobe className="w-full h-full" /></div>
                    <span className="text-[10px] font-bold text-booking-black uppercase">Global Network</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Contact Form Card */}
            <div className="relative group">
              {/* Floating Decorative Blur */}
              <div className="absolute -inset-4 bg-booking-blue/5 blur-3xl rounded-[3rem] group-hover:bg-booking-blue/10 transition-all duration-700"></div>

              <div className="relative bg-white border border-booking-gray-medium rounded-[3rem] p-10 md:p-12 shadow-2xl overflow-hidden">
                <div className="relative z-10 space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-inter font-bold text-booking-black italic">Send us a Private Message</h3>
                    <p className="text-booking-gray-dark font-poppins text-sm">We value your privacy and respond to all inquiries personally.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-booking-black uppercase tracking-wider ml-1">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="E.g. John"
                          className="w-full bg-booking-gray-light/30 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-booking-blue/20 transition-all font-poppins text-sm"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-booking-black uppercase tracking-wider ml-1">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="E.g. Doe"
                          className="w-full bg-booking-gray-light/30 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-booking-blue/20 transition-all font-poppins text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-booking-black uppercase tracking-wider ml-1">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john.doe@premium.com"
                        className="w-full bg-booking-gray-light/30 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-booking-blue/20 transition-all font-poppins text-sm"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-booking-black uppercase tracking-wider ml-1">Inquiry Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="E.g. VIP Reservation Request"
                        className="w-full bg-booking-gray-light/30 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-booking-blue/20 transition-all font-poppins text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-booking-black uppercase tracking-wider ml-1">Detailed Message</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows="5"
                        placeholder="How can our professional team assist you today?"
                        className="w-full bg-booking-gray-light/30 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-booking-blue/20 transition-all resize-none font-poppins text-sm"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-booking-blue hover:bg-booking-blue-dark text-white font-bold py-5 rounded-2xl shadow-xl shadow-booking-blue/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                    >
                      {isLoading ? "PROCESSING..." : "SEND PREMIUM MESSAGE"}
                    </button>
                  </form>
                </div>

                {/* Corner Accents */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-booking-blue/5 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-booking-blue/5 rounded-full blur-3xl"></div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Map or Newsletter Area Placeholder */}
      <section className="bg-booking-black py-20">
        <div className="custom-container text-center space-y-8">
          <h3 className="text-white text-3xl font-inter font-bold">Experience the Gold Standard of Service</h3>
          <p className="text-white/60 font-poppins max-w-2xl mx-auto">
            Our offices in London, New York, and Dubai are ready to welcome you. Join our exclusive newsletter for hidden gems and priority booking access.
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <button className="bg-white text-booking-black px-10 py-4 rounded-xl font-bold hover:bg-booking-blue hover:text-white transition-all duration-300 shadow-xl">Join Exclusive Club</button>
            <button className="bg-white/10 text-white border border-white/20 px-10 py-4 rounded-xl font-bold hover:bg-white/20 transition-all duration-300">View Global Map</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
