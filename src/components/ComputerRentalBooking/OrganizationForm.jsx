import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PhoneInput from "../PhoneInput";

export default function OrganizationForm({ onContinue }) {
  const { t } = useTranslation();
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
    { value: "Corporation", label: t('booking_wizard.types.corporation') },
    { value: "Non-Profit Organization", label: t('booking_wizard.types.nonprofit') },
    { value: "Government Agency", label: t('booking_wizard.types.government') },
    { value: "Educational Institution", label: t('booking_wizard.types.education') },
    { value: "Small Business", label: t('booking_wizard.types.small_business') },
    { value: "Startup", label: t('booking_wizard.types.startup') },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const digits = formData.phoneNumber.replace(/\D/g, '');
    const { countryData } = await import("../../utils/countryData");
    const selectedCountry = countryData.find(c => c.code === formData.countryCode);
    const requiredDigits = selectedCountry ? selectedCountry.digits : 9;

    if (digits.length !== requiredDigits) {
      setPhoneError(true);
      return;
    }

    if (onContinue) onContinue(formData);
  };

  const fields = [
    { id: "organization-name", label: t('booking_wizard.org_name'), field: "organizationName", type: "text", required: true },
    { id: "organization-type", label: t('booking_wizard.org_type'), field: "organizationType", type: "select", required: true },
    { id: "rccm", label: t('booking_wizard.rccm'), field: "rccmNumber", type: "text", required: false },
    { id: "address", label: t('booking_wizard.address'), field: "businessAddress", type: "text", required: true },
    { id: "city", label: t('booking_wizard.city'), field: "cityRegion", type: "text", required: true },
    { id: "email", label: t('booking_wizard.email'), field: "email", type: "email", required: true },
    { id: "contact", label: t('booking_wizard.contact_person'), field: "contactPerson", type: "text", required: true },
    { id: "role", label: t('booking_wizard.role'), field: "role", type: "text", required: false },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-2 py-6 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl rounded-lg bg-white px-3 py-6 shadow-lg sm:p-6 md:p-8">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{t('booking_wizard.title')}</h1>
            <p className="text-sm text-gray-500 sm:text-base">{t('booking_wizard.subtitle')}</p>
          </div>
        </div>

        <h2 className="mb-4 text-lg font-bold sm:text-xl">{t('booking_wizard.org_section')}</h2>

        <form className="grid gap-6" onSubmit={handleSubmit}>
          {fields.map(({ id, label, field, type, required }) => (
            <div key={id} className="grid gap-2 sm:grid-cols-[140px_1fr] sm:items-center">
              <label htmlFor={id} className="text-sm font-medium text-gray-700">
                {label}{required ? ' *' : ''}
              </label>
              {type === 'select' ? (
                <select
                  id={id}
                  required={required}
                  value={formData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-gray-50 p-2"
                >
                  <option value="">{t('booking_wizard.org_type')}</option>
                  {organizationTypes.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  id={id}
                  type={type}
                  required={required}
                  value={formData[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-gray-50 p-2"
                />
              )}
            </div>
          ))}

          <div className="grid gap-2 sm:grid-cols-[140px_1fr] sm:items-center">
            <label className="text-sm font-medium text-gray-700">{t('booking_wizard.phone')} *</label>
            <PhoneInput
              countryCode={formData.countryCode}
              value={formData.phoneNumber}
              onCountryCodeChange={(code) => handleInputChange('countryCode', code)}
              onChange={(phone) => {
                handleInputChange('phoneNumber', phone);
                setPhoneError(false);
              }}
              error={phoneError}
              required
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="rounded-full bg-green-600 px-8 py-2 font-medium text-white hover:bg-green-700"
            >
              {t('booking_wizard.continue')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
