import React from "react";

const countryCodes = [
    { code: "+224", iso: "GN", flag: "🇬🇳", placeholder: "XXX XX XX XX", digits: 9 },
    { code: "+221", iso: "SN", flag: "🇸🇳", placeholder: "XX XXX XX XX", digits: 9 },
    { code: "+225", iso: "CI", flag: "🇨🇮", placeholder: "XX XX XX XX XX", digits: 10 },
    { code: "+233", iso: "GH", flag: "🇬🇭", placeholder: "XX XXX XXXX", digits: 9 },
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

    const formatPhoneNumber = (val, code) => {
        const digits = val.replace(/\D/g, '');
        if (!digits) return '';

        let formatted = digits;
        if (code === '+225') {
            // 10 digits: XX XX XX XX XX
            formatted = digits.match(/.{1,2}/g)?.join(' ') || '';
            return formatted.substring(0, 14); // 10 digits + 4 spaces
        } else if (code === '+221') {
            // 9 digits: XX XXX XX XX
            const match = digits.match(/^(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})$/);
            if (match) {
                formatted = match[1];
                if (match[2]) formatted += ' ' + match[2];
                if (match[3]) formatted += ' ' + match[3];
                if (match[4]) formatted += ' ' + match[4];
            }
            return formatted.trim().substring(0, 12);
        } else if (code === '+233') {
            // 9 digits: XX XXX XXXX
            const match = digits.match(/^(\d{0,2})(\d{0,3})(\d{0,4})$/);
            if (match) {
                formatted = match[1];
                if (match[2]) formatted += ' ' + match[2];
                if (match[3]) formatted += ' ' + match[3];
            }
            return formatted.trim().substring(0, 11);
        } else {
            // +224 or others
            // 9 digits: XXX XX XX XX
            const match = digits.match(/^(\d{0,3})(\d{0,2})(\d{0,2})(\d{0,2})$/);
            if (match) {
                formatted = match[1];
                if (match[2]) formatted += ' ' + match[2];
                if (match[3]) formatted += ' ' + match[3];
                if (match[4]) formatted += ' ' + match[4];
            }
            return formatted.trim().substring(0, 12);
        }
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
        // Re-format existing value to new format if possible, or clear it
        const currentDigits = value.replace(/\D/g, '');
        const maxDigits = countryCodes.find(c => c.code === newCode)?.digits || 9;
        const trimmedDigits = currentDigits.slice(0, maxDigits);
        onChange(formatPhoneNumber(trimmedDigits, newCode));
    };

    return (
        <div className={`flex items-stretch w-full h-[46px] ${className}`}>
            <select
                value={countryCode}
                onChange={handleCountryChange}
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
                onChange={handleInputChange}
                className={`w-full rounded-r-md border border-gray-300 bg-gray-100 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none h-full ${error ? "border-red-500" : ""
                    }`}
                required={required}
            />
        </div>
    );
}
