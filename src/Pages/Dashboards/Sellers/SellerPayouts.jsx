import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Trash2, Edit, Loader2, DollarSign } from "lucide-react";
import { PayoutService } from "../../../services/payoutService";
import { auth } from "../../../firebaseConfig";

export default function SellerPayouts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("amount");
  const [sortDirection, setSortDirection] = useState("desc");
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPayout, setEditingPayout] = useState(null);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchPayouts();
    fetchStats();
  }, [user, currentPage, searchTerm]);

  const fetchPayouts = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      // Fetch all for client side filtering/pagination
      const data = await PayoutService.getSellerPayouts(user.uid);
      setPayouts(data || []);
    } catch (err) {
      setError(`Failed to load payouts: ${err.message}`);
      console.error('Error fetching payouts:', err);
      setPayouts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!user) return;
    try {
      const statsData = await PayoutService.getPayoutStats(user.uid);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching payout stats:', err);
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
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      case "failed":
        return "Failed";
      default:
        return "Unknown";
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const formatPrice = (price) => {
    return price ? `${price.toLocaleString()} GNF` : "N/A";
  };

  const handleEditPayout = (payout) => {
    setEditingPayout(payout);
    setShowEditModal(true);
  };

  const handleDeletePayout = async (payoutId) => {
    if (window.confirm('Are you sure you want to delete this payout?')) {
      try {
        await PayoutService.deletePayout(payoutId);
        alert('Payout deleted successfully!');
        setPayouts(prev => prev.filter(p => p.id !== payoutId));
      } catch (error) {
        console.error('Error deleting payout:', error);
        alert('Failed to delete payout. Please try again.');
      }
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingPayout(null);
  };

  const handleUpdate = async () => {
    try {
      await PayoutService.updatePayout(editingPayout.id, {
        amount: editingPayout.amount,
        paymentMethod: editingPayout.paymentMethod,
        paymentNumber: editingPayout.paymentNumber,
        status: editingPayout.status
      });

      alert('Payout updated successfully!');
      fetchPayouts();
      fetchStats();
      handleCloseEditModal();
    } catch (error) {
      console.error('Error updating payout:', error);
      alert('Failed to update payout. Please try again.');
    }
  };

  const filteredPayouts = payouts.filter(payout =>
    (payout.paymentMethod?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (payout.status?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    const aValue = a[sortField] || 0;
    const bValue = b[sortField] || 0;
    if (sortDirection === 'asc') return aValue > bValue ? 1 : -1;
    return aValue < bValue ? 1 : -1;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600">Loading payouts...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full">
        {/* Header */}
        <div className="p-6 pb-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Payouts</h1>

          {error && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-yellow-700 text-sm">
                ⚠️ {error}
              </p>
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Payouts</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.total || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.completed || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-yellow-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.pending || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Amount</p>
                  <p className="text-lg font-semibold text-gray-900">{formatPrice(stats.totalAmount)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-4xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search payouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Payouts Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden mx-6 mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Amount</span>
                      {sortField === "amount" && (
                        <ChevronDown className={`h-4 w-4 transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Payment Method
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Payment Number
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Processed Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayouts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      {payouts.length === 0 ? (
                        <div>
                          <p className="text-lg font-medium mb-2">No payouts found</p>
                          <p className="text-sm">Payouts will appear here once you start earning from sales.</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg font-medium mb-2">No payouts match your search</p>
                          <p className="text-sm">Try adjusting your search terms.</p>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredPayouts.map((payout) => (
                    <tr key={payout.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-800">
                        {formatPrice(payout.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                        {payout.paymentMethod || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                        {payout.paymentNumber || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles(payout.status)}`}>
                          <span className={`w-2 h-2 rounded-full mr-2 ${getStatusIcon(payout.status)}`}></span>
                          {getStatusText(payout.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                        {formatDate(payout.processedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleDeletePayout(payout.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete Payout"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEditPayout(payout)}
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                            title="Edit Payout"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Payout Modal */}
        {showEditModal && editingPayout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Edit Payout</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payout ID</label>
                  <input
                    type="text"
                    value={editingPayout.id || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (GNF)</label>
                  <input
                    type="number"
                    value={editingPayout.amount || ''}
                    onChange={(e) => setEditingPayout({ ...editingPayout, amount: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    value={editingPayout.paymentMethod || ''}
                    onChange={(e) => setEditingPayout({ ...editingPayout, paymentMethod: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="OM">OM</option>
                    <option value="MoMo">MoMo</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Number</label>
                  <input
                    type="text"
                    value={editingPayout.paymentNumber || ''}
                    onChange={(e) => setEditingPayout({ ...editingPayout, paymentNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter payment number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editingPayout.status || ''}
                    onChange={(e) => setEditingPayout({ ...editingPayout, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Processed Date (Read Only)</label>
                  <input
                    type="text"
                    value={editingPayout.processedAt && editingPayout.processedAt.seconds ?
                      new Date(editingPayout.processedAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleUpdate}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Update Payout
                </button>
                <button
                  onClick={handleCloseEditModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
