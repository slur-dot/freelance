import React, { useState } from "react";
import PhoneInput from "../PhoneInput";

export default function OrganizationForm({ onContinue }) {
  const [phoneError, setPhoneError] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: "",
    organizationType: "",
    rccmNumber: "",
    businessAddress: "",
    cityRegion: "",
    phoneNumber: "",
    countryCode: "+224",
    email: "",
    contactPerson: "",
    role: "",
  });

  const organizationTypes = [
    "Corporation",
    "Non-Profit Organization",
    "Government Agency",
    "Educational Institution",
    "Small Business",
    "Startup",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const digits = formData.phoneNumber.replace(/\D/g, '');
    const requiredDigits = formData.countryCode === '+225' ? 10 : 9;
    
    if (digits.length < requiredDigits) {
      setPhoneError(true);
      return;
    }

    console.log("Form Data:", formData);
    if (onContinue) onContinue(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-6 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl rounded-lg bg-white px-4 py-6 shadow-lg sm:p-6 md:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Booking Form</h1>
            <p className="text-sm text-gray-500 sm:text-base">
              Complete the booking form to complete your booking
            </p>
          </div>
        </div>

        {/* Section Title */}
        <h2 className="mb-4 text-lg font-bold sm:text-xl">Organization Details</h2>

        <form className="grid gap-6" onSubmit={handleSubmit}>
          {[
            {
              id: "organization-name",
              label: "Organization Name",
              placeholder: "e.g., Amara Cissé",
              field: "organizationName",
              type: "text",
              required: true,
            },
            {
              id: "organization-type",
              label: "Organization Type",
              field: "organizationType",
              type: "select",
              required: true,
              options: organizationTypes,
            },
            {
              id: "rccm-number",
              label: "RCCM Number",
              placeholder: "e.g., RCCM/GC/KAL/033.456B/2012",
              field: "rccmNumber",
              type: "text",
              required: true,
            },
            {
              id: "business-address",
              label: "Business Address",
              placeholder: "e.g., 001 BP 457, Conakry",
              field: "businessAddress",
              type: "text",
              required: true,
            },
            {
              id: "city-region",
              label: "City / Region",
              placeholder: "e.g., 100 BP 75, Kindia / Labé / Kankan / N’Zérékoré",
              field: "cityRegion",
              type: "text",
              required: true,
            },
            {
              id: "phone-number",
              label: "Phone Number",
              placeholder: "+224 641 14 22",
              field: "phoneNumber",
              type: "tel",
              required: true,
            },
            {
              id: "email",
              label: "Email",
              placeholder: "johndoe@gmail.com",
              field: "email",
              type: "email",
              required: true,
            },
            {
              id: "contact-person",
              label: "Contact Person",
              placeholder: "Emily John",
              field: "contactPerson",
              type: "text",
              required: true,
            },
            {
              id: "role",
              label: "Role",
              placeholder: "Enter Role",
              field: "role",
              type: "text",
              required: false,
            },
          ]
          .filter((input) => !(input.field === "rccmNumber" && formData.organizationType !== "Corporation"))
          .map((input) => (
            <div
              key={input.id}
              className="grid gap-2 sm:grid-cols-3 sm:items-center sm:gap-4"
            >
              <label htmlFor={input.id} className="font-medium text-sm sm:text-base sm:col-span-1">
                {input.label}
                {input.required && <span className="text-red-500">*</span>}
              </label>
              {input.type === "select" ? (
                <select
                  id={input.id}
                  value={formData[input.field]}
                  onChange={(e) => handleInputChange(input.field, e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 sm:col-span-2"
                  required={input.required}
                >
                  <option value="">Select an Option</option>
                  {input.options.map((type, index) => (
                    <option key={index} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              ) : input.type === "tel" ? (
                <div className="flex flex-col w-full sm:col-span-2">
                  <PhoneInput
                    id={input.id}
                    value={formData[input.field]}
                    onChange={(val) => {
                      handleInputChange(input.field, val);
                      if (phoneError) setPhoneError(false);
                    }}
                    countryCode={formData.countryCode}
                    onCountryCodeChange={(code) => handleInputChange("countryCode", code)}
                    required={input.required}
                    error={phoneError}
                  />
                  {phoneError && (
                    <p className="text-red-500 text-xs mt-1">
                      Please enter a valid {formData.countryCode === '+225' ? '10' : '9'}-digit phone number.
                    </p>
                  )}
                </div>
              ) : (
                <input
                  id={input.id}
                  type={input.type}
                  placeholder={input.placeholder}
                  value={formData[input.field]}
                  onChange={(e) => handleInputChange(input.field, e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 sm:col-span-2"
                  required={input.required}
                />
              )}
            </div>
          ))}

          {/* Continue Button */}
          <div className="col-span-full mt-4 flex justify-center">
            <button
              type="submit"
              className="w-full max-w-[250px] rounded-3xl bg-green-600 px-6 py-4 text-sm font-medium text-white transition hover:bg-green-700"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
