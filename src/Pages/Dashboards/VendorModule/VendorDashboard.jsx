import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Info, Upload, Star, Edit, Lock, Trash2, Eye, EyeOff } from "lucide-react";
import AlexandraImg from "../../../assets/Alexandra.png";
import DefaultAvatarImg from "../../../assets/profile-image.jpg";
import LiveChatWidget from "../../../components/Support/LiveChatWidget";
import { auth } from "../../../firebaseConfig";
import { VendorService } from "../../../services/vendorService";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser } from "firebase/auth";

// 🔹 Default Avatar (local asset to avoid DNS failures)
const DefaultAvatar = DefaultAvatarImg;

// Button Component
function Button({ children, className = "", variant = "default", disabled, ...props }) {
  const baseStyles =
    variant === "outline"
      ? "border border-gray-300 text-gray-500 bg-transparent"
      : variant === "ghost"
        ? "text-black"
        : "bg-green-600 hover:bg-green-700 text-white";
  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium ${baseStyles} ${className}`}
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

// Avatar Components
function Avatar({ children, className = "" }) {
  return <div className={`h-10 w-10 rounded-full overflow-hidden ${className}`}>{children}</div>;
}

function AvatarImage({ src, alt }) {
  return <img src={src} alt={alt} className="w-full h-full object-cover" />;
}

// 🔹 Profile Card Component
function ProfileCard({ vendor, onUpload, onEditProfile, onChangePassword, onDeleteAccount }) {
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState(vendor?.avatar || DefaultAvatar);
  const progress = Math.round(vendor?.status?.profileCompletion || 0);
  const [isVendorOwner] = useState(true);

  // Update local avatar state if vendor prop updates
  useEffect(() => {
    if (vendor?.avatar) {
      setAvatar(vendor.avatar);
    }
  }, [vendor]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size < 1000 * 1024) { // Increased to 1MB logic, service handles upload
      const reader = new FileReader();
      reader.onloadend = async () => {
        const dataUrl = reader.result;
        setAvatar(dataUrl); // Optimistic update
        try {
          await onUpload?.(dataUrl); // Pass dataUrl or file. Service handles both.
        } catch (err) {
          console.error('Avatar upload failed', err);
          alert('Failed to upload avatar.');
          setAvatar(vendor?.avatar || DefaultAvatar); // Revert on failure
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert("Image must be under 1MB"); // Updated message
    }
  };

  return (
    <Card className="p-4 md:col-span-3">
      <h3 className="text-lg font-semibold mb-3">{t('vendor_dashboard.profile.title')}</h3>
      <div className="flex items-start gap-4 flex-wrap">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
            <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          {isVendorOwner && (
            <label className="absolute -bottom-1 -right-1 bg-green-600 text-white rounded-full p-2 shadow cursor-pointer">
              <Upload className="w-4 h-4" />
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
          )}
        </div>
        <div className="w-full text-sm italic text-gray-600 mt-1">
          {t('vendor_dashboard.profile.upload_photo')}
        </div>

        <div className="flex-grow">
          <p className="font-semibold">{vendor?.businessName || "Vendor"}</p>
          <p className="text-sm text-gray-500">{vendor?.name}</p>
          <p className="text-sm text-gray-500">📍 {vendor?.location || "-"}</p>
          {vendor?.visibility?.email && (
            <p className="text-sm text-gray-500">Email: {vendor?.email}</p>
          )}
          {vendor?.visibility?.phone && (
            <p className="text-sm text-gray-500">Phone: {vendor?.phone}</p>
          )}
          {vendor?.visibility?.socialLinks && (
            <div className="text-sm text-gray-500 flex gap-3 flex-wrap">
              {vendor?.socialLinks?.linkedin && <a className="text-blue-600" href={vendor.socialLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
              {vendor?.socialLinks?.facebook && <a className="text-blue-600" href={vendor.socialLinks.facebook} target="_blank" rel="noreferrer">Facebook</a>}
              {vendor?.socialLinks?.website && <a className="text-blue-600" href={vendor.socialLinks.website} target="_blank" rel="noreferrer">Website</a>}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3">
        <div className="text-sm mb-1">{t('vendor_dashboard.profile.complete_progress', { progress })}</div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="flex gap-2 mt-3 flex-wrap">
        {progress === 100 && (
          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">{t('vendor_dashboard.profile.profile_complete')}</span>
        )}
        {vendor?.status?.verified && (
          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">{t('vendor_dashboard.profile.verified_vendor')}</span>
        )}
        {vendor?.businessLicense?.licenseNumber && (
          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">{t('vendor_dashboard.profile.license', { number: vendor.businessLicense.licenseNumber })}</span>
        )}
        {vendor?.paymentMethod?.type && (
          <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">{t('vendor_dashboard.profile.payment', { type: vendor.paymentMethod.type, number: vendor.paymentMethod.number })}</span>
        )}
      </div>

      <div className="flex items-center gap-1 mt-3 text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-500" />
        ))}
        <span className="ml-2 text-sm text-gray-600">({vendor?.status?.rating || 0} / 5)</span>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 space-y-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 text-xs"
            onClick={onEditProfile}
          >
            <Edit className="h-3 w-3 mr-1" />
            {t('vendor_dashboard.profile.edit')}
          </Button>
          <Button
            variant="outline"
            className="flex-1 text-xs"
            onClick={onChangePassword}
          >
            <Lock className="h-3 w-3 mr-1" />
            {t('vendor_dashboard.profile.change_password')}
          </Button>
        </div>

        <Button
          variant="outline"
          className="w-full text-xs text-red-600 border-red-300 hover:bg-red-50"
          onClick={onDeleteAccount}
        >
          <Trash2 className="h-3 w-3 mr-1" />
          {t('vendor_dashboard.profile.delete_account')}
        </Button>
      </div>
    </Card>
  );
}

// Edit Profile Modal Component
function EditProfileModal({ vendorData, onClose, onUpdate }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: vendorData?.name || '',
    businessName: vendorData?.businessName || '',
    location: vendorData?.location || '',
    email: vendorData?.email || '',
    phone: vendorData?.phone || '',
    linkedin: vendorData?.socialLinks?.linkedin || '',
    facebook: vendorData?.socialLinks?.facebook || '',
    website: vendorData?.socialLinks?.website || '',
    paymentNumber: vendorData?.paymentMethod?.number || ''
  });
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
      await VendorService.updateVendorProfile(vendorData.id, {
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
          ...vendorData.paymentMethod,
          number: formData.paymentNumber
        }
      });

      alert('Profile updated successfully!');
      onUpdate(); // Refresh data
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
        <h3 className="text-lg font-semibold mb-4">{t('vendor_dashboard.modals.edit_profile.title')}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('vendor_dashboard.modals.edit_profile.name')}</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('vendor_dashboard.modals.edit_profile.business_name')}</label>
              <input type="text" name="businessName" value={formData.businessName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('vendor_dashboard.modals.edit_profile.location')}</label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('vendor_dashboard.modals.edit_profile.email')}</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('vendor_dashboard.modals.edit_profile.phone')}</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('vendor_dashboard.modals.edit_profile.payment_number')}</label>
              <input type="tel" name="paymentNumber" value={formData.paymentNumber} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('vendor_dashboard.modals.edit_profile.social_links')}</label>
            <div className="space-y-2">
              <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder={t('vendor_dashboard.modals.edit_profile.linkedin')} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              <input type="url" name="facebook" value={formData.facebook} onChange={handleInputChange} placeholder={t('vendor_dashboard.modals.edit_profile.facebook')} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              <input type="url" name="website" value={formData.website} onChange={handleInputChange} placeholder={t('vendor_dashboard.modals.edit_profile.website')} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={loading}>{loading ? t('vendor_dashboard.modals.edit_profile.updating_btn') : t('vendor_dashboard.modals.edit_profile.update_btn')}</Button>
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={loading}>{t('vendor_dashboard.modals.edit_profile.cancel')}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Change Password Modal Component
function ChangePasswordModal({ vendorData, onClose }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 10;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return { minLength, hasNumber, hasSpecialChar, isValid: minLength && hasNumber && hasSpecialChar };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validation
    const newPasswordValidation = validatePassword(formData.newPassword);
    const newErrors = {};

    if (!formData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!newPasswordValidation.isValid) newErrors.newPassword = 'Password must be at least 10 characters with 1 number and 1 special character';
    if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user || user.uid !== vendorData.id) throw new Error("No authenticated user found");

      // Re-authenticate
      const credential = EmailAuthProvider.credential(user.email, formData.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, formData.newPassword);

      alert('Password changed successfully!');
      onClose();
    } catch (error) {
      console.error('Error changing password:', error);
      let msg = error.message;
      if (error.code === 'auth/wrong-password') msg = 'Incorrect current password.';
      alert(msg || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">{t('vendor_dashboard.modals.change_password.title')}</h3>
        <p className="text-sm text-gray-600 mb-4">
          {t('vendor_dashboard.modals.change_password.desc')}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleInputChange} placeholder={t('vendor_dashboard.modals.change_password.current')} className={`w-full px-3 py-2 border rounded-md ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
          </div>
          <div>
            <input type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} placeholder={t('vendor_dashboard.modals.change_password.new')} className={`w-full px-3 py-2 border rounded-md ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
          </div>
          <div>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder={t('vendor_dashboard.modals.change_password.confirm')} className={`w-full px-3 py-2 border rounded-md ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="flex gap-2 mt-4">
            <Button type="submit" className="flex-1" disabled={loading}>{loading ? t('vendor_dashboard.modals.change_password.changing_btn') : t('vendor_dashboard.modals.change_password.change_btn')}</Button>
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={loading}>{t('vendor_dashboard.modals.change_password.cancel')}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VendorDashboard() {
  const { t } = useTranslation();
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [showSerialModal, setShowSerialModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newSerial, setNewSerial] = useState({ product: "", serialNumber: "", status: "Available" });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [vendor, setVendor] = React.useState(null);
  const [dashboard, setDashboard] = React.useState(null);
  const [reviews, setReviews] = React.useState([]); // ADDED
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        if (!user) {
          if (!auth.currentUser) setLoading(false);
          navigate('/login');
          return;
        }
        setLoading(true);
        const [vendorRes, dashStats, reviewsRes] = await Promise.all([
          VendorService.getVendorProfile(user.uid),
          VendorService.getDashboardStats(user.uid),
          VendorService.getVendorReviews(user.uid) // ADDED
        ]);

        if (!mounted) return;
        setVendor(vendorRes);
        setDashboard(dashStats);
        setReviews(reviewsRes || []); // ADDED
      } catch (e) {
        if (!mounted) return;
        console.error("Dashboard load failed", e);
        setError("Failed to load dashboard data.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [user]);

  const uploadAvatar = async (dataUrl) => {
    if (!user) return;
    try {
      const newUrl = await VendorService.uploadAvatar(user.uid, dataUrl);
      setVendor(prev => ({ ...prev, avatar: newUrl }));
    } catch (e) {
      console.error("Upload failed", e);
      alert("Avatar upload failed");
    }
  };

  const refreshVendorData = async () => {
    try {
      const vendorRes = await VendorService.getVendorProfile(user.uid);
      setVendor(vendorRes);
    } catch (e) {
      console.error('Error refreshing vendor data:', e);
    }
  };

  const handleDeleteAccount = async () => {
    if (!vendor?.id) return;
    if (!window.confirm(t('vendor_dashboard.profile.delete_confirm'))) return;

    try {
      await VendorService.deleteVendor(vendor.id);
      await deleteUser(user);
      alert('Account deleted successfully');
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    }
  };

  const [serialNumbers, setSerialNumbers] = useState(() => {
    const saved = localStorage.getItem('vendorSerialNumbers');
    if (saved) return JSON.parse(saved);
    return [];
  });

  React.useEffect(() => {
    localStorage.setItem('vendorSerialNumbers', JSON.stringify(serialNumbers));
  }, [serialNumbers]);

  const handleAddSerial = () => {
    if (newSerial.product && newSerial.serialNumber) {
      const newId = serialNumbers.length ? Math.max(...serialNumbers.map(s => s.id)) + 1 : 1;
      setSerialNumbers([...serialNumbers, { ...newSerial, id: newId }]);
      setNewSerial({ product: "", serialNumber: "", status: "Available" });
      setShowAddModal(false);
    }
  };

  const handleEditSerial = (id) => {
    const serial = serialNumbers.find(s => s.id === id);
    if (serial) {
      setNewSerial({ ...serial });
      setEditingId(id);
      setShowAddModal(true);
    }
  };

  const handleUpdateSerial = () => {
    if (newSerial.product && newSerial.serialNumber) {
      setSerialNumbers(serialNumbers.map(s => s.id === editingId ? { ...newSerial, id: editingId } : s));
      setNewSerial({ product: "", serialNumber: "", status: "Available" });
      setEditingId(null);
      setShowAddModal(false);
    }
  };

  const handleDeleteSerial = (id) => {
    if (window.confirm(t('vendor_dashboard.modals.serial_numbers.delete_confirm'))) {
      setSerialNumbers(serialNumbers.filter(s => s.id !== id));
    }
  };

  const closeModals = () => {
    setShowAddModal(false);
    setEditingId(null);
    setNewSerial({ product: "", serialNumber: "", status: "Available" });
  };

  if (loading) return <div className="min-h-screen bg-gray-100 py-6 px-4">Loading...</div>;
  if (error) return <div className="min-h-screen bg-gray-100 py-6 px-4 text-red-600">{error}</div>;

  const totalOrders = dashboard?.ordersCount || 0;
  const totalListings = dashboard?.listingsCount || 0;
  // const totalPayoutsAmount = dashboard?.totalPayoutsAmount || 0; // Not used currently in UI but available

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 max-w-7xl mx-auto">{t('vendor_dashboard.overview.title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Profile Section */}
        <ProfileCard
          vendor={vendor}
          onUpload={uploadAvatar}
          onEditProfile={() => setShowEditModal(true)}
          onChangePassword={() => setShowPasswordModal(true)}
          onDeleteAccount={handleDeleteAccount}
        />

        {/* Orders Card */}
        <div className="md:col-span-1">
          <h3 className="text-base md:text-lg font-semibold mb-2">{t('vendor_dashboard.overview.total_orders')}</h3>
          <Card className="h-auto md:h-[180px] flex flex-col">
            <div className="flex flex-row items-center justify-between p-4">
              <p className="text-sm font-medium text-gray-500">{t('vendor_dashboard.overview.orders_placed')}</p>
              <Info className="h-4 w-4 text-gray-500" />
            </div>
            <CardContent className="flex flex-col justify-between flex-grow">
              <div className="text-3xl md:text-4xl font-bold">{totalOrders}</div>
              <Button className="mt-4 w-fit" onClick={() => navigate("/vendor/dashboard/orders")}>{t('vendor_dashboard.overview.view_orders')}</Button>
            </CardContent>
          </Card>
        </div>

        {/* Listings Card */}
        <div className="md:col-span-1">
          <h3 className="text-base md:text-lg font-semibold mb-2">{t('vendor_dashboard.overview.total_listings')}</h3>
          <Card className="h-auto md:h-[180px] flex flex-col">
            <div className="flex flex-row items-center justify-between p-4">
              <p className="text-sm font-medium text-gray-500">{t('vendor_dashboard.overview.active_listings')}</p>
              <Info className="h-4 w-4 text-gray-500" />
            </div>
            <CardContent className="flex flex-col justify-between flex-grow">
              <div className="text-3xl md:text-4xl font-bold">{totalListings}</div>
              <Button className="mt-4 w-fit" onClick={() => navigate("/vendor/dashboard/listings")}>
                {t('vendor_dashboard.overview.view_listings')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Serial Number Management */}
        <div className="md:col-span-1">
          <h3 className="text-base md:text-lg font-semibold mb-2">{t('vendor_dashboard.overview.serial_numbers')}</h3>
          <Card className="h-auto md:h-[180px] flex flex-col">
            <div className="flex flex-row items-center justify-between p-4">
              <p className="text-sm font-medium text-gray-500">{t('vendor_dashboard.overview.manage_serials')}</p>
              <Info className="h-4 w-4 text-gray-500" />
            </div>
            <CardContent className="flex flex-col justify-between flex-grow">
              <div className="text-3xl md:text-4xl font-bold">{t('vendor_dashboard.overview.products_count', { count: serialNumbers.length })}</div>
              <Button className="mt-4 w-fit" onClick={() => setShowSerialModal(true)}>
                {t('vendor_dashboard.overview.manage_serials_btn')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Orders Section (Left) */}
        <div className="md:col-span-2 flex flex-col">
          <h3 className="text-base md:text-lg font-semibold mb-2">{t('vendor_dashboard.overview.current_order_status')}</h3>
          <Card className="h-auto md:h-[520px]">
            <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full">
              <div className="w-full text-left mb-4 bg-gray-50 overflow-x-auto">
                <div className="grid grid-cols-6 min-w-[600px] gap-4 font-semibold text-sm text-gray-600 border-b border-gray-100 p-4">
                  <div>{t('vendor_dashboard.overview.table.date')}</div>
                  <div>{t('vendor_dashboard.overview.table.name')}</div>
                  <div>{t('vendor_dashboard.overview.table.product')}</div>
                  <div>{t('vendor_dashboard.overview.table.serial')}</div>
                  <div>{t('vendor_dashboard.overview.table.status')}</div>
                  <div>{t('vendor_dashboard.overview.table.price')}</div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center flex-grow">
                <h4 className="text-lg md:text-xl font-bold mb-2">{t('vendor_dashboard.overview.get_started_orders')}</h4>
                <p className="text-gray-500 w-full">
                  {t('vendor_dashboard.overview.orders_info')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews Section (Right) */}
        <div className="md:col-span-1 md:row-span-2 flex flex-col">
          <h3 className="text-base md:text-lg font-semibold mb-2">{t('vendor_dashboard.overview.reviews')}</h3>
          <Card className="flex-grow">
            <CardContent className="flex flex-col h-full p-0">
              <div className="flex-grow overflow-y-auto max-h-[300px] md:max-h-none">
                {reviews.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 italic">
                    {t('vendor_dashboard.overview.no_reviews')}
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="flex items-center gap-3 p-4 border-b last:border-b-0"
                    >
                      <Avatar>
                        <AvatarImage src={review.avatar || DefaultAvatar} alt={review.authorName || "User"} />
                      </Avatar>
                      <div className="flex-grow">
                        <p className="font-semibold">{review.authorName || "Anonymous"}</p>
                        <p className="text-sm text-gray-500">
                          {review.content || review.comment || "No content"}
                        </p>
                        {review.rating && (
                          <div className="flex text-yellow-500 text-xs mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-yellow-500" : "text-gray-300"}`} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowChatWidget(true)}
                >
                  {t('vendor_dashboard.overview.manage_messages')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* LiveChatWidget */}
      {showChatWidget && <LiveChatWidget forceOpen={true} />}

      {/* Serial Number Management Modal */}
      {showSerialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t('vendor_dashboard.modals.serial_numbers.title')}</h2>
              <button
                onClick={() => setShowSerialModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">{t('vendor_dashboard.modals.serial_numbers.product')}</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">{t('vendor_dashboard.modals.serial_numbers.serial')}</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">{t('vendor_dashboard.modals.serial_numbers.status')}</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">{t('vendor_dashboard.modals.serial_numbers.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {serialNumbers.map((item) => (
                    <tr key={item.id}>
                      <td className="border border-gray-300 px-4 py-2">{item.product}</td>
                      <td className="border border-gray-300 px-4 py-2 font-mono text-sm">{item.serialNumber}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${item.status === 'Available'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'Sold'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          onClick={() => handleEditSerial(item.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSerial(item.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowSerialModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {t('vendor_dashboard.modals.serial_numbers.close')}
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {t('vendor_dashboard.modals.serial_numbers.add_btn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Serial Number Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingId ? t('vendor_dashboard.modals.add_serial.edit_title') : t('vendor_dashboard.modals.add_serial.add_title')}
              </h2>
              <button
                onClick={closeModals}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('vendor_dashboard.modals.add_serial.product_label')}
                </label>
                <input
                  type="text"
                  value={newSerial.product}
                  onChange={(e) => setNewSerial({ ...newSerial, product: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('vendor_dashboard.modals.add_serial.product_placeholder')}
                />
              </div>



              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('vendor_dashboard.modals.add_serial.serial_label')}
                </label>
                <input
                  type="text"
                  value={newSerial.serialNumber}
                  onChange={(e) => setNewSerial({ ...newSerial, serialNumber: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder={t('vendor_dashboard.modals.add_serial.serial_placeholder')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('vendor_dashboard.modals.add_serial.status_label')}
                </label>
                <select
                  value={newSerial.status}
                  onChange={(e) => setNewSerial({ ...newSerial, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Available">{t('vendor_dashboard.modals.add_serial.available')}</option>
                  <option value="Sold">{t('vendor_dashboard.modals.add_serial.sold')}</option>
                  <option value="Reserved">{t('vendor_dashboard.modals.add_serial.reserved')}</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={closeModals}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {t('vendor_dashboard.modals.add_serial.cancel')}
              </button>
              <button
                onClick={editingId ? handleUpdateSerial : handleAddSerial}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                {editingId ? t('vendor_dashboard.modals.add_serial.update_btn') : t('vendor_dashboard.modals.add_serial.add_btn')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          vendorData={vendor}
          onClose={() => setShowEditModal(false)}
          onUpdate={refreshVendorData}
        />
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <ChangePasswordModal
          vendorData={vendor}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </div>
  );
}
