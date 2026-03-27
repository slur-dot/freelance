import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PhoneInput from "../../components/PhoneInput";

export default function CompanyTrainingRequestForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    companyName: "",
    phoneNumber: "",
    countryCode: "+224",
    lookingFor: "",
    numEmployees: "",
    preferredDuration: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((d) => ({ ...d, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneDigits = formData.phoneNumber.replace(/\D/g, '');
    const { countryData } = await import("../../utils/countryData");
    const selectedCountry = countryData.find(c => c.code === formData.countryCode);
    const requiredDigits = selectedCountry ? selectedCountry.digits : 9;

    if (phoneDigits.length !== requiredDigits) {
      alert(`Invalid phone number length for ${selectedCountry?.name || 'selected country'}. Expected ${requiredDigits} digits.`);
      return;
    }

    console.log("Custom Training Request Submitted:", formData);
    alert("Request submitted! We'll contact you soon.");
  };

  return (
    <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl w-full space-y-8 p-8 shadow-lg bg-white">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('training.forms.request.title')}</h1>
          <p className="mt-2 text-gray-600">
            {t('training.forms.request.subtitle')}
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          {/* Company Name */}
          <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="sm:w-40 flex-shrink-0">
                <label htmlFor="company-name" className="block text-sm font-medium text-gray-700">
                  {t('training.forms.request.company_name')}
                </label>
                <p className="text-xs text-gray-500 mt-1">{t('training.forms.request.helpers.company')}</p>
              </div>
              <input
                id="company-name"
                name="companyName"
                type="text"
                autoComplete="organization"
                placeholder={t('training.forms.request.placeholders.company_name')}
                value={formData.companyName}
                onChange={handleChange}
                className="flex-grow rounded-md border border-gray-300 shadow-sm bg-gray-200 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 sm:text-sm px-3 py-2"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="sm:w-40 flex-shrink-0">
                <label htmlFor="phone-number" className="block text-sm font-medium text-gray-700">
                  {t('training.forms.request.phone')}
                </label>
              </div>
              <div className="flex-grow">
                <PhoneInput
                  id="phone-number"
                  value={formData.phoneNumber}
                  onChange={(val) => setFormData((d) => ({ ...d, phoneNumber: val }))}
                  countryCode={formData.countryCode}
                  onCountryCodeChange={(code) => setFormData((d) => ({ ...d, countryCode: code }))}
                  className="!rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Looking for? */}
          <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="sm:w-40 flex-shrink-0">
                <label htmlFor="looking-for" className="block text-sm font-medium text-gray-700">
                  {t('training.forms.request.looking_for')}
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  {t('training.forms.request.helpers.looking')}
                </p>
              </div>
              <textarea
                id="looking-for"
                name="lookingFor"
                rows={3}
                placeholder={t('training.forms.request.placeholders.looking_for')}
                value={formData.lookingFor}
                onChange={handleChange}
                className="flex-grow rounded-md border border-gray-300 bg-gray-200 shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 sm:text-sm px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Number of Employees */}
            <div className="flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                <div className="sm:w-48 flex-shrink-0">
                  <label htmlFor="num-employees" className="block text-sm font-medium text-gray-700">
                    {t('training.forms.request.employees')}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('training.forms.request.helpers.employees')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="num-employees"
                    name="numEmployees"
                    type="number"
                    min="1"
                    placeholder={t('training.forms.request.placeholders.employees')}
                    value={formData.numEmployees}
                    onChange={handleChange}
                    className="w-28 rounded-md border border-gray-300 bg-gray-200 shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 sm:text-sm px-3 py-2"
                  />
                  <span className="text-sm text-gray-700 whitespace-nowrap">GNF</span>
                </div>
              </div>
            </div>

            {/* Preferred Duration */}
            <div className="flex flex-col">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="sm:w-32 flex-shrink-0">
                  <label htmlFor="preferred-duration" className="block text-sm font-medium text-gray-700">
                    {t('training.forms.request.duration')}
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    {t('training.forms.request.helpers.duration')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    id="preferred-duration"
                    name="preferredDuration"
                    type="number"
                    min="1"
                    placeholder={t('training.forms.request.placeholders.duration')}
                    value={formData.preferredDuration}
                    onChange={handleChange}
                    className="w-28 rounded-md border border-gray-300 bg-gray-200 shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 sm:text-sm px-3 py-2"
                  />
                  <span className="text-sm text-gray-700 whitespace-nowrap">Hours</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              className="py-2 px-8 rounded-full text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
            >
              {t('training.forms.request.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
