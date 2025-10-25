import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useContactSupportMutation } from "../services/Api";
import { toastUtils } from "../utils/toastUtils";

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

        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className="py-20 bg-gradient-to-b from-[#0F0F23] via-[#1A1A2E] to-[#16213E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 mt-16">
          <h1 className="text-4xl lg:text-5xl font-inter font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-white/80 font-poppins max-w-2xl mx-auto">
            Get in touch with our team. We're here to help with any questions
            about our services.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-inter font-semibold text-white mb-6">
              Send us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-poppins text-sm mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#9945FF] transition-colors"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-poppins text-sm mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#9945FF] transition-colors"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-white font-poppins text-sm mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#9945FF] transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-poppins text-sm mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#9945FF] transition-colors"
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label className="block text-white font-poppins text-sm mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-[#9945FF] transition-colors resize-none"
                  placeholder="Tell us more about your inquiry..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[#14F195] to-[#9945FF] text-white px-8 py-4 rounded-xl font-outfit font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-inter font-semibold text-white mb-6">
                Get in Touch
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-inter font-semibold mb-1">
                      Email
                    </h4>
                    <p className="text-white/80 font-poppins">
                      support@mealcheap.com
                    </p>
                    <p className="text-white/80 font-poppins">
                      info@mealcheap.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-inter font-semibold mb-1">
                      Phone
                    </h4>
                    <p className="text-white/80 font-poppins">
                      +1 (555) 123-4567
                    </p>
                    <p className="text-white/80 font-poppins">
                      Mon-Fri: 9AM-6PM EST
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-inter font-semibold mb-1">
                      Address
                    </h4>
                    <p className="text-white/80 font-poppins">
                      123 Food Street
                    </p>
                    <p className="text-white/80 font-poppins">
                      New York, NY 10001
                    </p>
                    <p className="text-white/80 font-poppins">United States</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-inter font-semibold text-white mb-6">
                Quick Help
              </h3>
              <div className="space-y-4">
                <Link
                  to="/faq"
                  className="block text-white/80 font-poppins hover:text-white transition-colors"
                >
                  → Frequently Asked Questions
                </Link>
                
                <Link
                  to="/terms"
                  className="block text-white/80 font-poppins hover:text-white transition-colors"
                >
                  → Terms & Conditions
                </Link>
                <Link
                  to="/privacy"
                  className="block text-white/80 font-poppins hover:text-white transition-colors"
                >
                  → Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
