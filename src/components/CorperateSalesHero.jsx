import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import CooperateSalesHeroBg from "../assets/CooporateSaleshero.jpg";

export default function CorperateSalesHero() {
  return (
    <section className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden">
      {/* Background Image */}
      <img
        src={CooperateSalesHeroBg}
        alt="Cooperate Sales Background"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6">
        <div className="max-w-3xl sm:max-w-4xl space-y-3 sm:space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Devices Sales and Rental For <br/> Your Business & NGO
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-snug">
            Equip Your Team with Smartphones and Laptops Across Guinea - Perfect for Companies, NGOs, and Organizations in Conakry and All Prefectures
          </p>
        </div>
      </div>
    </section>
  );
}
