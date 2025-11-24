import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "../../../utils/axios";
import { toast } from "react-hot-toast";
import { 
  FaArrowLeft, 
  FaSave,
  FaImage, 
  FaCalendar,
  FaBuilding,
  FaTag,
  FaEnvelope,
  FaUser,
  FaDollarSign
} from "react-icons/fa";

const BannerAdEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [bannerAd, setBannerAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    fetchBannerAd();
    fetchProperties();
  }, [id]);

  const fetchBannerAd = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = user?.token || localStorage.getItem("auth_token");
      const response = await axios.get(`/api/v1/banner-ads/${id}`, {
        headers: token ? {
          Authorization: `Bearer ${token}`
        } : {},
      });

      if (response.data.success) {
        const adData = response.data.data;
        console.log("Banner ad fetched:", adData);
        console.log("Property ID (raw):", adData.property_id);
        console.log("Property ID (type):", typeof adData.property_id);
        if (adData.property_id && typeof adData.property_id === "object") {
          console.log("Property ID (_id):", adData.property_id._id);
        }
        setBannerAd(adData);
        setImagePreview(adData.image || "");
      } else {
        setError(response.data.message || "Failed to fetch banner ad");
      }
    } catch (error) {
      console.error("Error fetching banner ad:", error);
      setError(error.response?.data?.message || "Failed to fetch banner ad");
      toast.error(error.response?.data?.message || "Failed to fetch banner ad");
    } finally {
      setLoading(false);
    }
  };

  const fetchProperties = async () => {
    try {
      setLoadingProperties(true);
      const token = user?.token || localStorage.getItem("auth_token");
      const response = await axios.get("/api/v1/properties?limit=100", {
        headers: token ? {
          Authorization: `Bearer ${token}`
        } : {},
      });
      
      console.log("Properties API response:", response.data);
      
      if (response.data.success) {
        // Handle different response formats
        const propertiesData = response.data.data?.properties || response.data.data || response.data.properties || [];
        setProperties(propertiesData);
        console.log("Properties loaded:", propertiesData.length);
        console.log("Properties data:", propertiesData);
      } else {
        console.error("Properties API returned error:", response.data.message);
        toast.error(response.data.message || "Failed to load properties");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
      console.error("Error details:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to load properties");
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

      const token = user?.token || localStorage.getItem("auth_token");
      const response = await axios.put(`/api/v1/banner-ads/${id}`, payload, {
        headers: token ? {
          Authorization: `Bearer ${token}`
        } : {},
      });

      if (response.data.success) {
        toast.success("Banner ad updated successfully");
        navigate(`/admin/banner-ads/${id}`);
      }
    } catch (error) {
      console.error("Error updating banner ad:", error);
      toast.error(error.response?.data?.message || "Failed to update banner ad");
    } finally {
      setSubmitting(false);
    }
  };

  // Compute initial values using useMemo to ensure it updates when bannerAd changes
  // IMPORTANT: This hook must be called BEFORE any early returns to follow Rules of Hooks
  const initialValues = useMemo(() => {
    if (!bannerAd) {
      return {
        title: "",
        description: "",
        image: "",
        ctaText: "Book Now",
        property_id: "",
        priority: 1,
        startDate: new Date().toISOString().split("T")[0],
        endDate: "",
        isActive: true,
        advertiserName: "",
        advertiserEmail: "",
        amountPaid: 0,
        currency: "PKR",
      };
    }

    // Extract property_id - handle both populated object and string ID
    let propertyId = "";
    if (bannerAd.property_id) {
      if (typeof bannerAd.property_id === "object" && bannerAd.property_id._id) {
        propertyId = bannerAd.property_id._id.toString();
      } else if (typeof bannerAd.property_id === "string") {
        propertyId = bannerAd.property_id;
      }
    }

    const values = {
      title: bannerAd.title || "",
      description: bannerAd.description || "",
      image: bannerAd.image || "",
      ctaText: bannerAd.ctaText || "Book Now",
      property_id: propertyId,
      priority: bannerAd.priority || 1,
      startDate: bannerAd.startDate
        ? new Date(bannerAd.startDate).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      endDate: bannerAd.endDate
        ? new Date(bannerAd.endDate).toISOString().split("T")[0]
        : "",
      isActive: bannerAd.isActive !== undefined ? bannerAd.isActive : true,
      advertiserName: bannerAd.advertiserName || "",
      advertiserEmail: bannerAd.advertiserEmail || "",
      amountPaid: bannerAd.amountPaid || 0,
      currency: bannerAd.currency || "PKR",
      clickLimit: bannerAd.clickLimit || null, // Optional, null means no limit
    };
    console.log("Initial values computed:", values);
    console.log("Property ID in initial values:", values.property_id);
    return values;
  }, [bannerAd]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-[#0A1330] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#14F195] mx-auto mb-4"></div>
          <p className="text-[#AEB9E1]">Loading banner ad...</p>
        </div>
      </div>
    );
  }

  if (error || !bannerAd) {
    return (
      <div className="p-4 sm:p-6 bg-[#0A1330] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-red-400 mb-4">{error || "Banner ad not found"}</p>
          <button
            onClick={() => navigate("/admin/banner-ads")}
            className="px-4 py-2 bg-[#9945FF] text-white rounded-lg hover:bg-[#7A35DF] transition-colors"
          >
            Back to Banner Ads
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-[#0A1330] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(`/admin/banner-ads/${id}`)}
            className="flex items-center gap-2 text-[#AEB9E1] hover:text-white transition-colors"
          >
            <FaArrowLeft />
            <span>Back to Details</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Edit Banner Ad</h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {/* Form */}
        <div className="bg-[#171D41] rounded-lg shadow-lg border border-[#3A3A4E] overflow-hidden">
          {/* Banner Image Preview Section */}
          <div className="relative w-full h-64 md:h-96 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Banner preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaImage className="text-white text-6xl opacity-50" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, setFieldValue }) => (
                <Form className="space-y-6">
                  {/* Image Upload */}
                  <div className="bg-[#2A2A3E] rounded-lg p-6 border border-[#3A3A4E]">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FaImage className="text-[#9945FF]" />
                      Banner Image
                    </h3>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, setFieldValue)}
                          className="w-full px-4 py-2 bg-[#171D41] border border-[#3A3A4E] rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#9945FF] file:text-white hover:file:bg-[#7A35DF]"
                        />
                        <Field
                          type="text"
                          name="image"
                          placeholder="Or paste image URL/base64"
                          className="mt-2 w-full px-4 py-2 bg-[#171D41] border border-[#3A3A4E] rounded-lg text-white placeholder-[#AEB9E1] focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
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
                    </div>
                  </div>

                  {/* Title and Description */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#2A2A3E] rounded-lg p-6 border border-[#3A3A4E]">
                      <h3 className="text-lg font-semibold text-white mb-4">Title & CTA</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">
                            Title *
                          </label>
                          <Field
                            type="text"
                            name="title"
                            placeholder="e.g., Boost Your Social Game"
                            className="w-full px-4 py-2 bg-[#171D41] border border-[#3A3A4E] rounded-lg text-white placeholder-[#AEB9E1] focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
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
                            className="w-full px-4 py-2 bg-[#171D41] border border-[#3A3A4E] rounded-lg text-white placeholder-[#AEB9E1] focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
                          />
                          <ErrorMessage
                            name="ctaText"
                            component="div"
                            className="text-red-400 text-sm mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#2A2A3E] rounded-lg p-6 border border-[#3A3A4E]">
                      <h3 className="text-lg font-semibold text-white mb-4">Description</h3>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">
                          Description *
                        </label>
                        <Field
                          as="textarea"
                          name="description"
                          rows={4}
                          placeholder="Get real tools, real quick. Free followers, likes, and insights..."
                          className="w-full px-4 py-2 bg-[#171D41] border border-[#3A3A4E] rounded-lg text-white placeholder-[#AEB9E1] focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
                        />
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-red-400 text-sm mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Property Selection */}
                  <div className="bg-[#2A2A3E] rounded-lg p-6 border border-[#3A3A4E]">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FaBuilding className="text-[#9945FF]" />
                      Property Selection
                    </h3>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">
                        Property *
                      </label>
                      <Field
                        as="select"
                        name="property_id"
                        className="w-full px-4 py-2 bg-[#171D41] border border-[#3A3A4E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF] disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loadingProperties}
                      >
                        <option value="">
                          {loadingProperties ? "Loading properties..." : "Select a property"}
                        </option>
                        {properties.length === 0 && !loadingProperties && (
                          <option value="" disabled>No properties available</option>
                        )}
                        {properties.map((property) => {
                          const propertyId = property._id?.toString() || property._id;
                          return (
                            <option key={propertyId} value={propertyId}>
                              {property.name} - {property.address}
                            </option>
                          );
                        })}
                      </Field>
                      {loadingProperties && (
                        <p className="text-[#AEB9E1] text-sm mt-2">Loading properties...</p>
                      )}
                      {properties.length === 0 && !loadingProperties && (
                        <p className="text-yellow-400 text-sm mt-2">
                          No properties found. Please create a property first.
                        </p>
                      )}
                      {values.property_id && !loadingProperties && properties.length > 0 && (
                        (() => {
                          const selectedProperty = properties.find(
                            (p) => (p._id?.toString() || p._id) === values.property_id
                          );
                          if (!selectedProperty) {
                            return (
                              <p className="text-yellow-400 text-sm mt-2">
                                ⚠️ Selected property not found in list. The property may have been deleted.
                              </p>
                            );
                          }
                          return (
                            <p className="text-green-400 text-xs mt-2">
                              ✓ Selected: {selectedProperty.name}
                            </p>
                          );
                        })()
                      )}
                      <ErrorMessage
                        name="property_id"
                        component="div"
                        className="text-red-400 text-sm mt-1"
                      />
                    </div>
                  </div>

                  {/* Priority, Status, and Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#2A2A3E] rounded-lg p-6 border border-[#3A3A4E]">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FaTag className="text-[#9945FF]" />
                        Priority & Status
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">
                            Priority (1-10)
                          </label>
                          <Field
                            type="number"
                            name="priority"
                            min="1"
                            max="10"
                            className="w-full px-4 py-2 bg-[#171D41] border border-[#3A3A4E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
                          />
                          <ErrorMessage
                            name="priority"
                            component="div"
                            className="text-red-400 text-sm mt-1"
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <Field
                              type="checkbox"
                              name="isActive"
                              className="w-4 h-4 text-[#9945FF] bg-[#171D41] border-[#3A3A4E] rounded focus:ring-[#9945FF]"
                            />
                            <span className="text-[#AEB9E1]">Active (Show on home page)</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#2A2A3E] rounded-lg p-6 border border-[#3A3A4E]">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FaCalendar className="text-[#9945FF]" />
                        Dates
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">
                            Start Date *
                          </label>
                          <Field
                            type="date"
                            name="startDate"
                            className="w-full px-4 py-2 bg-[#171D41] border border-[#3A3A4E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
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
                                    className="w-full px-4 py-2 bg-[#171D41] border border-[#3A3A4E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
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
                    </div>
                  </div>

                  {/* Advertiser Information */}
                  <div className="bg-[#2A2A3E] rounded-lg p-6 border border-[#3A3A4E]">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FaUser className="text-[#9945FF]" />
                      Advertiser Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">
                          Advertiser Name
                        </label>
                        <Field
                          type="text"
                          name="advertiserName"
                          placeholder="Hotel/Company name"
                          className="w-full px-4 py-2 bg-[#171D41] border border-[#3A3A4E] rounded-lg text-white placeholder-[#AEB9E1] focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
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
                          className="w-full px-4 py-2 bg-[#171D41] border border-[#3A3A4E] rounded-lg text-white placeholder-[#AEB9E1] focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
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
                          className="w-full px-4 py-2 bg-[#171D41] border border-[#3A3A4E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2 text-[#AEB9E1]">
                          Currency
                        </label>
                        <Field
                          as="select"
                          name="currency"
                          className="w-full px-4 py-2 bg-[#171D41] border border-[#3A3A4E] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
                        >
                          <option value="PKR">PKR (Rs)</option>
                          <option value="USD">USD ($)</option>
                        </Field>
                          </div>
                        </div>
                      </div>

                  {/* Click Limit (Optional) */}
                  <div className="bg-[#2A2A3E] rounded-lg p-6 border border-[#3A3A4E]">
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
                        className="w-full px-4 py-2 bg-[#171D41] border border-[#3A3A4E] rounded-lg text-white placeholder-[#AEB9E1] focus:outline-none focus:ring-2 focus:ring-[#9945FF]"
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

                  {/* Submit Buttons */}
                  <div className="flex gap-4 pt-4 border-t border-[#3A3A4E]">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/banner-ads/${id}`)}
                      className="flex-1 px-6 py-3 bg-[#2A2A3E] hover:bg-[#3A3A4E] text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <FaSave />
                      {submitting ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerAdEditPage;

