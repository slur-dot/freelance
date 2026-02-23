import React, { useState, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { AdminService } from "../../../services/adminService";
import { useTranslation } from "react-i18next";

export default function UserManagement() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("userName");
  const [sortDirection, setSortDirection] = useState("desc");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // AdminService returns { data: [...], lastDoc: ... }
      // For now, we fetch first 50. Pagination logic needs complete overhaul for Firestore (offset-based -> cursor-based).
      // We will fetch enough for simple display or implement simplified pagination.
      const result = await AdminService.getAllUsers(null, null, 100);
      setUsers(result.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Sample data - in a real app this would come from an API


  const itemsPerPage = 9; // Show 9 items per page as shown in the screenshot
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleBanUser = async (id) => {
    try {
      setLoading(true);
      await AdminService.updateUser(id, { isBanned: true, updatedAt: new Date() });
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, isBanned: true } : user)));
      setError(""); // Clear any previous errors
    } catch (e) {
      console.error("Error banning user:", e);
      setError(`Failed to ban user: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUnbanUser = async (id) => {
    try {
      setLoading(true);
      await AdminService.updateUser(id, { isBanned: false, updatedAt: new Date() });
      setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, isBanned: false } : user)));
      setError(""); // Clear any previous errors
    } catch (e) {
      console.error("Error unbanning user:", e);
      setError(`Failed to unban user: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.totalMoneySpent || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FCFCFD' }}>
      <div className="w-full">
        {/* Header */}
        <div className="p-6 pb-4" style={{ backgroundColor: '#FCFCFD' }}>
          <h1 className="text-4xl font-bold text-gray-800 mb-6">{t('admin_dashboard.user_management.title')}</h1>

          {/* Search Bar */}
          <div className="relative mx-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t('admin_dashboard.user_management.search_placeholder')}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-md focus:outline-none text-gray-700 placeholder-gray-500"
            />
            {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
            {loading && <div className="mt-2 text-sm text-gray-500">{t('common.loading')}</div>}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden mx-6 mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("displayName")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t('admin_dashboard.user_management.table.headers.name')}</span>
                      {sortField === "displayName" && (
                        <ChevronDown className={`h-4 w-4 transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('admin_dashboard.user_management.table.headers.completed_orders')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('admin_dashboard.user_management.table.headers.creation_date')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('admin_dashboard.user_management.table.headers.spent')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('admin_dashboard.user_management.table.headers.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-800">
                      <div className="flex flex-col">
                        <span>{user.fullName || user.displayName || user.userName || (user.firstName ? `${user.firstName} ${user.lastName || ''}` : null) || 'N/A'}</span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      {user.totalCompletedOrders || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      {user.createdAt?.seconds
                        ? new Date(user.createdAt.seconds * 1000).toLocaleDateString()
                        : (user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      ${user.totalMoneySpent || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      {user.isBanned ? (
                        <button
                          onClick={() => handleUnbanUser(user.id)}
                          disabled={loading}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? t('admin_dashboard.user_management.table.actions.processing') : t('admin_dashboard.user_management.table.actions.unban')}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBanUser(user.id)}
                          disabled={loading}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? t('admin_dashboard.user_management.table.actions.processing') : t('admin_dashboard.user_management.table.actions.ban')}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-200 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t('admin_dashboard.pagination.previous')}
              </button>

              <span className="text-sm font-medium text-gray-700">
                {t('admin_dashboard.pagination.page_info', { current: currentPage, total: totalPages })}
              </span>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t('admin_dashboard.pagination.next')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
