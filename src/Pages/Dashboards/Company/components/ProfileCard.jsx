import React, { useEffect, useState } from "react";
import { Info, Upload, Star, Loader2, Eye, EyeOff, Edit, Lock, Trash2 } from "lucide-react";
import { storage } from "../../../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { CompanyService } from "../../../../services/companyService";
import { useTranslation } from "react-i18next";
import PhoneInput from "../../../../components/PhoneInput";

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

function Card({ children, className = "" }) {
  return <div className={`bg-white shadow rounded-lg ${className}`}>{children}</div>;
}
function CardHeader({ children, className = "" }) {
  return <div className={`p-4 border-b border-gray-200 ${className}`}>{children}</div>;
}
function CardContent({ children, className = "" }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

const DefaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23e5e7eb'/%3E%3Ctext x='75' y='75' font-family='Arial, sans-serif' font-size='16' fill='%236b7280' text-anchor='middle' dy='.3em'%3EAvatar%3C/text%3E%3C/svg%3E";

function EditProfileModal({ companyData, onClose, onUpdate }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: companyData?.name || '',
    sector: companyData?.sector || '',
    location: companyData?.location || '',
    email: companyData?.email || '',
    phone: companyData?.phone || '',
    linkedin: companyData?.socialLinks?.linkedin || '',
    facebook: companyData?.socialLinks?.facebook || '',
    website: companyData?.socialLinks?.website || '',
    paymentNumber: companyData?.paymentMethod?.number || ''
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

      const updatedData = {
        name: formData.name,
        sector: formData.sector,
        location: formData.location,
        email: formData.email,
        phone: formData.phone,
        socialLinks: {
          linkedin: formData.linkedin,
          facebook: formData.facebook,
          website: formData.website
        },
        paymentMethod: {
          ...companyData.paymentMethod,
          number: formData.paymentNumber
        }
      };

      await CompanyService.updateCompanyProfile(companyData.id, updatedData);

      console.log('Profile update successful');
      alert('Profile updated successfully!');

      // Call onUpdate to refresh the parent component data
      if (onUpdate) {
        console.log('Calling onUpdate to refresh parent data...');
        await onUpdate();
      }
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
        <h3 className="text-lg font-semibold mb-4">{t('company_dashboard.profile_edit_title')}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('company_dashboard.profile_company_name')}</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('company_dashboard.profile_sector')}</label>
              <input type="text" name="sector" value={formData.sector} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('company_dashboard.profile_location')}</label>
              <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('company_dashboard.profile_email')}</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('company_dashboard.profile_phone')}</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('company_dashboard.profile_payment_number')}</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('company_dashboard.profile_social_links')}</label>
            <div className="space-y-2">
              <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="LinkedIn URL" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input type="url" name="facebook" value={formData.facebook} onChange={handleInputChange} placeholder="Facebook URL" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
              <input type="url" name="website" value={formData.website} onChange={handleInputChange} placeholder="Website URL" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1" disabled={loading}>{loading ? t('company_dashboard.profile_updating') : t('company_dashboard.profile_update_btn')}</Button>
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={loading}>{t('company_dashboard.profile_cancel')}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ChangePasswordModal({ companyData, onClose }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
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

    const newPasswordValidation = validatePassword(formData.newPassword);
    const newErrors = {};
    if (!formData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!newPasswordValidation.isValid) newErrors.newPassword = 'Password must be at least 10 characters with 1 number and 1 special character';
    if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); setLoading(false); return; }

    try {
      const response = await fetch(`http://localhost:5092/api/companies/${companyData.id}/change-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to change password');
      alert('Password changed successfully!');
      onClose();
    } catch (error) {
      console.error('Error changing password:', error);
      alert(error.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">{t('company_dashboard.profile_change_password_title')}</h3>
        <p className="text-sm text-gray-600 mb-4">{t('company_dashboard.profile_change_password_desc')}</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleInputChange} placeholder={t('company_dashboard.profile_current_password')} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.currentPassword && (<p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>)}
          </div>
          <div>
            <input type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} placeholder={t('company_dashboard.profile_new_password')} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.newPassword && (<p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>)}
          </div>
          <div>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder={t('company_dashboard.profile_confirm_password')} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.confirmPassword && (<p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>)}
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="submit" className="flex-1" disabled={loading}>{loading ? t('company_dashboard.profile_changing') : t('company_dashboard.profile_change_password_title')}</Button>
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={loading}>{t('company_dashboard.profile_cancel')}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProfileCard({ onContact, companyData, onAvatarUpdate, showActions = false }) {
  const { t } = useTranslation();
  const [avatar, setAvatar] = useState(DefaultAvatar);
  const [progress, setProgress] = useState(70);
  const [uploading, setUploading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (companyData) {
      if (companyData.avatar) setAvatar(companyData.avatar);
      if (companyData.profileCompletion) setProgress(companyData.profileCompletion);
    }
  }, [companyData]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert("Please select an image file"); return; }
    if (file.size > 2 * 1024 * 1024) { alert("Image must be under 2MB"); return; }
    if (!companyData?.id) { alert("Please select a company first"); return; }

    try {
      setUploading(true);
      const timestamp = Date.now();
      const fileName = `company-avatars/${companyData.id}/avatar-${timestamp}.${file.name.split('.').pop()}`;
      const storageRef = ref(storage, fileName);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setAvatar(downloadURL);
      await CompanyService.updateCompanyProfile(companyData.id, { avatar: downloadURL });
      onAvatarUpdate && onAvatarUpdate();
      alert("Avatar updated successfully!");
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert("Failed to upload avatar. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const toggleVisibility = async (field) => {
    if (!companyData?.id) return;
    try {
      const newVisibility = { ...companyData.visibility, [field]: !companyData.visibility[field] };

      await CompanyService.updateCompanyProfile(companyData.id, { visibility: newVisibility });
      onAvatarUpdate && onAvatarUpdate();
    } catch (error) {
      console.error('Error updating visibility:', error);
      alert('Failed to update visibility settings');
    }
  };

  return (
    <Card className="p-4 col-span-1 md:col-span-3">
      <div className="flex items-center gap-4">
        <div className="relative">
          <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm" onError={(e) => { e.target.src = DefaultAvatar; }} />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
          <label className={`absolute bottom-0 right-0 p-1 rounded-full transition-colors ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 cursor-pointer hover:bg-green-700'}`}>
            {uploading ? (<Loader2 className="h-4 w-4 text-white animate-spin" />) : (<Upload className="h-4 w-4 text-white" />)}
            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="mt-2">
        <p className="text-xs text-gray-500 italic">{t('company_dashboard.profile_photo_hint')}</p>
      </div>

      <div className="mt-3">
        <p className="font-semibold">{companyData?.name || t('company_dashboard.profile_name_not_set')}</p>
        <p className="text-sm text-gray-500">{companyData?.sector || t('company_dashboard.profile_sector_not_set')}</p>
        <p className="text-sm text-gray-500">📍 {companyData?.location || t('company_dashboard.profile_location_not_set')}</p>

        {companyData?.socialLinks && (
          <div className="mt-2">
            <p className="text-xs font-medium text-gray-600 mb-1">{t('company_dashboard.profile_social_links')}</p>
            <div className="flex gap-2 text-xs">
              {companyData.socialLinks.linkedin && (<a href={companyData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">LinkedIn</a>)}
              {companyData.socialLinks.facebook && (<a href={companyData.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Facebook</a>)}
              {companyData.socialLinks.website && (<a href={companyData.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Website</a>)}
            </div>
          </div>
        )}

        <div className="mt-2 space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">📧 {companyData?.email || t('company_dashboard.profile_email_not_set')}</p>
            <button onClick={() => toggleVisibility('email')} className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${companyData?.visibility?.email ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {companyData?.visibility?.email ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              {companyData?.visibility?.email ? t('company_dashboard.profile_public') : t('company_dashboard.profile_private')}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">📱 {companyData?.phone || t('company_dashboard.profile_phone_not_set')}</p>
            <button onClick={() => toggleVisibility('phone')} className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${companyData?.visibility?.phone ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {companyData?.visibility?.phone ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
              {companyData?.visibility?.phone ? t('company_dashboard.profile_public') : t('company_dashboard.profile_private')}
            </button>
          </div>
        </div>

        {companyData?.paymentMethod && (
          <div className="mt-2">
            <p className="text-xs font-medium text-gray-600">{t('company_dashboard.profile_payment_method')}</p>
            <p className="text-sm text-gray-500">{companyData.paymentMethod.type}: {companyData.paymentMethod.number}{companyData.paymentMethod.verified && <span className="text-green-600 ml-1">✓ {t('company_dashboard.profile_verified')}</span>}</p>
          </div>
        )}

        {companyData?.rccmNif && companyData?.visibility?.rccmNif && (
          <div className="mt-2">
            <p className="text-xs font-medium text-gray-600">{t('company_dashboard.profile_legal_info')}</p>
            <p className="text-sm text-gray-500">RCCM: {companyData.rccmNif.rccm} | NIF: {companyData.rccmNif.nif}{companyData.rccmNif.verified && <span className="text-green-600 ml-1">✓ {t('company_dashboard.profile_verified')}</span>}</p>
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-sm mb-1">{t('company_dashboard.profile_complete_pct', { pct: progress })}</div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
          {companyData?.status?.verified ? t('company_dashboard.profile_verified_badge') : t('company_dashboard.profile_complete_badge')}
        </span>
        {companyData?.status?.topClient && (<span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full">{t('company_dashboard.profile_top_company')}</span>)}
        {companyData?.status?.sme && (<span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">{t('company_dashboard.profile_sme')}</span>)}
      </div>

      <div className="flex items-center gap-1 mt-3 text-yellow-500">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-4 h-4 ${i < Math.floor(companyData?.status?.rating || 0) ? 'fill-yellow-500' : 'text-gray-300'}`} />
        ))}
        <span className="ml-2 text-sm text-gray-600">({companyData?.status?.rating || 0} / 5)</span>
        <span className="ml-2 text-sm text-gray-500">• {companyData?.status?.transactions || 0} {t('company_dashboard.profile_transactions')}</span>
      </div>

      {showActions && (
        <div className="mt-4 space-y-2">
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 text-xs" onClick={() => setShowEditModal(true)}>
              <Edit className="h-3 w-3 mr-1" />
              {t('company_dashboard.profile_edit_btn')}
            </Button>
            <Button variant="outline" className="flex-1 text-xs" onClick={() => setShowPasswordModal(true)}>
              <Lock className="h-3 w-3 mr-1" />
              {t('company_dashboard.profile_change_pwd_btn')}
            </Button>
          </div>
          <Button className="w-full text-xs" onClick={onContact}>{t('company_dashboard.profile_contact_btn')}</Button>
          <Button variant="outline" className="w-full text-xs text-red-600 border-red-300 hover:bg-red-50" onClick={() => setShowDeleteModal(true)}>
            <Trash2 className="h-3 w-3 mr-1" />
            {t('company_dashboard.profile_delete_btn')}
          </Button>
        </div>
      )}

      {showEditModal && (
        <EditProfileModal companyData={companyData} onClose={() => setShowEditModal(false)} onUpdate={onAvatarUpdate} />
      )}
      {showPasswordModal && (
        <ChangePasswordModal companyData={companyData} onClose={() => setShowPasswordModal(false)} />
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-red-600">{t('company_dashboard.profile_delete_title')}</h3>
            <p className="text-sm text-gray-600 mb-4">{t('company_dashboard.profile_delete_desc')}</p>
            <div className="flex gap-2">
              <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={() => { setShowDeleteModal(false); alert('Delete Company Account functionality - Coming Soon!'); }}>{t('company_dashboard.profile_delete_btn')}</Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>{t('company_dashboard.profile_cancel')}</Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}


