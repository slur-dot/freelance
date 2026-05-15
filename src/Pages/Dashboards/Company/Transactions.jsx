import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Info, FileText, MoreHorizontal, ChevronDown, Download } from "lucide-react";
import { CompanyService } from "../../../services/companyService";
import { auth } from "../../../firebaseConfig";

export default function Transactions() {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalCompleted: 0, totalAmount: 0 });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          setLoading(true);
          const dashboardData = await CompanyService.getDashboardData(user.uid);
          const transactionData = dashboardData.transactionHistory || [];
          setTransactions(transactionData);

          // Calculate stats
          const total = transactionData.reduce((sum, p) => {
            let val = 0;
            if (typeof p.amount === 'number') val = p.amount;
            else if (typeof p.amount === 'string') val = parseFloat(p.amount.replace(/[^0-9.-]+/g, "")) || 0;
            return sum + val;
          }, 0);

          setStats({
            totalCompleted: transactionData.length,
            totalAmount: total
          });

        } catch (error) {
          console.error("Error fetching transactions:", error);
        } finally {
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleExportPDF = () => {
    alert(t('company_dashboard.export_pdf') + " - Coming soon!");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 lg:p-10">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">{t('company_dashboard.transaction_history', 'Transaction History')}</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {/* Total Spent */}
        <div>
          <h2 className="text-lg font-bold mb-2 text-black">{t('company_dashboard.dashboard_total_transactions', 'Total Transactions')}</h2>
          <div className="bg-white p-4 rounded-lg shadow-sm h-full">
            <div className="pb-2">
              <p className="text-sm sm:text-base">{t('company_dashboard.dashboard_completed_transactions', 'Completed Transactions')}</p>
              <h3 className="text-2xl sm:text-3xl font-bold pt-3">
                {stats.totalCompleted}
              </h3>
            </div>
          </div>
        </div>

        {/* Total Amount */}
        <div>
          <h2 className="text-lg font-bold mb-2 text-black">{t('company_dashboard.total_spent', 'Total Spent')}</h2>
          <div className="bg-white p-4 rounded-lg shadow-sm h-full">
            <span className="text-sm sm:text-base">{t('company_dashboard.amount', 'Amount')}</span>
            <h3 className="text-2xl sm:text-3xl font-bold pt-3 pb-2 border-b border-gray-200">
              {stats.totalAmount.toLocaleString()} GNF
            </h3>
          </div>
        </div>
      </div>

      {/* Filters and Actions Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-1 border border-gray-300 px-3 sm:px-4 py-2 rounded-md bg-white hover:bg-gray-100">
            {t('client_dashboard.payments.filters.date_range', 'Date Range')} <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-2">
          <button 
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            onClick={handleExportPDF}
          >
            <Download className="h-4 w-4" />
            {t('company_dashboard.export_pdf', 'Export PDF')}
          </button>
        </div>
      </div>

      {/* Activity Table Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="bg-gray-50 border border-gray-100">
              <th className="py-2 px-2 sm:px-4">{t('company_dashboard.date', 'Date')}</th>
              <th className="px-2 sm:px-4">{t('company_dashboard.product_service', 'Product / Service')}</th>
              <th className="px-2 sm:px-4">{t('company_dashboard.provider', 'Provider')}</th>
              <th className="px-2 sm:px-4">{t('company_dashboard.payment_method', 'Payment Method')}</th>
              <th className="px-2 sm:px-4">{t('company_dashboard.status', 'Status')}</th>
              <th className="text-right px-2 sm:px-4">{t('company_dashboard.amount', 'Amount')}</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => {
                let dateStr = "N/A";
                if (transaction.date) {
                  const d = typeof transaction.date === 'object' && transaction.date.seconds 
                    ? new Date(transaction.date.seconds * 1000) 
                    : new Date(transaction.date);
                  dateStr = d.toLocaleDateString();
                }

                return (
                  <tr key={transaction.id || Math.random()} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-2 sm:px-4">{dateStr}</td>
                    <td className="px-2 sm:px-4 font-medium">{transaction.product || transaction.service || 'N/A'}</td>
                    <td className="px-2 sm:px-4 text-gray-600">{transaction.freelancer || transaction.provider || 'N/A'}</td>
                    <td className="px-2 sm:px-4 text-gray-600">{transaction.paymentMethod || 'N/A'}</td>
                    <td className="px-2 sm:px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                        transaction.status === 'active' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {transaction.status || 'pending'}
                      </span>
                    </td>
                    <td className="text-right px-2 sm:px-4 font-semibold text-green-600">
                      {typeof transaction.amount === 'number' ? transaction.amount.toLocaleString() : transaction.amount} GNF
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="h-60 text-center">
                  <div className="flex flex-col items-center justify-center h-full">
                    <h3 className="text-lg font-bold mb-2">
                      {t('company_dashboard.no_transactions', 'No transactions found')}
                    </h3>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
