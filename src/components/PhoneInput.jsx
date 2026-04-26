import React, { useState, useRef, useEffect } from "react";

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
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedCountry = countryCodes.find(c => c.code === countryCode) || countryCodes[0];
    const activePlaceholder = placeholder || selectedCountry.placeholder;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
                setSearchTerm("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredCountries = countryCodes.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.iso.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.includes(searchTerm)
    );

    const sanitizePhoneDigits = (val) => {
        return val.replace(/[^\d]/g, '');
    };

    const formatPhoneNumber = (val, code) => {
        const digits = sanitizePhoneDigits(val);
        if (!digits) return '';

        const country = countryCodes.find(c => c.code === code) || countryCodes[0];
        const trimmedDigits = digits.substring(0, country.digits);

        // Generic grouping: XX XX XX XX XX (pairs)
        return trimmedDigits.match(/.{1,2}/g)?.join(' ') || '';
    };

    const handleInputChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value, countryCode);
        onChange(formatted);
    };

    const handleCountrySelect = (code) => {
        if (onCountryCodeChange) {
            onCountryCodeChange(code);
        }
        const currentDigits = sanitizePhoneDigits(value);
        onChange(formatPhoneNumber(currentDigits, code));
        setIsDropdownOpen(false);
        setSearchTerm("");
    };

    return (
        <div className={`flex items-stretch w-full relative ${className}`} ref={dropdownRef}>
            {/* Country selector button */}
            <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`${selectClassName || "rounded-l-md border-y border-l border-gray-300 bg-gray-100"} px-3 text-sm focus:outline-none flex-shrink-0 flex items-center gap-1 min-w-[110px] ${error ? "border-red-500 text-red-500" : "text-gray-700"}`}
            >
                <span>{selectedCountry.flag}</span>
                <span>{selectedCountry.iso}</span>
                <span>{selectedCountry.code}</span>
                <svg className="w-3 h-3 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
                <div className="absolute top-full left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-xl w-72 max-h-64 overflow-hidden mt-1"
                    style={{ minWidth: '280px' }}
                >
                    {/* Search input */}
                    <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
                        <input
                            type="text"
                            placeholder="Search country..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            autoFocus
                        />
                    </div>
                    {/* Country list */}
                    <div className="overflow-y-auto max-h-48">
                        {filteredCountries.map((country) => (
                            <button
                                key={`${country.iso}-${country.code}`}
                                type="button"
                                onClick={() => handleCountrySelect(country.code)}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-green-50 transition-colors text-left ${
                                    country.code === countryCode ? 'bg-green-50 font-medium text-green-700' : 'text-gray-700'
                                }`}
                            >
                                <span className="text-lg">{country.flag}</span>
                                <span className="flex-1 truncate">{country.name}</span>
                                <span className="text-gray-400 text-xs">{country.code}</span>
                            </button>
                        ))}
                        {filteredCountries.length === 0 && (
                            <div className="px-3 py-4 text-sm text-gray-400 text-center">No countries found</div>
                        )}
                    </div>
                </div>
            )}

            {/* Phone number input */}
            <input
                id={id}
                type="tel"
                placeholder={activePlaceholder}
                value={value}
                onChange={handleInputChange}
                className={`w-full ${inputClassName || "rounded-r-md border border-gray-300 bg-gray-100"} px-4 text-sm focus:outline-none ${error ? "border-red-500" : ""}`}
                required={required}
            />
        </div>
    );
}
