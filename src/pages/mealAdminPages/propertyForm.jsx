import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "../../utils/axios";
import { toast } from "react-hot-toast";
import { FaPlus, FaTrash, FaSave, FaArrowLeft } from "react-icons/fa";

const PropertyForm = () => {
  const navigate = useNavigate();
  const { id, staffId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const isEditMode = Boolean(id);
  const isStaffProperty = Boolean(staffId);
  
  console.log("PropertyForm - id:", id, "staffId:", staffId, "isStaffProperty:", isStaffProperty);
  console.log("PropertyForm - user:", user);
  const [loading, setLoading] = useState(false);
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
      .matches(/^[\+]?[1-9][\d]{0,15}$/, "Please enter a valid phone number")
      .max(15, "Phone number must be less than 15 digits"),
    
    checkInTime: Yup.string()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter valid time format (HH:MM)")
      .required("Check-in time is required"),
    
    checkOutTime: Yup.string()
      .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter valid time format (HH:MM)")
      .required("Check-out time is required")
      .test('checkout-after-checkin', 'Check-out time must be after or equal to check-in time', function(value) {
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
            .positive("Price must be greater than 0")
            .min(1, "Minimum price is $1")
            .max(10000, "Maximum price is $10,000")
            .required("Price is required"),
        })
      )
      .min(1, "At least one room type is required")
      .test('total-rooms', 'Total rooms must be at least 1', function(roomTypes) {
        if (!roomTypes) return false;
        const totalRooms = roomTypes.reduce((sum, room) => sum + (room.count || 0), 0);
        return totalRooms > 0;
      })
      .test('unique-room-types', 'Each room type can only be added once', function(roomTypes) {
        if (!roomTypes) return true;
        const types = roomTypes.map(room => room.type);
        return new Set(types).size === types.length;
      }),
    
    status: Yup.string()
      .oneOf(['active', 'inactive', 'maintenance'], "Invalid status")
      .required("Status is required"),
  });

  // Fetch property data if edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/v1/properties/${id}`);
      
      if (response.data.success) {
        const property = response.data.data;
        setInitialValues({
          name: property.name || "",
          address: property.address || "",
          description: property.description || "",
          roomTypes: property.roomTypes || [],
          contactEmail: property.contactEmail || "",
          contactPhone: property.contactPhone || "",
          checkInTime: property.checkInTime || "14:00",
          checkOutTime: property.checkOutTime || "11:00",
          photos: property.photos || [],
          amenities: property.amenities || [],
          status: property.status || "active",
        });
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
        roomTypes: values.roomTypes.filter(room => room.count > 0),
      };

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
    <div className="p-3 sm:p-4 lg:p-6 bg-[#0A1330] min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <button
            onClick={() => navigate(user?.role === 'staff' ? "/staff/properties" : "/admin/properties")}
            className="p-3 bg-[#171D41] rounded-lg hover:bg-[#2A2A3E] transition-colors border border-[#3A3A4E] self-start"
          >
            <FaArrowLeft className="text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {isEditMode ? "Edit Property" : "Create New Property"}
            </h1>
            <p className="text-[#AEB9E1] mt-1 text-sm sm:text-base">
              {isEditMode ? "Update property information" : "Add a new property to your system"}
            </p>
            {isStaffProperty && (
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
                <span className="text-blue-400 text-xs font-medium">
                  Creating property for Staff ID: {staffId}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="bg-[#171D41] rounded-lg shadow-lg border border-[#3A3A4E] p-4 sm:p-6">
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, isSubmitting, setFieldValue, errors, touched }) => (
              <Form className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-white">Basic Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">Property Name *</label>
                      <Field
                        name="name"
                        type="text"
                        className="w-full px-4 py-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14F195] text-white placeholder-[#AEB9E1]"
                        placeholder="Enter property name"
                      />
                      <ErrorMessage name="name" component="div" className="text-red-400 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">Status</label>
                      <Field
                        as="select"
                        name="status"
                        className="w-full px-4 py-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14F195] text-white"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="maintenance">Maintenance</option>
                      </Field>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">Address *</label>
                    <Field
                      name="address"
                      type="text"
                      className="w-full px-4 py-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14F195] text-white placeholder-[#AEB9E1]"
                      placeholder="Enter property address"
                    />
                    <ErrorMessage name="address" component="div" className="text-red-400 text-sm mt-1" />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">Description</label>
                    <Field
                      as="textarea"
                      name="description"
                      rows="3"
                      className="w-full px-4 py-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14F195] text-white placeholder-[#AEB9E1] resize-none"
                      placeholder="Enter property description"
                    />
                  </div>
                </div>

                {/* Room Types */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-white">Room Types</h2>
                  <FieldArray name="roomTypes">
                    {({ push, remove }) => (
                      <div className="space-y-4">
                        {values.roomTypes.map((room, index) => (
                          <div key={index} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-[#2A2A3E] rounded-lg border border-[#3A3A4E]">
                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">Room Type</label>
                              <Field
                                as="select"
                                name={`roomTypes.${index}.type`}
                                className="w-full px-4 py-2 bg-[#3A3A4E] border border-[#454A67] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14F195] text-white"
                              >
                                <option value="single">Single</option>
                                <option value="double">Double</option>
                              </Field>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">Count</label>
                              <Field
                                name={`roomTypes.${index}.count`}
                                type="number"
                                min="0"
                                className="w-full px-4 py-2 bg-[#3A3A4E] border border-[#454A67] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14F195] text-white"
                              />
                              <ErrorMessage
                                name={`roomTypes.${index}.count`}
                                component="div"
                                className="text-red-400 text-sm mt-1"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">Price ($)</label>
                              <Field
                                name={`roomTypes.${index}.price`}
                                type="number"
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 bg-[#3A3A4E] border border-[#454A67] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14F195] text-white"
                              />
                              <ErrorMessage
                                name={`roomTypes.${index}.price`}
                                component="div"
                                className="text-red-400 text-sm mt-1"
                              />
                            </div>

                            <div className="flex items-end">
                              {values.roomTypes.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 border border-red-500/30 w-full transition-colors"
                                >
                                  <FaTrash className="inline mr-2" />
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => push({ type: "single", count: 0, price: 0 })}
                          className="w-full px-4 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 rounded-lg hover:from-blue-500/30 hover:to-purple-500/30 border border-blue-500/30 transition-all duration-300"
                        >
                          <FaPlus className="inline mr-2" />
                          Add Room Type
                        </button>
                      </div>
                    )}
                  </FieldArray>
                </div>

                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-white">Contact Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">Contact Email *</label>
                      <Field
                        name="contactEmail"
                        type="email"
                        className="w-full px-4 py-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14F195] text-white placeholder-[#AEB9E1]"
                        placeholder="contact@property.com"
                      />
                      <ErrorMessage name="contactEmail" component="div" className="text-red-400 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">Contact Phone</label>
                      <Field
                        name="contactPhone"
                        type="tel"
                        className="w-full px-4 py-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14F195] text-white placeholder-[#AEB9E1]"
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                  </div>
                </div>

                {/* Check-in/Check-out Times */}
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-white">Check-in/Check-out Times</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">Check-in Time</label>
                      <Field
                        name="checkInTime"
                        type="time"
                        className="w-full px-4 py-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14F195] text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">Check-out Time</label>
                      <Field
                        name="checkOutTime"
                        type="time"
                        className="w-full px-4 py-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#14F195] text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={() => console.log("Create Property button clicked!")}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                  >
                    <FaSave className="mr-2" />
                    {isSubmitting ? "Saving..." : isEditMode ? "Update Property" : "Create Property"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(user?.role === 'staff' ? "/staff/properties" : "/admin/properties")}
                    className="px-6 py-3 bg-[#2A2A3E] text-[#AEB9E1] rounded-lg hover:bg-[#3A3A4E] transition border border-[#3A3A4E]"
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default PropertyForm;

