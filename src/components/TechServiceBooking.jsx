import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { guineaCities, guineaCitiesByRegion } from "../data/guineaCities";
import PhoneInput from "./PhoneInput";

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ className = "", error, ...props }) => (
  <input
    className={`border rounded-md p-2 focus:outline-none focus:ring-2 w-full transition-all ${error
      ? "border-red-500 focus:ring-red-200 bg-red-50"
      : "border-gray-300 bg-gray-100 focus:ring-green-500"
      } ${className}`}
    {...props}
  />
);

const Textarea = ({ className = "", error, ...props }) => (
  <textarea
    className={`border rounded-md p-2 focus:outline-none focus:ring-2 w-full min-h-[100px] transition-all ${error
      ? "border-red-500 focus:ring-red-200 bg-red-50"
      : "border-gray-300 bg-gray-100 focus:ring-green-500"
      } ${className}`}
    {...props}
  />
);

const Label = ({ children, htmlFor, className = "", required }) => (
  <label
    htmlFor={htmlFor}
    className={`block font-medium text-gray-700 md:h-10 flex items-center ${className}`}
  >
    {children}
    {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
  </label>
);

const ErrorMessage = ({ message, id }) => (
  message ? (
    <p id={id} className="text-red-500 text-xs mt-1" role="alert">
      {message}
    </p>
  ) : null
);

const CityAutocomplete = ({ value, onChange, error, placeholder, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const containerRef = useRef(null);

  const allCities = guineaCitiesByRegion.flatMap(r =>
    r.prefectures.flatMap(p =>
      p.subprefectures.map(sp => ({
        label: `${sp} (${p.name})`,
        value: sp,
        subprefecture: sp,
        prefecture: p.name,
        region: r.region
      }))
    )
  );

  const filteredCities = allCities.filter(city =>
    city.label.toLowerCase().includes(query.toLowerCase()) ||
    city.region.toLowerCase().includes(query.toLowerCase())
  );

  const groupedCities = filteredCities.reduce((acc, city) => {
    if (!acc[city.region]) acc[city.region] = [];
    acc[city.region].push(city);
    return acc;
  }, {});

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative flex items-center">
        <Input
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (e.target.value === "") onChange("");
          }}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          error={error}
          autoComplete="off"
          className="pr-10"
        />
        <div
          className="absolute right-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {query ? (
            <span
              className="text-lg leading-none mr-1"
              onClick={(e) => {
                e.stopPropagation();
                setQuery("");
                onChange("");
                setIsOpen(true);
              }}
            >
              &times;
            </span>
          ) : null}
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {isOpen && filteredCities.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto">
          {Object.entries(groupedCities).map(([region, cities]) => (
            <div key={region}>
              <div className="bg-gray-100 px-4 py-1 text-xs font-bold text-gray-500 sticky top-0 uppercase tracking-wider">
                {region}
              </div>
              {cities.map((city, index) => (
                <div
                  key={`${city.value}-${index}`}
                  className="px-4 py-2 hover:bg-green-50 cursor-pointer text-sm text-gray-700 transition-colors border-b border-gray-50 last:border-0"
                  onClick={() => {
                    setQuery(city.value);
                    onChange(city.value);
                    setIsOpen(false);
                  }}
                >
                  <span className="font-semibold">{city.subprefecture}</span>
                  <span className="text-gray-400 ml-2 text-xs">({city.prefecture})</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {isOpen && query.trim() !== "" && filteredCities.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3 text-sm text-gray-500 italic">
          {t("tech_booking.city.no_results")}
        </div>
      )}
    </div>
  );
};

export default function TechServiceBooking() {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    companyName: "",
    phoneNumber: "",
    countryCode: "+224",
    fullName: "",
    email: "",
    city: "",
    projectDetails: "",
    file: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validatePhone = (phone) => {
    // Simple check if length is at least 7 after cleaning
    const cleaned = phone.replace(/[\s\-\(\)]/g, "");
    return cleaned.length >= 7;
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = t("tech_booking.validation.required");
    if (!formData.fullName.trim()) newErrors.fullName = t("tech_booking.validation.required");
    if (!formData.projectDetails.trim()) newErrors.projectDetails = t("tech_booking.validation.required");
    if (!formData.city) newErrors.city = t("tech_booking.validation.required");

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t("tech_booking.validation.required");
    } else if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = t("tech_booking.validation.invalid_phone");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("tech_booking.validation.required");
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t("tech_booking.validation.invalid_email");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const setCity = (cityName) => {
    setFormData((prev) => ({ ...prev, city: cityName }));
    if (errors.city) {
      setErrors((prev) => ({ ...prev, city: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    const maxSize = 10 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, file: t("tech_booking.validation.unsupported_file") }));
      fileInputRef.current.value = "";
      return;
    }

    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, file: t("tech_booking.validation.file_too_large") }));
      fileInputRef.current.value = "";
      return;
    }

    setFormData((prev) => ({ ...prev, file }));
    setErrors((prev) => ({ ...prev, file: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 1500);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
        <div className="bg-white shadow-lg rounded-lg max-w-2xl w-full p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">{t("tech_booking.success")}</h1>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full mt-4"
            onClick={() => setIsSuccess(false)}
          >
            {t("navbar.home")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
      <div className="bg-white shadow-lg rounded-lg max-w-2xl w-full p-8">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">{t("tech_booking.title")}</h1>
        <p className="text-gray-600 text-sm mb-8">{t("tech_booking.subtitle")}</p>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {/* Company Name */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-start gap-x-6">
            <Label htmlFor="companyName" required>{t("tech_booking.company_name.label")}</Label>
            <div>
              <Input
                id="companyName"
                placeholder={t("tech_booking.company_name.placeholder")}
                value={formData.companyName}
                onChange={handleInputChange}
                error={errors.companyName}
                aria-required="true"
                aria-invalid={!!errors.companyName}
                aria-describedby={errors.companyName ? "companyName-error" : undefined}
              />
              <ErrorMessage id="companyName-error" message={errors.companyName} />
            </div>
          </div>

          {/* Phone Number */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-start gap-x-6">
            <Label htmlFor="phoneNumber" required>{t("tech_booking.phone.label")}</Label>
            <div>
              <PhoneInput
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(val) => {
                  setFormData((prev) => ({ ...prev, phoneNumber: val }));
                  if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: null }));
                }}
                countryCode={formData.countryCode}
                onCountryCodeChange={(code) => {
                  setFormData((prev) => ({ ...prev, countryCode: code }));
                }}
                required
                error={!!errors.phoneNumber}
              />
              <p id="phone-helper" className="text-gray-500 text-[11px] mt-1 italic">
                {t("tech_booking.phone.helper")}
              </p>
              <ErrorMessage id="phoneNumber-error" message={errors.phoneNumber} />
            </div>
          </div>

          {/* City Autocomplete */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-start gap-x-6">
            <Label htmlFor="city" required>{t("tech_booking.city.label")}</Label>
            <div>
              <CityAutocomplete
                value={formData.city}
                onChange={setCity}
                error={errors.city}
                placeholder={t("tech_booking.city.placeholder")}
                t={t}
              />
              <ErrorMessage id="city-error" message={errors.city} />
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-start gap-x-6">
            <Label htmlFor="projectDetails" required>{t("tech_booking.project_details.label")}</Label>
            <div>
              <Textarea
                id="projectDetails"
                placeholder={t("tech_booking.project_details.placeholder")}
                value={formData.projectDetails}
                onChange={handleInputChange}
                error={errors.projectDetails}
                aria-required="true"
                aria-invalid={!!errors.projectDetails}
                aria-describedby={errors.projectDetails ? "projectDetails-error" : undefined}
              />
              <ErrorMessage id="projectDetails-error" message={errors.projectDetails} />
            </div>
          </div>

          {/* New Section: Contact Details */}
          <div className="pt-4 border-t border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Contact Person</h2>

            <div className="space-y-6">
              {/* Contact Full Name */}
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-start gap-x-6">
                <Label htmlFor="fullName" required>{t("tech_booking.full_name.label")}</Label>
                <div>
                  <Input
                    id="fullName"
                    placeholder={t("tech_booking.full_name.placeholder")}
                    value={formData.fullName}
                    onChange={handleInputChange}
                    error={errors.fullName}
                    aria-required="true"
                    aria-invalid={!!errors.fullName}
                    aria-describedby={errors.fullName ? "fullName-error" : undefined}
                  />
                  <ErrorMessage id="fullName-error" message={errors.fullName} />
                </div>
              </div>

              {/* Contact Email */}
              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-start gap-x-6">
                <Label htmlFor="email" required>{t("tech_booking.email.label")}</Label>
                <div>
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("tech_booking.email.placeholder")}
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    aria-required="true"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  <ErrorMessage id="email-error" message={errors.email} />
                </div>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] items-center gap-x-6 pt-4 border-t border-gray-100">
            <Label htmlFor="file">{t("tech_booking.file_upload.label")}</Label>
            <div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <input
                  type="file"
                  id="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded-full w-full sm:w-auto"
                >
                  {t("tech_booking.file_upload.button")}
                </Button>
                {formData.file && (
                  <span className="text-sm text-gray-600 truncate max-w-[200px]">
                    {formData.file.name}
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-[10px] mt-1 italic">
                PDF, DOC, DOCX (Max 10MB)
              </p>
              <ErrorMessage id="file-error" message={errors.file} />
            </div>
          </div>

          {/* Captcha Row */}
          <RecaptchaRow />

          {/* Submit Button */}
          <div className="mt-8 text-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-700 hover:bg-green-800 text-white py-3 px-12 rounded-full text-lg shadow-md"
            >
              {isSubmitting ? t("common.loading") : t("tech_booking.submit")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

const RecaptchaRow = () => (
  <div className="mt-6 flex flex-col items-center w-full">
    <div className="flex items-center justify-between border border-gray-300 rounded-md bg-gray-50 px-4 py-3 w-full max-w-xs">
      <div className="flex items-center gap-2">
        <input type="checkbox" id="not-robot" className="w-4 h-4 cursor-pointer" />
        <label htmlFor="not-robot" className="text-gray-700 text-sm cursor-pointer">I'm not a robot</label>
      </div>
      <img
        src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
        alt="reCAPTCHA"
        width={24}
        height={24}
      />
    </div>
    <div className="mt-2 text-[10px] text-gray-500 text-center">
      Privacy • Terms
    </div>
  </div>
);
