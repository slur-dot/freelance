import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { Info, Upload, Star, Loader2, Eye, EyeOff, Edit, Lock, Trash2, ExternalLink, TrendingUp, Package, DollarSign, Users } from "lucide-react";
import LiveChatWidget from "../../../components/Support/LiveChatWidget";
import { storage, auth } from "../../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { UserService } from "../../../services/userService";
import { ProductService } from "../../../services/productService";
import { OrderService } from "../../../services/orderService";
import { NotificationService } from "../../../services/notificationService";
import PhoneInput from "../../../components/PhoneInput";
import { ChangePasswordModal, DeleteAccountModal } from "../../../components/Modals/SecurityModals";

// Button Component
function Button({ children, className = "", variant = "default", disabled, ...props }) {
  const baseStyles =
    variant === "outline"
      ? "border border-gray-300 text-gray-500 bg-transparent hover:bg-gray-100"
      : variant === "ghost"
        ? "text-black hover:bg-gray-50"
        : "bg-green-600 hover:bg-green-700 text-white";
  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition ${baseStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

// Card Components
function Card({ children, className = "" }) {
  return <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>;
}
function CardHeader({ children, className = "" }) {
  return <div className={`p-4 border-b border-gray-200 ${className}`}>{children}</div>;
}
function CardContent({ children, className = "" }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

// Default Avatar (online fallback)
const DefaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23e5e7eb'/%3E%3Ctext x='75' y='75' font-family='Arial, sans-serif' font-size='16' fill='%236b7280' text-anchor='middle' dy='.3em'%3EAvatar%3C/text%3E%3C/svg%3E";

// Edit Profile Modal Component
function EditProfileModal({ sellerData, onClose, onUpdate }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: sellerData?.name || '',
    businessName: sellerData?.businessName || '',
    location: sellerData?.location || '',
    email: sellerData?.email || '',
    phone: sellerData?.phone || '',
    linkedin: sellerData?.socialLinks?.linkedin || '',
    facebook: sellerData?.socialLinks?.facebook || '',
    website: sellerData?.socialLinks?.website || '',
    paymentNumber: sellerData?.paymentMethod?.number || ''
  });
  const [phoneCountryCode, setPhoneCountryCode] = useState("+224");
  const [paymentCountryCode, setPaymentCountryCode] = useState("+224");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatePayload = {
        name: formData.name,
        businessName: formData.businessName,
        location: formData.location,
        email: formData.email,
        phone: formData.phone,
        socialLinks: {
          linkedin: formData.linkedin,
          facebook: formData.facebook,
          website: formData.website
        },
        paymentMethod: {
          ...sellerData.paymentMethod,
          number: formData.paymentNumber
        }
      };

      await UserService.updateUserProfile(sellerData.id, updatePayload); 

      alert('Profile updated successfully!');
      onUpdate(); 
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">{t('seller_dashboard.modal.edit_title')}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('seller_dashboard.modal.name')}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('seller_dashboard.modal.business_name')}</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('seller_dashboard.modal.location')}</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('seller_dashboard.modal.email')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('seller_dashboard.modal.phone')}</label>
              <PhoneInput
                value={formData.phone}
                onChange={(val) => setFormData(prev => ({ ...prev, phone: val }))}
                countryCode={phoneCountryCode}
                onCountryCodeChange={setPhoneCountryCode}
                className="rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('seller_dashboard.modal.payment_number')}</label>
              <PhoneInput
                value={formData.paymentNumber}
                onChange={(val) => setFormData(prev => ({ ...prev, paymentNumber: val }))}
                countryCode={paymentCountryCode}
                onCountryCodeChange={setPaymentCountryCode}
                className="rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('seller_dashboard.modal.social_links')}</label>
            <div className="space-y-2">
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder={t('seller_dashboard.modal.linkedin')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                placeholder={t('seller_dashboard.modal.facebook')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder={t('seller_dashboard.modal.website')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? t('seller_dashboard.modal.updating_btn') : t('seller_dashboard.modal.update_btn')}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              {t('seller_dashboard.modal.cancel_btn')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Profile Card
function ProfileCard({ onContact, sellerData, onAvatarUpdate, setShowPasswordModal, setShowDeleteModal }) {
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState(DefaultAvatar);
  const [progress, setProgress] = useState(70);
  const [uploading, setUploading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (sellerData) {
      if (sellerData.avatar) {
        setAvatar(sellerData.avatar);
      }
      if (sellerData.profileCompletion) {
        setProgress(sellerData.profileCompletion);
      }
    }
  }, [sellerData]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    if (!sellerData?.id) {
      alert("Please select a seller first");
      return;
    }

    try {
      setUploading(true);
      const timestamp = Date.now();
      const fileName = `ads/avatars/${sellerData.id}_${timestamp}.${file.name.split('.').pop()}`;
      const storageRef = ref(storage, fileName);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setAvatar(downloadURL);
      await UserService.updateUserProfile(sellerData.id, { avatar: downloadURL });
      if (onAvatarUpdate) onAvatarUpdate();
      alert("Avatar updated successfully!");
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert("Failed to upload avatar. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const toggleVisibility = async (field) => {
    if (!sellerData?.id) return;
    try {
      const newVisibility = {
        ...sellerData.visibility,
        [field]: !sellerData.visibility?.[field]
      };
      await UserService.updateUserProfile(sellerData.id, { visibility: newVisibility });
      onAvatarUpdate(); 
    } catch (error) {
      console.error('Error updating visibility:', error);
      alert('Failed to update visibility settings');
    }
  };

  return (
    <Card className="p-4 md:col-span-3">
      <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
        <div className="relative shrink-0 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center relative">
            <img
              src={avatar}
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = DefaultAvatar; }}
            />
            <label className={`absolute bottom-0 right-0 p-1.5 rounded-full shadow cursor-pointer transform translate-x-1/4 translate-y-1/4 transition-colors ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}>
              {uploading ? <Loader2 className="h-3.5 w-3.5 text-white animate-spin" /> : <Upload className="h-3.5 w-3.5 text-white" />}
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" disabled={uploading} />
            </label>
          </div>
          <div className="text-[10px] italic text-gray-500 mt-3 text-center max-w-[90px] leading-tight">
            {t('seller_dashboard.profile.add_photo')}
          </div>
        </div>

        <div className="flex-grow min-w-0">
          <p className="font-semibold text-lg">{sellerData?.name || "Loading..."}</p>
          <p className="text-sm text-gray-500">{sellerData?.businessName || "Loading..."}</p>
          <p className="text-sm text-gray-500">📍 {sellerData?.location || "Loading..."}</p>

          {sellerData?.socialLinks && (
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-600 mb-1">{t('seller_dashboard.profile.social_links')}</p>
              <div className="flex gap-2 text-xs flex-wrap">
                {sellerData.socialLinks.linkedin && <a href={sellerData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>}
                {sellerData.socialLinks.facebook && <a href={sellerData.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook</a>}
                {sellerData.socialLinks.website && <a href={sellerData.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Website</a>}
              </div>
            </div>
          )}
        </div>
      </div>

        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">📧 {sellerData?.email || "Loading..."}</p>
            <button onClick={() => toggleVisibility('email')} className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${sellerData?.visibility?.email ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {sellerData?.visibility?.email ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              {sellerData?.visibility?.email ? 'Public' : 'Private'}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">📱 {sellerData?.phone || "Loading..."}</p>
            <button onClick={() => toggleVisibility('phone')} className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${sellerData?.visibility?.phone ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {sellerData?.visibility?.phone ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              {sellerData?.visibility?.phone ? 'Public' : 'Private'}
            </button>
          </div>
        </div>

      <div className="mt-4 space-y-2">
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 text-xs" onClick={() => setShowEditModal(true)}>
            <Edit className="h-3 w-3 mr-1" /> {t('seller_dashboard.profile.edit')}
          </Button>
          <Button variant="outline" className="flex-1 text-xs" onClick={() => setShowPasswordModal(true)}>
            <Lock className="h-3 w-3 mr-1" /> {t('seller_dashboard.profile.change_password')}
          </Button>
        </div>
        <Button className="w-full text-xs" onClick={onContact}>{t('seller_dashboard.profile.contact_admin')}</Button>
        <Button variant="outline" className="w-full text-xs text-red-600 border-red-300 hover:bg-red-50" onClick={() => setShowDeleteModal(true)}>
          <Trash2 className="h-3 w-3 mr-1" /> {t('seller_dashboard.profile.delete_account')}
        </Button>
      </div>

      {showEditModal && <EditProfileModal sellerData={sellerData} onClose={() => setShowEditModal(false)} onUpdate={onAvatarUpdate} />}
    </Card>
  );
}

export default function SellerDashboard() {
  const { t } = useTranslation();
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const fetchMySeller = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const [profile, products, orders, notifs] = await Promise.all([
        UserService.getUserProfile(user.uid),
        ProductService.getSellerProducts(user.uid),
        OrderService.getSellerOrders(user.uid),
        NotificationService.getUserNotifications(user.uid)
      ]);
      if (profile) {
        const sellerProfile = {
          ...profile,
          id: user.uid,
          status: {
            ...profile.status,
            activeListings: products.length,
            transactions: orders.length,
            totalSales: orders
              .filter(o => o.status === 'completed' || o.status === 'delivered')
              .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0)
          }
        };
        setSelectedSeller(sellerProfile);
        setRecentOrders((orders || []).slice(0, 5));
        setNotifications((notifs || []).slice(0, 5));
      } else {
        setError("Seller profile not found. Please complete setup.");
      }

    } catch (err) {
      setError(`Failed to load seller data: ${err.message}`);
      console.error('Error fetching seller:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySeller();
  }, [user]);

  // Handle avatar update
  const handleAvatarUpdate = () => {
    fetchMySeller(); // Refresh seller data
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600">Loading seller data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error && !selectedSeller) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h3 className="text-yellow-800 font-medium">{t('seller_dashboard.offline_mode')}</h3>
            <p className="text-yellow-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Quick Management Hub - New Prominent Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="space-y-2 text-center md:text-left">
              <h2 className="text-3xl font-bold">{t('freelancer_dashboard.welcome', 'Welcome back,')} {selectedSeller?.name || user?.displayName || "Seller"}!</h2>
              <p className="text-blue-100 font-medium">{t('seller_dashboard.hub_desc', 'Manage your products and track your sales from your centralized vendor hub.')}</p>
           </div>
           <div className="flex flex-wrap justify-center gap-4">
              <Link to="/seller/dashboard/listings" className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-50 transition-all active:scale-95 whitespace-nowrap">
                 {t('seller_dashboard.go_to_hub', 'Manage Listings')}
              </Link>
           </div>
        </div>
      </div>

      <div className="mb-6 max-w-7xl mx-auto">
        {error && (
          <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-md p-2">
            <p className="text-yellow-700 text-sm">
              ⚠️ {t('seller_dashboard.offline_mode')} - {error}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Profile Section */}
        <ProfileCard
          onContact={() => setShowChatWidget(true)}
          sellerData={selectedSeller}
          onAvatarUpdate={handleAvatarUpdate}
        />

        {/* Total Sales Card */}
        <div className="md:col-span-1">
          <h3 className="text-base md:text-lg font-semibold mb-2">{t('seller_dashboard.cards.total_sales')}</h3>
          <Card className="h-auto md:h-[180px] flex flex-col">
            <div className="flex flex-row items-center justify-between p-4">
              <p className="text-sm font-medium text-gray-500">{t('seller_dashboard.cards.revenue_after_commission')}</p>
              <Info className="h-4 w-4 text-gray-500" />
            </div>
            <CardContent className="flex flex-col justify-between flex-grow">
              <div className="text-3xl md:text-4xl font-bold">
                {selectedSeller?.status?.totalSales ?
                  (selectedSeller.status.totalSales * (selectedSeller.subscription?.plan === 'Premium' ? 0.9 : 0.85)).toLocaleString() :
                  '0'} GNF
              </div>
              <Button className="mt-4 w-fit" onClick={() => navigate("/seller/dashboard/analytics")}>
                {t('seller_dashboard.cards.view_analytics')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Active Listings Card */}
        <div className="md:col-span-1">
          <h3 className="text-base md:text-lg font-semibold mb-2">{t('seller_dashboard.cards.active_listings')}</h3>
          <Card className="h-auto md:h-[180px] flex flex-col">
            <div className="flex flex-row items-center justify-between p-4">
              <p className="text-sm font-medium text-gray-500">{t('seller_dashboard.cards.products_available')}</p>
              <Info className="h-4 w-4 text-gray-500" />
            </div>
            <CardContent className="flex flex-col justify-between flex-grow">
              <div className="text-3xl md:text-4xl font-bold">{selectedSeller?.status?.activeListings || 0} Products</div>
              <Button className="mt-4 w-fit" onClick={() => navigate("/seller/dashboard/listings")}>
                {t('seller_dashboard.cards.manage_listings')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Orders Card */}
        <div className="md:col-span-1">
          <h3 className="text-base md:text-lg font-semibold mb-2">{t('seller_dashboard.cards.total_orders')}</h3>
          <Card className="h-auto md:h-[180px] flex flex-col">
            <div className="flex flex-row items-center justify-between p-4">
              <p className="text-sm font-medium text-gray-500">{t('seller_dashboard.cards.completed_transactions')}</p>
              <Info className="h-4 w-4 text-gray-500" />
            </div>
            <CardContent className="flex flex-col justify-between flex-grow">
              <div className="text-3xl md:text-4xl font-bold">{selectedSeller?.status?.transactions || 0} Orders</div>
              <Button className="mt-4 w-fit" onClick={() => navigate("/seller/dashboard/orders")}>
                {t('seller_dashboard.cards.view_orders')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Payouts Card */}
        <div className="md:col-span-1">
          <h3 className="text-base md:text-lg font-semibold mb-2">{t('seller_dashboard.cards.payouts')}</h3>
          <Card className="h-auto md:h-[180px] flex flex-col">
            <div className="flex flex-row items-center justify-between p-4">
              <p className="text-sm font-medium text-gray-500">{t('seller_dashboard.cards.money_ready')}</p>
              <Info className="h-4 w-4 text-gray-500" />
            </div>
            <CardContent className="flex flex-col justify-between flex-grow">
              <div className="text-3xl md:text-4xl font-bold">
                {selectedSeller?.status?.pendingPayouts?.toLocaleString() || '0'} GNF
              </div>
              <Button className="mt-4 w-fit" onClick={() => navigate("/seller/dashboard/payouts")}>
                {t('seller_dashboard.cards.view_payouts')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <div className="md:col-span-1 md:row-span-2 flex flex-col">
          <h3 className="text-base md:text-lg font-semibold mb-2">{t('seller_dashboard.recent_activity.title')}</h3>
          <Card className="flex-grow">
            <CardContent className="flex flex-col h-full p-0">
              <div className="flex-grow overflow-y-auto max-h-[300px] md:max-h-none">
                {recentOrders.length > 0 ? (
                  <div className="space-y-2 p-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex justify-between items-center text-sm border-b pb-2">
                        <div className="flex flex-col">
                          <span className="font-medium truncate max-w-[150px]">{order.product || `Order #${order.id.slice(0, 6)}`}</span>
                          <span className="text-xs text-gray-500">{order.buyerName}</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-bold">{order.totalAmount ? `${order.totalAmount} GNF` : '-'}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] mt-1 ${order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {order.status || 'pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    <h4 className="text-lg font-bold mb-2">{t('seller_dashboard.recent_activity.welcome_title')}</h4>
                    <p className="text-sm">
                      {t('seller_dashboard.recent_activity.welcome_desc')}
                    </p>
                  </div>
                )}
              </div>
              <div className="p-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate("/seller/dashboard/listings")}
                >
                  {t('seller_dashboard.recent_activity.create_listing')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Overview */}
        <div className="md:col-span-2 flex flex-col w-full">
          <h3 className="text-base md:text-lg font-semibold mb-2">{t('seller_dashboard.performance.title')}</h3>
          <Card className="h-[300px]">
            <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full">
              <div className="w-full text-left mb-4 bg-gray-50 overflow-x-auto">
                <div className="grid grid-cols-4 gap-4 font-semibold text-xs sm:text-sm text-gray-600 border-b border-gray-100 pb-3 p-2 sm:p-4 min-w-[400px]">
                  <div>{t('seller_dashboard.performance.metric')}</div>
                  <div>{t('seller_dashboard.performance.value')}</div>
                  <div>{t('seller_dashboard.performance.plan')}</div>
                  <div>{t('seller_dashboard.performance.commission')}</div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center flex-grow px-2">
                <h4 className="text-lg sm:text-xl font-bold mb-2">{t('seller_dashboard.performance.seller_performance')}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <p className="font-semibold">{t('seller_dashboard.performance.total_revenue')}</p>
                    <p className="text-gray-600">{selectedSeller?.status?.totalSales?.toLocaleString() || '0'} GNF</p>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">{t('seller_dashboard.performance.net_earnings')}</p>
                    <p className="text-gray-600">
                      {selectedSeller?.status?.totalSales ?
                        (selectedSeller.status.totalSales * (selectedSeller.subscription?.plan === 'Premium' ? 0.9 : 0.85)).toLocaleString() :
                        '0'} GNF
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">{t('seller_dashboard.performance.plan')}</p>
                    <p className="text-gray-600">{selectedSeller?.subscription?.plan || 'Basic'}</p>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">{t('seller_dashboard.performance.commission_rate')}</p>
                    <p className="text-gray-600">{selectedSeller?.subscription?.plan === 'Premium' ? '10%' : '15%'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Notifications Section */}
        <div className="md:col-span-3 flex flex-col w-full">
          <h3 className="text-base md:text-lg font-semibold mb-2">Recent Notifications</h3>
          <Card className="h-[300px]">
            <CardContent className="flex flex-col h-full p-0">
              <div className="flex-grow overflow-y-auto max-h-[300px] md:max-h-none">
                <div className="space-y-3 p-4">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div key={notification.id} className="flex items-start gap-3 text-sm p-3 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{notification.title}</p>
                          <p className="text-gray-600 mt-0.5">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.createdAt?.seconds ? new Date(notification.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-500">
                      <h4 className="text-lg font-bold mb-2">Welcome to Your Seller Dashboard!</h4>
                      <p className="text-sm mb-4">
                        You'll receive notifications here for new orders, payouts, and important updates.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate("/seller/dashboard/notifications")}
                >
                  VIEW ALL NOTIFICATIONS
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showChatWidget && <LiveChatWidget forceOpen={true} />}
    </div>
  );
}
