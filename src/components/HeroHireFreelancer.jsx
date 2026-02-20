import React from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaArrowRight } from "react-icons/fa";
import heroImage from "../assets/Training_hero.png";
import heroIcon from "../assets/Traiining_heroIcon.png";
import GroupBackground from "../assets/Group.png";
import { useTranslation, Trans } from "react-i18next";

export default function HeroHireFreelancer() {
  const { t } = useTranslation();

  return (
    <section
      className="relative w-full min-h-[700px] bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center text-white overflow-hidden"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-10"></div>

      {/* Hero Content */}
      <div className="relative z-20 text-center px-4 py-16 md:py-24 lg:py-32 max-w-5xl mx-auto w-full">
        {/* Icon and Heading */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
          <img src={heroIcon} alt="Hero Icon" className="w-12 h-12" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            <Trans i18nKey="freelancer.hero.title">
              Hire Top Freelancers in
              <br />
              <span className="text-orange-500">Guinea & Globally</span>
            </Trans>
          </h1>
        </div>

        {/* Subheading */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-8 max-w-2xl mx-auto">
          {t('freelancer.hero.subtitle')}
        </p>

        {/* Search Bar */}
        <div className="flex justify-center mb-8 px-2">
          <div className="relative w-full sm:w-3/4 max-w-xl">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={t('freelancer.hero.search_placeholder')}
              className="w-full pl-10 pr-28 py-2 rounded-md bg-gray-200 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
            />
            <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#008060] hover:bg-[#00664d] text-white px-4 py-1.5 rounded-full flex items-center gap-1 text-sm h-auto cursor-pointer">
              {t('freelancer.hero.search_button')} <FaArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Filter By Section */}
        <div className="text-left w-full max-w-3xl mx-auto rounded-md p-4 text-white">
          <p className="text-sm font-semibold mb-2">{t('freelancer.hero.filter_label')}</p>

          {/* First row: left-aligned */}
          <div className="flex flex-wrap justify-start gap-2 mb-3">
            {t('freelancer.hero.filters', { returnObjects: true }).map((filter, idx) => (
              <button
                key={idx}
                className="text-[11px] px-3 py-1 rounded-md font-medium bg-gray-200 text-black border border-white/70 transition hover:bg-[#008060] hover:text-white cursor-pointer"
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Second row: centered */}
          <div className="flex flex-wrap justify-center gap-2">
            {t('freelancer.hero.locations', { returnObjects: true }).map((location, idx) => (
              <button
                key={idx}
                className="text-[11px] px-3 py-1 rounded-md font-medium bg-gray-200 text-black border border-white/70 transition hover:bg-[#008060] hover:text-white cursor-pointer"
              >
                {location}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Green Section with Group.png */}
      <div
        className="relative w-full py-8 sm:py-12 md:py-16 text-center z-20 mt-auto bg-green-800 bg-no-repeat bg-center bg-cover"
        style={{ backgroundImage: `url(${GroupBackground})` }}
      >
        <div className="relative z-10 px-4">
          <p className="text-xs font-semibold mb-2">{t('freelancer.hero.ad.label')}</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            <Trans i18nKey="freelancer.hero.ad.title">
              Need Tech for Your Freelance Work? <br />
              Shop Now!
            </Trans>
          </h2>
          <Link
            to="/shop"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full flex items-center gap-2 mx-auto cursor-pointer inline-flex"
            style={{ textDecoration: 'none' }}
          >
            {t('freelancer.hero.ad.button')} <FaArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
