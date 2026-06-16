import React, { useState, useRef, useEffect } from "react";
import { countryData as countryCodes } from "../utils/countryData";
import 'react-phone-input-2/lib/style.css';

export default function PhoneInput({
    value,
    onChange,
    countryCode = "+224",
    onCountryCodeChange,
    placeholder,
    id,
    required = false,
    error = false,
    className = "",
    selectClassName = "",
    inputClassName = ""
}) {
    const selectedCountry = countryCodes.find(c => c.code === countryCode) || countryCodes[0];
    const activePlaceholder = placeholder || selectedCountry.placeholder;

    const sanitizePhoneDigits = (val) => {
        return val.replace(/[^\d]/g, '');
    };

    const handleInputChange = (e) => {
        const digits = sanitizePhoneDigits(e.target.value);
        const country = countryCodes.find(c => c.code === countryCode) || countryCodes[0];
        const trimmedDigits = digits.substring(0, country.digits);
        onChange(trimmedDigits);
    };

    const handleCountrySelect = (e) => {
        if (onCountryCodeChange) {
            onCountryCodeChange(e.target.value);
        }
    };

    return (
        <div className={`flex items-stretch w-full ${className}`}>
            <div className="relative flex-shrink-0">
                <select
                    value={countryCode}
                    onChange={handleCountrySelect}
                    className={`h-full w-[105px] pl-10 pr-6 appearance-none ${selectClassName || "rounded-l-md border-y border-l border-gray-300 bg-gray-100"} text-sm focus:outline-none ${error ? "border-red-500 text-red-500" : "text-gray-700"}`}
                    style={{ backgroundImage: 'none', cursor: 'pointer' }}
                >
                    {countryCodes.map((country, index) => (
                        <option key={`${country.iso}-${country.code}-${index}`} value={country.code}>
                            {country.iso} ({country.code})
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <span className="text-base leading-none">{selectedCountry.flag}</span>
                </div>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            
            <input
                id={id}
                type="tel"
                placeholder={activePlaceholder}
                value={value}
                onChange={handleInputChange}
                className={`w-full ${inputClassName || "rounded-r-md border border-gray-300 bg-white"} px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${error ? "border-red-500 ring-1 ring-red-500" : ""}`}
                required={required}
            />
        </div>
    );
}
