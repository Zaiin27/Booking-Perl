import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "../../utils/axios";
import { toast } from "react-hot-toast";
import { FaPlus, FaTrash, FaSave, FaArrowLeft } from "react-icons/fa";

const FormErrorReporter = ({ errors, submitCount }) => {
  useEffect(() => {
    if (submitCount > 0 && Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      const errorMsg = typeof firstError === 'string'
        ? firstError
        : "Please check all required fields and room quantities/prices.";
      toast.error(`Form Error: ${errorMsg}`);
      console.log("Validation Errors:", errors);
    }
  }, [submitCount]);
  return null;
};

const PropertyForm = () => {
  const navigate = useNavigate();
  const { id, staffId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const isEditMode = Boolean(id);
  const isStaffProperty = Boolean(staffId);

  console.log("PropertyForm - id:", id, "staffId:", staffId, "isStaffProperty:", isStaffProperty);
  console.log("PropertyForm - user:", user);
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([null, null]);
  const [propertyPaymentType, setPropertyPaymentType] = useState(null);

  // Handle image upload
  const handleImageChange = (index, event, setFieldValue, values) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;

      // Update preview
      const newPreviews = [...imagePreviews];
      newPreviews[index] = base64String;
      setImagePreviews(newPreviews);

      // Update form values - ensure photos array has 2 slots
      const currentPhotos = values.photos || [];
      const newPhotos = [...currentPhotos];
      while (newPhotos.length < 2) {
        newPhotos.push(null);
      }
      newPhotos[index] = base64String;
      setFieldValue('photos', newPhotos.filter(photo => photo !== null && photo !== undefined));
    };
    reader.readAsDataURL(file);
  };

  // Remove image
  const handleImageRemove = (index, setFieldValue, values) => {
    const newPreviews = [...imagePreviews];
    newPreviews[index] = null;
    setImagePreviews(newPreviews);

    const currentPhotos = values.photos || [];
    const newPhotos = [...currentPhotos];
    if (newPhotos[index]) {
      newPhotos[index] = null;
    }
    setFieldValue('photos', newPhotos.filter(photo => photo !== null && photo !== undefined));
  };

  const [initialValues, setInitialValues] = useState({
    name: "",
    address: "",
    description: "",
    roomTypes: [
      { type: "single", count: 0, price: 0 },
      { type: "double", count: 0, price: 0 },
    ],
    contactEmail: "",
    contactPhone: "",
    checkInTime: "15:00",
    checkOutTime: "23:00",
    photos: [],
    amenities: [],
    status: "active",
    currency: "USD",
  });

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Property name must be at least 3 characters")
      .max(100, "Property name must be less than 100 characters")
      .matches(/^[a-zA-Z0-9\s\-&.,'()]+$/, "Property name contains invalid characters")
      .required("Property name is required"),

    address: Yup.string()
      .min(10, "Address must be at least 10 characters")
      .max(500, "Address must be less than 500 characters")
      .required("Address is required"),

    description: Yup.string()
      .max(1000, "Description must be less than 1000 characters"),

    contactEmail: Yup.string()
      .email("Please enter a valid email address")
      .required("Contact email is required"),

    contactPhone: Yup.string()
      .matches(/^[\+]?[0-9\s\-]{7,20}$/, "Please enter a valid phone number")
      .max(20, "Phone number must be less than 20 characters"),

    checkInTime: Yup.string()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter valid time format (HH:MM)")
      .required("Check-in time is required"),

    checkOutTime: Yup.string()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter valid time format (HH:MM)")
      .required("Check-out time is required")
      .test('checkout-after-checkin', 'Check-out time must be after or equal to check-in time', function (value) {
        const { checkInTime } = this.parent;
        if (!checkInTime || !value) return true;

        console.log("Time validation - Check-in:", checkInTime, "Check-out:", value);

        const checkIn = new Date(`2000-01-01T${checkInTime}`);
        const checkOut = new Date(`2000-01-01T${value}`);

        const isValid = checkOut >= checkIn;
        console.log("Time validation result:", isValid);

        return isValid; // Allow same time
      }),

    roomTypes: Yup.array()
      .of(
        Yup.object({
          type: Yup.string()
            .oneOf(['single', 'double'], "Room type must be single or double")
            .required("Room type is required"),
          count: Yup.number()
            .integer("Room count must be a whole number")
            .min(0, "Room count must be at least 0")
            .max(1000, "Room count cannot exceed 1000")
            .required("Room count is required"),
          price: Yup.number()
            .min(0, "Price cannot be negative")
            .max(10000, "Maximum price is $10,000")
            .required("Price is required"),
        })
      )
      .min(1, "At least one room type is required")
      .test('total-rooms', 'Total rooms must be at least 1', function (roomTypes) {
        if (!roomTypes) return false;
        const totalRooms = roomTypes.reduce((sum, room) => sum + (room.count || 0), 0);
        return totalRooms > 0;
      })
      .test('unique-room-types', 'Each room type can only be added once', function (roomTypes) {
        if (!roomTypes) return true;
        const types = roomTypes.map(room => room.type);
        return new Set(types).size === types.length;
      }),

    status: Yup.string()
      .oneOf(['active', 'inactive', 'maintenance'], "Invalid status")
      .required("Status is required"),

    currency: Yup.string()
      .oneOf(['USD', 'PKR'], "Currency must be USD or PKR")
      .required("Currency is required"),
  });

  // Fetch property data if edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchProperty();
    } else if (isStaffProperty && staffId) {
      // Fetch staff payment type when creating property for staff
      fetchStaffPaymentType();
    } else if (user?.role === 'staff') {
      // Fetch current staff user's payment type
      fetchStaffPaymentType();
    }
  }, [id, staffId, isEditMode, isStaffProperty, user]);

  const fetchStaffPaymentType = async () => {
    try {
      const targetStaffId = staffId || user?.id;
      if (!targetStaffId) return;

      // If staff is creating property for themselves, use their own paymentType from auth state
      if (user?.role === 'staff' && !staffId && user?.paymentType) {
        setPropertyPaymentType(user.paymentType);
        return;
      }

      // If admin is creating property for a staff, use admin endpoint
      if (user?.role === 'admin' && staffId) {
        const response = await axios.get(`/api/v1/admin/users/${targetStaffId}`);
        if (response.data.success) {
          const staffData = response.data.data;
          setPropertyPaymentType(staffData.paymentType || 'both');
        }
      } else if (user?.role === 'staff' && user?.paymentType) {
        // Staff creating for themselves - use from user state
        setPropertyPaymentType(user.paymentType);
      } else {
        // Fallback: try to get from profile endpoint
        try {
          const response = await axios.get(`/api/v1/auth/profile`);
          if (response.data.success && response.data.user?.paymentType) {
            setPropertyPaymentType(response.data.user.paymentType);
          } else {
            setPropertyPaymentType('both'); // Default
          }
        } catch (profileError) {
          console.error("Error fetching profile:", profileError);
          setPropertyPaymentType('both'); // Default
        }
      }
    } catch (error) {
      console.error("Error fetching staff payment type:", error);
      // Fallback to user's paymentType from auth state if available
      if (user?.paymentType) {
        setPropertyPaymentType(user.paymentType);
      } else {
        setPropertyPaymentType('both'); // Default
      }
    }
  };

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/properties/${id}`);

      if (response.data.success) {
        const property = response.data.data;
        const photos = property.photos || [];

        // Set image previews
        const previews = [null, null];
        if (photos[0]) previews[0] = photos[0];
        if (photos[1]) previews[1] = photos[1];
        setImagePreviews(previews);

        setInitialValues({
          name: property.name || "",
          address: property.address || "",
          description: property.description || "",
          roomTypes: property.roomTypes || [],
          contactEmail: property.contactEmail || "",
          contactPhone: property.contactPhone || "",
          checkInTime: property.checkInTime || "14:00",
          checkOutTime: property.checkOutTime || "11:00",
          photos: photos,
          amenities: property.amenities || [],
          status: property.status || "active",
          currency: property.currency || "USD",
        });
        // Set payment type from property
        setPropertyPaymentType(property.paymentType || 'both');
      }
    } catch (error) {
      console.error("Error fetching property:", error);
      toast.error(error.response?.data?.message || "Failed to fetch property");
      navigate("/admin/properties");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    console.log("=== FORM SUBMISSION STARTED ===");
    console.log("Form values:", values);

    try {

      const payload = {
        ...values,
        roomTypes: values.roomTypes.filter(room => room.count > 0 && room.price > 0),
      };

      if (payload.roomTypes.length === 0) {
        toast.error("Please add at least one room category with quantity and price greater than 0");
        setSubmitting(false);
        return;
      }

      // Add owner_id if creating property for specific staff
      if (isStaffProperty && !isEditMode) {
        payload.owner_id = staffId;
        console.log("Setting owner_id for staff property:", staffId);
      }

      console.log("Final payload:", payload);
      console.log("isStaffProperty:", isStaffProperty, "isEditMode:", isEditMode, "staffId:", staffId);

      console.log("API payload:", payload);
      console.log("Making API call to:", isEditMode ? `/api/v1/properties/${id}` : "/api/v1/properties");

      // Get token for authentication
      const token = localStorage.getItem('auth_token');
      const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

      console.log("Property creation - Token:", token ? "Present" : "Missing");
      console.log("Property creation - Headers:", authHeaders);

      let response;
      if (isEditMode) {
        response = await axios.put(`/api/v1/properties/${id}`, payload, { headers: authHeaders });
      } else {
        response = await axios.post("/api/v1/properties", payload, { headers: authHeaders });
      }

      console.log("API response:", response);

      if (response.data.success) {
        toast.success(
          isEditMode ? "Property updated successfully" : "Property created successfully"
        );
        // Navigate based on user role
        if (user?.role === 'staff') {
          navigate("/staff/properties");
        } else {
          navigate("/admin/properties");
        }
      }
    } catch (error) {
      console.error("Error saving property:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      toast.error(error.response?.data?.message || error.message || "Failed to save property");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A1330]">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#14F195]"></div>
          <div className="text-[#AEB9E1] text-sm font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 bg-[#0A1330] min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10 overflow-visible">
          <button
            onClick={() => navigate(user?.role === 'staff' ? "/staff/properties" : "/admin/properties")}
            className="p-3 bg-[#121B36] rounded-xl border border-[#FFFFFF0D] hover:bg-[#1C244D] transition-all self-start shadow-xl"
          >
            <FaArrowLeft className="text-[#14F195]" size={14} />
          </button>
          <div className="flex-1 flex flex-col gap-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {isEditMode ? "Modify Property" : "Direct Listing"}
            </h1>
            <p className="text-[#AEB9E1] text-xs font-bold uppercase tracking-widest opacity-60">
              {isEditMode ? "Update listing data" : "Register a new establishment"}
            </p>
            {isStaffProperty && (
              <div className="mt-3 inline-flex items-center px-4 py-1.5 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <span className="text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                  Partner ID: {staffId}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Unified Form Card */}
        <div className="bg-[#121B36] rounded-[32px] border border-[#FFFFFF0D] shadow-2xl p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#9945FF] to-[#14F195] opacity-5 blur-3xl -z-10"></div>

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, isSubmitting, setFieldValue, errors, touched, submitCount }) => (
              <>
                <FormErrorReporter errors={errors} submitCount={submitCount} />
                <Form className="space-y-10">

                  {/* Section: Basic Details */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-2 h-6 bg-[#14F195] rounded-full"></span>
                      <h2 className="text-xl font-bold text-white">Identity Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-white text-[10px] font-bold uppercase tracking-widest ml-1">Establishment Name *</label>
                        <Field
                          name="name"
                          type="text"
                          className="w-full h-14 bg-[#171D41] border border-[#FFFFFF0D] rounded-2xl px-5 text-white font-bold focus:ring-2 focus:ring-[#14F195/40] outline-none transition-all placeholder-white/60"
                          placeholder="e.g. Grand Royal Hotel"
                        />
                        <ErrorMessage name="name" component="div" className="text-red-400 text-[10px] font-bold uppercase tracking-wider ml-1" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-white text-[10px] font-bold uppercase tracking-widest ml-1">Active Status</label>
                        <Field
                          as="select"
                          name="status"
                          className="w-full h-14 bg-[#171D41] border border-[#FFFFFF0D] rounded-2xl px-5 text-white font-bold focus:ring-2 focus:ring-[#14F195/40] outline-none transition-all cursor-pointer"
                        >
                          <option value="active">Operational (Active)</option>
                          <option value="inactive">Paused (Inactive)</option>
                          <option value="maintenance">Under Maintenance</option>
                        </Field>
                      </div>

                      <div className="space-y-2">
                        <label className="text-white text-[10px] font-bold uppercase tracking-widest ml-1">Primary Currency *</label>
                        <Field
                          as="select"
                          name="currency"
                          className="w-full h-14 bg-[#171D41] border border-[#FFFFFF0D] rounded-2xl px-5 text-white font-bold focus:ring-2 focus:ring-[#14F195/40] outline-none transition-all cursor-pointer"
                        >
                          <option value="USD">USD ($) - International</option>
                          <option value="PKR">PKR (Rs) - Local</option>
                        </Field>
                        <ErrorMessage name="currency" component="div" className="text-red-400 text-[10px] font-bold uppercase tracking-wider ml-1" />
                      </div>

                      {propertyPaymentType && (
                        <div className="space-y-2">
                          <label className="text-white text-[10px] font-bold uppercase tracking-widest ml-1">
                            Payment Policy <span className="text-[8px] opacity-40">(Inherited)</span>
                          </label>
                          <div className="w-full h-14 flex items-center bg-[#0A1330] border border-[#FFFFFF05] rounded-2xl px-5 text-white/50 font-bold text-sm italic">
                            {propertyPaymentType === 'online' ? 'Credit/Debit Only' :
                              propertyPaymentType === 'cash' ? 'Pay on Arrival Only' :
                                'Multi-Channel (Both)'}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-white text-[10px] font-bold uppercase tracking-widest ml-1">Geographic Location *</label>
                      <Field
                        name="address"
                        type="text"
                        className="w-full h-14 bg-[#171D41] border border-[#FFFFFF0D] rounded-2xl px-5 text-white font-bold focus:ring-2 focus:ring-[#14F195/40] outline-none transition-all placeholder-white/60"
                        placeholder="Street, City, Country"
                      />
                      <ErrorMessage name="address" component="div" className="text-red-400 text-[10px] font-bold uppercase tracking-wider ml-1" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-white text-[10px] font-bold uppercase tracking-widest ml-1">Listing Bio</label>
                      <Field
                        as="textarea"
                        name="description"
                        rows="3"
                        className="w-full bg-[#171D41] border border-[#FFFFFF0D] rounded-[24px] p-5 text-white font-medium focus:ring-2 focus:ring-[#14F195/40] outline-none transition-all placeholder-white/60 resize-none min-h-[120px]"
                        placeholder="Describe the unique features of your property..."
                      />
                    </div>
                  </div>

                  {/* Section: Inventory */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-2 h-6 bg-[#9945FF] rounded-full"></span>
                      <h2 className="text-xl font-bold text-white">Room Inventory</h2>
                    </div>

                    <FieldArray name="roomTypes">
                      {({ push, remove }) => (
                        <div className="space-y-6">
                          {values.roomTypes.map((room, index) => (
                            <div key={index} className="relative group">
                              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#9945FF] to-[#14F195] rounded-[28px] blur opacity-0 group-hover:opacity-10 transition duration-500"></div>
                              <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-[#171D41] rounded-[28px] border border-[#FFFFFF0D]">
                                <div className="space-y-2">
                                  <label className="text-white text-[9px] font-bold uppercase tracking-widest ml-1">Category</label>
                                  <Field
                                    as="select"
                                    name={`roomTypes.${index}.type`}
                                    className="w-full h-12 bg-[#0A1330] border border-[#FFFFFF0D] rounded-xl px-4 text-white font-bold focus:ring-[#14F195] appearance-none cursor-pointer"
                                  >
                                    <option value="single">Single Room</option>
                                    <option value="double">Double Room</option>
                                  </Field>
                                </div>

                                <div className="space-y-2">
                                  <label className="text-white text-[9px] font-bold uppercase tracking-widest ml-1">Quantity</label>
                                  <Field
                                    name={`roomTypes.${index}.count`}
                                    type="number"
                                    className="w-full h-12 bg-[#0A1330] border border-[#FFFFFF0D] rounded-xl px-4 text-white font-bold outline-none"
                                  />
                                  <ErrorMessage name={`roomTypes.${index}.count`} component="div" className="text-red-400 text-[10px] font-medium" />
                                </div>

                                <div className="space-y-2">
                                  <label className="text-white text-[9px] font-bold uppercase tracking-widest ml-1">Price ({values.currency})</label>
                                  <Field
                                    name={`roomTypes.${index}.price`}
                                    type="number"
                                    className="w-full h-12 bg-[#0A1330] border border-[#FFFFFF0D] rounded-xl px-4 text-white font-bold outline-none"
                                  />
                                  <ErrorMessage name={`roomTypes.${index}.price`} component="div" className="text-red-400 text-[10px] font-medium" />
                                </div>

                                <div className="flex items-end">
                                  {values.roomTypes.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => remove(index)}
                                      className="w-full h-12 flex items-center justify-center gap-2 bg-[#FF4B5510] text-[#FF4B55] border border-[#FF4B5520] rounded-xl hover:bg-[#FF4B5520] transition-all font-bold text-xs"
                                    >
                                      <FaTrash size={12} />
                                      <span>REMOVE</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => push({ type: "single", count: 0, price: 0 })}
                            className="w-full py-4 bg-white/5 border border-dashed border-[#FFFFFF1A] rounded-[24px] text-[#AEB9E1] font-bold hover:bg-white/10 hover:border-[#14F195/40] transition-all flex items-center justify-center gap-2"
                          >
                            <FaPlus size={12} />
                            <span>APPEND NEW ROOM CATEGORY</span>
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  {/* Section: Communications & Policy */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                        <h2 className="text-xl font-bold text-white">Contact Info</h2>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-white text-[10px] font-bold uppercase tracking-widest ml-1">Support Email *</label>
                          <Field
                            name="contactEmail"
                            type="email"
                            className="w-full h-14 bg-[#171D41] border border-[#FFFFFF0D] rounded-2xl px-5 text-white font-bold outline-none placeholder-white/60"
                            placeholder="inquiry@hotel.com"
                          />
                          <ErrorMessage name="contactEmail" component="div" className="text-red-400 text-[10px] font-bold" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-white text-[10px] font-bold uppercase tracking-widest ml-1">Mobile Hotline</label>
                          <Field
                            name="contactPhone"
                            type="tel"
                            className="w-full h-14 bg-[#171D41] border border-[#FFFFFF0D] rounded-2xl px-5 text-white font-bold outline-none placeholder-white/60"
                            placeholder="+00 000 000 000"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-2 h-6 bg-[#F7B91C] rounded-full"></span>
                        <h2 className="text-xl font-bold text-white">Policy Times</h2>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-white text-[10px] font-bold uppercase tracking-widest text-center block">Check-In</label>
                          <Field
                            name="checkInTime"
                            type="time"
                            className="w-full h-14 bg-[#171D41] border border-[#FFFFFF0D] rounded-2xl px-5 text-white font-bold outline-none text-center"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-white text-[10px] font-bold uppercase tracking-widest text-center block">Check-Out</label>
                          <Field
                            name="checkOutTime"
                            type="time"
                            className="w-full h-14 bg-[#171D41] border border-[#FFFFFF0D] rounded-2xl px-5 text-white font-bold outline-none text-center"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section: Media Gallery */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-2 h-6 bg-pink-500 rounded-full"></span>
                      <h2 className="text-xl font-bold text-white">Visual Showcase</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[0, 1].map((index) => (
                        <div key={index} className="space-y-4">
                          <label className="text-white text-[10px] font-bold uppercase tracking-widest block ml-2">Gallery Asset {index + 1}</label>

                          {imagePreviews[index] ? (
                            <div className="relative group rounded-[28px] overflow-hidden border border-[#FFFFFF0D] shadow-2xl">
                              <img src={imagePreviews[index]} className="w-full h-64 object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                <button
                                  type="button"
                                  onClick={() => handleImageRemove(index, setFieldValue, values)}
                                  className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
                                >
                                  <FaTrash size={16} className="text-white" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="h-64 border-2 border-dashed border-[#FFFFFF0D] rounded-[32px] flex items-center justify-center group hover:border-[#14F195/40] transition-colors relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(index, e, setFieldValue, values)}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                              />
                              <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <FaPlus size={20} className="text-[#AEB9E1]" />
                                </div>
                                <div className="text-center">
                                  <p className="text-white font-bold text-sm">Upload Perspective</p>
                                  <p className="text-white/40 text-[10px] font-bold uppercase mt-1">High Res JPG / PNG</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Global Actions */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-[#FFFFFF0D]">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-[2] h-18 bg-gradient-to-r py-3 from-[#9945FF] to-[#14F195] text-white rounded-[20px] font-black text-xs tracking-[0.15em] shadow-xl shadow-[#14F19511] hover:opacity-95 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      <FaSave size={18} />
                      {isSubmitting ? "PROCESSING..." : isEditMode ? "SAVE UPDATES" : "DEPLOY LISTING"}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(user?.role === 'staff' ? "/staff/properties" : "/admin/properties")}
                      className="flex-1 h-14 px-8 py-3 bg-[#171D41] text-[#AEB9E1] rounded-[20px] font-bold text-[10px] tracking-[0.15em] border border-[#FFFFFF0D] hover:bg-white/5 transition-all"
                    >
                      CANCEL
                    </button>
                  </div>
                </Form>
              </>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;

