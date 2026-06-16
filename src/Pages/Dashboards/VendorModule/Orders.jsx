import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, ChevronDown, Trash2, Edit, CheckCircle, MessageSquare } from "lucide-react";
import { OrderService } from "../../../services/orderService";
import { VendorService } from "../../../services/vendorService";
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

  const [user, setUser] = useState(auth.currentUser);
  const [vendorData, setVendorData] = useState(null);

  // Modals state
  const [acceptingOrder, setAcceptingOrder] = useState(null);
  const [assignedSerials, setAssignedSerials] = useState([]);
  const [updatingStatusOrder, setUpdatingStatusOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const loadData = React.useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError("");

      const fetchedOrders = await OrderService.getSellerOrders(user.uid);
      setOrders(fetchedOrders);

      const vData = await VendorService.getVendorProfile(user.uid);
      setVendorData(vData);

    } catch (e) {
      console.error("Error loading orders:", e);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const removeOrder = async (orderId) => {
    if (!window.confirm(t('vendor_dashboard.orders.delete_confirm', 'Are you sure you want to delete this order?'))) return;
    try {
      await OrderService.deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (e) {
      setError(e.message);
      alert(t("failed_to_delete_order_843", "Failed to delete order"));
    }
  };

  const handleAcceptClick = (order) => {
    const quantity = order.quantity || 1;
    let initialSerials = Array(quantity).fill("");

    // Auto-assign logic for verified vendors
    if (vendorData?.status?.verified) {
      const savedSerialsStr = localStorage.getItem('vendorSerialNumbers');
      if (savedSerialsStr) {
        const savedSerials = JSON.parse(savedSerialsStr);
        // Find available serials that roughly match the product name or just any available if no strict matching
        const available = savedSerials.filter((s) => s.status === 'Available');

        let assignedCount = 0;
        initialSerials = initialSerials.map(() => {
          if (assignedCount < available.length) {
            const assigned = available[assignedCount].serialNumber;
            assignedCount++;
            return assigned;
          }
          return "";
        });
      }
    }

    setAssignedSerials(initialSerials);
    setAcceptingOrder(order);
  };

  const handleAcceptSubmit = async (e) => {
    e.preventDefault();
    // Validate uniqueness and completeness
    const filledSerials = assignedSerials.filter((s) => s.trim() !== "");
    if (filledSerials.length !== (acceptingOrder.quantity || 1)) {
      alert(t("please_provide_a_serial_number_for_each_item_in_th_825", "Please provide a serial number for each item in the order."));
      return;
    }
    const uniqueSerials = new Set(filledSerials);
    if (uniqueSerials.size !== filledSerials.length) {
      alert(t("serial_numbers_must_be_unique_687", "Serial numbers must be unique."));
      return;
    }

    try {
      await OrderService.updateOrder(acceptingOrder.id, {
        status: "accepted",
        assignedSerials: filledSerials
      });

      // Update local storage serials to "Sold" if they were auto-assigned
      const savedSerialsStr = localStorage.getItem('vendorSerialNumbers');
      if (savedSerialsStr) {
        let savedSerials = JSON.parse(savedSerialsStr);
        savedSerials = savedSerials.map((s) => {
          if (filledSerials.includes(s.serialNumber)) {
            return { ...s, status: "Sold" };
          }
          return s;
        });
        localStorage.setItem('vendorSerialNumbers', JSON.stringify(savedSerials));
      }

      setOrders((prev) => prev.map((o) => o.id === acceptingOrder.id ? { ...o, status: "accepted", assignedSerials: filledSerials } : o));
      setAcceptingOrder(null);
      alert(t("order_accepted_and_serials_locked_successfully_947", "Order accepted and serials locked successfully."));
    } catch (err) {
      alert(t("failed_to_accept_order_217", "Failed to accept order"));
    }
  };

  const handleUpdateStatusSubmit = async (e) => {
    e.preventDefault();
    if (!newStatus) return;
    try {
      await OrderService.updateOrderStatus(updatingStatusOrder.id, newStatus);
      setOrders((prev) => prev.map((o) => o.id === updatingStatusOrder.id ? { ...o, status: newStatus } : o));
      setUpdatingStatusOrder(null);
    } catch (err) {
      alert(t("failed_to_update_status_213", "Failed to update status"));
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
      case "completed":return "bg-green-100 text-green-800 border-green-200";
      case "accepted":return "bg-blue-100 text-blue-800 border-blue-200";
      case "in_progress":return "bg-purple-100 text-purple-800 border-purple-200";
      case "cancelled":return "bg-red-100 text-red-800 border-red-200";
      case "pending":return "bg-orange-100 text-orange-800 border-orange-200";
      default:return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":return "bg-green-500";
      case "accepted":return "bg-blue-500";
      case "in_progress":return "bg-purple-500";
      case "cancelled":return "bg-red-500";
      case "pending":return "bg-orange-500";
      default:return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    if (!status) return t('vendor_dashboard.orders.status.unknown', 'Unknown');
    const displayStatus = status === 'in_progress' ? 'In progress' : status.charAt(0).toUpperCase() + status.slice(1);
    return t(`vendor_dashboard.orders.status.${status}`, displayStatus);
  };

  // Filter & Sort
  const filteredOrders = orders.filter((order) =>
  (order.buyerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
  (order.product || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
  (order.id || '').toLowerCase().includes(searchTerm.toLowerCase())
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

  // Client-side Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div className="min-h-screen bg-gray-100 p-6">{t("loading_438", "Loading...")}</div>;
  if (error) return <div className="min-h-screen bg-gray-100 p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('vendor_dashboard.orders.title', 'Orders')}</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t('vendor_dashboard.orders.search_placeholder', 'Search by Buyer, Product, or Order ID')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("order_id_394", "Order ID")}
                  </th>
                  <th
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("buyerName")}>
                    
                    <div className="flex items-center space-x-1">
                      <span>{t('vendor_dashboard.orders.table.buyer', 'Buyer')}</span>
                      {sortField === "buyerName" &&
                      <ChevronDown className={`h-4 w-4 transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      }
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('vendor_dashboard.orders.table.product', 'Product')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('vendor_dashboard.orders.table.quantity', 'Qty')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('vendor_dashboard.orders.table.price', 'Total Amount')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort("createdAt")}>
                    <div className="flex items-center space-x-1">
                      <span>{t('vendor_dashboard.orders.table.created_at', 'Date')}</span>
                      {sortField === "createdAt" &&
                      <ChevronDown className={`h-4 w-4 transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      }
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('vendor_dashboard.orders.table.status', 'Status')}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('vendor_dashboard.orders.table.actions', 'Actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedOrders.map((order) =>
                <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id.substring(0, 8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.buyerName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.product || '-'}
                      {order.assignedSerials && order.assignedSerials.length > 0 &&
                    <div className="text-xs text-gray-500 mt-1">{t("sn_329", "SN:")} {order.assignedSerials.join(', ')}</div>
                    }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.quantity || 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
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
                      <div className="flex items-center space-x-2">
                        {order.status === 'pending' &&
                      <button
                        className="flex items-center gap-1 text-green-600 hover:text-green-700 font-medium px-2 py-1 rounded hover:bg-green-50 transition-colors text-xs"
                        onClick={() => handleAcceptClick(order)}>
                        
                            <CheckCircle className="w-3.5 h-3.5" />
                            {t("accept_331", "Accept")}
                          </button>
                      }
                        {(order.status === 'accepted' || order.status === 'in_progress') &&
                      <button
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors text-xs"
                        onClick={() => {
                          setUpdatingStatusOrder(order);
                          setNewStatus(order.status);
                        }}>
                        
                            <Edit className="w-3.5 h-3.5" />
                            {t("status_658", "Status")}
                          </button>
                      }
                        <button
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-900 font-medium px-2 py-1 rounded hover:bg-gray-100 transition-colors text-xs"
                        onClick={() => alert(`Opening chat for order ${order.id.substring(0, 8).toUpperCase()}...`)}>
                        
                          <MessageSquare className="w-3.5 h-3.5" />
                          {t("message_667", "Message")}
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
                {paginatedOrders.length === 0 &&
                <tr>
                    <td colSpan="8" className="px-6 py-4 text-center text-gray-500">{t('vendor_dashboard.orders.no_orders', 'No orders found.')}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
                
                {t('vendor_dashboard.orders.pagination.previous', 'Previous')}
              </button>
              <span className="text-sm text-gray-700">
                {t('vendor_dashboard.orders.pagination.page_of', { current: currentPage, total: totalPages || 1 })}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
                
                {t('vendor_dashboard.orders.pagination.next', 'Next')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accept Order Modal */}
      {acceptingOrder &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">{t("accept_order_185", "Accept Order")}</h2>
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg text-sm mb-4">
              {t("you_must_provide_71", "You must provide")} <strong>{acceptingOrder.quantity || 1} {t("unique_serial_numbers_134", "unique serial number(s)")}</strong> {t("to_accept_this_order_these_will_be_locked_and_sha_263", "to accept this order. These will be locked and shared with the buyer.")}
            </div>
            <form onSubmit={handleAcceptSubmit} className="space-y-4">
              {assignedSerials.map((serial, index) =>
            <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("serial_number_260", "Serial Number")} {index + 1}
                  </label>
                  <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                value={serial}
                onChange={(e) => {
                  const newSerials = [...assignedSerials];
                  newSerials[index] = e.target.value;
                  setAssignedSerials(newSerials);
                }}
                placeholder={t("enter_or_scan_sn_332", "Enter or scan SN")} />
              
                </div>
            )}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50" onClick={() => setAcceptingOrder(null)}>{t("cancel_523", "Cancel")}</button>
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium">{t("confirm_accept_758", "Confirm & Accept")}</button>
              </div>
            </form>
          </div>
        </div>
      }

      {/* Update Status Modal */}
      {updatingStatusOrder &&
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-xl font-bold mb-4">{t("update_order_status_207", "Update Order Status")}</h2>
            <form onSubmit={handleUpdateStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t("new_status_458", "New Status")}</label>
                <select
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}>
                
                  <option value="accepted">{t("accepted_482", "Accepted")}</option>
                  <option value="in_progress">{t("in_progress_806", "In Progress")}</option>
                  <option value="completed">{t("completed_446", "Completed")}</option>
                  <option value="cancelled">{t("cancelled_1", "Cancelled")}</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50" onClick={() => setUpdatingStatusOrder(null)}>{t("cancel_906", "Cancel")}</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">{t("update_635", "Update")}</button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>);

}