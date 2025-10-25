import React from 'react';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { SiVisa, SiMastercard, SiAmericanexpress } from 'react-icons/si';
import { FaCreditCard } from 'react-icons/fa';
import { HiLockClosed } from 'react-icons/hi';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '18px',
      color: '#374151',
      '::placeholder': {
        color: '#9CA3AF',
      },
      padding: '12px 16px',
      lineHeight: '1.5',
      fontFamily: '"Inter", sans-serif',
      letterSpacing: '0.025em',
    },
    invalid: {
      color: '#EF4444',
    },
  },
};

const StripeCardElement = ({ onCardChange, error }) => {
  return (
    <div className="space-y-4">
      {/* Card Number Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Number
        </label>
        <div className="relative">
          <CardNumberElement
            options={{
              ...CARD_ELEMENT_OPTIONS,
              placeholder: "1234 5678 9012 3456",
            }}
            onChange={onCardChange}
            className="w-full px-4 py-3 pr-12 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9945FF] focus:border-transparent font-inter text-lg tracking-wider placeholder-gray-400"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <FaCreditCard className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Expiry and CVV Fields */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          <CardExpiryElement
            options={{
              ...CARD_ELEMENT_OPTIONS,
              placeholder: "MM/YY",
            }}
            onChange={onCardChange}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9945FF] focus:border-transparent font-inter text-lg tracking-wider placeholder-gray-400"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVV
          </label>
          <div className="relative">
            <CardCvcElement
              options={{
                ...CARD_ELEMENT_OPTIONS,
                placeholder: "123",
              }}
              onChange={onCardChange}
              className="w-full px-4 py-3 pr-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9945FF] focus:border-transparent font-inter text-lg tracking-wider placeholder-gray-400"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <HiLockClosed className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      {/* Security Notice */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <HiLockClosed className="w-4 h-4" />
        <span>Your payment information is secure and encrypted</span>
      </div>
    </div>
  );
};

export default StripeCardElement;
