import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import TechServicesBg from "../assets/TechServicesHero.jpg";

import { useTranslation } from "react-i18next";

export default function TechServicesHero() {
  const { t } = useTranslation();
  return (
    <section className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden">
      {/* Background Image */}
      <img
        src={TechServicesBg}
        alt="Training Modules Background"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl space-y-4">
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            {t('tech_services.hero.title')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-snug">
            {t('tech_services.hero.subtitle')}
          </p>
          <Link
            to="/tech-services/booking"
            className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 mt-4 sm:mt-6 text-sm sm:text-base font-medium text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            {t('tech_services.hero.cta')}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
