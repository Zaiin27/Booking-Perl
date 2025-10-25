import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";
import { FaArrowLeft, FaCalendar, FaUser, FaBed, FaDollarSign } from "react-icons/fa";

const BookingFormPage = () => {
  const navigate = useNavigate();
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [numberOfNights, setNumberOfNights] = useState(0);

  // Validation schema
  const validationSchema = Yup.object({
    guestName: Yup.string()
      .min(2, "Guest name must be at least 2 characters")
      .max(100, "Guest name must be less than 100 characters")
      .matches(/^[a-zA-Z\s\-'\.]+$/, "Guest name can only contain letters, spaces, hyphens, apostrophes, and periods")
      .required("Guest name is required"),
    
    guestEmail: Yup.string()
      .email("Please enter a valid email address")
      .max(100, "Email must be less than 100 characters")
      .required("Email is required"),
    
    guestPhone: Yup.string()
      .matches(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be less than 15 digits")
      .required("Phone number is required"),
    
    checkInDate: Yup.date()
      .required("Check-in date is required")
      .min(new Date(new Date().setHours(0, 0, 0, 0)), "Check-in date must be today or in the future")
      .test('not-weekend', 'Weekend bookings may have restrictions', function(value) {
        if (!value) return true;
        const day = new Date(value).getDay();
        return true; // Allow all days, but can add restrictions here
      }),
    
    checkOutDate: Yup.date()
      .required("Check-out date is required")
      .min(Yup.ref("checkInDate"), "Check-out date must be after check-in date")
      .test('minimum-stay', 'Minimum stay is 1 night', function(value) {
        const { checkInDate } = this.parent;
        if (!checkInDate || !value) return true;
        
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(value);
        const diffTime = checkOut - checkIn;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays >= 1;
      })
      .test('maximum-stay', 'Maximum stay is 30 nights', function(value) {
        const { checkInDate } = this.parent;
        if (!checkInDate || !value) return true;
        
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(value);
        const diffTime = checkOut - checkIn;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        return diffDays <= 30;
      }),
    
    numberOfGuests: Yup.number()
      .integer("Number of guests must be a whole number")
      .min(1, "At least 1 guest required")
      .max(20, "Maximum 20 guests allowed")
      .required("Number of guests is required"),
    
    bookedRooms: Yup.array()
      .of(
        Yup.object({
          roomType: Yup.string()
            .oneOf(['single', 'double'], "Room type must be single or double")
            .required("Room type is required"),
          quantity: Yup.number()
            .integer("Room quantity must be a whole number")
            .min(0, "Room quantity cannot be negative")
            .max(10, "Maximum 10 rooms of same type per booking")
            .required("Room quantity is required"),
        })
      )
      .min(1, "At least one room must be selected")
      .test('total-rooms', 'Total rooms must be at least 1', function(bookedRooms) {
        if (!bookedRooms) return false;
        const totalRooms = bookedRooms.reduce((sum, room) => sum + (room.quantity || 0), 0);
        return totalRooms > 0;
      })
      .test('room-capacity', 'Total rooms must accommodate all guests', function(bookedRooms) {
        const { numberOfGuests } = this.parent;
        if (!bookedRooms || !numberOfGuests) return true;
        
        const totalRooms = bookedRooms.reduce((sum, room) => {
          const roomCapacity = room.roomType === 'single' ? 1 : 2;
          return sum + (room.quantity * roomCapacity);
        }, 0);
        
        return totalRooms >= numberOfGuests;
      }),
    
    specialRequests: Yup.string()
      .max(500, "Special requests must be less than 500 characters"),
  });

  // Fetch property details
  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/properties/${propertyId}`);
      
      if (response.data.success) {
        setProperty(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching property:", error);
      toast.error("Failed to fetch property details");
      navigate("/properties");
    } finally {
      setLoading(false);
    }
  };

  // Calculate total amount
  const calculateTotal = (values) => {
    if (!values.checkInDate || !values.checkOutDate || !values.bookedRooms.length) {
      return 0;
    }

    const checkIn = new Date(values.checkInDate);
    const checkOut = new Date(values.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    setNumberOfNights(nights);

    let total = 0;
    values.bookedRooms.forEach((bookedRoom) => {
      const roomType = property?.roomTypes.find((r) => r.type === bookedRoom.roomType);
      if (roomType && bookedRoom.quantity) {
        total += roomType.price * bookedRoom.quantity * nights;
      }
    });

    return total;
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const payload = {
        property_id: propertyId,
        guestName: values.guestName,
        guestEmail: values.guestEmail,
        guestPhone: values.guestPhone,
        checkInDate: values.checkInDate,
        checkOutDate: values.checkOutDate,
        numberOfGuests: values.numberOfGuests,
        bookedRooms: values.bookedRooms.filter((room) => room.quantity > 0),
        specialRequests: values.specialRequests,
      };

      const response = await axios.post("/api/v1/bookings", payload);

      if (response.data.success) {
        const booking = response.data.data;
        toast.success("Booking created successfully! Redirecting to payment...");
        // Redirect to payment page with booking reference
        navigate(`/order-now?booking=${booking.bookingReference}`);
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error(error.response?.data?.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Property not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/properties")}
            className="p-3 bg-white rounded-full shadow hover:shadow-lg transition"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Complete Your Booking</h1>
            <p className="text-gray-600 mt-2">You're booking at {property.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <Formik
                initialValues={{
                  guestName: "",
                  guestEmail: "",
                  guestPhone: "",
                  checkInDate: "",
                  checkOutDate: "",
                  numberOfGuests: 1,
                  bookedRooms: property.roomTypes.map((room) => ({
                    roomType: room.type,
                    quantity: 0,
                  })),
                  specialRequests: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({ values, isSubmitting, setFieldValue }) => {
                  const total = calculateTotal(values);
                  if (total !== calculatedAmount) {
                    setCalculatedAmount(total);
                  }

                  return (
                    <Form className="space-y-6">
                      {/* Guest Information */}
                      <div>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
                          <FaUser className="text-blue-600" />
                          Guest Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Full Name *</label>
                            <Field
                              name="guestName"
                              type="text"
                              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="John Doe"
                            />
                            <ErrorMessage name="guestName" component="div" className="text-red-500 text-sm mt-1" />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Email Address *</label>
                            <Field
                              name="guestEmail"
                              type="email"
                              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="john@example.com"
                            />
                            <ErrorMessage name="guestEmail" component="div" className="text-red-500 text-sm mt-1" />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Phone Number *</label>
                            <Field
                              name="guestPhone"
                              type="tel"
                              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="+1 234 567 8900"
                            />
                            <ErrorMessage name="guestPhone" component="div" className="text-red-500 text-sm mt-1" />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Number of Guests *</label>
                            <Field
                              name="numberOfGuests"
                              type="number"
                              min="1"
                              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <ErrorMessage name="numberOfGuests" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                        </div>
                      </div>

                      {/* Booking Dates */}
                      <div>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
                          <FaCalendar className="text-blue-600" />
                          Select Dates
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Check-in Date *</label>
                            <Field
                              name="checkInDate"
                              type="date"
                              min={new Date().toISOString().split("T")[0]}
                              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <ErrorMessage name="checkInDate" component="div" className="text-red-500 text-sm mt-1" />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Check-out Date *</label>
                            <Field
                              name="checkOutDate"
                              type="date"
                              min={values.checkInDate || new Date().toISOString().split("T")[0]}
                              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <ErrorMessage name="checkOutDate" component="div" className="text-red-500 text-sm mt-1" />
                          </div>
                        </div>

                        {numberOfNights > 0 && (
                          <div className="mt-2 text-sm text-blue-600 font-medium">
                            Duration: {numberOfNights} night{numberOfNights > 1 ? "s" : ""}
                          </div>
                        )}
                      </div>

                      {/* Room Selection */}
                      <div>
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
                          <FaBed className="text-blue-600" />
                          Select Rooms
                        </h2>

                        <div className="space-y-4">
                          {property.roomTypes.map((roomType, index) => (
                            <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex justify-between items-center mb-2">
                                <div>
                                  <h3 className="font-semibold text-lg capitalize">{roomType.type} Room</h3>
                                  <p className="text-sm text-gray-600">
                                    ${roomType.price} per night • {roomType.available} available
                                  </p>
                                </div>
                                <div className="w-32">
                                  <label className="block text-sm font-medium mb-1">Quantity</label>
                                  <Field
                                    name={`bookedRooms.${index}.quantity`}
                                    type="number"
                                    min="0"
                                    max={roomType.available}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Special Requests */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Special Requests (Optional)</label>
                        <Field
                          as="textarea"
                          name="specialRequests"
                          rows="3"
                          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Any special requirements or preferences..."
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting || calculatedAmount === 0}
                        className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Processing..." : `Confirm Booking - $${calculatedAmount.toFixed(2)}`}
                      </button>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">Booking Summary</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{property.name}</h3>
                  <p className="text-sm text-gray-600">{property.address}</p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Check-in:</span>
                    <span className="font-medium">{property.checkInTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out:</span>
                    <span className="font-medium">{property.checkOutTime}</span>
                  </div>
                </div>

                {calculatedAmount > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{numberOfNights} nights</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-blue-600">
                      <span>Total Amount:</span>
                      <span>${calculatedAmount.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingFormPage;

