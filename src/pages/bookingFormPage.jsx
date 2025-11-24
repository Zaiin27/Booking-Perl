import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";
import { 
  FaArrowLeft, 
  FaCalendar, 
  FaUser, 
  FaBed, 
  FaDollarSign, 
  FaClock, 
  FaMapMarkerAlt,
  FaStar,
  FaWifi,
  FaCar,
  FaSwimmingPool,
  FaUtensils,
  FaPlus,
  FaMinus,
  FaCheck,
  FaExclamationTriangle,
  FaUsers
} from "react-icons/fa";

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
    
    paymentType: Yup.string()
      .oneOf(['online', 'on_arrival'], "Payment type must be online or on_arrival")
      .required("Payment type is required")
      .test('available-payment', 'Selected payment method is not available for this property', function(value) {
        if (!property?.paymentType) return true; // Allow if property data not loaded yet
        const availableTypes = property.paymentType === 'both' ? ['online', 'on_arrival'] : 
                               property.paymentType === 'online' ? ['online'] : 
                               property.paymentType === 'cash' ? ['on_arrival'] : [];
        return availableTypes.includes(value);
      }),
  });

  // Fetch property details with real-time availability
  useEffect(() => {
    fetchProperty();
  }, [propertyId]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/properties/${propertyId}`);
      
      if (response.data.success) {
        const propertyData = response.data.data;
        
        // Fetch real-time availability
        const availabilityResponse = await axios.get(`/api/v1/properties/${propertyId}/availability`);
        if (availabilityResponse.data.success) {
          const availabilityData = availabilityResponse.data.data;
          setProperty({
            ...propertyData,
            roomTypes: availabilityData.property.roomTypes,
            realTimeAvailability: availabilityData.availability
          });
        } else {
          setProperty(propertyData);
        }
      }
    } catch (error) {
      console.error("Error fetching property:", error);
      toast.error("Failed to fetch property details");
      navigate("/properties");
    } finally {
      setLoading(false);
    }
  };

  // Format currency based on property currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "N/A";
    
    const currency = property?.currency || "USD";
    
    // Support for PKR/Rs (Pakistani Rupees)
    if (currency === "PKR" || currency === "Rs" || currency === "RS" || currency === "pkr") {
      // Format PKR with comma separators and "Rs" prefix
      const formattedAmount = new Intl.NumberFormat("en-PK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
      return `Rs ${formattedAmount}`;
    }
    
    // Default to USD format
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Get currency symbol
  const getCurrencySymbol = () => {
    const currency = property?.currency || "USD";
    if (currency === "PKR" || currency === "Rs" || currency === "RS" || currency === "pkr") {
      return "Rs";
    }
    return "$";
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

    // Add platform fee if payment on arrival
    if (values.paymentType === 'on_arrival') {
      total += 200; // 200 PKR platform fee
    }

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
        paymentType: values.paymentType,
      };

      const response = await axios.post("/api/v1/bookings", payload);

      if (response.data.success) {
        const booking = response.data.data;
        
        if (values.paymentType === 'online') {
          toast.success("Booking created successfully! Redirecting to payment...");
          // Redirect to payment page with booking reference
          navigate(`/order-now?booking=${booking.bookingReference}`);
        } else {
          // Payment on arrival - redirect to confirmation page
          toast.success("Booking confirmed successfully!");
          navigate(`/booking-confirmation/${booking.bookingReference}`);
        }
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
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#16213E] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <div className="text-xl text-white font-medium">Loading property details...</div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#16213E] flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-red-400 text-6xl mx-auto mb-4" />
          <div className="text-xl text-white font-medium">Property not found</div>
          <button
            onClick={() => navigate("/properties")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F23] via-[#1A1A2E] to-[#16213E] py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Enhanced Header */}
        <div className="flex items-center gap-6 mb-8">
          <button
            onClick={() => navigate("/properties")}
            className="group p-4 bg-white/10 backdrop-blur-sm rounded-full shadow-lg hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <FaArrowLeft className="text-white group-hover:text-blue-300 transition-colors" />
          </button>
          <div className="flex-1">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent mb-2">
              Complete Your Booking
            </h1>
            <div className="flex items-center gap-3 text-gray-300">
              <FaMapMarkerAlt className="text-blue-400" />
              <span className="text-lg">You're booking at <span className="text-white font-semibold">{property.name}</span></span>
            </div>
          </div>
        </div>

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
            paymentType: property?.paymentType === 'cash' ? 'on_arrival' : 
                        property?.paymentType === 'online' ? 'online' : 'online',
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
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Booking Form */}
                <div className="xl:col-span-2">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
                    <Form className="space-y-8">
                      {/* Guest Information */}
                      <div className="group">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                            <FaUser className="text-white text-xl" />
                          </div>
                          <h2 className="text-3xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                            Guest Information
                          </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                            <Field
                              name="guestName"
                              type="text"
                              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                              placeholder="Enter your full name"
                            />
                            <ErrorMessage name="guestName" component="div" className="text-red-500 text-sm mt-1 flex items-center gap-1" />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                            <Field
                              name="guestEmail"
                              type="email"
                              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                              placeholder="your.email@example.com"
                            />
                            <ErrorMessage name="guestEmail" component="div" className="text-red-500 text-sm mt-1 flex items-center gap-1" />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                            <Field
                              name="guestPhone"
                              type="tel"
                              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                              placeholder="+1 234 567 8900"
                            />
                            <ErrorMessage name="guestPhone" component="div" className="text-red-500 text-sm mt-1 flex items-center gap-1" />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Guests *</label>
                            <Field
                              name="numberOfGuests"
                              type="number"
                              min="1"
                              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                            />
                            <ErrorMessage name="numberOfGuests" component="div" className="text-red-500 text-sm mt-1 flex items-center gap-1" />
                          </div>
                        </div>
                      </div>

                      {/* Booking Dates */}
                      <div className="group">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl shadow-lg">
                            <FaCalendar className="text-white text-xl" />
                          </div>
                          <h2 className="text-3xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
                            Select Dates
                          </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Check-in Date *</label>
                            <Field
                              name="checkInDate"
                              type="date"
                              min={new Date().toISOString().split("T")[0]}
                              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                            />
                            <ErrorMessage name="checkInDate" component="div" className="text-red-500 text-sm mt-1 flex items-center gap-1" />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Check-out Date *</label>
                            <Field
                              name="checkOutDate"
                              type="date"
                              min={values.checkInDate || new Date().toISOString().split("T")[0]}
                              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                            />
                            <ErrorMessage name="checkOutDate" component="div" className="text-red-500 text-sm mt-1 flex items-center gap-1" />
                          </div>
                        </div>

                        {numberOfNights > 0 && (
                          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-200">
                            <div className="flex items-center gap-2 text-green-700 font-semibold">
                              <FaClock className="text-green-600" />
                              <span>Duration: {numberOfNights} night{numberOfNights > 1 ? "s" : ""}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Room Selection */}
                      <div className="group">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
                            <FaBed className="text-white text-xl" />
                          </div>
                          <h2 className="text-3xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                            Select Rooms
                          </h2>
                        </div>

                        <div className="space-y-6">
                          {property.roomTypes.map((roomType, index) => (
                            <div key={index} className="group/room p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                              <div className="flex justify-between items-center">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-bold text-xl capitalize text-gray-800">{roomType.type} Room</h3>
                                    <div className="flex items-center gap-1">
                                      {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className="text-yellow-400 text-sm" />
                                      ))}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                      <FaDollarSign className="text-green-600" />
                                      <span className="font-semibold text-green-600">{formatCurrency(roomType.price)}</span>
                                      <span>per night</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <FaCheck className="text-blue-600" />
                                      <span className="font-semibold text-blue-600">{roomType.available}</span>
                                      <span>available</span>
                                    </div>
                                    {property.realTimeAvailability?.[roomType.type] && (
                                      <div className="flex items-center gap-1">
                                        <FaUsers className="text-orange-600" />
                                        <span className="font-semibold text-orange-600">{property.realTimeAvailability[roomType.type].booked}</span>
                                        <span>booked</span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <FaWifi className="text-blue-500" />
                                      <span>Free WiFi</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <FaCar className="text-green-500" />
                                      <span>Parking</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <FaUtensils className="text-orange-500" />
                                      <span>Breakfast</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="ml-6">
                                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">Quantity</label>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const currentValue = values.bookedRooms[index]?.quantity || 0;
                                        if (currentValue > 0) {
                                          setFieldValue(`bookedRooms.${index}.quantity`, currentValue - 1);
                                        }
                                      }}
                                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                    >
                                      <FaMinus className="text-sm" />
                                    </button>
                                    <Field
                                      name={`bookedRooms.${index}.quantity`}
                                      type="number"
                                      min="0"
                                      max={roomType.available}
                                      className="w-16 px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-center font-semibold"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const currentValue = values.bookedRooms[index]?.quantity || 0;
                                        if (currentValue < roomType.available) {
                                          setFieldValue(`bookedRooms.${index}.quantity`, currentValue + 1);
                                        }
                                      }}
                                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                    >
                                      <FaPlus className="text-sm" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payment Type Selection */}
                      <div className="group">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl shadow-lg">
                            <FaDollarSign className="text-white text-xl" />
                          </div>
                          <h2 className="text-3xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                            Payment Method
                          </h2>
                        </div>
                        
                        <div className="space-y-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Select Payment Option *</label>
                          {property?.paymentType && (
                            <p className="text-xs text-gray-500 mb-3">
                              Available payment methods: {
                                property.paymentType === 'both' ? 'Online & Cash' :
                                property.paymentType === 'online' ? 'Online Only' :
                                property.paymentType === 'cash' ? 'Cash Only (Payment on Arrival)' : 'Both'
                              }
                            </p>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Online Payment Option - Always show, but disable if not supported */}
                            <label className={`relative ${property?.paymentType !== 'online' && property?.paymentType !== 'both' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                              <Field
                                type="radio"
                                name="paymentType"
                                value="online"
                                disabled={property?.paymentType !== 'online' && property?.paymentType !== 'both'}
                                className="sr-only peer"
                              />
                              <div className={`p-6 border-2 rounded-xl transition-all duration-300 ${
                                property?.paymentType === 'online' || property?.paymentType === 'both'
                                  ? 'border-gray-200 bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:shadow-lg hover:border-blue-300 hover:shadow-md'
                                  : 'border-gray-300 bg-gray-100'
                              }`}>
                                <div className="flex items-center gap-3">
                                  <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                                    property?.paymentType === 'online' || property?.paymentType === 'both'
                                      ? 'border-gray-400 peer-checked:border-blue-500 peer-checked:bg-blue-500'
                                      : 'border-gray-300'
                                  }`}>
                                    <div className="w-3 h-3 bg-white rounded-full hidden peer-checked:block"></div>
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-bold text-lg text-gray-800">Payment Online</h3>
                                    <p className="text-sm text-gray-600 mt-1">Pay now securely with card or mobile wallet</p>
                                    {property?.paymentType !== 'online' && property?.paymentType !== 'both' && (
                                      <p className="text-xs text-red-500 mt-1">Not available for this property</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </label>
                            
                            {/* Cash Payment Option - Always show, but disable if not supported */}
                            <label className={`relative ${property?.paymentType !== 'cash' && property?.paymentType !== 'both' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                              <Field
                                type="radio"
                                name="paymentType"
                                value="on_arrival"
                                disabled={property?.paymentType !== 'cash' && property?.paymentType !== 'both'}
                                className="sr-only peer"
                              />
                              <div className={`p-6 border-2 rounded-xl transition-all duration-300 ${
                                property?.paymentType === 'cash' || property?.paymentType === 'both'
                                  ? 'border-gray-200 bg-gray-50 peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:shadow-lg hover:border-green-300 hover:shadow-md'
                                  : 'border-gray-300 bg-gray-100'
                              }`}>
                                <div className="flex items-center gap-3">
                                  <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${
                                    property?.paymentType === 'cash' || property?.paymentType === 'both'
                                      ? 'border-gray-400 peer-checked:border-green-500 peer-checked:bg-green-500'
                                      : 'border-gray-300'
                                  }`}>
                                    <div className="w-3 h-3 bg-white rounded-full hidden peer-checked:block"></div>
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-bold text-lg text-gray-800">Payment on Arrival</h3>
                                    <p className="text-sm text-gray-600 mt-1">Pay when you arrive at the property</p>
                                    {property?.paymentType !== 'cash' && property?.paymentType !== 'both' && (
                                      <p className="text-xs text-red-500 mt-1">Not available for this property</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </label>
                          </div>
                          <ErrorMessage name="paymentType" component="div" className="text-red-500 text-sm mt-1 flex items-center gap-1" />
                        </div>
                      </div>

                      {/* Special Requests */}
                      <div className="group">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl shadow-lg">
                            <FaUtensils className="text-white text-xl" />
                          </div>
                          <h2 className="text-3xl font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                            Special Requests
                          </h2>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Requirements (Optional)</label>
                          <Field
                            as="textarea"
                            name="specialRequests"
                            rows="4"
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all duration-300 bg-gray-50 focus:bg-white resize-none"
                            placeholder="Any special requirements, dietary restrictions, accessibility needs, or preferences..."
                          />
                          <div className="text-xs text-gray-500 mt-1">
                            Let us know how we can make your stay more comfortable
                          </div>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-6">
                        <button
                          type="submit"
                          disabled={isSubmitting || calculatedAmount === 0}
                          className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 rounded-2xl font-bold text-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-blue-500/25 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <div className="flex items-center justify-center gap-3">
                            {isSubmitting ? (
                              <>
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                <span>Processing Your Booking...</span>
                              </>
                            ) : (
                              <>
                                <FaCheck className="text-2xl group-hover:scale-110 transition-transform" />
                                <span>Confirm Booking - {formatCurrency(calculatedAmount)}</span>
                                <FaDollarSign className="text-2xl group-hover:scale-110 transition-transform" />
                              </>
                            )}
                          </div>
                        </button>
                        
                        {calculatedAmount === 0 && (
                          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                            <div className="flex items-center gap-2 text-yellow-700">
                              <FaExclamationTriangle className="text-yellow-600" />
                              <span className="font-semibold">Please select rooms and dates to see the total amount</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </Form>
                  </div>
                </div>

                {/* Enhanced Booking Summary */}
                <div className="xl:col-span-1">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 sticky top-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
                        <FaDollarSign className="text-white text-xl" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-800">Booking Summary</h2>
                    </div>

                    <div className="space-y-6">
                      {/* Property Info */}
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                        <div className="flex items-center gap-3 mb-3">
                          <FaMapMarkerAlt className="text-blue-600" />
                          <h3 className="font-bold text-lg text-gray-800">{property.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600 ml-6">{property.address}</p>
                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <FaStar className="text-yellow-500" />
                            <span>4.8 Rating</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaWifi className="text-blue-500" />
                            <span>Free WiFi</span>
                          </div>
                        </div>
                      </div>

                      {/* Check-in/out Times */}
                      <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-200">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                          <FaClock className="text-green-600" />
                          Check-in & Check-out Times
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Check-in:</span>
                            <span className="font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm">
                              {property.checkInTime}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Check-out:</span>
                            <span className="font-semibold text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm">
                              {property.checkOutTime}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing Summary */}
                      {calculatedAmount > 0 && (
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <FaBed className="text-purple-600" />
                            Pricing Summary
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Duration:</span>
                              <span className="font-semibold text-gray-800">{numberOfNights} night{numberOfNights > 1 ? "s" : ""}</span>
                            </div>
                            {values.paymentType === 'on_arrival' && (
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-600">Platform Fee:</span>
                                <span className="font-semibold text-orange-600">{formatCurrency(200)}</span>
                              </div>
                            )}
                            <div className="border-t border-purple-200 pt-2 mt-3">
                              <div className="flex justify-between items-center text-xl font-bold">
                                <span className="text-gray-800">Total Amount:</span>
                                <span className="text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                                  {formatCurrency(calculatedAmount)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Security Badge */}
                      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <FaCheck className="text-green-600" />
                          </div>
                          <div>
                            <h5 className="font-semibold text-green-800">Secure Booking</h5>
                            <p className="text-xs text-green-600">Your payment is protected</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default BookingFormPage;

