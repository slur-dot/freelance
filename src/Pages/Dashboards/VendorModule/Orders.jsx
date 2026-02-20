import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, ChevronDown, Trash2, Edit } from "lucide-react";
import { OrderService } from "../../../services/orderService";
import { auth } from "../../../firebaseConfig";

export default function Orders() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editOrder, setEditOrder] = useState(null);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const loadOrders = React.useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError("");
      // Fetch all orders for the vendor
      const fetchedOrders = await OrderService.getSellerOrders(user.uid);
      setOrders(fetchedOrders);
    } catch (e) {
      console.error("Error loading orders:", e);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const removeOrder = async (orderId) => {
    if (!window.confirm(t('vendor_dashboard.orders.delete_confirm'))) return;
    try {
      await OrderService.deleteOrder(orderId);
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (e) {
      setError(e.message);
      alert("Failed to delete order");
    }
  };

  const saveOrder = async (e) => {
    e?.preventDefault();
    try {
      await OrderService.updateOrder(editOrder.id, {
        buyerName: editOrder.buyerName,
        product: editOrder.product,
        quantity: Number(editOrder.quantity || 1),
        status: editOrder.status,
        totalAmount: Number(editOrder.totalAmount || 0)
      });

      setOrders(prev => prev.map(o => o.id === editOrder.id ? { ...o, ...editOrder } : o));
      setEditOrder(null);
    } catch (e) {
      setError(e.message);
      alert("Failed to update order");
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

  const getStatusStyles = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      case "pending": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      case "pending": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Filter & Sort
  const filteredOrders = orders.filter(order =>
    (order.buyerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.product || '').toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    // Handle dates
    if (sortField === 'createdAt') {
      const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(0);
      const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(0);
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    }

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Client-side Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div className="min-h-screen bg-gray-100 p-6">Loading...</div>;
  if (error) return <div className="min-h-screen bg-gray-100 p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('vendor_dashboard.orders.title')}</h1>
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t('vendor_dashboard.orders.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("buyerName")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t('vendor_dashboard.orders.table.buyer')}</span>
                      {sortField === "buyerName" && (
                        <ChevronDown className={`h-4 w-4 transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('vendor_dashboard.orders.table.product')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('vendor_dashboard.orders.table.quantity')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('vendor_dashboard.orders.table.price')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort("createdAt")}>
                    <div className="flex items-center space-x-1">
                      <span>{t('vendor_dashboard.orders.table.created_at')}</span>
                      {sortField === "createdAt" && (
                        <ChevronDown className={`h-4 w-4 transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('vendor_dashboard.orders.table.status')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('vendor_dashboard.orders.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.buyerName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.product || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.quantity || 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.totalAmount ? `${order.totalAmount} GNF` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(order.status)}`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${getStatusIcon(order.status)}`}></span>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center space-x-3">
                        <button className="text-gray-400 hover:text-red-500 transition-colors" onClick={() => removeOrder(order.id)}>
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <button className="text-gray-400 hover:text-blue-500 transition-colors" onClick={() => setEditOrder({
                          id: order.id,
                          buyerName: order.buyerName || '',
                          product: order.product || '',
                          quantity: order.quantity || 1,
                          status: order.status,
                          totalAmount: order.totalAmount || 0
                        })}>
                          <Edit className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedOrders.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">{t('vendor_dashboard.orders.no_orders')}</td>
                  </tr>
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
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {editOrder && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">{t('vendor_dashboard.orders.edit_modal.title')}</h2>
            <form onSubmit={saveOrder} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">{t('vendor_dashboard.orders.edit_modal.buyer')}</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={editOrder.buyerName}
                  onChange={e => setEditOrder({ ...editOrder, buyerName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">{t('vendor_dashboard.orders.edit_modal.product')}</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={editOrder.product}
                  onChange={e => setEditOrder({ ...editOrder, product: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">{t('vendor_dashboard.orders.edit_modal.quantity')}</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={editOrder.quantity}
                  onChange={e => setEditOrder({ ...editOrder, quantity: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">{t('vendor_dashboard.orders.edit_modal.status')}</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={editOrder.status}
                  onChange={e => setEditOrder({ ...editOrder, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">{t('vendor_dashboard.orders.edit_modal.total_amount')}</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-2"
                  value={editOrder.totalAmount}
                  onChange={e => setEditOrder({ ...editOrder, totalAmount: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" className="px-4 py-2 border rounded" onClick={() => setEditOrder(null)}>{t('vendor_dashboard.orders.edit_modal.cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">{t('vendor_dashboard.orders.edit_modal.save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}