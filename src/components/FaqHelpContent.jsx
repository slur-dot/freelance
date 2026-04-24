import React, { useState } from "react";
import { ChevronRight, Plus, X, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

/* ---------------- QA Item ---------------- */
function QAItem({ id, question, answer, isOpen, onToggle }) {
  return (
    <div className="border-none bg-white shadow-sm">
      <button
        type="button"
        onClick={() => onToggle(id)}
        aria-expanded={isOpen}
        className="w-full flex justify-between items-center p-4 text-left text-base sm:text-lg font-medium text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
      >
        <span>{question}</span>
        <span
          className={`flex items-center justify-center w-8 h-8 transition-colors duration-200 ${isOpen ? "bg-[#66C2B9] text-black" : "bg-[#66C2B9] text-black"
            }`}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </span>
      </button>

      {isOpen && <div className="px-4 pb-4 text-sm sm:text-base text-gray-600">{answer}</div>}
    </div>
  );
}

/* ---------------- Category Wrapper ---------------- */
function FaqCategory({ title, items, defaultOpenId }) {
  const [openId, setOpenId] = useState(defaultOpenId ?? null);
  const handleToggle = (id) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <section className="mt-8 sm:mt-10">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h2>
      <div className="w-full mt-4 space-y-4">
        {items.map((qa) => (
          <QAItem
            key={qa.id}
            id={qa.id}
            question={qa.question}
            answer={qa.answer}
            isOpen={openId === qa.id}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </section>
  );
}

/* ---------------- Main Help Content ---------------- */
export default function FaqHelpContent() {
  const { t } = useTranslation();
  const freelancerFAQs = [
    { id: "free-1", question: t('faq.q1'), answer: t('faq.a1') },
    { id: "free-2", question: t('faq.q2'), answer: t('faq.a2') },
    { id: "free-3", question: t('faq.q3'), answer: t('faq.a3') },
  ];

  const companyFAQs = [
    { id: "comp-1", question: t('faq.q4'), answer: t('faq.a4') },
    { id: "comp-2", question: t('faq.q5'), answer: t('faq.a5') },
    { id: "comp-3", question: t('faq.q6'), answer: t('faq.a6') },
  ];

  const vendorFAQs = companyFAQs.map((q) => ({ ...q, id: `vend-${q.id}` }));

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Filter Section */}
          <div className="w-full lg:max-w-xs bg-white border border-gray-300 p-4 rounded-md self-start">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-blue-500">{t('faq.filters')}</h2>
              <SlidersHorizontal className="h-5 w-5 text-gray-600" />
            </div>

            <div className="mt-4 space-y-2">
              <label htmlFor="role-filter" className="text-sm font-medium text-gray-500">
                {t('faq.role')}
              </label>
              <select
                id="role-filter"
                className="w-full h-10 px-3 border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
              >
                <option value="">All Roles</option>
                <option value="freelancer">Freelancer</option>
                <option value="company">Company</option>
                <option value="vendor">Vendor</option>
                <option value="client">Client</option>
              </select>
            </div>

            <button
              type="button"
              className="mt-4 w-full h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium text-sm transition-colors"
            >
              {t('faq.apply_filter')}
            </button>
          </div>

          {/* FAQ Content */}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('faq.faq_title')}</h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">{t('faq.still_questions')}</p>

            <button
              type="button"
              className="mt-5 sm:mt-6 bg-green-600 hover:bg-green-700 text-white rounded-full px-5 sm:px-6 py-2 inline-flex items-center font-medium text-sm sm:text-base transition-colors"
            >
              {t('faq.contact_us')}
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>

            <FaqCategory title={t('faq.cat_freelancers')} items={freelancerFAQs} defaultOpenId="free-1" />
            <FaqCategory title={t('faq.cat_companies')} items={companyFAQs} />
            <FaqCategory title={t('faq.cat_vendors')} items={vendorFAQs} />
          </div>
        </div>
      </div>
    </div>
  );
}
