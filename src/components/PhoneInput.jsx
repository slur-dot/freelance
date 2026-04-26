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
    const [searchTerm, setSearchTerm] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);

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

    // Auto-focus search when dropdown opens
    useEffect(() => {
        if (isDropdownOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
        }
    }, [isDropdownOpen]);

    const filteredCountries = countryCodes.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.iso.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.includes(searchTerm)
    );

    const sanitizePhoneDigits = (val) => {
        return val.replace(/[^\d]/g, '');
    };

    const handleInputChange = (e) => {
        const digits = sanitizePhoneDigits(e.target.value);
        const country = countryCodes.find(c => c.code === countryCode) || countryCodes[0];
        const trimmedDigits = digits.substring(0, country.digits);
        onChange(trimmedDigits);
    };

    const handleCountrySelect = (country) => {
        if (onCountryCodeChange) {
            onCountryCodeChange(country.code);
        }
        setIsDropdownOpen(false);
        setSearchTerm("");
    };

    return (
        <div className={`flex items-stretch w-full relative ${className}`} ref={dropdownRef}>
            {/* Country selector button */}
            <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`${selectClassName || "rounded-l-md border-y border-l border-gray-300 bg-gray-100"} px-3 py-2 text-sm focus:outline-none flex-shrink-0 flex items-center gap-1.5 ${error ? "border-red-500 text-red-500" : "text-gray-700"}`}
            >
                <div className="flex items-center justify-center w-5 h-4 overflow-hidden rounded-[2px]">
                    <div className={`flag ${selectedCountry.iso.toLowerCase()}`} style={{ transform: 'scale(1.2)', transformOrigin: 'center' }} />
                </div>
                <span className="font-medium">{selectedCountry.code}</span>
                <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
                <div 
                    className="absolute left-0 bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden"
                    style={{ top: '100%', marginTop: '4px', width: '300px', zIndex: 9999 }}
                >
                    {/* Search input */}
                    <div className="p-2 border-b border-gray-100 bg-white">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search country..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    {/* Country list */}
                    <div className="overflow-y-auto" style={{ maxHeight: '200px' }}>
                        {filteredCountries.map((country, index) => (
                            <button
                                key={`${country.iso}-${country.code}-${index}`}
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleCountrySelect(country);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-green-50 transition-colors text-left border-b border-gray-50 ${
                                    country.code === countryCode && country.iso === selectedCountry.iso
                                        ? 'bg-green-50 font-semibold text-green-700' 
                                        : 'text-gray-700'
                                }`}
                            >
                                <div className="flex items-center justify-center w-6 h-4 overflow-hidden rounded-[2px] flex-shrink-0">
                                    <div className={`flag ${country.iso.toLowerCase()}`} style={{ transform: 'scale(1.2)', transformOrigin: 'center' }} />
                                </div>
                                <span className="flex-1 truncate">{country.name}</span>
                                <span className="text-gray-400 text-xs font-mono">{country.code}</span>
                            </button>
                        ))}
                        {filteredCountries.length === 0 && (
                            <div className="px-3 py-6 text-sm text-gray-400 text-center">No countries found</div>
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
                className={`w-full ${inputClassName || "rounded-r-md border border-gray-300 bg-gray-100"} px-4 py-2 text-sm focus:outline-none ${error ? "border-red-500" : ""}`}
                required={required}
            />
        </div>
    );
}
