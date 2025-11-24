import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "../../../utils/axios";
import { toast } from "react-hot-toast";
import { FaTimes, FaImage, FaCalendar } from "react-icons/fa";

const PromotionForm = ({ ad, onClose, onSuccess }) => {
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(ad?.image || "");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoadingProperties(true);
      const response = await axios.get("/api/v1/properties?limit=100&status=active");
      if (response.data.success) {
        setProperties(response.data.data.properties || []);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast.error("Failed to load properties");
    } finally {
      setLoadingProperties(false);
    }
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .required("Title is required")
      .max(100, "Title cannot exceed 100 characters"),
    description: Yup.string()
      .required("Description is required")
      .max(500, "Description cannot exceed 500 characters"),
    image: Yup.string().required("Image is required"),
    property_id: Yup.string().required("Property is required"),
    ctaText: Yup.string().max(50, "CTA text cannot exceed 50 characters"),
    priority: Yup.number()
      .min(1, "Priority must be at least 1")
      .max(10, "Priority cannot exceed 10"),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date()
      .nullable()
      .transform((value, originalValue) => {
        return originalValue === "" ? null : value;
      })
      .when("startDate", (startDate, schema) => {
        if (!startDate) return schema;
        return schema.min(startDate, "End date must be after start date");
      }),
    advertiserName: Yup.string(),
    advertiserEmail: Yup.string().email("Invalid email address"),
    amountPaid: Yup.number().min(0, "Amount cannot be negative"),
    clickLimit: Yup.number()
      .nullable()
      .min(1, "Click limit must be at least 1")
      .transform((value, originalValue) => {
        return originalValue === "" ? null : value;
      }),
  });

  const initialValues = {
    title: ad?.title || "",
    description: ad?.description || "",
    image: ad?.image || "",
    ctaText: ad?.ctaText || "Book Now",
    property_id: ad?.property_id?._id || ad?.property_id || "",
    priority: ad?.priority || 1,
    startDate: ad?.startDate
      ? new Date(ad.startDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    endDate: ad?.endDate
      ? new Date(ad.endDate).toISOString().split("T")[0]
      : "",
    isActive: ad?.isActive !== undefined ? ad.isActive : true,
    advertiserName: ad?.advertiserName || "",
    advertiserEmail: ad?.advertiserEmail || "",
    amountPaid: ad?.amountPaid || 0,
    currency: ad?.currency || "PKR",
    clickLimit: ad?.clickLimit || null, // Optional, null means no limit
  };

  const handleImageChange = (e, setFieldValue) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFieldValue("image", base64String);
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);

      const payload = {
        ...values,
        property_id: values.property_id,
        // Convert empty string to null for clickLimit
        clickLimit: values.clickLimit === "" || values.clickLimit === null ? null : Number(values.clickLimit),
        // Convert empty string to null for endDate
        endDate: values.endDate === "" || values.endDate === null ? null : values.endDate,
      };

      let response;
      if (ad) {
        response = await axios.put(`/api/v1/banner-ads/${ad._id}`, payload);
      } else {
        response = await axios.post("/api/v1/banner-ads", payload);
      }

      if (response.data.success) {
        toast.success(ad ? "Banner ad updated successfully" : "Banner ad created successfully");
        onSuccess();
      }
    } catch (error) {
      console.error("Error saving banner ad:", error);
      toast.error(error.response?.data?.message || "Failed to save banner ad");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#171D41] rounded-xl shadow-2xl border border-[#3A3A4E] w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#171D41] border-b border-[#3A3A4E] p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-white">
            {ad ? "Edit Banner Ad" : "Create New Banner Ad"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2A2A3E] rounded-lg transition-colors"
          >
            <FaTimes className="text-white text-xl" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">
                    Banner Image *
                  </label>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, setFieldValue)}
                        className="w-full px-4 py-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#9945FF] file:text-white hover:file:bg-[#7A35DF]"
                      />
                      <Field
                        type="text"
                        name="image"
                        placeholder="Or paste image URL/base64"
                        className="mt-2 w-full px-4 py-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg text-white placeholder-[#AEB9E1] focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
                        onChange={(e) => {
                          setFieldValue("image", e.target.value);
                          setImagePreview(e.target.value);
                        }}
                      />
                      <ErrorMessage
                        name="image"
                        component="div"
                        className="text-red-400 text-sm mt-1"
                      />
                    </div>
                    {imagePreview && (
                      <div className="w-48 h-32 rounded-lg overflow-hidden border border-[#3A3A4E]">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Title and Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">
                      Title *
                    </label>
                    <Field
                      type="text"
                      name="title"
                      placeholder="e.g., Boost Your Social Game"
                      className="w-full px-4 py-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg text-white placeholder-[#AEB9E1] focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">
                      CTA Button Text
                    </label>
                    <Field
                      type="text"
                      name="ctaText"
                      placeholder="Book Now"
                      className="w-full px-4 py-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg text-white placeholder-[#AEB9E1] focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
                    />
                    <ErrorMessage
                      name="ctaText"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">
                    Description *
                  </label>
                  <Field
                    as="textarea"
                    name="description"
                    rows={3}
                    placeholder="Get real tools, real quick. Free followers, likes, and insights..."
                    className="w-full px-4 py-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg text-white placeholder-[#AEB9E1] focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-400 text-sm mt-1"
                  />
                </div>

                {/* Property Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">
                    Property *
                  </label>
                  <Field
                    as="select"
                    name="property_id"
                    className="w-full px-4 py-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
                    disabled={loadingProperties}
                  >
                    <option value="">Select a property</option>
                    {properties.map((property) => (
                      <option key={property._id} value={property._id}>
                        {property.name} - {property.address}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="property_id"
                    component="div"
                    className="text-red-400 text-sm mt-1"
                  />
                </div>

                {/* Priority and Status */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">
                      Priority (1-10)
                    </label>
                    <Field
                      type="number"
                      name="priority"
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
                    />
                    <ErrorMessage
                      name="priority"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">
                      Start Date *
                    </label>
                    <Field
                      type="date"
                      name="startDate"
                      className="w-full px-4 py-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
                    />
                    <ErrorMessage
                      name="startDate"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">
                      End Date (Optional - Leave empty for unlimited)
                    </label>
                    <Field
                      type="date"
                      name="endDate"
                      className="w-full px-4 py-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
                    />
                    <p className="text-[#AEB9E1] text-xs mt-2">
                      Set an end date to automatically remove the ad from the home page. Leave empty to run indefinitely.
                    </p>
                    <ErrorMessage
                      name="endDate"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Advertiser Info */}
                <div className="border-t border-[#3A3A4E] pt-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Advertiser Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">
                        Advertiser Name
                      </label>
                      <Field
                        type="text"
                        name="advertiserName"
                        placeholder="Hotel/Company name"
                        className="w-full px-4 py-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg text-white placeholder-[#AEB9E1] focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">
                        Advertiser Email
                      </label>
                      <Field
                        type="email"
                        name="advertiserEmail"
                        placeholder="advertiser@example.com"
                        className="w-full px-4 py-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg text-white placeholder-[#AEB9E1] focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
                      />
                      <ErrorMessage
                        name="advertiserEmail"
                        component="div"
                        className="text-red-400 text-sm mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">
                        Amount Paid
                      </label>
                      <Field
                        type="number"
                        name="amountPaid"
                        min="0"
                        className="w-full px-4 py-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">
                        Currency
                      </label>
                      <Field
                        as="select"
                        name="currency"
                        className="w-full px-4 py-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
                      >
                        <option value="PKR">PKR (Rs)</option>
                        <option value="USD">USD ($)</option>
                      </Field>
                    </div>
                  </div>
                </div>

                {/* Click Limit (Optional) */}
                <div className="border-t border-[#3A3A4E] pt-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Click Tracking (Optional)</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">
                      Click Limit (Leave empty for unlimited)
                    </label>
                    <Field
                      type="number"
                      name="clickLimit"
                      min="1"
                      placeholder="e.g., 1000 (ad will be removed after this many clicks)"
                      className="w-full px-4 py-2 bg-[#2A2A3E] border border-[#3A3A4E] rounded-lg text-white placeholder-[#AEB9E1] focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
                    />
                    <p className="text-[#AEB9E1] text-xs mt-2">
                      Set a limit on how many times users can click "Book Now". Once reached, the ad will be automatically removed from the home page.
                    </p>
                    <ErrorMessage
                      name="clickLimit"
                      component="div"
                      className="text-red-400 text-sm mt-1"
                    />
                  </div>
                </div>

                {/* Active Status */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Field
                      type="checkbox"
                      name="isActive"
                      className="w-4 h-4 text-[#9945FF] bg-[#2A2A3E] border-[#3A3A4E] rounded focus:ring-[#9945FF]"
                    />
                    <span className="text-[#AEB9E1]">Active (Show on home page)</span>
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4 border-t border-[#3A3A4E]">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-[#2A2A3E] hover:bg-[#3A3A4E] text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting
                      ? "Saving..."
                      : ad
                      ? "Update Banner Ad"
                      : "Create Banner Ad"}
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

export default PromotionForm;
