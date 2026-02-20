import React, { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { AdminService } from "../../../services/adminService";
import { useTranslation } from "react-i18next";

export default function ManageBookings() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("companyId");
  const [sortDirection, setSortDirection] = useState("desc");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const result = await AdminService.getAllBookings(null, 100);
      setBookings(result.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const itemsPerPage = 9; // Show 9 items per page as shown in the screenshot

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAccept = async (id) => {
    try {
      setLoading(true);
      // We assume AdminService has updateBooking or generic update
      // We will add updateBooking to AdminService next
      await AdminService.updateBooking(id, {
        status: "approved",
        updatedAt: new Date()
      });

      setBookings((prev) => prev.map((booking) => (booking.id === id ? { ...booking, status: "approved" } : booking)));
      setError(""); // Clear any previous errors
    } catch (e) {
      console.error("Error accepting booking:", e);
      setError(t('admin_dashboard.operations.booking_management.errors.accept_failed', { message: e.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleDeny = async (id) => {
    if (!window.confirm(t('admin_dashboard.operations.booking_management.actions.confirm_deny'))) {
      return;
    }

    try {
      setLoading(true);
      await AdminService.updateBooking(id, {
        status: "rejected",
        updatedAt: new Date()
      });

      setBookings((prev) => prev.map((booking) => (booking.id === id ? { ...booking, status: "rejected" } : booking)));
      setError(""); // Clear any previous errors
    } catch (e) {
      console.error("Error denying booking:", e);
      setError(t('admin_dashboard.operations.booking_management.errors.deny_failed', { message: e.message }));
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking =>
    (booking.clientName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (booking.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full">
        {/* Header */}
        <div className="p-6 pb-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">{t('admin_dashboard.operations.booking_management.title')}</h1>

          {/* Search Bar */}
          <div className="relative mx-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t('admin_dashboard.operations.booking_management.search_placeholder')}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-md focus:outline-none text-gray-700 placeholder-gray-500"
            />
            {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
            {loading && <div className="mt-2 text-sm text-gray-500">Loading...</div>}
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden mx-6 mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("clientName")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t('admin_dashboard.operations.booking_management.table.headers.client_name')}</span>
                      {sortField === "clientName" && (
                        <ChevronDown className={`h-4 w-4 transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('admin_dashboard.operations.booking_management.table.headers.description')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('admin_dashboard.operations.booking_management.table.headers.bidding_date')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('admin_dashboard.operations.booking_management.table.headers.amount')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('admin_dashboard.operations.booking_management.table.headers.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-800">
                      {booking.clientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      {booking.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      {booking.biddingDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      {booking.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      <div className="flex items-center space-x-3">
                        {booking.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => handleAccept(booking.id)}
                              disabled={loading}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {t('admin_dashboard.operations.booking_management.actions.accept')}
                            </button>
                            <button
                              onClick={() => handleDeny(booking.id)}
                              disabled={loading}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {t('admin_dashboard.operations.booking_management.actions.deny')}
                            </button>
                          </>
                        ) : (
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                              }`}
                          >
                            {t(`admin_dashboard.operations.booking_management.actions.status.${booking.status || 'pending'}`)}
                          </span>
                        )}
                      </div>
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
