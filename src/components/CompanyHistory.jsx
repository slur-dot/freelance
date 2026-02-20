import React from "react";
import { Star, Trophy, Users, Languages } from "lucide-react";
import banner from "../assets/TechServicesHero.jpg";

// i18n content
import { useTranslation } from "react-i18next";

export default function CompanyHistory() {
  const { t } = useTranslation();

  return (
    <main className="bg-white text-gray-800">
      {/* Banner */}
      <section className="relative">
        <img
          src={banner}
          alt="Guinean youth & diaspora experts at Conakry tech event"
          loading="lazy"
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">
            {t('company_history.headline')}
          </h1>
          <p className="text-gray-200 max-w-3xl">{t('company_history.subheadline')}</p>
        </div>
      </section>

      {/* Founding */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-start gap-4">
          <Star
            className="w-6 h-6 text-yellow-500 flex-shrink-0"
            aria-label="Secure Founding"
          />
          <p className="text-gray-700 text-base leading-relaxed">{t('company_history.founding')}</p>
        </div>
      </section>

      {/* Milestones */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-start gap-4">
            <Trophy
              className="w-6 h-6 text-blue-600 flex-shrink-0"
              aria-label="Secure Milestones"
            />
            <ul className="space-y-2 text-gray-700">
              <li className="text-base leading-relaxed">{t('company_history.milestone_1')}</li>
              <li className="text-base leading-relaxed">{t('company_history.milestone_2')}</li>
              <li className="text-base leading-relaxed">{t('company_history.milestone_3')}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Partnerships */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-start gap-4">
          <Users
            className="w-6 h-6 text-green-600 flex-shrink-0"
            aria-label="Secure Partnerships"
          />
          <p className="text-gray-700 text-base leading-relaxed">
            {t('company_history.partnerships')}
          </p>
        </div>
        <div className="flex gap-6 mt-6">
          <img
            src="/logos/orange-guinea.svg"
            alt="Orange Guinea: Secure Payments"
            className="h-10"
            loading="lazy"
          />
          <img
            src="/logos/ccc.svg"
            alt="Conakry Chamber of Commerce"
            className="h-10"
            loading="lazy"
          />
        </div>
        <div className="mt-8">
          <a
            href="/signup"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
            aria-label={t('company_history.cta')}
          >
            {t('company_history.cta')}
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-gray-300 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex gap-4 mb-4 md:mb-0">
            <a href="/about-freelance" className="hover:text-white">
              About Freelance-224
            </a>
            <a href="/success-stories" className="hover:text-white">
              Success Stories
            </a>
            <a href="/what-we-do" className="hover:text-white">
              What We Do
            </a>
          </div>
          <p className="text-gray-400 text-center">{t('company_history.copyright')}</p>
        </div>
      </footer>
    </main>
  );
}
