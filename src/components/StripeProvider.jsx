import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// You can replace this with your actual Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Rp7coH7rUJBXjyfChI7rSJ0TV3pclVwLQbW3JEYj0rpNICESZdE9VtZUvm0859VZhognd5Pm46ODNno2pDJbs4f00uSbvIqLs');

const StripeProvider = ({ children }) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeProvider;
