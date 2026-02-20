import React, { useState } from "react";
import { adminApi } from "../../../lib/adminApi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Productform({ onContinue }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const categories = [
    { value: "Smartphones", label: t('admin_dashboard.listings.product.form_page.categories.smartphones') },
    { value: "Laptops", label: t('admin_dashboard.listings.product.form_page.categories.laptops') },
    { value: "Tablets", label: t('admin_dashboard.listings.product.form_page.categories.tablets') },
    { value: "Accessories", label: t('admin_dashboard.listings.product.form_page.categories.accessories') },
    { value: "Wearables", label: t('admin_dashboard.listings.product.form_page.categories.wearables') },
    { value: "Others", label: t('admin_dashboard.listings.product.form_page.categories.others') },
  ];

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
      const productData = {
        name: formData.name,
        sku: `SKU-${Date.now()}`, // Generate unique SKU
        description: "", // Default empty description
        price: parseFloat(formData.price) || 0,
        stock: 0, // Default stock
        category: formData.category,
        listed: false, // Default to unlisted
      };

      console.log("Creating product with data:", productData);

      const result = await adminApi.create("products", productData);
      console.log("Product created successfully:", result);

      // Navigate back to product listing
      navigate("/admin/dashboard/product-listing");

      if (onContinue) onContinue(result);
    } catch (err) {
      console.error("Error creating product:", err);
      setError(err.message || t('admin_dashboard.listings.product.form_page.errors.create_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl rounded-lg bg-white px-4 py-6 shadow-lg sm:p-6 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold sm:text-3xl">{t('admin_dashboard.listings.product.form_page.title')}</h1>
          <p className="text-sm text-gray-500 sm:text-base">
            {t('admin_dashboard.listings.product.form_page.subtitle')}
          </p>
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
              {t('admin_dashboard.listings.product.form_page.labels.name')} <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              placeholder={t('admin_dashboard.listings.product.form_page.placeholders.name')}
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Category */}
          <div className="grid gap-2 sm:grid-cols-[1fr_2fr] sm:items-center sm:gap-4">
            <label htmlFor="category" className="font-medium text-sm sm:text-base">
              {t('admin_dashboard.listings.product.form_page.labels.category')} <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">{t('admin_dashboard.listings.product.form_page.placeholders.select_category')}</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price with GNF */}
          <div className="grid gap-2 sm:grid-cols-[1fr_2fr] sm:items-center sm:gap-4">
            <label htmlFor="price" className="font-medium text-sm sm:text-base">
              {t('admin_dashboard.listings.product.form_page.labels.price')} <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                id="price"
                type="text"
                placeholder={t('admin_dashboard.listings.product.form_page.placeholders.price')}
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className="w-1/2 rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
                required
              />
              <span className="text-sm font-medium text-gray-700">GNF</span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="col-span-full mt-4 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full max-w-[250px] rounded-3xl bg-green-600 px-6 py-4 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('admin_dashboard.listings.product.form_page.buttons.submitting') : t('admin_dashboard.listings.product.form_page.buttons.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
