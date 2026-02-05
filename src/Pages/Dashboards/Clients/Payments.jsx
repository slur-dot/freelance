import React, { useState, useEffect } from "react";
import { Info, FileText, MoreHorizontal, ChevronDown } from "lucide-react";
import { ClientService } from "../../../services/clientService";
import { auth } from "../../../firebaseConfig";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalCompleted: 0, upcoming: 0, totalAmount: 0 });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          setLoading(true);
          const paymentData = await ClientService.getPayments(user.uid);
          setPayments(paymentData);

          // Calculate stats
          const total = paymentData.reduce((sum, p) => {
            // Clean string if needed
            let val = 0;
            if (typeof p.amount === 'number') val = p.amount;
            else if (typeof p.amount === 'string') val = parseFloat(p.amount.replace(/[^0-9.-]+/g, "")) || 0;
            return sum + val;
          }, 0);

          setStats({
            totalCompleted: paymentData.length,
            upcoming: 0, // Placeholder
            totalAmount: total
          });

        } catch (error) {
          console.error("Error fetching payments:", error);
        } finally {
          setLoading(false);
        }
      }
    });
    return () => unsubscribe();
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8 lg:p-10">
      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Earnings</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
        {/* Available Funds */}
        <div>
          <h2 className="text-lg font-bold mb-2 text-black">Total Payments</h2>
          <div className="bg-white p-4 rounded-lg shadow-sm h-[1/2]">
            <div className="pb-2">
              <p className="text-sm sm:text-base">Total Payments Completed</p>
              <h3 className="text-2xl sm:text-3xl font-bold pt-5">
                {stats.totalAmount.toLocaleString()} GNF
              </h3>
            </div>
          </div>
        </div>

        {/* Future Payments */}
        <div>
          <h2 className="text-lg font-bold mb-2 text-black">Last Month</h2>
          <div className="bg-white p-4 rounded-lg shadow-sm h-full">
            <span className="text-sm sm:text-base">Payments</span>
            <h3 className="text-2xl sm:text-3xl font-bold pt-3 pb-2 border-b border-gray-200">
              0 GNF
            </h3>
            <div className="space-y-2 mt-2 text-sm text-gray-600">
              <p className="text-xs text-gray-500">Based on recent activity</p>
            </div>
          </div>
        </div>

        {/* Earnings & Expenses */}
        <div>
          <h2 className="text-lg font-bold mb-2 text-black">
            Summary
          </h2>
          <div className="bg-white p-4 rounded-lg shadow-sm h-full">
            <span className="text-sm sm:text-base">Transactions</span>
            <h3 className="text-3xl sm:text-4xl font-bold">{stats.totalCompleted}</h3>
            <div className="space-y-2 mt-2 text-sm text-gray-600">
              <p className="text-xs text-gray-500">
                Total completed transactions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-1 border border-gray-300 px-3 sm:px-4 py-2 rounded-md bg-white hover:bg-gray-100">
            Date range <ChevronDown className="h-4 w-4" />
          </button>
          <button className="flex items-center gap-1 border border-gray-300 px-3 sm:px-4 py-2 rounded-md bg-white hover:bg-gray-100">
            Activity <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-2">
          <button className="border border-gray-300 p-2 rounded-md bg-white hover:bg-gray-100">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Info Text */}
      <div className="text-sm text-gray-500 mb-4">Showing 0 results.</div>

      {/* Activity Table Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="bg-gray-50 border border-gray-100">
              <th className="py-2 px-2 sm:px-4">Date</th>
              <th className="px-2 sm:px-4">Activity</th>
              <th className="px-2 sm:px-4">Description</th>
              <th className="px-2 sm:px-4">From</th>
              <th className="px-2 sm:px-4">Order</th>
              <th className="text-right px-2 sm:px-4">Amount</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-2 sm:px-4">{payment.date}</td>
                  <td className="px-2 sm:px-4">{payment.activity}</td>
                  <td className="px-2 sm:px-4 truncate max-w-[150px]">{payment.description}</td>
                  <td className="px-2 sm:px-4">{payment.from}</td>
                  <td className="px-2 sm:px-4">{payment.order}</td>
                  <td className="text-right px-2 sm:px-4 font-semibold">{typeof payment.amount === 'number' ? payment.amount.toLocaleString() + ' GNF' : payment.amount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="h-60 text-center">
                  <div className="flex flex-col items-center justify-center h-full">
                    <h3 className="text-lg font-bold mb-2">
                      No Payments Yet
                    </h3>
                    <p className="text-sm text-gray-600 w-full">
                      Your payment history will appear here once you make purchases.
                    </p>
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
