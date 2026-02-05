import React, { useState, useEffect } from "react";
import { Search, ChevronDown, Trash2, Plus, Loader2, Megaphone } from "lucide-react";
import { AdService } from "../../../services/adService";
import { auth } from "../../../firebaseConfig";

export default function SellerAds() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState("desc");
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    cta: "",
    type: "banner", // banner | reel | carousel
    target: "homepage", // homepage | listings | conakry
    duration: 1, // weeks
    cost: 100000
  });
  const [mediaFiles, setMediaFiles] = useState([]); // FileList for upload
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchAds();
    fetchStats();
  }, [user, currentPage, searchTerm]);

  const fetchAds = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);

      const adsData = await AdService.getSellerAds(user.uid);
      // Client-side filtering/pagination since API is replaced
      // In a real app with many ads, we should keep strict server-side pagination or Firestore limits
      setAds(adsData || []);
    } catch (err) {
      setError(`Failed to load ads: ${err.message}`);
      console.error('Error fetching ads:', err);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!user) return;
    try {
      const statsData = await AdService.getAdStats(user.uid);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching ad stats:', err);
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
      case "active":
        return "bg-green-500 text-white";
      case "inactive":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return "bg-green-600";
      case "inactive":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const formatPrice = (price) => {
    return price ? `${price.toLocaleString()} GNF` : "N/A";
  };

  const filteredAds = ads.filter(ad => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      (ad.title || '').toLowerCase().includes(term) ||
      (ad.subtitle || '').toLowerCase().includes(term)
    );
  }).sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    if (sortDirection === 'asc') return aValue > bValue ? 1 : -1;
    return aValue < bValue ? 1 : -1;
  });

  const PRICING_PER_WEEK = {
    banner: 100000,
    reel: 150920,
    carousel: 200000,
  };

  const recomputeCost = (type, duration) => {
    const weeks = Number(duration) || 1;
    const base = PRICING_PER_WEEK[type] || PRICING_PER_WEEK.banner;
    return base * weeks;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "type" || name === "duration") {
      const next = { ...formData, [name]: name === "duration" ? Number(value) : value };
      next.cost = recomputeCost(next.type, next.duration);
      setFormData(next);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files || []);
    setMediaFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Validate media
      const maxBytes = 5 * 1024 * 1024;
      if (formData.type === "banner") {
        if (mediaFiles.length !== 1) return alert("Please upload exactly one image for Banner.");
      }
      if (formData.type === "reel") {
        if (mediaFiles.length !== 1) return alert("Please upload exactly one video for Reel.");
      }
      if (formData.type === "carousel") {
        if (mediaFiles.length < 2) return alert("Please upload at least two images for Carousel.");
      }

      for (const f of mediaFiles) {
        if (f.size > maxBytes) return alert("One of the files exceeds 5MB limit.");
      }

      const payload = {
        sellerId: user.uid,
        title: formData.title,
        subtitle: formData.subtitle,
        cta: formData.cta,
        type: formData.type,
        target: formData.target,
        duration: formData.duration,
        cost: recomputeCost(formData.type, formData.duration),
      };

      await AdService.createAd(payload, mediaFiles);

      alert('Ad created successfully!');
      setFormData({ title: "", subtitle: "", cta: "", type: "banner", target: "homepage", duration: 1, cost: 100000 });
      setMediaFiles([]);
      setShowModal(false);
      fetchAds();
    } catch (error) {
      console.error('Error creating ad:', error);
      alert('Failed to create ad. Please try again.');
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ title: "", subtitle: "", cta: "", type: "banner", cost: 100000, duration: 7 });
  };

  const handleDeleteAd = async (adId) => {
    if (window.confirm('Are you sure you want to delete this ad?')) {
      try {
        await AdService.deleteAd(adId);
        alert('Ad deleted successfully!');
        setAds(prev => prev.filter(ad => ad.id !== adId));
      } catch (error) {
        console.error('Error deleting ad:', error);
        alert('Failed to delete ad. Please try again.');
      }
    }
  };

  const handleToggleAdStatus = async (adId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'deactivate';

    if (window.confirm(`Are you sure you want to ${action} this ad?`)) {
      try {
        await AdService.updateAd(adId, { status: newStatus });
        alert(`Ad ${action}d successfully!`);
        fetchAds();
      } catch (error) {
        console.error(`Error ${action}ing ad:`, error);
        alert(`Failed to ${action} ad. Please try again.`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600">Loading ads...</span>
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
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-gray-800">Ads Management</h1>
            <button
              onClick={openModal}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add new Ad
            </button>
          </div>

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
                <Megaphone className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Ads</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.total || ads.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <Megaphone className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Active</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.active || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <Megaphone className="h-8 w-8 text-red-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Inactive</p>
                  {/* Fallback calculation if stats don't return detail */}
                  <p className="text-lg font-semibold text-gray-900">{ads.filter(a => a.status !== 'active').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center">
                <Megaphone className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Spent</p>
                  <p className="text-lg font-semibold text-gray-900">{formatPrice(stats.totalSpent)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-4xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search ads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-700 placeholder-gray-400"
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
                    Image
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Ad Title</span>
                      {sortField === "title" && (
                        <ChevronDown className={`h-4 w-4 transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("subtitle")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Ad subtitle</span>
                      {sortField === "subtitle" && (
                        <ChevronDown className={`h-4 w-4 transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort("cta")}
                  >
                    <div className="flex items-center space-x-1">
                      <span>CTA</span>
                      {sortField === "cta" && (
                        <ChevronDown className={`h-4 w-4 transform ${sortDirection === "desc" ? "rotate-180" : ""}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Cost
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAds.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      {ads.length === 0 ? (
                        <div>
                          <p className="text-lg font-medium mb-2">No ads found</p>
                          <p className="text-sm">Create your first ad to promote your products and increase sales.</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg font-medium mb-2">No ads match your search</p>
                          <p className="text-sm">Try adjusting your search terms.</p>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredAds.map((ad) => (
                    <tr key={ad.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(() => {
                          // Try to determine image to show. 
                          // If carousel/banner, use first image.
                          // If reel, verify videoUrl vs Thumbnail if available.
                          // AdService struct: images[], videoUrl, image
                          let displaySrc = null;
                          if (ad.images && ad.images.length > 0) displaySrc = ad.images[0];
                          else if (ad.image) displaySrc = ad.image;
                          // For video, we don't have a thumbnail generator here, so maybe show a placeholder or the video element?

                          if (ad.type === 'reel' && ad.videoUrl) {
                            return (
                              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center relative">
                                <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-1"></div>
                              </div>
                            );
                          }

                          return displaySrc ? (
                            <div className="relative">
                              <img
                                src={displaySrc}
                                alt={ad.title}
                                className="w-12 h-12 rounded-lg object-cover"
                                onError={(e) => {
                                  e.target.src = `https://via.placeholder.com/48x48?text=${encodeURIComponent(ad.title?.charAt(0) || 'A')}`;
                                }}
                              />
                              {ad.type === 'carousel' && ad.images && ad.images.length > 1 && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                                  {ad.images.length}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-xs">
                              {ad.title?.charAt(0) || 'A'}
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base font-medium text-gray-800">
                        {ad.title || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                        {ad.subtitle || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                        {ad.cta || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                        {formatPrice(ad.cost)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(ad.status)}`}>
                          <span className={`w-2 h-2 rounded-full mr-2 ${getStatusIcon(ad.status)}`}></span>
                          {ad.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base text-gray-800">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleDeleteAd(ad.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete Ad"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleToggleAdStatus(ad.id, ad.status)}
                            className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${ad.status === "active"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                              }`}
                            title={ad.status === "active" ? "Deactivate Ad" : "Activate Ad"}
                          >
                            {ad.status === "active" ? "Deactivate" : "Activate"}
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
                <h2 className="text-2xl font-bold text-gray-800">Add Advertisement</h2>
                <p className="text-gray-600 mt-1">Complete the Advertisement form to add your Ad</p>
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
                {/* Type & Target */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                    >
                      <option value="banner">Banner (image)</option>
                      <option value="reel">Reel (video)</option>
                      <option value="carousel">Carousel (multiple images)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-2">
                      Target
                    </label>
                    <select
                      id="target"
                      name="target"
                      value={formData.target}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                    >
                      <option value="homepage">Homepage</option>
                      <option value="listings">Listings page</option>
                      <option value="conakry">Conakry (18-45, SMEs)</option>
                    </select>
                  </div>
                </div>

                {/* Title Field */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Get the best services online"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                    required
                  />
                </div>

                {/* Subtitle Field */}
                <div>
                  <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <textarea
                    id="subtitle"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    placeholder="We will make sure..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 resize-none"
                    required
                  />
                </div>

                {/* CTA Field */}
                <div>
                  <label htmlFor="cta" className="block text-sm font-medium text-gray-700 mb-2">
                    CTA
                  </label>
                  <input
                    type="text"
                    id="cta"
                    name="cta"
                    value={formData.cta}
                    onChange={handleInputChange}
                    placeholder="Join Now"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                    required
                  />
                </div>

                {/* Media Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.type === 'reel' ? 'Upload Video (max 5MB)' : formData.type === 'carousel' ? 'Upload Images (multiple, max 5MB each)' : 'Upload Image (max 5MB)'}
                  </label>
                  <input
                    type="file"
                    accept={formData.type === 'reel' ? 'video/*' : 'image/*'}
                    multiple={formData.type === 'carousel'}
                    onChange={handleMediaChange}
                    className="w-full"
                  />
                </div>

                {/* Duration and Auto Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (weeks)
                    </label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      min="1"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost (auto)
                    </label>
                    <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-700">
                      {recomputeCost(formData.type, formData.duration).toLocaleString()} GNF
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-center gap-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  Create Ad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
