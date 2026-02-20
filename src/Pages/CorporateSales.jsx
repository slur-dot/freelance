import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import CooperateSalesHero from "../components/CorperateSalesHero";
import CorporateSalesProduct from "../components/CorporateSalesProduct";
import CorporateRentalProduct from "../components/CorporateRentalProduct";
import { useTranslation } from "react-i18next";


export default function CorporateSales() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("sales");

  return (
    <div className="w-full">
      {/* Hero Section */}
      <CooperateSalesHero />

      {/* Breadcrumb + Tabs Row */}
      <div className="flex flex-wrap items-center justify-start gap-6 mb-4 px-4 sm:px-6 lg:px-8 pt-4 border-b border-gray-200 pb-2 ml-20">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 flex items-center">
          <ol className="inline-flex p-0 list-none">
            <li className="flex items-center">
              <Link to="/" className="text-gray-600 hover:underline">
                {t('corporate_sales.breadcrumbs.home')}
              </Link>
              <ChevronRight className="h-3 w-3 mx-2" />
            </li>
            <li className="flex items-center">
              <span className="text-gray-900">{t('corporate_sales.breadcrumbs.corporate_sales')}</span>
            </li>
          </ol>
        </nav>

        {/* Tabs */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setActiveTab("sales")}
            className={`rounded-none px-0 pb-1 text-sm ${activeTab === "sales"
                ? "text-[#228B22] border-b-2 border-[#228B22]"
                : "text-gray-600 hover:text-[#228B22]"
              }`}
          >
            {t('corporate_sales.tabs.sales')}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rental")}
            className={`rounded-none px-0 pb-1 text-sm ${activeTab === "rental"
                ? "text-[#228B22] border-b-2 border-[#228B22]"
                : "text-gray-600 hover:text-[#228B22]"
              }`}
          >
            {t('corporate_sales.tabs.rental')}
          </button>
        </div>
      </div>

      {/* Dynamic Content Based on Active Tab */}
      {activeTab === "sales" && <CorporateSalesProduct />}
      {activeTab === "rental" && <CorporateRentalProduct />}
    </div>
  );
}
