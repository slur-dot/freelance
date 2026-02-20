import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Trash2, Plus, X } from "lucide-react";
import { AdminService } from "../../../services/adminService";
import { useTranslation } from "react-i18next";

export default function AdvertisementManagement() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("adTitle");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAd, setDeletingAd] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [advertisements, setAdvertisements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    cta: ""
  });

  const fetchAdvertisements = async () => {
    try {
      setLoading(true);
      const result = await AdminService.getAllAds(null, 100);
      setAdvertisements(result.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvertisements();
  }, []);

  const itemsPerPage = 9; // Show 9 items per page as shown in the screenshot
  const totalPages = Math.ceil(advertisements.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = (id) => {
    const ad = advertisements.find(ad => ad.id === id);
    setDeletingAd(ad);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingAd(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await AdminService.deleteAd(deletingAd.id);

      // Optimistic update
      setAdvertisements(prev => prev.filter(ad => ad.id !== deletingAd.id));

      setToastMessage(t('admin_dashboard.ad_management.toasts.deleted'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (e) {
      setError(e.message);
      // Re-fetch to sync if failed or to be safe
      fetchAdvertisements();
    }
    handleCloseDeleteModal();
  };

  const handleActivate = async (id) => {
    try {
      await AdminService.updateAd(id, { status: "Active" });

      setAdvertisements(prev => prev.map(ad => ad.id === id ? { ...ad, status: "Active" } : ad));

      setToastMessage(t('admin_dashboard.ad_management.toasts.activated'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await AdminService.updateAd(id, { status: "Inactive" });

      setAdvertisements(prev => prev.map(ad => ad.id === id ? { ...ad, status: "Inactive" } : ad));

      setToastMessage(t('admin_dashboard.ad_management.toasts.deactivated'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleAddNewAd = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setFormData({ title: "", subtitle: "", cta: "" });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AdminService.createAd({
        image: "placeholder",
        adTitle: formData.title,
        adSubtitle: formData.subtitle,
        cta: formData.cta,
        status: "Active"
      });
      fetchAdvertisements();
      setToastMessage(t('admin_dashboard.ad_management.toasts.added'));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (e) {
      setError(e.message);
    }
    handleCloseAddModal();
  };

  const getStatusPillColor = (status) => {
    if (status === "Active") {
      return "bg-green-100 text-green-800";
    } else {
      return "bg-red-100 text-red-800";
    }
  };

  const getStatusDotColor = (status) => {
    if (status === "Active") {
      return "bg-green-500";
    } else {
      return "bg-red-500";
    }
  };

  const filteredAds = advertisements.filter(ad =>
    (ad.adTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ad.adSubtitle || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAds = filteredAds.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-gray-800">{t('admin_dashboard.ad_management.title')}</h1>
            <button
              onClick={handleAddNewAd}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              {t('admin_dashboard.ad_management.add_button')}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mx-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t('admin_dashboard.ad_management.search_placeholder')}
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

        {/* Advertisements Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden mx-6 mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('admin_dashboard.ad_management.table.headers.image')}
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("type")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t('admin_dashboard.ad_management.table.headers.title')}</span>
                      {sortField === "type" && (
                        <ChevronDown className={`h-4 w-4 transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('admin_dashboard.ad_management.table.headers.subtitle')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('admin_dashboard.ad_management.table.headers.cta')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('admin_dashboard.ad_management.table.headers.status')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('admin_dashboard.ad_management.table.headers.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedAds.map((ad) => (
                  <tr key={ad.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-800">
                      {ad.image}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      {ad.adTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      {ad.adSubtitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      {ad.cta}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusDotColor(ad.status)}`}></div>
                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusPillColor(ad.status)}`}>
                          {ad.status === "Active" ? t('admin_dashboard.ad_management.actions.activate') : (ad.status === "Inactive" ? t('admin_dashboard.ad_management.actions.deactivate') : ad.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleDelete(ad.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete Advertisement"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        {ad.status === "Active" ? (
                          <button
                            onClick={() => handleDeactivate(ad.id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            {t('admin_dashboard.ad_management.actions.deactivate')}
                          </button>
                        ) : (
                          <button
                            onClick={() => handleActivate(ad.id)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            {t('admin_dashboard.ad_management.actions.activate')}
                          </button>
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

      {/* Add Advertisement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('admin_dashboard.ad_management.modals.add.title')}</h2>
              <p className="text-gray-600">{t('admin_dashboard.ad_management.modals.add.subtitle')}</p>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
              <div className="flex items-center">
                <label className="w-20 text-sm font-medium text-gray-700">{t('admin_dashboard.ad_management.modals.add.form.title')}</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder={t('admin_dashboard.ad_management.modals.add.form.placeholders.title')}
                  className="flex-1 ml-4 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Subtitle Field */}
              <div className="flex items-start">
                <label className="w-20 text-sm font-medium text-gray-700 mt-2">{t('admin_dashboard.ad_management.modals.add.form.subtitle')}</label>
                <textarea
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange("subtitle", e.target.value)}
                  placeholder={t('admin_dashboard.ad_management.modals.add.form.placeholders.subtitle')}
                  rows={3}
                  className="flex-1 ml-4 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  required
                />
              </div>

              {/* CTA Field */}
              <div className="flex items-center">
                <label className="w-20 text-sm font-medium text-gray-700">{t('admin_dashboard.ad_management.modals.add.form.cta')}</label>
                <input
                  type="text"
                  value={formData.cta}
                  onChange={(e) => handleInputChange("cta", e.target.value)}
                  placeholder={t('admin_dashboard.ad_management.modals.add.form.placeholders.cta')}
                  className="flex-1 ml-4 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md transition-colors"
                >
                  {t('admin_dashboard.ad_management.modals.add.submit')}
                </button>
              </div>
            </form>

            {/* Close Button */}
            <button
              onClick={handleCloseAddModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingAd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('admin_dashboard.ad_management.modals.delete.title')}</h2>
              <p className="text-gray-600">{t('admin_dashboard.ad_management.modals.delete.message')}</p>
            </div>

            {/* Advertisement Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-800 font-medium">{deletingAd.adTitle}</p>
              <p className="text-gray-600 text-sm">{deletingAd.adSubtitle}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleCloseDeleteModal}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md transition-colors"
              >
                {t('admin_dashboard.ad_management.modals.delete.cancel')}
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
              >
                {t('admin_dashboard.ad_management.modals.delete.confirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right duration-300">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
