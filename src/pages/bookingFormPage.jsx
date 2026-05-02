import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "../utils/axios";
import { toast } from "react-hot-toast";
import {
  FaArrowLeft,
  FaCalendar,
  FaUser,
  FaBed,
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
  const [searchParams] = useSearchParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [numberOfNights, setNumberOfNights] = useState(0);

  // Extract values from URL
  const urlCheckIn = searchParams.get("checkIn") || "";
  const urlCheckOut = searchParams.get("checkOut") || "";
  const urlAdults = parseInt(searchParams.get("adults")) || 1;
  const urlChildren = parseInt(searchParams.get("children")) || 0;
  const urlRooms = parseInt(searchParams.get("rooms")) || 0;

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
      .nullable()
      .transform((value) => (value === '' ? null : value)),

    guestPhone: Yup.string()
      .required("Phone number is required")
      .test('pakistani-phone', 'Please enter a valid Pakistani phone number (e.g., 03038463827 or +92 308 5739464)', function (value) {
        if (!value || value.trim() === '') return false;

        // Remove all non-digit characters
        const digits = value.replace(/\D/g, '');

        // Must have at least 10 digits
        if (digits.length < 10) return false;

        // Check if it starts with +92 (international format)
        if (value.trim().startsWith('+92')) {
          // Should have exactly 12 digits total (92 + 10)
          return digits.length === 12 && digits.startsWith('92');
        }

        // Check if it starts with 92 (without +)
        if (digits.startsWith('92') && digits.length === 12) {
          return true;
        }

        // Check if it starts with 0 (local format) - exactly 11 digits
        if (digits.startsWith('0') && digits.length === 11) {
          return true;
        }

        // Check if it's exactly 10 digits (will be auto-formatted to 0XXXXXXXXXX)
        if (digits.length === 10 && !digits.startsWith('0')) {
          return true;
        }

        return false;
      }),

    checkInDate: Yup.date()
      .required("Check-in date is required")
      .min(new Date(new Date().setHours(0, 0, 0, 0)), "Check-in date must be today or in the future")
      .test('not-weekend', 'Weekend bookings may have restrictions', function (value) {
        if (!value) return true;
        const day = new Date(value).getDay();
        return true; // Allow all days, but can add restrictions here
      }),

    checkOutDate: Yup.date()
      .required("Check-out date is required")
      .min(Yup.ref("checkInDate"), "Check-out date must be after check-in date")
      .test('minimum-stay', 'Minimum stay is 1 night', function (value) {
        const { checkInDate } = this.parent;
        if (!checkInDate || !value) return true;

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(value);
        const diffTime = checkOut - checkIn;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays >= 1;
      })
      .test('maximum-stay', 'Maximum stay is 30 nights', function (value) {
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
      .test('total-rooms', 'Total rooms must be at least 1', function (bookedRooms) {
        if (!bookedRooms) return false;
        const totalRooms = bookedRooms.reduce((sum, room) => sum + (room.quantity || 0), 0);
        return totalRooms > 0;
      })
      .test('room-capacity', 'Total rooms must accommodate all guests', function (bookedRooms) {
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
      .test('available-payment', 'Selected payment method is not available for this property', function (value) {
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

        // Fetch real-time availability with dates if available
        const availabilityParams = {};
        if (urlCheckIn) availabilityParams.checkInDate = urlCheckIn;
        if (urlCheckOut) availabilityParams.checkOutDate = urlCheckOut;

        const availabilityResponse = await axios.get(`/api/v1/properties/${propertyId}/availability`, {
          params: availabilityParams
        });

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

  // Format Pakistani phone number
  const formatPakistaniPhone = (value) => {
    if (!value) return "";

    // Remove all non-digit characters except +
    const cleanValue = value.replace(/[^\d+]/g, "");

    // If starts with +92, format as +92 XXX XXXXXXX
    if (cleanValue.startsWith("+92")) {
      const digits = cleanValue.substring(3).replace(/\D/g, "");
      if (digits.length >= 10) {
        const operatorCode = digits.substring(0, 3);
        const number = digits.substring(3);
        return `+92 ${operatorCode} ${number}`;
      }
      return cleanValue;
    }

    // Remove all non-digit characters for local format
    const digits = cleanValue.replace(/\D/g, "");

    // If starts with 92 (without +), format as +92 XXX XXXXXXX
    if (digits.startsWith("92") && digits.length >= 12) {
      const operatorCode = digits.substring(2, 5);
      const number = digits.substring(5);
      return `+92 ${operatorCode} ${number}`;
    }

    // If starts with 0, keep as 0XXXXXXXXX (11 digits exactly)
    if (digits.startsWith("0") && digits.length === 11) {
      return digits;
    }

    // If starts with 0 but less than 11 digits, allow partial input
    if (digits.startsWith("0") && digits.length < 11) {
      return digits;
    }

    // If 10 digits without 0, add 0 prefix
    if (digits.length === 10 && !digits.startsWith("0")) {
      return `0${digits}`;
    }

    // If 11 digits without 0, assume it's missing the 0
    if (digits.length === 11 && !digits.startsWith("0")) {
      return `0${digits}`;
    }

    // Return digits as is for partial input
    return digits;
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
        guestEmail: values.guestEmail || null,
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <div className="text-xl text-gray-900 font-medium">Loading property details...</div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-red-500 text-6xl mx-auto mb-4" />
          <div className="text-xl text-gray-900 font-medium">Property not found</div>
          <button
            onClick={() => navigate("/properties")}
            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Premium Hero Header */}
      <div className="relative bg-[#0A1128] pt-32 pb-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/20 to-purple-600/20"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button
            onClick={() => navigate("/properties")}
            className="group flex items-center gap-2 text-white/70 hover:text-white transition-all mb-8 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Listings</span>
          </button>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">Secure Checkout</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-inter font-extrabold text-white tracking-tight">
              Complete Your <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Premium Reservation.</span>
            </h1>
            <div className="flex items-center gap-3 text-white/60 text-lg font-poppins">
              <FaMapMarkerAlt className="text-blue-400" />
              <span>Stay at <span className="text-white font-semibold">{property.name}</span></span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-20">
        <Formik
          initialValues={{
            guestName: "",
            guestEmail: "",
            guestPhone: "",
            checkInDate: urlCheckIn,
            checkOutDate: urlCheckOut,
            numberOfGuests: urlAdults + urlChildren,
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
          {({ values, isSubmitting, setFieldValue, isValid, errors }) => {
            const total = calculateTotal(values);
            if (total !== calculatedAmount) {
              setCalculatedAmount(total);
            }

            return (
              <Form>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Side: Form Sections */}
                  <div className="lg:col-span-8 space-y-8">
                    {/* Guest Information Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-white p-8 md:p-10 relative overflow-hidden group animate-slide-up">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>

                      <div className="relative">
                        <div className="flex items-center gap-4 mb-10">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                            <FaUser className="text-white text-xl" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-inter font-extrabold text-[#0F172A]">Guest Information</h2>
                            <p className="text-slate-500 font-poppins text-sm">Tell us who is coming for this amazing stay.</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                            <Field
                              name="guestName"
                              type="text"
                              className="w-full bg-slate-50 border-2 border-slate-100 px-6 py-4 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all font-poppins text-slate-700 placeholder:text-slate-300"
                              placeholder="e.g. John Doe"
                            />
                            <ErrorMessage name="guestName" component="div" className="text-rose-500 text-xs font-medium mt-1 ml-1" />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Phone Number</label>
                            <Field name="guestPhone">
                              {({ field, form }) => (
                                <input
                                  {...field}
                                  type="tel"
                                  value={field.value || ""}
                                  onChange={(e) => {
                                    const formatted = formatPakistaniPhone(e.target.value);
                                    form.setFieldValue("guestPhone", formatted);
                                  }}
                                  onBlur={field.onBlur}
                                  className="w-full bg-slate-50 border-2 border-slate-100 px-6 py-4 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all font-poppins text-slate-700 placeholder:text-slate-300"
                                  placeholder="+92 300 1234567"
                                />
                              )}
                            </Field>
                            <ErrorMessage name="guestPhone" component="div" className="text-rose-500 text-xs font-medium mt-1 ml-1" />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                            <Field
                              name="guestEmail"
                              type="email"
                              className="w-full bg-slate-50 border-2 border-slate-100 px-6 py-4 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all font-poppins text-slate-700 placeholder:text-slate-300"
                              placeholder="john@example.com"
                            />
                            <ErrorMessage name="guestEmail" component="div" className="text-rose-500 text-xs font-medium mt-1 ml-1" />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Number of Guests</label>
                            <div className="relative">
                              <Field
                                name="numberOfGuests"
                                type="number"
                                min="1"
                                className="w-full bg-slate-50 border-2 border-slate-100 px-6 py-4 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all font-poppins text-slate-700"
                              />
                              <FaUsers className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" />
                            </div>
                            <ErrorMessage name="numberOfGuests" component="div" className="text-rose-500 text-xs font-medium mt-1 ml-1" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Date Selection Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-white p-8 md:p-10 relative overflow-hidden group animate-slide-up delay-100">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>

                      <div className="relative">
                        <div className="flex items-center gap-4 mb-10">
                          <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-600/20">
                            <FaCalendar className="text-white text-xl" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-inter font-extrabold text-[#0F172A]">Select Stay Dates</h2>
                            <p className="text-slate-500 font-poppins text-sm">Choose your preferred dates for the stay.</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Check-in Date</label>
                            <Field
                              name="checkInDate"
                              type="date"
                              min={new Date().toISOString().split("T")[0]}
                              className="w-full bg-slate-50 border-2 border-slate-100 px-6 py-4 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 outline-none transition-all font-poppins text-slate-700 cursor-pointer"
                              onClick={(e) => e.target.showPicker?.()}
                            />
                            <ErrorMessage name="checkInDate" component="div" className="text-rose-500 text-xs font-medium mt-1 ml-1" />
                          </div>

                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Check-out Date</label>
                            <Field
                              name="checkOutDate"
                              type="date"
                              min={values.checkInDate || new Date().toISOString().split("T")[0]}
                              className="w-full bg-slate-50 border-2 border-slate-100 px-6 py-4 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 outline-none transition-all font-poppins text-slate-700 cursor-pointer"
                              onClick={(e) => e.target.showPicker?.()}
                            />
                            <ErrorMessage name="checkOutDate" component="div" className="text-rose-500 text-xs font-medium mt-1 ml-1" />
                          </div>
                        </div>

                        {numberOfNights > 0 && (
                          <div className="mt-8 flex items-center gap-3 px-6 py-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-emerald-700 font-inter font-bold">
                            <FaClock className="animate-pulse" />
                            <span>Stay Duration: {numberOfNights} {numberOfNights === 1 ? 'Night' : 'Nights'}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Room Selection Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-purple-900/5 border border-white p-8 md:p-10 relative overflow-hidden group animate-slide-up delay-200">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>

                      <div className="relative">
                        <div className="flex items-center gap-4 mb-10">
                          <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-600/20">
                            <FaBed className="text-white text-xl" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-inter font-extrabold text-[#0F172A]">Choose Rooms</h2>
                            <p className="text-slate-500 font-poppins text-sm">Select the rooms you wish to book.</p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          {property.roomTypes.map((roomType, index) => (
                            <div key={index} className="group/item relative bg-slate-50 hover:bg-white rounded-3xl p-6 border-2 border-slate-100 hover:border-purple-200 transition-all duration-300">
                              <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="flex-1 space-y-4">
                                  <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-bold text-slate-800 capitalize transition-colors group-hover/item:text-purple-600">{roomType.type} Room</h3>
                                    <div className="flex gap-0.5">
                                      {[...Array(5)].map((_, i) => <FaStar key={i} className="text-amber-400 text-xs" />)}
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-3">
                                    <div className="px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center gap-2">
                                      <span className="text-indigo-600 font-extrabold text-lg">{formatCurrency(roomType.price)}</span>
                                      <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">/ Night</span>
                                    </div>
                                    <div className="px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm flex items-center gap-2">
                                      <FaCheck className="text-emerald-500" />
                                      <span className="text-slate-600 font-bold">{roomType.available} Available</span>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-4 pt-2">
                                    <div className="flex items-center gap-2 text-slate-400">
                                      <FaWifi className="text-blue-400" />
                                      <span className="text-xs font-bold uppercase tracking-tight">Free WiFi</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400">
                                      <FaCar className="text-emerald-400" />
                                      <span className="text-xs font-bold uppercase tracking-tight">Parking</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400">
                                      <FaUtensils className="text-orange-400" />
                                      <span className="text-xs font-bold uppercase tracking-tight">Breakfast</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-inner flex flex-col justify-center items-center min-w-[140px]">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Quantity</span>
                                  <div className="flex items-center gap-4">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const val = values.bookedRooms[index]?.quantity || 0;
                                        if (val > 0) setFieldValue(`bookedRooms.${index}.quantity`, val - 1);
                                      }}
                                      className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 flex items-center justify-center transition-colors border border-slate-100"
                                    >
                                      <FaMinus size={12} />
                                    </button>
                                    <span className="text-xl font-extrabold text-slate-700 w-6 text-center">{values.bookedRooms[index]?.quantity || 0}</span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const val = values.bookedRooms[index]?.quantity || 0;
                                        if (val < roomType.available) setFieldValue(`bookedRooms.${index}.quantity`, val + 1);
                                      }}
                                      className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-500 flex items-center justify-center transition-colors border border-slate-100"
                                    >
                                      <FaPlus size={12} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Payment & Requests Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-900/5 border border-white p-8 md:p-10 relative overflow-hidden group animate-slide-up delay-300">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/5 to-blue-500/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform duration-700"></div>

                      <div className="relative space-y-12">
                        {/* Payment Method */}
                        <div>
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                              <span className="text-white font-black text-xl">Rs</span>
                            </div>
                            <div>
                              <h2 className="text-2xl font-inter font-extrabold text-[#0F172A]">Payment Method</h2>
                              <p className="text-slate-500 font-poppins text-sm">Select your preferred way to pay.</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <label className={`relative cursor-pointer group/pay ${property?.paymentType === 'cash' ? 'opacity-50 pointer-events-none' : ''}`}>
                              <Field type="radio" name="paymentType" value="online" className="sr-only" />
                              <div className={`h-full p-6 rounded-3xl border-2 transition-all duration-300 ${values.paymentType === 'online' ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 bg-slate-50 hover:border-blue-200'}`}>
                                <div className="flex items-center gap-4">
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${values.paymentType === 'online' ? 'border-blue-500 bg-blue-500' : 'border-slate-300 bg-white'}`}>
                                    {values.paymentType === 'online' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                  </div>
                                  <div>
                                    <h3 className={`font-bold ${values.paymentType === 'online' ? 'text-blue-700' : 'text-slate-700'}`}>Pay Online</h3>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Instant</p>
                                  </div>
                                </div>
                              </div>
                            </label>

                            <label className={`relative cursor-pointer group/pay ${property?.paymentType === 'online' ? 'opacity-50 pointer-events-none' : ''}`}>
                              <Field type="radio" name="paymentType" value="on_arrival" className="sr-only" />
                              <div className={`h-full p-6 rounded-3xl border-2 transition-all duration-300 ${values.paymentType === 'on_arrival' ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-100 bg-slate-50 hover:border-emerald-200'}`}>
                                <div className="flex items-center gap-4">
                                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${values.paymentType === 'on_arrival' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 bg-white'}`}>
                                    {values.paymentType === 'on_arrival' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                                  </div>
                                  <div>
                                    <h3 className={`font-bold ${values.paymentType === 'on_arrival' ? 'text-emerald-700' : 'text-slate-700'}`}>On Arrival</h3>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">Pay at Check-in</p>
                                  </div>
                                </div>
                              </div>
                            </label>
                          </div>
                        </div>

                        {/* Special Requests */}
                        <div>
                          <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-600/20">
                              <FaUtensils className="text-white text-xl" />
                            </div>
                            <div>
                              <h2 className="text-2xl font-inter font-extrabold text-[#0F172A]">Special Requests</h2>
                              <p className="text-slate-500 font-poppins text-sm">Any extra needs for your stay?</p>
                            </div>
                          </div>

                          <Field
                            as="textarea"
                            name="specialRequests"
                            rows="4"
                            className="w-full bg-slate-50 border-2 border-slate-100 px-6 py-5 rounded-3xl focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/50 outline-none transition-all font-poppins text-slate-700 placeholder:text-slate-300 resize-none"
                            placeholder="e.g. Early check-in, dietary needs..."
                          />
                        </div>

                        {/* Action Area */}
                        <div className="pt-6">
                          <button
                            type="submit"
                            disabled={isSubmitting || calculatedAmount === 0}
                            onClick={() => {
                              if (!isValid || Object.keys(errors).length > 0) {
                                toast.error("Please fill all required fields correctly.");
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                console.log("Validation errors:", errors);
                              }
                            }}
                            className="w-full relative group/btn overflow-hidden rounded-[2rem]"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-300 group-hover/btn:scale-105"></div>
                            <div className="relative px-8 py-6 flex items-center justify-center gap-4 text-white font-inter font-black text-xl uppercase tracking-tighter">
                              {isSubmitting ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                              ) : (
                                <>
                                  <span>Confirm Stay</span>
                                  <div className="h-8 w-[1px] bg-white/20"></div>
                                  <span className="text-blue-200">{formatCurrency(calculatedAmount)}</span>
                                </>
                              )}
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Summary Card */}
                  <div className="lg:col-span-4">
                    <div className="sticky top-20 space-y-6 animate-slide-up delay-400">
                      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/10 border border-white p-8 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                        <div className="relative space-y-8">
                          <div>
                            <h2 className="text-2xl font-inter font-extrabold text-[#0F172A] mb-2">Your Summary</h2>
                            <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
                          </div>

                          <div className="space-y-6">
                            <div className="flex gap-4">
                              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 border border-slate-100">
                                <FaMapMarkerAlt className="text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800 line-clamp-1">{property.name}</h4>
                                <p className="text-xs text-slate-400 line-clamp-1">{property.address}</p>
                              </div>
                            </div>

                            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-medium">Check-in</span>
                                <span className="text-slate-800 font-bold">{values.checkInDate || '---'}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-medium">Check-out</span>
                                <span className="text-slate-800 font-bold">{values.checkOutDate || '---'}</span>
                              </div>
                              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                                <span className="text-slate-500 font-medium">Nights</span>
                                <span className="px-3 py-1 bg-white rounded-lg border border-slate-200 text-xs font-black text-blue-600">{numberOfNights} Nights</span>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex justify-between items-center px-2">
                                <span className="text-slate-500 text-sm font-medium">Booking Total</span>
                                <span className="text-slate-800 font-bold">{formatCurrency(calculatedAmount - (values.paymentType === 'on_arrival' ? 200 : 0))}</span>
                              </div>
                              {values.paymentType === 'on_arrival' && (
                                <div className="flex justify-between items-center px-2">
                                  <span className="text-slate-500 text-sm font-medium">Platform Fee</span>
                                  <span className="text-orange-600 font-bold">{formatCurrency(200)}</span>
                                </div>
                              )}
                              <div className="pt-6 border-t-2 border-dashed border-slate-200">
                                <div className="flex justify-between items-end">
                                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Payable</span>
                                  <span className="text-3xl font-inter font-black text-indigo-600 tracking-tighter">{formatCurrency(calculatedAmount)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="px-6 py-4 bg-emerald-50 rounded-2xl flex items-center gap-3 border border-emerald-100">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                              <FaCheck className="text-emerald-500 text-xs" />
                            </div>
                            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Safe & Secure Verified</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default BookingFormPage;
