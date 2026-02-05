import React from "react";
import faqHeroImage from "../assets/FAQ_Hero.jpg";

export default function FaqHeroSection() {
  return (
    <section
      className="relative w-full py-16 sm:py-20 md:py-32 lg:py-48 bg-cover bg-center"
      style={{ backgroundImage: `url(${faqHeroImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <div className="relative container mx-auto px-4 sm:px-6 text-center text-white z-10">
        <div className="mx-auto space-y-4 sm:space-y-6">
          {/* Heading */}
          <h1 className="max-w-xl sm:max-w-2xl mx-auto text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Help & Support
          </h1>
          <p className="w-full max-w-2xl sm:max-w-3xl mx-auto text-base sm:text-lg md:text-xl">
            Search questions or useful articles
          </p>

          {/* Search Box */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md sm:max-w-xl mx-auto">
            <input
              type="search"
              placeholder="What are you looking for?"
              className="w-full h-11 sm:h-12 px-4 rounded-md bg-white text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm sm:text-base"
            />
            <button className="h-11 sm:h-12 px-5 sm:px-6 bg-green-600 text-white hover:bg-green-700 transition-all rounded-md flex items-center gap-2 text-sm sm:text-base">
              Search
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
