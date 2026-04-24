import React, { useState } from "react";
import { Star, Trophy, Users, Globe, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import ProfileLayout from "../Pages/Dashboards/Common/ProfileLayout";

export default function CompanyHistory() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("overview");

  const companyUser = {
    name: "Freelance-224",
    email: "contact@freelance-224.com",
    avatar: "https://ui-avatars.com/api/?name=Freelance+224&background=2563eb&color=fff&size=200",
    role: t('company_history.role', "Guinea's Premier Tech Platform"),
    createdAt: new Date("2022-01-01"),
  };

  const stats = [
    { label: t('company_history.stats.users', 'Active Users'), value: '10,000+', trend: 'up', trendNote: '+500 this month' },
    { label: t('company_history.stats.projects', 'Projects Completed'), value: '25,000+', trend: 'up', trendNote: '98% Success Rate' },
    { label: t('company_history.stats.freelancers', 'Expert Freelancers'), value: '1,500+', trend: 'up', trendNote: 'Vetted Professionals' },
    { label: t('company_history.stats.partners', 'Partners'), value: '50+', trend: 'up', trendNote: 'Local & Global' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Breadcrumb Navigation - Similar to the app's standard navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex text-sm text-gray-500">
            <a href="/" className="hover:text-gray-700">{t('nav.home', 'Home')}</a>
            <span className="mx-2">›</span>
            <span className="text-gray-900">{t('nav.about_us', 'About Us')}</span>
          </nav>
        </div>
      </div>

      <ProfileLayout user={companyUser} stats={stats}>
        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-100 bg-gray-50/30 overflow-x-auto no-scrollbar rounded-t-xl">
          {['overview', 'history', 'partnerships'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 text-sm font-bold transition-all relative flex-shrink-0 ${
                activeTab === tab
                  ? 'text-blue-600 bg-white'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className="flex items-center gap-2">
                {t(`company_history.tabs.${tab}`, tab.charAt(0).toUpperCase() + tab.slice(1))}
              </div>
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="prose max-w-none text-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('company_history.headline')}</h2>
                <p className="text-lg leading-relaxed text-gray-600 mb-6">{t('company_history.subheadline')}</p>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mt-8">
                  <div className="flex items-start gap-4">
                    <Globe className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{t('company_history.mission_title', 'Our Mission')}</h3>
                      <p className="text-gray-700">{t('company_history.mission_desc', 'To empower Guinean professionals and businesses by bridging the gap through technology, creating a thriving digital economy in West Africa.')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                    <Star className="w-5 h-5 text-yellow-500" />
                    {t('company_history.founding_title', 'The Beginning')}
                  </h3>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-xl border border-gray-100">
                    {t('company_history.founding')}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-6">
                    <Trophy className="w-5 h-5 text-blue-600" />
                    {t('company_history.milestones_title', 'Key Milestones')}
                  </h3>
                  <ul className="space-y-4">
                    {[
                      t('company_history.milestone_1'),
                      t('company_history.milestone_2'),
                      t('company_history.milestone_3')
                    ].map((milestone, i) => (
                      <li key={i} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 font-bold text-xs">{i + 1}</span>
                        </div>
                        <span className="text-gray-700">{milestone}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'partnerships' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="max-w-3xl">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                  <Users className="w-5 h-5 text-green-600" />
                  {t('company_history.partnerships_title', 'Trusted By Industry Leaders')}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-8">
                  {t('company_history.partnerships')}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {/* Partnership Logos */}
                  <div className="bg-white border border-gray-100 p-6 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                    <img src="/logos/orange-guinea.svg" alt="Orange Guinea" className="h-12 object-contain grayscale hover:grayscale-0 transition-all" />
                  </div>
                  <div className="bg-white border border-gray-100 p-6 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                    <img src="/logos/ccc.svg" alt="Chamber of Commerce" className="h-12 object-contain grayscale hover:grayscale-0 transition-all" />
                  </div>
                </div>

                <div className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h4 className="text-2xl font-bold mb-2">{t('company_history.cta_title', 'Ready to join us?')}</h4>
                    <p className="text-blue-100">{t('company_history.cta_subtitle', 'Be part of Guinea\'s fastest growing tech ecosystem.')}</p>
                  </div>
                  <a href="/signup" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all whitespace-nowrap flex items-center gap-2">
                    {t('company_history.cta')}
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </ProfileLayout>
    </div>
  );
}
