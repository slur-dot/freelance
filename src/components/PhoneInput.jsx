import React from "react";

const countryCodes = [
    { code: "+224", iso: "GN", flag: "🇬🇳", placeholder: "6X XXX XXX" },
    { code: "+221", iso: "SN", flag: "🇸🇳", placeholder: "7X XXX XX XX" },
    { code: "+225", iso: "CI", flag: "🇨🇮", placeholder: "0X XX XX XX XX" },
    { code: "+233", iso: "GH", flag: "🇬🇭", placeholder: "2X XXX XXXX" },
];

export default function PhoneInput({
    value,
    onChange,
    countryCode = "+224",
    onCountryCodeChange,
    placeholder, // optional override
    id,
    required = false,
    error = false,
    className = ""
}) {
    const selectedCountry = countryCodes.find(c => c.code === countryCode) || countryCodes[0];
    const activePlaceholder = placeholder || selectedCountry.placeholder;

    return (
        <div className={`flex items-stretch w-full h-[46px] ${className}`}>
            <select
                value={countryCode}
                onChange={(e) => onCountryCodeChange && onCountryCodeChange(e.target.value)}
                className={`rounded-l-md border-y border-l border-gray-300 bg-gray-100 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-w-[145px] flex-shrink-0 h-full ${error ? "border-red-500 text-red-500" : "text-gray-700"
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
                onChange={(e) => onChange(e.target.value)}
                className={`w-full rounded-r-md border border-gray-300 bg-gray-100 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-full ${error ? "border-red-500" : ""
                    }`}
                required={required}
            />
        </div>
    );
}
