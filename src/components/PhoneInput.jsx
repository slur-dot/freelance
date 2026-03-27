import React from "react";

import { countryData as countryCodes } from "../utils/countryData";

export default function PhoneInput({
    value,
    onChange,
    countryCode = "+224",
    onCountryCodeChange,
    placeholder, // optional override
    id,
    required = false,
    error = false,
    className = "",
    selectClassName = "",
    inputClassName = ""
}) {
    const selectedCountry = countryCodes.find(c => c.code === countryCode) || countryCodes[0];
    const activePlaceholder = placeholder || selectedCountry.placeholder;

    const formatPhoneNumber = (val, code) => {
        const digits = val.replace(/\D/g, '');
        if (!digits) return '';

        // Limit to max digits for the selected country
        const country = countryCodes.find(c => c.code === code) || countryCodes[0];
        const trimmedDigits = digits.substring(0, country.digits);

        if (code === '+225' || code === '+33' || code === '+212' || code === '+213') {
            // 10 digits (CI) or 9 digits (FR/MA/DZ): XX XX XX XX XX or X XX XX XX XX
            return trimmedDigits.match(/.{1,2}/g)?.join(' ') || '';
        } else if (code === '+221' || code === '+224') {
            // 9 digits: XX XXX XX XX or XXX XX XX XX
            if (code === '+221') {
                const match = trimmedDigits.match(/^(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})$/);
                if (match) {
                    return [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ');
                }
            } else {
                const match = trimmedDigits.match(/^(\d{0,3})(\d{0,2})(\d{0,2})(\d{0,2})$/);
                if (match) {
                    return [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ');
                }
            }
        } else if (code === '+233' || code === '+1' || code === '+234' || code === '+44') {
            // Generic pattern
            if (code === '+233') {
                const match = trimmedDigits.match(/^(\d{0,2})(\d{0,3})(\d{0,4})$/);
                if (match) return [match[1], match[2], match[3]].filter(Boolean).join(' ');
            } else if (code === '+1' || code === '+234') {
                const match = trimmedDigits.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
                if (match) return [match[1], match[2], match[3]].filter(Boolean).join(' ');
            } else if (code === '+44') {
                const match = trimmedDigits.match(/^(\d{0,4})(\d{0,6})$/);
                if (match) return [match[1], match[2]].filter(Boolean).join(' ');
            }
        } else if (code === '+216' || code === '+223') {
            // Tunisia (8 digits): XX XXX XXX
            // Mali (8 digits): XX XX XX XX
            if (code === '+216') {
                const match = trimmedDigits.match(/^(\d{0,2})(\d{0,3})(\d{0,3})$/);
                if (match) return [match[1], match[2], match[3]].filter(Boolean).join(' ');
            } else {
                return trimmedDigits.match(/.{1,2}/g)?.join(' ') || '';
            }
        }
        
        return trimmedDigits;
    };

    const handleInputChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value, countryCode);
        onChange(formatted);
    };

    const handleCountryChange = (e) => {
        const newCode = e.target.value;
        if (onCountryCodeChange) {
            onCountryCodeChange(newCode);
        }
        
        // Clean existing value and re-format for new country rules
        const currentDigits = value.replace(/\D/g, '');
        onChange(formatPhoneNumber(currentDigits, newCode));
    };

    return (
        <div className={`flex items-stretch w-full ${className}`}>
            <select
                value={countryCode}
                onChange={handleCountryChange}
                className={`${selectClassName || "rounded-l-md border-y border-l border-gray-300 bg-gray-100"} px-3 text-sm focus:outline-none flex-shrink-0 min-w-[120px] ${error ? "border-red-500 text-red-500" : "text-gray-700"
                    }`}
            >
                {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                        {country.flag} {country.iso} {country.code}
                    </option>
                ))}
            </select>
            <input
                id={id}
                type="tel"
                placeholder={activePlaceholder}
                value={value}
                onChange={handleInputChange}
                className={`w-full ${inputClassName || "rounded-r-md border border-gray-300 bg-gray-100"} px-4 text-sm focus:outline-none ${error ? "border-red-500" : ""
                    }`}
                required={required}
            />
        </div>
    );
}
