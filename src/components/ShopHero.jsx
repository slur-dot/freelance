import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import PhoneImage from "../assets/phone.png";
import LaptopImage from "../assets/laptopdevice.png";
import ServiceImage from "../assets/shopService.png";

export default function ShopHero() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set your target end date: September 10, 2025, 11:59 PM
    const endDate = new Date("2025-09-10T23:59:59").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full pt-6 sm:pt-8 md:pt-12 lg:pt-16 xl:pt-24 pb-12 sm:pb-16 md:pb-24 lg:pb-32 xl:pb-48 bg-gradient-to-br from-[#f0f0f5] to-[#e0e0eb] overflow-hidden">
        <div className="container px-4 sm:px-5 md:px-6 relative z-10">
          <div className="flex flex-col items-center text-center space-y-4 sm:space-y-5 md:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 max-w-4xl">
              Discover Smartphones, Laptops, Desktops, and Accessories
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-700">
              Sale Ends September 10, 2025 – Save 20%!
            </p>

            {/* Dynamic Countdown */}
            <div className="rounded-lg px-4 sm:px-6 py-3 max-w-2xl w-full">
              <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center">
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s remaining
              </p>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-1 text-center">
                Sale ends on September 10, 2025 at 11:59 PM
              </p>
            </div>
          </div>
        </div>

        {/* Hero Images */}
        <img
          src={PhoneImage}
          alt="Smartphone"
          className="absolute bottom-[-10] left-[-50px] w-[140px] sm:w-[160px] md:w-[250px] lg:w-[300px] rotate-30 z-0 opacity-90"
        />
        <img
          src={LaptopImage}
          alt="Laptops"
          className="absolute bottom-[-30px] right-[-40px] w-[140px] sm:w-[180px] md:w-[260px] lg:w-[320px] rotate-0 z-0 opacity-90"
        />
      </section>

      {/* IT Support Section */}
      <section className="w-full py-12 sm:py-16 md:py-24 lg:py-32 bg-[#1a202c] text-white border-4 border-[#3B82F6]">
        <div className="container px-4 sm:px-5 md:px-6 flex flex-col md:flex-row justify-center items-center gap-8 sm:gap-10 md:gap-12 max-w-5xl mx-auto">
          {/* Centered image with padding */}
          <div className="flex justify-center">
            <img
              src={ServiceImage}
              alt="IT Support Services"
              className="max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[350px] h-auto"
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* Centered content */}
          <div className="flex flex-col space-y-4 text-left items-start justify-center">
            <span className="text-xs sm:text-sm font-semibold uppercase text-gray-400">Ad</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight max-w-xl">
              Need IT Support? Explore Our Tech Services!
            </h2>
            <Link
              to="/tech-services"
              className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-3xl transition mt-2 sm:mt-4 cursor-pointer"
              onClick={() => {
                // Google Analytics tracking
                if (typeof gtag !== 'undefined') {
                  gtag('event', 'click', {
                    event_category: 'AD Banner',
                    event_label: 'Get IT Support Button',
                    value: 1
                  });
                }
              }}
            >
              Get IT Support
              <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function ArrowRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
