import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, Trash2, Edit } from "lucide-react";
import { PayoutService } from "../../../services/payoutService";
import { auth } from "../../../firebaseConfig";

export default function Payouts() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editPayout, setEditPayout] = useState(null);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const loadPayouts = React.useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError("");
      const fetchedPayouts = await PayoutService.getSellerPayouts(user.uid);
      setPayouts(fetchedPayouts);
    } catch (e) {
      console.error("Error loading payouts:", e);
      setError("Failed to load payouts.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPayouts();
  }, [loadPayouts]);

  const removePayout = async (payoutId) => {
    if (!window.confirm(t('vendor_dashboard.payouts.delete_confirm'))) return;
    try {
      await PayoutService.deletePayout(payoutId);
      setPayouts(prev => prev.filter(p => p.id !== payoutId));
    } catch (e) {
      setError(e.message);
      alert("Failed to delete payout");
    }
  };

  const savePayout = async (e) => {
    e?.preventDefault();
    try {
      await PayoutService.updatePayout(editPayout.id, {
        status: editPayout.status,
        amount: Number(editPayout.amount || 0),
        method: editPayout.method
      });
      setPayouts(prev => prev.map(p => p.id === editPayout.id ? { ...p, ...editPayout, amount: Number(editPayout.amount) } : p));
      setEditPayout(null);
    } catch (e) {
      setError(e.message);
      alert("Failed to update payout");
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredPayouts = payouts.filter(p =>
    String(p.amount || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(p.method || p.paymentMethod || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(p.status || '').toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (sortField === 'createdAt') {
      const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(0);
      const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(0);
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPayouts.length / itemsPerPage);
  const paginatedPayouts = filteredPayouts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div className="min-h-screen bg-gray-100 p-6">Loading...</div>;
  if (error) return <div className="min-h-screen bg-gray-100 p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full">
        {/* Header */}
        <div className="p-6 pb-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">{t('vendor_dashboard.payouts.title')}</h1>
          {/* Search Bar */}
          <div className="relative max-w-4xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t('vendor_dashboard.payouts.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Payouts Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden mx-6 mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('vendor_dashboard.payouts.table.amount')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('vendor_dashboard.payouts.table.method')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('vendor_dashboard.payouts.table.status')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-100" onClick={() => handleSort("createdAt")}>
                    {t('vendor_dashboard.payouts.table.created_at')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('vendor_dashboard.payouts.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedPayouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      {payout.amount ? `${payout.amount} GNF` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      {payout.method || payout.paymentMethod || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      {payout.status ? t(`vendor_dashboard.payouts.status.${payout.status.toLowerCase()}`, payout.status) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      {payout.createdAt?.seconds ? new Date(payout.createdAt.seconds * 1000).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      <div className="flex items-center space-x-3">
                        <button className="text-gray-400 hover:text-red-500 transition-colors" onClick={() => removePayout(payout.id)}>
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <button className="text-gray-400 hover:text-blue-500 transition-colors" onClick={() => setEditPayout({ id: payout.id, status: payout.status, amount: payout.amount, method: payout.method || payout.paymentMethod })}>
                          <Edit className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedPayouts.length === 0 && (
                  <tr><td colSpan={5} className="text-center p-4 text-gray-500">{t('vendor_dashboard.payouts.no_payouts')}</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t('vendor_dashboard.payouts.pagination.previous')}
              </button>
              <span className="text-sm font-medium text-gray-700">
                {t('vendor_dashboard.payouts.pagination.page_of', { current: currentPage, total: totalPages || 1 })}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t('vendor_dashboard.payouts.pagination.next')}
              </button>
            </div>
          </div>
        </div>
      </div>
      {editPayout && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">{t('vendor_dashboard.payouts.edit_modal.title')}</h2>
            <form onSubmit={savePayout} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">{t('vendor_dashboard.payouts.edit_modal.status')}</label>
                <select className="w-full border rounded px-3 py-2" value={editPayout.status} onChange={e => setEditPayout({ ...editPayout, status: e.target.value })}>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">{t('vendor_dashboard.payouts.edit_modal.amount')}</label>
                <input type="number" className="w-full border rounded px-3 py-2" value={editPayout.amount || 0} onChange={e => setEditPayout({ ...editPayout, amount: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">{t('vendor_dashboard.payouts.edit_modal.method')}</label>
                <input className="w-full border rounded px-3 py-2" value={editPayout.method || ''} onChange={e => setEditPayout({ ...editPayout, method: e.target.value })} />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="px-4 py-2 border rounded" onClick={() => setEditPayout(null)}>{t('vendor_dashboard.payouts.edit_modal.cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">{t('vendor_dashboard.payouts.edit_modal.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
