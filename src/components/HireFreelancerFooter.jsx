import React from "react";
import { ArrowRight } from "lucide-react";
import FreelanceImage from "../assets/FreelanceImage.jpg";
import { useTranslation } from "react-i18next";

export default function HireFreelancerFooter() {
  const { t } = useTranslation();
  return (
    <section className="relative w-full h-[450px] sm:h-[500px] md:h-[400px] lg:h-[350px] overflow-hidden flex items-center justify-center text-center px-4 py-12">
      {/* Background Image */}
      <img
        src={FreelanceImage}
        alt="Freelancer working with a scale of justice"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      />

      {/* Darker Overlay */}
      <div className="absolute inset-0 bg-black/70 z-10"></div> {/* bg-black/70 = 70% opacity black */}

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center space-y-4 sm:space-y-6 max-w-3xl mx-auto">
        <span className="inline-flex items-center rounded-full bg-blue-500 px-3 py-1 text-xs sm:text-sm font-medium text-white">
          {t('freelancer.footer.badge')}
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
          {t('freelancer.footer.title')}
        </h2>
        <div className="flex flex-col gap-4 items-center">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-sm sm:text-base md:text-lg rounded-full font-semibold flex items-center justify-center gap-2">
            {t('freelancer.footer.upskill')} <ArrowRight className="h-5 w-5" />
          </button>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm sm:text-base md:text-base rounded-full font-semibold flex items-center justify-center gap-2 w-fit">
            {t('freelancer.footer.join')} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
