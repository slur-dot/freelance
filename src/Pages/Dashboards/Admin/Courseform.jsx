import React, { useState } from "react";
import { adminApi } from "../../../lib/adminApi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

export default function Courseform({ onContinue }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    videoFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Map form fields to backend schema
      const courseData = {
        title: formData.name, // Map name to title
        category: "General", // Default category
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        durationHours: 0, // Default duration
        level: "Beginner", // Default level
        published: false, // Default to unpublished
      };

      console.log("Creating course with data:", courseData);

      const result = await adminApi.create("courses", courseData);
      console.log("Course created successfully:", result);

      // Navigate back to course listing
      navigate("/admin/dashboard/course-listing");

      if (onContinue) onContinue(result);
    } catch (err) {
      console.error("Error creating course:", err);
      setError(err.message || t('admin_dashboard.listings.course.form_page.errors.create_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl rounded-lg bg-white px-4 py-6 shadow-lg sm:p-6 md:p-8">
        {/* Header */}
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{t('admin_dashboard.listings.course.form_page.title')}</h1>
            <p className="text-sm text-gray-500 sm:text-base">
              {t('admin_dashboard.listings.course.form_page.subtitle')}
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/dashboard/course-listing")}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form className="grid gap-6" onSubmit={handleSubmit}>
          {/* Error Message */}
          {error && (
            <div className="col-span-full rounded-md bg-red-50 p-3 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Name */}
          <div className="grid gap-2 sm:grid-cols-[1fr_2fr] sm:items-center sm:gap-4">
            <label htmlFor="name" className="font-medium text-sm sm:text-base">
              {t('admin_dashboard.listings.course.form_page.labels.name')} <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder={t('admin_dashboard.listings.course.form_page.placeholders.name')}
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div className="grid gap-2 sm:grid-cols-[1fr_2fr] sm:items-start sm:gap-4">
            <label
              htmlFor="description"
              className="font-medium text-sm sm:text-base"
            >
              {t('admin_dashboard.listings.course.form_page.labels.description')} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              placeholder={t('admin_dashboard.listings.course.form_page.placeholders.description')}
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
              rows={5}
              required
            />
          </div>

          {/* Price with GNF */}
          <div className="grid gap-2 sm:grid-cols-[1fr_2fr] sm:items-center sm:gap-4">
            <label htmlFor="price" className="font-medium text-sm sm:text-base">
              {t('admin_dashboard.listings.course.form_page.labels.price')} <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                id="price"
                type="text"
                placeholder={t('admin_dashboard.listings.course.form_page.placeholders.price')}
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className="w-1/2 rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
              <span className="text-sm font-medium text-gray-700">GNF</span>
            </div>
          </div>


          {/* Video File Upload */}
          <div className="grid gap-2 sm:grid-cols-[1fr_2fr] sm:items-center sm:gap-4">
            <label htmlFor="videoFile" className="font-medium text-sm sm:text-base">
              {t('admin_dashboard.listings.course.form_page.labels.video_file', 'Upload Video')}
            </label>
            <div className="w-full">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer">
                <input
                  type="file"
                  id="videoFile"
                  accept="video/*"
                  onChange={(e) => handleInputChange("videoFile", e.target.files[0])}
                  className="hidden"
                />
                <label htmlFor="videoFile" className="cursor-pointer">
                  <p className="text-sm font-medium text-gray-700">{t('admin_dashboard.listings.course.form_page.placeholders.video_upload', 'Click to upload or drag and drop')}</p>
                  <p className="text-xs text-gray-500 mt-1">MP4, WebM up to 500MB</p>
                  {formData.videoFile && (
                    <p className="text-xs text-green-600 mt-2 font-medium">✓ {formData.videoFile.name}</p>
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Submit/Cancel Buttons */}
          <div className="col-span-full mt-4 flex flex-col sm:flex-row justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard/course-listing")}
              className="w-full max-w-[250px] rounded-3xl border border-gray-300 px-6 py-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              {t('common.cancel') || 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full max-w-[250px] rounded-3xl bg-green-600 px-6 py-4 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('admin_dashboard.listings.course.form_page.buttons.submitting') : t('admin_dashboard.listings.course.form_page.buttons.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
