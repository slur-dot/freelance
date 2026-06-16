import { useTranslation } from "react-i18next";import React, { useState } from "react";

export default function DeviceDetailsForm({ onContinue, prefilledProduct = {} }) {
  const [formData, setFormData] = useState({
    deviceType: prefilledProduct.deviceType || "",
    quantity: 1,
    rentalDuration: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: "",
    preferredBrands: prefilledProduct.brand || "",
    purpose: ""
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onContinue) onContinue(formData); // Move to next step
  };

  return (
    <div className="flex justify-center p-4 md:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <div className="w-full max-w-3xl rounded-lg shadow-lg bg-white">
        {/* Header */}
        <div className="p-4">
          <h2 className="text-2xl font-bold ml-3">{t("booking_form_639", "Booking Form")}</h2>
          <p className="text-black text-sm mt-1 ml-3">
            {t("complete_the_booking_form_to_complete_your_booking_546", "Complete the booking form to complete your booking")}
          </p>
        </div>

        {/* Content */}
        <form className="p-6 pt-0 space-y-6" onSubmit={handleSubmit}>
          <h3 className="text-lg font-semibold mt-2">{t("device_rental_details_998", "Device Rental Details")}</h3>

          <div className="grid grid-cols-1 gap-6">
            {/* Device Type */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
              <label className="w-full sm:w-40 text-sm font-medium">{t("device_type_25", "Device Type*")}</label>
              <input
                value={formData.deviceType || "Computer"}
                readOnly
                className="flex-1 bg-gray-200 text-gray-600 border border-gray-300 rounded-md px-4 py-2 w-full cursor-not-allowed cursor-default" />
              
            </div>

            {/* Quantity */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
              <label className="w-full sm:w-40 text-sm font-medium">{t("quantity_649", "Quantity*")}</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                className="w-full sm:w-40 bg-gray-100 border border-gray-300 rounded-md px-4 py-2"
                required />
              
            </div>

            {/* Rental Duration */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
              <label className="w-full sm:w-40 text-sm font-medium">{t("rental_duration_491", "Rental Duration*")}</label>
              <select
                value={formData.rentalDuration}
                onChange={(e) => handleChange("rentalDuration", e.target.value)}
                className="flex-1 bg-gray-100 border border-gray-300 rounded-md px-4 py-2 w-full"
                required>
                
                <option value="">{t("select_an_option_125", "Select an Option")}</option>
                <option value="Weekly">{t("weekly_953", "Weekly")}</option>
                <option value="Monthly">{t("monthly_947", "Monthly")}</option>
                <option value="Yearly">{t("yearly_1", "Yearly")}</option>
              </select>
            </div>

            {/* Start Date and End Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">{t("start_date_794", "Start Date*")}</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.startDate}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2"
                  required />
                
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">{t("end_date_163", "End Date*")}</label>
                <input
                  type="date"
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  value={formData.endDate}
                  onChange={(e) => handleChange("endDate", e.target.value)}
                  className="w-full bg-gray-100 border border-gray-300 rounded-md px-4 py-2"
                  required />
                
              </div>
            </div>

            {/* Preferred Brands */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8">
              <label className="w-full sm:w-40 text-sm font-medium">
                {t("preferred_brand_602", "Preferred Brand*")}
              </label>
              <select
                value={formData.preferredBrands}
                onChange={(e) => handleChange("preferredBrands", e.target.value)}
                className="flex-1 bg-gray-100 border border-gray-300 rounded-md px-4 py-2 w-full"
                required>
                
                <option value="">{t("select_a_brand_880", "Select a Brand")}</option>
                <option value="Apple">{t("apple_902", "Apple")}</option>
                <option value="Dell">{t("dell_838", "Dell")}</option>
                <option value="HP">{t("hp_828", "HP")}</option>
                <option value="Lenovo">{t("lenovo_856", "Lenovo")}</option>
                <option value="Samsung">{t("samsung_396", "Samsung")}</option>
                <option value="Acer">{t("acer_272", "Acer")}</option>
                <option value="Asus">{t("asus_432", "Asus")}</option>
              </select>
            </div>

            {/* Purpose of Rental */}
            <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-8">
              <label className="w-full sm:w-40 text-sm font-medium pt-2">
                {t("purpose_of_rental_271", "Purpose of Rental")}
              </label>
              <textarea
                value={formData.purpose}
                onChange={(e) => handleChange("purpose", e.target.value)}
                placeholder={t("eg_office_use_project_implementation_522", "e.g. Office use, Project implementation")}
                className="flex-1 bg-gray-100 border border-gray-300 rounded-md px-4 py-2 min-h-[100px] w-full" />
              
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-center p-6">
            <button
              type="submit"
              className="w-full max-w-[300px] bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-3xl font-medium text-lg">
              {t("continue_321", "Continue")}
            
            </button>
          </div>
        </form>
      </div>
    </div>);

}