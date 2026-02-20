import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Info, FileText, MoreHorizontal, ChevronDown } from "lucide-react";
import { auth } from "../../../firebaseConfig";

import { FreelancerService } from "../../../services/freelancerService";
import { UserService } from "../../../services/userService";

// ... (existing imports)

export default function Earnings() {
  const { t } = useTranslation();
  const [user, setUser] = useState(auth.currentUser);
  const FREELANCER_ID = user?.uid;

  const [finance, setFinance] = useState({ totalEarned: 0, netEarnings: 0, earningsByCategory: {}, commissionRate: 0.1, nextMilestone: 3000000 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!FREELANCER_ID) {
      if (!auth.currentUser) setLoading(false);
      return;
    }
    let isMounted = true;

    async function fetchFinance() {
      try {
        setLoading(true);
        // Parallel fetch: profile (stats) + earnings history
        const [profile, history] = await Promise.all([
          UserService.getUserProfile(FREELANCER_ID),
          FreelancerService.getEarningsHistory(FREELANCER_ID)
        ]);

        if (isMounted) {
          // Fallback if profile fields are missing
          const totalEarned = profile?.totalEarned || 0;
          const commissionRate = profile?.commissionRate || 0.1;
          const netEarnings = profile?.balance || 0; // Or calculate: totalEarned * (1 - commissionRate)

          setFinance({
            totalEarned: totalEarned,
            netEarnings: netEarnings,
            earningsByCategory: profile?.earningsByCategory || {},
            commissionRate: commissionRate,
            nextMilestone: profile?.nextMilestone || 3000000
          });
          setTransactions(history || []);
        }
      } catch (e) {
        if (isMounted) {
          console.error(e);
          setError("Failed to load earnings data");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchFinance();
    return () => { isMounted = false; };
  }, [FREELANCER_ID]);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 lg:p-10">
      {/* Centered container to avoid cut-off */}
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">{t('earnings_page.title')}</h1>
        {loading && <div className="mb-4">{t('earnings_page.loading') || 'Loading...'}</div>}
        {error && !loading && <div className="mb-4 text-red-600">{error}</div>}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16 w-full">
          {/* Available Funds */}
          <div className="w-full">
            <h2 className="text-base sm:text-lg font-bold mb-2 text-black">
              {t('earnings_page.available_funds.title')}
            </h2>
            <div className="bg-white p-4 rounded-lg shadow-sm h-full flex flex-col">
              <div className="pb-2">
                <p className="text-sm sm:text-base">{t('earnings_page.available_funds.balance_desc')}</p>
                <h3 className="text-2xl sm:text-4xl font-bold break-words">
                  {finance.netEarnings?.toLocaleString()} GNF
                </h3>
              </div>
              <button className="mt-auto w-full border border-gray-200 text-gray-600 hover:bg-gray-100 bg-transparent rounded-md py-2 text-sm sm:text-base">
                {t('earnings_page.available_funds.withdraw_btn')}
              </button>
            </div>
          </div>

          {/* Future Payments */}
          <div className="w-full">
            <h2 className="text-base sm:text-lg font-bold mb-2 text-black">
              {t('earnings_page.future_payments.title')}
            </h2>
            <div className="bg-white p-4 rounded-lg shadow-sm h-full flex flex-col">
              <span className="text-sm sm:text-base">{t('earnings_page.future_payments.clearing_desc')}</span>
              <h3 className="text-2xl sm:text-4xl font-bold pb-2 border-b border-gray-200 break-words">
                $0.00
              </h3>
              <div className="space-y-2 mt-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>{t('earnings_page.future_payments.active_orders')}</span>
                  <Info className="h-3 w-3 text-gray-400" />
                </div>
                <span>-</span>
                <div className="text-sm text-gray-400 mt-2">{t('earnings_page.future_payments.coming_soon')}</div>
              </div>
            </div>
          </div>

          {/* Earnings & Expenses */}
          <div className="w-full">
            <h2 className="text-base sm:text-lg font-bold mb-2 text-black">
              {t('earnings_page.earnings_expenses.title')}
            </h2>
            <div className="bg-white p-4 rounded-lg shadow-sm h-full flex flex-col">
              <span className="text-sm sm:text-base">{t('earnings_page.earnings_expenses.gross_desc')}</span>
              <h3 className="text-2xl sm:text-4xl font-bold break-words">{finance.totalEarned?.toLocaleString()} GNF</h3>
              <div className="space-y-2 mt-2 text-sm text-gray-600">
                <div className="pb-2 border-b border-gray-200">
                  <p className="text-xs text-gray-500">
                    {t('earnings_page.earnings_expenses.since_joining')}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span>{t('earnings_page.earnings_expenses.commission')} ({Math.round((finance.commissionRate || 0) * 100)}%)</span>
                  <span>
                    {(Math.round((finance.totalEarned || 0) * (finance.commissionRate || 0))).toLocaleString()} GNF
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span>{t('earnings_page.earnings_expenses.net_earnings')}</span>
                  <span>{finance.netEarnings?.toLocaleString()} GNF</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Earnings by Category + Milestone */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
          {/* Bar Graph */}
          <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-base sm:text-lg font-bold mb-4 text-black">{t('earnings_page.categories.title')}</h2>
            <div className="h-48 flex items-end gap-3">
              {(() => {
                const cats = finance.earningsByCategory || {};
                const series = [
                  { key: 'it', label: 'IT', value: cats.it || 0 },
                  { key: 'web', label: 'Web', value: cats.web || 0 },
                  { key: 'design', label: 'Design', value: cats.design || 0 },
                  { key: 'marketing', label: 'Marketing', value: cats.marketing || 0 },
                  { key: 'facebookAds', label: 'Facebook Ads', value: cats.facebookAds || 0 },
                ];
                const max = Math.max(1, ...series.map(s => s.value));
                return series.map((s) => (
                  <div key={s.key} className="flex-1 flex flex-col items-center justify-end">
                    <div
                      className="w-full bg-green-600/30 rounded"
                      style={{ height: `${Math.round((s.value / max) * 100)}%` }}
                    />
                    <div className="text-xs text-gray-600 mt-2 text-center">
                      <div className="font-medium">{s.label}</div>
                      <div>{s.value.toLocaleString()} GNF</div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Milestone Tracker */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-base sm:text-lg font-bold mb-2 text-black">{t('earnings_page.milestone.title')}</h2>
            <p className="text-sm text-gray-600 mb-3">{t('earnings_page.milestone.next')}: {finance.nextMilestone?.toLocaleString()} GNF</p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600"
                style={{ width: `${Math.min(100, Math.round(((finance.netEarnings || 0) / (finance.nextMilestone || 3000000)) * 100))}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-gray-600 flex items-center justify-between">
              <span>{finance.netEarnings?.toLocaleString()} GNF</span>
              <span>{Math.min(100, Math.round(((finance.netEarnings || 0) / (finance.nextMilestone || 3000000)) * 100))}%</span>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-6 w-full">
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-1 border border-gray-300 px-3 py-2 rounded-md bg-white hover:bg-gray-100 text-sm w-full sm:w-auto">
              {t('earnings_page.filters.date_range')} <ChevronDown className="h-4 w-4" />
            </button>
            <button className="flex items-center gap-1 border border-gray-300 px-3 py-2 rounded-md bg-white hover:bg-gray-100 text-sm w-full sm:w-auto">
              {t('earnings_page.filters.activity')} <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-md bg-white hover:bg-gray-100 text-sm w-full sm:w-auto">
              <FileText className="h-4 w-4" /> {t('earnings_page.filters.email_activity')}
            </button>
            <button className="border border-gray-300 p-2 rounded-md bg-white hover:bg-gray-100 w-full sm:w-auto flex justify-center">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-4">{t('earnings_page.table.showing_results', { count: transactions.length })}</div>

        {/* Activity Table */}
        <div className="bg-white rounded-lg shadow-sm p-4 overflow-x-auto">
          <table className="w-full text-left text-sm min-w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="py-2 px-3">{t('earnings_page.table.date')}</th>
                <th className="px-3">{t('earnings_page.table.activity')}</th>
                <th className="px-3">{t('earnings_page.table.desc')}</th>
                <th className="px-3">{t('earnings_page.table.from')}</th>
                <th className="px-3">{t('earnings_page.table.order')}</th>
                <th className="px-3 text-right">{t('earnings_page.table.amount')}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-60 text-center px-3">
                    <div className="flex flex-col items-center justify-center h-full">
                      <h3 className="text-base sm:text-lg font-bold mb-2">
                        {t('earnings_page.table.no_transactions')}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 max-w-xs sm:max-w-md">
                        {t('earnings_page.table.no_transactions_desc')}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="py-2 px-3">{tx.date?._seconds ? new Date(tx.date._seconds * 1000).toLocaleDateString() : new Date(tx.date).toLocaleDateString()}</td>
                    <td className="px-3">{t('earnings_page.table.items.payment') || 'Payment'}</td>
                    <td className="px-3">{tx.project}</td>
                    <td className="px-3">{tx.client}</td>
                    <td className="px-3">-</td>
                    <td className="px-3 text-right">{tx.netAmount?.toLocaleString()} GNF</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer actions */}
        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            className="border border-gray-300 px-3 py-2 rounded-md bg-white hover:bg-gray-100 text-sm"
            onClick={() => {
              // In this view we already show all fetched transactions
              // This button is here for UX consistency or future navigation
              window.location.href = '/freelancer/dashboard/earnings';
            }}
          >
            {t('earnings_page.actions.view_all')}
          </button>
          <button
            className="border border-green-600 text-green-700 px-3 py-2 rounded-md bg-white hover:bg-green-50 text-sm"
            onClick={() => {
              // Simple PDF export via browser print to PDF
              window.print();
            }}
          >
            {t('earnings_page.actions.export')}
          </button>
        </div>
      </div>
    </div>
  );
}
