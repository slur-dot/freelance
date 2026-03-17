import React from "react";
import { useNavigate } from "react-router-dom";
import ProfileCarousel from "./ProfileCarousel";
import ERP from "../assets/ERP.png";
import DeviceSales from "../assets/DeviceSales.png";
import Outsourcing from "../assets/Outsourcing.png";
import SolutionIntegration from "../assets/SolutionIntegration.png";
import TrainingIT from "../assets/TrainingIT.png";
import ITSupport from "../assets/ITSupport.png";

import { useTranslation } from "react-i18next";

// Sample ServiceCard component with updated styling
const ServiceCard = ({ icon, title, description, buttonText, additionalContent, to }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg flex flex-col sm:flex-row sm:items-start items-center justify-center sm:justify-start text-center sm:text-left">
      {/* Icon */}
      <div className="flex-shrink-0 mb-4 sm:mb-0">{icon}</div>

      {/* Content */}
      <div className="flex flex-col items-center sm:items-start">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        {additionalContent && <div className="mb-4">{additionalContent}</div>}
        <button 
          onClick={() => navigate(to)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-colors duration-300"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default function Services() {
  const { t } = useTranslation();

  const profiles = [
    { name: t('services_page.profiles.mariama.name'), role: t('services_page.profiles.mariama.role') },
    { name: t('services_page.profiles.ibrahima.name'), role: t('services_page.profiles.ibrahima.role') },
    { name: t('services_page.profiles.fatou.name'), role: t('services_page.profiles.fatou.role') },
    { name: t('services_page.profiles.sekou.name'), role: t('services_page.profiles.sekou.role') },
    { name: t('services_page.profiles.aminata.name'), role: t('services_page.profiles.aminata.role') },
    { name: t('services_page.profiles.mohamed.name'), role: t('services_page.profiles.mohamed.role') },
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
        <div className="text-center max-w-5xl mx-auto">
          <div className="mb-4 sm:mb-6">
            <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 cursor-pointer">
              {t('home.services.for_companies')}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="block">{t('home.services.fuel_innovation')}</span>
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {t('home.services.transformation')}
            </span>
          </h1>

          <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto mb-12 sm:mb-16 leading-relaxed">
            {t('home.services.subtitle')}
          </p>
        </div>

        {/* Carousel Section */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">{t('home.services.recruitment_title')}</h2>
            <p className="text-gray-400 text-base sm:text-lg">
              {t('home.services.recruitment_subtitle')}
            </p>
          </div>
          <ProfileCarousel profiles={profiles} />
        </div>
      </div>

      {/* Services Grid */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          <ServiceCard
            icon={
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center overflow-hidden mr-4">
                <img src={ERP} alt="ERP" className="w-6 h-6 object-contain" />
              </div>
            }
            title={t('home.services.erp_title')}
            description={t('home.services.erp_desc')}
            buttonText={t('home.services.erp_btn')}
            to="/tech-services#erp-solutions"
          />

          <ServiceCard
            icon={
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center overflow-hidden mr-4">
                <img src={DeviceSales} alt="Device Sales" className="w-6 h-6 object-contain" />
              </div>
            }
            title={t('home.services.it_support_title')}
            description={t('home.services.it_support_desc')}
            buttonText={t('home.services.it_support_btn')}
            to="/tech-services#it-support"
          />

          <ServiceCard
            icon={
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center overflow-hidden mr-4">
                <img src={Outsourcing} alt="Outsourcing" className="w-6 h-6 object-contain" />
              </div>
            }
            title={t('home.services.integration_title')}
            description={t('home.services.integration_desc')}
            buttonText={t('home.services.integration_btn')}
            to="/tech-services#it-integration"
          />

          <ServiceCard
            icon={
              <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center overflow-hidden mr-4">
                <img src={SolutionIntegration} alt="Solution Integration" className="w-6 h-6 object-contain" />
              </div>
            }
            title={t('home.services.outsourcing_title')}
            description={t('home.services.outsourcing_desc')}
            buttonText={t('home.services.outsourcing_btn')}
            to="/tech-services#it-outsourcing"
          />

          <ServiceCard
            icon={
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center overflow-hidden mr-4">
                <img src={TrainingIT} alt="Training" className="w-6 h-6 object-contain" />
              </div>
            }
            title={t('home.services.device_title')}
            description={t('home.services.device_desc')}
            buttonText={t('home.services.device_btn')}
            to="/computer-rental#rental-products"
            additionalContent={
              <div className="space-y-1 text-center sm:text-left flex flex-col items-center sm:items-start">
                <p className="text-green-400 font-semibold">{t('services_page.price_device')}</p>
                <p className="text-gray-400 text-sm">
                  <span className="text-xs">{t('home.services.rental')}</span>{" "}
                  <span className="text-orange-400 font-semibold">{t('services_page.price_rental')}</span>
                </p>
              </div>
            }
          />

          <ServiceCard
            icon={
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center overflow-hidden mr-4">
                <img src={ITSupport} alt="IT Support" className="w-6 h-6 object-contain" />
              </div>
            }
            title={t('home.services.training_title')}
            description={t('home.services.training_desc')}
            buttonText={t('home.services.training_btn')}
            to="/training-modules#training-content"
          />
        </div>
      </div>
    </div>
  );
}