import React from "react";
import { useTranslation } from "react-i18next";

function Card({ children, className = "" }) {
  return <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>;
}

export function ActiveContracts({ contracts }) {
  const { t } = useTranslation();

  if (!contracts || contracts.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t('company_dashboard.contracts_title')}</h3>
        <div className="text-center text-gray-500">
          <p>{t('company_dashboard.contracts_no_contracts')}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{t('company_dashboard.contracts_title_freelance')}</h3>
      <div className="space-y-4">
        {contracts.filter(c => c.status === 'active').map((contract, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{contract.title}</h4>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">{contract.status}</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{contract.device}</p>
            <p className="text-lg font-semibold text-green-600">{contract.monthlyCost.toLocaleString()} GNF/month</p>
            <p className="text-xs text-gray-500">{t('company_dashboard.contracts_provider')} {contract.provider}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function RecentPurchases({ purchases }) {
  const { t } = useTranslation();

  if (!purchases || purchases.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t('company_dashboard.purchases_title_sellers')}</h3>
        <div className="text-center text-gray-500">
          <p>{t('company_dashboard.purchases_no_purchases')}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{t('company_dashboard.purchases_title_sellers')}</h3>
      <div className="space-y-3">
        {purchases.slice(0, 5).map((purchase, index) => (
          <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium">{purchase.item}</p>
              <p className="text-sm text-gray-600">{t('company_dashboard.purchases_seller')} {purchase.seller}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{purchase.amount.toLocaleString()} GNF</p>
              <span className={`px-2 py-1 text-xs rounded-full ${purchase.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{purchase.status}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}


