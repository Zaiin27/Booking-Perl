import React from "react";
import { useSearchParams } from "react-router-dom";
import OrderForm from "../components/orderForm/OrderForm.jsx";
import BookingPaymentForm from "../components/bookingPayment/BookingPaymentForm.jsx";
import OurMission from "../components/orderForm/OurMission.jsx";
import StripeProvider from "../components/StripeProvider.jsx";

const OrderNowPage = () => {
  const [searchParams] = useSearchParams();
  const bookingReference = searchParams.get('booking');

  // If there's a booking reference, show booking payment form
  if (bookingReference) {
    return (
      <StripeProvider>
        <BookingPaymentForm />
      </StripeProvider>
    );
  }

  // Otherwise, show the regular order form
  return (
    <StripeProvider>
      <OrderForm />
      <OurMission />
    </StripeProvider>
  );
};

export default OrderNowPage;
