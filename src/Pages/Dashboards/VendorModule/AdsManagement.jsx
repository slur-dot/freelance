import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, ChevronDown, Trash2, Plus, Upload } from "lucide-react";
import { AdService } from "../../../services/adService";
import { auth } from "../../../firebaseConfig";

export default function AdsManagement() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("adTitle");
  const [sortDirection, setSortDirection] = useState("desc");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", subtitle: "", cta: "", type: "banner" });
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(auth.currentUser);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const loadAds = React.useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError("");
      const fetchedAds = await AdService.getSellerAds(user.uid);
      setAds(fetchedAds);
    } catch (e) {
      console.error("Error loading ads:", e);
      setError("Failed to load advertisements.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadAds();
  }, [loadAds]);

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
      case "active": return "bg-green-500 text-white";
      case "inactive": return "bg-red-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active": return "bg-green-600";
      case "inactive": return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  const filteredAds = ads.filter(ad =>
    (ad.adTitle || ad.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ad.adSubtitle || ad.subtitle || '').toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => {
    const aVal = (a[sortField] || '').toString().toLowerCase();
    const bVal = (b[sortField] || '').toString().toLowerCase();

    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await AdService.createAd({
        sellerId: user.uid,
        title: formData.title,
        adTitle: formData.title,
        adSubtitle: formData.subtitle,
        cta: formData.cta,
        type: formData.type || 'banner',
        status: 'active'
      }, files); // Pass files to service

      setFormData({ title: "", subtitle: "", cta: "", type: "banner" });
      setFiles([]);
      setShowModal(false);
      loadAds();
    } catch (e) {
      setError(e.message);
      alert("Failed to create ad");
    }
  };

  const openModal = () => { setShowModal(true); };
  const closeModal = () => { setShowModal(false); setFormData({ title: "", subtitle: "", cta: "", type: "banner" }); setFiles([]); };

  const deleteAd = async (adId) => {
    if (!window.confirm(t('vendor_dashboard.ads.delete_confirm'))) return;
    try {
      await AdService.deleteAd(adId);
      setAds(prev => prev.filter(ad => ad.id !== adId));
    } catch (e) {
      setError(e.message);
      alert("Failed to delete ad");
    }
  };

  const toggleAd = async (adId, nextStatus) => {
    try {
      await AdService.updateAd(adId, { status: nextStatus });
      setAds(prev => prev.map(ad => ad.id === adId ? { ...ad, status: nextStatus } : ad));
    } catch (e) {
      setError(e.message);
      alert("Failed to update status");
    }
  };

  // Pagination
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredAds.length / itemsPerPage);
  const paginatedAds = filteredAds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <div className="min-h-screen bg-gray-100 p-6">Loading...</div>;
  if (error) return <div className="min-h-screen bg-gray-100 p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-gray-800">{t('vendor_dashboard.ads.title')}</h1>
            <button
              onClick={openModal}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              {t('vendor_dashboard.ads.add_btn')}
            </button>
          </div>
          {/* Search Bar */}
          <div className="relative max-w-4xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={t('vendor_dashboard.ads.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Ads Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden mx-6 mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('vendor_dashboard.ads.table.image')}
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("adTitle")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t('vendor_dashboard.ads.table.title')}</span>
                      {sortField === "adTitle" && (
                        <ChevronDown className={`h-4 w-4 transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("adSubtitle")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t('vendor_dashboard.ads.table.subtitle')}</span>
                      {sortField === "adSubtitle" && (
                        <ChevronDown className={`h-4 w-4 transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("cta")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{t('vendor_dashboard.ads.table.cta')}</span>
                      {sortField === "cta" && (
                        <ChevronDown className={`h-4 w-4 transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('vendor_dashboard.ads.table.status')}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {t('vendor_dashboard.ads.table.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedAds.map((ad) => (
                  <tr key={ad.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center overflow-hidden">
                        {ad.image ? (
                          <img src={ad.image} alt={ad.adTitle} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 bg-gray-400 rounded"></div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-800">
                      {ad.adTitle || ad.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      {ad.adSubtitle || ad.subtitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      {ad.cta}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(ad.status)}`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${getStatusIcon(ad.status)}`}></span>
                        {ad.status === "active" ? t('vendor_dashboard.ads.status.active') : t('vendor_dashboard.ads.status.inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                      <div className="flex items-center space-x-3">
                        <button className="text-gray-400 hover:text-red-500 transition-colors" onClick={() => deleteAd(ad.id)}>
                          <Trash2 className="h-5 w-5" />
                        </button>
                        {ad.status === 'active' ? (
                          <button className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors" onClick={() => toggleAd(ad.id, 'inactive')}>
                            {t('vendor_dashboard.ads.deactivate')}
                          </button>
                        ) : (
                          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors" onClick={() => toggleAd(ad.id, 'active')}>
                            {t('vendor_dashboard.ads.activate')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {paginatedAds.length === 0 && (
                  <tr><td colSpan={6} className="text-center p-4 text-gray-500">{t('vendor_dashboard.ads.no_ads')}</td></tr>
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
                {t('vendor_dashboard.ads.pagination.previous')}
              </button>
              <span className="text-sm font-medium text-gray-700">
                {t('vendor_dashboard.ads.pagination.page_of', { current: currentPage, total: totalPages || 1 })}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {t('vendor_dashboard.ads.pagination.next')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Advertisement Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{t('vendor_dashboard.ads.create_modal.title')}</h2>
                <p className="text-gray-600 mt-1">{t('vendor_dashboard.ads.create_modal.desc')}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors text-2xl font-bold leading-none"
              >
                ×
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="px-6 py-4">
              <div className="space-y-4">
                {/* Title Field */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('vendor_dashboard.ads.create_modal.title_label')}
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Get the best services online"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    required
                  />
                </div>

                {/* Subtitle Field */}
                <div>
                  <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('vendor_dashboard.ads.create_modal.subtitle_label')}
                  </label>
                  <textarea
                    id="subtitle"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    placeholder="We will make sure..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 resize-none"
                    required
                  />
                </div>

                {/* CTA Field */}
                <div>
                  <label htmlFor="cta" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('vendor_dashboard.ads.create_modal.cta_label')}
                  </label>
                  <input
                    type="text"
                    id="cta"
                    name="cta"
                    value={formData.cta}
                    onChange={handleInputChange}
                    placeholder="Join Now"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                    required
                  />
                </div>

                {/* File Upload Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('vendor_dashboard.ads.create_modal.image_label')}
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-gray-500 mb-2" />
                        <p className="text-sm text-gray-500"><span className="font-semibold">{t('vendor_dashboard.ads.create_modal.click_upload')}</span></p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  </div>
                  {files.length > 0 && (
                    <p className="text-sm text-gray-500 mt-2">Selected: {files[0].name}</p>
                  )}
                </div>

              </div>

              {/* Modal Actions */}
              <div className="flex justify-center gap-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t('vendor_dashboard.ads.create_modal.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
                >
                  {t('vendor_dashboard.ads.create_modal.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
