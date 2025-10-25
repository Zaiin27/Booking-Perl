import React from "react";

const RefundsPage = () => {
  return (
    <div className="py-20 bg-gradient-to-b from-[#0F0F23] via-[#1A1A2E] to-[#16213E]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-inter font-bold text-white mb-4">
            Refunds Policy
          </h1>
          <p className="text-xl text-white/80 font-poppins max-w-2xl mx-auto">
            We want you to be completely satisfied with your order. Learn about
            our refund and cancellation policies.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-inter font-semibold text-white mb-4">
              Order Cancellation
            </h2>
            <p className="text-white/80 font-poppins mb-6">
              You may cancel your order at any time before it is confirmed by
              the restaurant. Once confirmed, cancellation may not be possible
              depending on the restaurant's preparation status.
            </p>

            <h2 className="text-2xl font-inter font-semibold text-white mb-4">
              Refund Eligibility
            </h2>
            <p className="text-white/80 font-poppins mb-6">
              Refunds are available for orders that are cancelled before
              preparation begins, or in cases where we are unable to fulfill
              your order due to technical issues or restaurant unavailability.
            </p>

            <h2 className="text-2xl font-inter font-semibold text-white mb-4">
              Quality Issues
            </h2>
            <p className="text-white/80 font-poppins mb-6">
              If you receive food that is cold, incorrect, or of poor quality,
              please contact our support team immediately. We will work with the
              restaurant to resolve the issue and may offer a refund or
              replacement.
            </p>

            <h2 className="text-2xl font-inter font-semibold text-white mb-4">
              Delivery Problems
            </h2>
            <p className="text-white/80 font-poppins mb-6">
              If your order is significantly delayed or never arrives, you may
              be eligible for a full refund. We will investigate the issue and
              process your refund within 3-5 business days.
            </p>

            <h2 className="text-2xl font-inter font-semibold text-white mb-4">
              Refund Process
            </h2>
            <p className="text-white/80 font-poppins mb-6">
              Refunds are typically processed within 3-5 business days and will
              be credited back to your original payment method. For $FORK token
              payments, refunds will be returned to your wallet.
            </p>

            <h2 className="text-2xl font-inter font-semibold text-white mb-4">
              Non-Refundable Items
            </h2>
            <p className="text-white/80 font-poppins mb-6">
              Service fees, delivery charges, and any applicable taxes are
              generally non-refundable unless the entire order is cancelled
              before preparation begins.
            </p>

            <h2 className="text-2xl font-inter font-semibold text-white mb-4">
              Contact Us
            </h2>
            <p className="text-white/80 font-poppins mb-6">
              If you need to request a refund or have questions about our refund
              policy, please contact our support team through our website or
              mobile app. We're here to help ensure your satisfaction.
            </p>

            <h2 className="text-2xl font-inter font-semibold text-white mb-4">
              Dispute Resolution
            </h2>
            <p className="text-white/80 font-poppins mb-6">
              If you disagree with a refund decision, you may request a review
              by our customer service team. We will investigate the matter and
              respond within 48 hours.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-white/60 font-poppins text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RefundsPage;
