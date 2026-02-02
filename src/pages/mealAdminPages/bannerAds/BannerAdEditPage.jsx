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
    <div className="p-4 lg:p-6 pb-24 lg:pb-6 bg-[#0A1330] min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10 overflow-visible mt-2">
          <button
            onClick={() => navigate(`/admin/banner-ads/${id}`)}
            className="p-3 bg-[#121B36] rounded-xl border border-[#FFFFFF0D] hover:bg-[#1C244D] transition-all self-start shadow-xl"
          >
            <FaArrowLeft className="text-[#14F195]" size={14} />
          </button>
          <div className="flex-1 flex flex-col gap-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Edit Banner</h1>
            <p className="text-[#AEB9E1] text-xs font-bold uppercase tracking-widest opacity-60">Creative Asset Management</p>
          </div>
        </div>

        {/* Unified Layout Card */}
        <div className="bg-[#121B36] rounded-[32px] border border-[#FFFFFF0D] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#9945FF] to-[#14F195] opacity-5 blur-3xl -z-10"></div>

          {/* Visual Preview Segment */}
          <div className="relative w-full h-64 md:h-80 overflow-hidden">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Creative preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#171D41] flex items-center justify-center">
                <FaImage className="text-white text-6xl opacity-10" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#121B36] to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-[#14F19520] backdrop-blur-md px-4 py-2 rounded-xl border border-[#14F19520] inline-block">
                <span className="text-[#14F195] text-[10px] font-bold uppercase tracking-widest">Live Preview</span>
              </div>
            </div>
          </div>

          {/* Form Content Segment */}
          <div className="p-6 md:p-10">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ values, setFieldValue }) => (
                <Form className="space-y-12">

                  {/* Media Injection Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-6 bg-pink-500 rounded-full"></span>
                      <h3 className="text-lg font-bold text-white">Visual Identity</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="h-48 border-2 border-dashed border-[#FFFFFF0D] rounded-[32px] flex items-center justify-center group hover:border-[#14F195/40] transition-colors relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, setFieldValue)}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <FaImage size={18} className="text-[#AEB9E1]" />
                          </div>
                          <div className="text-center px-4">
                            <p className="text-white font-bold text-sm">Replace Media</p>
                            <p className="text-[#AEB9E1]/30 text-[9px] font-bold uppercase mt-1 px-4">Drag drop or tap to browse</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 flex flex-col justify-center">
                        <label className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest ml-1">Remote Resource (URL)</label>
                        <Field
                          type="text"
                          name="image"
                          placeholder="Direct URL if not uploading"
                          className="w-full h-14 bg-[#171D41] border border-[#FFFFFF0D] rounded-2xl px-5 text-white font-bold placeholder-[#AEB9E1]/20 outline-none"
                          onChange={(e) => {
                            setFieldValue("image", e.target.value);
                            setImagePreview(e.target.value);
                          }}
                        />
                        <ErrorMessage name="image" component="div" className="text-red-400 text-[10px] font-bold uppercase ml-1" />
                      </div>
                    </div>
                  </div>

                  {/* Messaging Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-6 bg-[#14F195] rounded-full"></span>
                      <h3 className="text-lg font-bold text-white">Copy & Impact</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest ml-1">Headline Text *</label>
                        <Field
                          name="title"
                          placeholder="Main catching title"
                          className="w-full h-14 bg-[#171D41] border border-[#FFFFFF0D] rounded-2xl px-5 text-white font-bold placeholder-[#AEB9E1]/20 outline-none"
                        />
                        <ErrorMessage name="title" component="div" className="text-red-400 text-[10px] font-bold uppercase ml-1" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest ml-1">Button Text (CTA)</label>
                        <Field
                          name="ctaText"
                          placeholder="e.g. BOOK NOW"
                          className="w-full h-14 bg-[#171D41] border border-[#FFFFFF0D] rounded-2xl px-5 text-white font-bold placeholder-[#AEB9E1]/20 outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest ml-1">Supporting Description *</label>
                      <Field
                        as="textarea"
                        name="description"
                        rows={4}
                        className="w-full bg-[#171D41] border border-[#FFFFFF0D] rounded-[24px] p-5 text-white font-medium outline-none placeholder-[#AEB9E1]/20 resize-none min-h-[120px]"
                      />
                      <ErrorMessage name="description" component="div" className="text-red-400 text-[10px] font-bold uppercase ml-1" />
                    </div>
                  </div>

                  {/* Deployment Logic Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-6 bg-[#9945FF] rounded-full"></span>
                      <h3 className="text-lg font-bold text-white">Distribution Logic</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest ml-1">Target Property *</label>
                        <Field
                          as="select"
                          name="property_id"
                          className="w-full h-14 bg-[#171D41] border border-[#FFFFFF0D] rounded-2xl px-5 text-white font-bold appearance-none cursor-pointer"
                        >
                          <option value="">Choose Property</option>
                          {properties.map((p) => (
                            <option key={p._id} value={p._id}>{p.name}</option>
                          ))}
                        </Field>
                        <ErrorMessage name="property_id" component="div" className="text-red-400 text-[10px] font-bold uppercase ml-1" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest ml-1">Display Priority</label>
                        <Field
                          type="number"
                          name="priority"
                          className="w-full h-14 bg-[#171D41] border border-[#FFFFFF0D] rounded-2xl px-5 text-white font-bold outline-none"
                        />
                      </div>

                      <div className="flex items-center px-4">
                        <label className="flex items-center gap-4 cursor-pointer group">
                          <div className="relative">
                            <Field
                              type="checkbox"
                              name="isActive"
                              className="sr-only peer"
                            />
                            <div className="w-12 h-6 bg-[#0A1330] rounded-full border border-[#FFFFFF0D] peer-checked:bg-[#14F19520] peer-checked:border-[#14F19530] transition-all"></div>
                            <div className="absolute left-1 top-1 w-4 h-4 bg-[#AEB9E1] rounded-full peer-checked:left-7 peer-checked:bg-[#14F195] transition-all duration-300"></div>
                          </div>
                          <span className="text-[#AEB9E1] font-bold text-sm">Visibility (Live)</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest ml-1">Activation Period (Start)</label>
                        <Field
                          type="date"
                          name="startDate"
                          className="w-full h-14 bg-[#171D41] border border-[#FFFFFF0D] rounded-2xl px-5 text-white font-bold outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest ml-1">Termination Period (End)</label>
                        <Field
                          type="date"
                          name="endDate"
                          className="w-full h-14 bg-[#171D41] border border-[#FFFFFF0D] rounded-2xl px-5 text-white font-bold outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Financial & Partner Info */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-6 bg-[#F7B91C] rounded-full"></span>
                      <h3 className="text-lg font-bold text-white">Partner Management</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest ml-1">Advertiser ID / Name</label>
                        <Field
                          name="advertiserName"
                          className="w-full h-14 bg-[#171D41] border border-[#FFFFFF0D] rounded-2xl px-5 text-white font-bold outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest ml-1">Registered Payout (Amount)</label>
                        <div className="relative">
                          <Field
                            name="amountPaid"
                            type="number"
                            className="w-full h-14 bg-[#171D41] border border-[#FFFFFF0D] rounded-2xl px-5 pr-16 text-white font-bold outline-none"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 h-8 px-2 bg-[#0A1330] rounded-lg border border-[#FFFFFF05] flex items-center text-[10px] font-bold text-[#AEB9E1]">
                            {values.currency}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Operational Controls */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-6 bg-blue-400 rounded-full"></span>
                      <h3 className="text-lg font-bold text-white">Operational Gates</h3>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[#AEB9E1]/40 text-[10px] font-bold uppercase tracking-widest ml-1">Conversion Limit (Click Cap)</label>
                      <Field
                        type="number"
                        name="clickLimit"
                        placeholder="Leave empty for unlimited traction"
                        className="w-full h-14 bg-[#171D41] border border-[#FFFFFF0D] rounded-2xl px-5 text-white font-bold outline-none placeholder-[#AEB9E1]/20"
                      />
                      <p className="text-[#AEB9E1]/30 text-[9px] font-medium leading-relaxed px-1">Defines after how many user interactions the creative asset should be withdrawn automatically.</p>
                    </div>
                  </div>

                  {/* Submission Suite */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-[#FFFFFF0D]">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 h-16 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white rounded-[24px] font-bold text-lg tracking-tight shadow-xl shadow-[#14F19522] hover:opacity-95 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      <FaSave size={18} />
                      {submitting ? "COMMITTING DATA..." : "AUTHORIZE CHANGES"}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/banner-ads/${id}`)}
                      className="h-16 px-10 bg-[#0A1330] text-[#AEB9E1] rounded-[24px] font-bold text-sm tracking-widest border border-[#FFFFFF0D] hover:bg-white/5 transition-all"
                    >
                      ABORT
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

