import React, { useState, useEffect } from "react";
import { Info, FileText, MoreHorizontal, ChevronDown } from "lucide-react";
import { auth } from "../../../firebaseConfig";

import { FreelancerService } from "../../../services/freelancerService";
import { UserService } from "../../../services/userService";

// ... (existing imports)

export default function Earnings() {
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
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Earnings</h1>
        {loading && <div className="mb-4">Loading...</div>}
        {error && !loading && <div className="mb-4 text-red-600">{error}</div>}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16 w-full">
          {/* Available Funds */}
          <div className="w-full">
            <h2 className="text-base sm:text-lg font-bold mb-2 text-black">
              Available funds
            </h2>
            <div className="bg-white p-4 rounded-lg shadow-sm h-full flex flex-col">
              <div className="pb-2">
                <p className="text-sm sm:text-base">Balance Available for use</p>
                <h3 className="text-2xl sm:text-4xl font-bold break-words">
                  {finance.netEarnings?.toLocaleString()} GNF
                </h3>
              </div>
              <button className="mt-auto w-full border border-gray-200 text-gray-600 hover:bg-gray-100 bg-transparent rounded-md py-2 text-sm sm:text-base">
                Withdraw balance
              </button>
            </div>
          </div>

          {/* Future Payments */}
          <div className="w-full">
            <h2 className="text-base sm:text-lg font-bold mb-2 text-black">
              Future payments
            </h2>
            <div className="bg-white p-4 rounded-lg shadow-sm h-full flex flex-col">
              <span className="text-sm sm:text-base">Payments being cleared</span>
              <h3 className="text-2xl sm:text-4xl font-bold pb-2 border-b border-gray-200 break-words">
                $0.00
              </h3>
              <div className="space-y-2 mt-2 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Payments for active orders</span>
                  <Info className="h-3 w-3 text-gray-400" />
                </div>
                <span>-</span>
                <div className="text-sm text-gray-400 mt-2">Coming soon</div>
              </div>
            </div>
          </div>

          {/* Earnings & Expenses */}
          <div className="w-full">
            <h2 className="text-base sm:text-lg font-bold mb-2 text-black">
              Earnings & expenses
            </h2>
            <div className="bg-white p-4 rounded-lg shadow-sm h-full flex flex-col">
              <span className="text-sm sm:text-base">Earnings to date (gross)</span>
              <h3 className="text-2xl sm:text-4xl font-bold break-words">{finance.totalEarned?.toLocaleString()} GNF</h3>
              <div className="space-y-2 mt-2 text-sm text-gray-600">
                <div className="pb-2 border-b border-gray-200">
                  <p className="text-xs text-gray-500">
                    Your gross earnings since joining.
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span>Commission ({Math.round((finance.commissionRate || 0) * 100)}%)</span>
                  <span>
                    {(Math.round((finance.totalEarned || 0) * (finance.commissionRate || 0))).toLocaleString()} GNF
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span>Net earnings</span>
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
            <h2 className="text-base sm:text-lg font-bold mb-4 text-black">Earnings by category</h2>
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
            <h2 className="text-base sm:text-lg font-bold mb-2 text-black">Milestone</h2>
            <p className="text-sm text-gray-600 mb-3">Next: {finance.nextMilestone?.toLocaleString()} GNF</p>
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
              Date range <ChevronDown className="h-4 w-4" />
            </button>
            <button className="flex items-center gap-1 border border-gray-300 px-3 py-2 rounded-md bg-white hover:bg-gray-100 text-sm w-full sm:w-auto">
              Activity <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button className="flex items-center gap-2 border border-gray-300 px-3 py-2 rounded-md bg-white hover:bg-gray-100 text-sm w-full sm:w-auto">
              <FileText className="h-4 w-4" /> Email activity
            </button>
            <button className="border border-gray-300 p-2 rounded-md bg-white hover:bg-gray-100 w-full sm:w-auto flex justify-center">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-4">Showing {transactions.length} results.</div>

        {/* Activity Table */}
        <div className="bg-white rounded-lg shadow-sm p-4 overflow-x-auto">
          <table className="w-full text-left text-sm min-w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="py-2 px-3">Date</th>
                <th className="px-3">Activity</th>
                <th className="px-3">Description</th>
                <th className="px-3">From</th>
                <th className="px-3">Order</th>
                <th className="px-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-60 text-center px-3">
                    <div className="flex flex-col items-center justify-center h-full">
                      <h3 className="text-base sm:text-lg font-bold mb-2">
                        No transactions yet
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 max-w-xs sm:max-w-md">
                        Transactions will appear here after your first project.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="py-2 px-3">{tx.date?._seconds ? new Date(tx.date._seconds * 1000).toLocaleDateString() : new Date(tx.date).toLocaleDateString()}</td>
                    <td className="px-3">Payment</td>
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
            View All Transactions
          </button>
          <button
            className="border border-green-600 text-green-700 px-3 py-2 rounded-md bg-white hover:bg-green-50 text-sm"
            onClick={() => {
              // Simple PDF export via browser print to PDF
              window.print();
            }}
          >
            Export as PDF
          </button>
        </div>
      </div>
    </div>
  );
}
