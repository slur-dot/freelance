import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

/**
 * Specialized PhoneInput for Partnership page with searchable dropdown.
 */
export default function PartnerPhoneInput({
  value,
  onChange,
  defaultCountry = "gn",
  placeholder,
  id,
  required = false,
  error = false,
  className = "",
  inputClassName = ""
}) {
  return (
    <div className={`phone-input-container ${className} w-full`}>
      <PhoneInput
        country={defaultCountry}
        value={value}
        onChange={(phone) => onChange(`+${phone}`)}
        enableSearch={true}
        placeholder={placeholder}
        inputProps={{
          id: id,
          required: required,
        }}
        containerClass="!w-full"
        inputClass={`!w-full !h-auto !px-[48px] !py-3 !bg-gray-50 !border !border-gray-200 !rounded-lg focus:!ring-2 focus:!ring-[#15803D] !transition-colors !text-sm ${error ? '!border-red-500' : ''} ${inputClassName}`}
        buttonClass="!bg-transparent !border !border-gray-200 !border-r-0 !rounded-l-lg !px-2"
        dropdownClass="!rounded-lg !shadow-xl !border-gray-200"
        searchClass="!mx-2 !my-1 !p-2 !rounded !border-gray-300"
      />
      <style>{`
        .react-tel-input .flag-dropdown {
          background-color: transparent !important;
          border: 1px solid #e5e7eb !important;
          border-right: none !important;
          border-radius: 0.5rem 0 0 0.5rem !important;
        }
        .react-tel-input .selected-flag:hover, .react-tel-input .selected-flag:focus {
          background-color: #f9fafb !important;
        }
        .react-tel-input .form-control:focus {
          box-shadow: none !important;
          border-color: #15803D !important;
        }
      `}</style>
    </div>
  );
}
