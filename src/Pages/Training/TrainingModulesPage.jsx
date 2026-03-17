// src/Pages/Training/TrainingModulesPage.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import TrainingHeroSection from "../../components/TrainingHeroSection";
import FreelanceCourses from "./FreelanceCourses";
import CompanyCourses from "./CompanyCourses";
import { useTranslation } from "react-i18next";

export default function TrainingModulesPage() {
  const [activeTab, setActiveTab] = useState("freelancers");
  const { t } = useTranslation();
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <main className="w-full flex flex-col">
      {/*  Hero Section */}
      <TrainingHeroSection />

      {/*  Breadcrumb + Tabs */}
      <div id="training-content" className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6 scroll-mt-24">
        <div className="flex items-center border-b order-gray-300 pb-2">
          {/* Breadcrumb */}
          <nav className="text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600">
              {t('freelancer.profile.breadcrumbs.home')}
            </Link>
            <span className="mx-2">{">"}</span>
            <span className="text-sm text-gray-500">{t('training.modules.breadcrumb')}</span>
          </nav>

          {/* Tabs */}
          <div className="flex space-x-6 ml-20">
            <button
              onClick={() => setActiveTab("freelancers")}
              className={`pb-2 text-sm font-medium transition-colors ${activeTab === "freelancers"
                  ? "text-green-600  "
                  : "text-gray-600 hover:text-green-600"
                }`}
            >
              {t('training.tabs.freelancers')}
            </button>
            <button
              onClick={() => setActiveTab("companies")}
              className={`pb-2 text-sm font-medium transition-colors ${activeTab === "companies"
                  ? "text-green-600  "
                  : "text-gray-600 hover:text-green-600"
                }`}
            >
              {t('training.tabs.companies')}
            </button>
          </div>
        </div>
      </div>

      {/*  Dynamic Tab Content */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "freelancers" && <FreelanceCourses />}
        {activeTab === "companies" && <CompanyCourses />}
      </div>
    </main>
  );
}
