import React from "react";
import computerHero from "../assets/computerHero.jpg";
import shopLaptop from "../assets/laptopdevice.png";
import { useTranslation } from "react-i18next";

const ComputerRentalHero = () => {
  const { t } = useTranslation();
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Image with brightness filter */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${computerHero})` }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1930]/50 to-[#2A0A30]/50 z-10"></div>

      {/* Abstract Dots */}
      <div className="absolute top-10 left-10 w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-pink-500 rounded-full opacity-70 z-20 hidden sm:block"></div>
      <div className="absolute top-20 right-10 sm:right-16 md:right-20 w-3 h-3 sm:w-4 sm:h-4 md:w-6 md:h-6 bg-blue-400 rounded-full opacity-70 z-20 hidden sm:block"></div>
      <div className="absolute top-16 right-10 sm:right-14 md:right-16 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-orange-300 rounded-full opacity-70 z-20 hidden sm:block"></div>

      {/* Text Content */}
      <div className="relative z-30 flex flex-col items-center justify-center h-3/4 px-4 text-center">
        <h1 className="text-white text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-xs sm:max-w-xl md:max-w-4xl">
          {t('computer_rental.hero.title')}
        </h1>
        <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl mt-4 max-w-sm sm:max-w-lg md:max-w-2xl">
          {t('computer_rental.hero.subtitle')}
        </p>
      </div>

      {/* Laptop Image */}
      <div className="relative z-30 flex justify-center mt-4 sm:-mt-10 md:-mt-20">
        <img
          src={shopLaptop}
          alt="Assorted Laptops and Tablet"
          width={300}
          height={200}
          className="hidden md:block"
        />
      </div>
    </section>
  );
};

export default ComputerRentalHero;
