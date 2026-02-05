import React, { useState, useEffect } from "react";
import {
  FaMobileAlt,
  FaUsers,
  FaTools,
  FaDesktop,
  FaGraduationCap,
  FaArrowRight,
  FaClock,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function TechServicesLanding() {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 1,
    hours: 19,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-center">
        <div className="flex flex-wrap justify-center items-center gap-4 mb-8">
          <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold">
            Save 20%
          </span>
          <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
            Faster solutions
          </span>
        </div>

        <div className="relative mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Shop. Book.{" "}
            <span className="relative">
              <span className="bg-blue-200 px-4 py-2 rounded-full border-2 border-blue-400">
                Hire.
              </span>
            </span>{" "}
            Rent. Transform.
          </h1>
        </div>

        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-900 mb-4">
          - Your Tech Partner in <span className="text-red-600">Guinea</span>
        </h2>

        <p className="text-base sm:text-lg text-gray-600 mb-8">
          Serving Guinean locals, expats, companies, NGOs, and freelancers across Conakry and all prefectures
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            ["Shop Smartphones", <FaMobileAlt />, "/shop"],
            ["Hire Freelancers", <FaUsers />, "/hire-freelancers"],
            ["Explore Tech Services", <FaTools />, "/tech-services"],
            ["Rent Devices", <FaDesktop />, "/computer-rental"],
            ["Start Training", <FaGraduationCap />, "/training-modules"],
          ].map(([text, Icon, path], idx) => (
            <Link
              key={idx}
              to={path}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-full flex items-center justify-center text-sm sm:text-base"
            >
              <span className="mr-2">{Icon}</span>
              {text}
              <FaArrowRight className="ml-2" />
            </Link>
          ))}
        </div>

        {/* Countdown Timer */}
        <div className="mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaClock className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              {timeRemaining.days} day, {timeRemaining.hours} hours remaining
            </h3>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            from 05:55 PM CEST, May 14, 2025, to midnight May 16, 2025
          </p>
        </div>
      </section>

      {/* ✅ Product Showcase Section */}
      <section className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="max-w-full px-4 py-12">
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 items-center text-center lg:text-left">
            {/* Left Images */}
            <div className="flex justify-center lg:justify-start relative gap-4 mb-6 lg:mb-0">
              <img
                src="/src/assets/iphone.png"
                alt="Promo 1"
                className="w-24 sm:w-32 md:w-36 h-auto rounded-xl object-cover transform rotate-12"
              />
              <img
                src="/src/assets/phone.png"
                alt="Promo 2"
                className="w-28 sm:w-40 md:w-44 h-auto rounded-xl object-cover -ml-6 z-20"
              />
            </div>

            {/* Center Content */}
            <div className="flex flex-col items-center lg:items-start">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 leading-snug">
                Get 20% Off Smartphones &<br />
                Rentals – Visit Our Shop!
              </h3>
              <button className="bg-transparent text-white border border-white hover:bg-white/20 px-6 py-3 text-sm sm:text-md rounded-full font-semibold flex items-center justify-center transition">
                Explore the Platform Now
                <FaArrowRight className="ml-2" />
              </button>
            </div>

            {/* Right Image */}
            <div className="flex justify-center lg:justify-end mt-6 lg:mt-0">
              <img
                src="/src/assets/performance.png"
                alt="Preview"
                className="w-48 sm:w-64 md:w-72 h-auto object-cover"
              />
            </div>
          </div>

          {/* Decorative Circles */}
          <div className="relative">
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
            <div className="absolute top-1/2 -right-8 w-10 h-10 bg-white/10 rounded-full" />
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/10 rounded-full" />
          </div>
        </div>
      </section>
    </div>
  );
}
