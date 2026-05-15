import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { auth } from '../../firebaseConfig';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, deleteUser } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Button({ children, className = "", variant = "default", disabled, ...props }) {
  const baseStyles =
    variant === "outline"
      ? "border border-gray-300 text-gray-500 bg-transparent hover:bg-gray-100"
      : variant === "ghost"
        ? "text-black hover:bg-gray-50"
        : variant === "danger"
          ? "bg-red-600 hover:bg-red-700 text-white"
          : "bg-green-600 hover:bg-green-700 text-white";
  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition ${baseStyles} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export function ChangePasswordModal({ onClose }) {
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
    const minLength = password.length >= 6;
    return { minLength, isValid: minLength };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const newPasswordValidation = validatePassword(formData.newPassword);
    const newErrors = {};
    if (!formData.currentPassword) newErrors.currentPassword = t('security_modals.req_current', 'Current password is required');
    if (!newPasswordValidation.isValid) newErrors.newPassword = t('security_modals.req_length', 'Password must be at least 6 characters');
    if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = t('security_modals.req_match', 'Passwords do not match');
    
    if (Object.keys(newErrors).length > 0) { 
      setErrors(newErrors); 
      setLoading(false); 
      return; 
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");

      // Re-authenticate
      const credential = EmailAuthProvider.credential(user.email, formData.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, formData.newPassword);
      
      alert(t('security_modals.pwd_success', 'Password changed successfully!'));
      onClose();
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setErrors({ currentPassword: t('security_modals.err_wrong_pwd', 'Incorrect current password') });
      } else {
        alert(error.message || t('security_modals.err_general', 'Failed to change password. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">{t('company_dashboard.profile_change_password_title', 'Change Password')}</h3>
        <p className="text-sm text-gray-600 mb-4">{t('company_dashboard.profile_change_password_desc', 'Enter your current password and a new secure password.')}</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleInputChange} placeholder={t('company_dashboard.profile_current_password', 'Current Password')} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.currentPassword && (<p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>)}
          </div>
          <div>
            <input type="password" name="newPassword" value={formData.newPassword} onChange={handleInputChange} placeholder={t('company_dashboard.profile_new_password', 'New Password')} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.newPassword && (<p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>)}
          </div>
          <div>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder={t('company_dashboard.profile_confirm_password', 'Confirm New Password')} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} />
            {errors.confirmPassword && (<p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>)}
          </div>
          <div className="flex gap-2 mt-4">
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={loading}>{loading ? t('company_dashboard.profile_changing', 'Changing...') : t('company_dashboard.profile_change_pwd_btn', 'Change Password')}</Button>
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={loading}>{t('company_dashboard.profile_cancel', 'Cancel')}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function DeleteAccountModal({ onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!password) {
      setError(t('security_modals.req_pwd_delete', 'Please enter your password to confirm deletion'));
      setLoading(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No authenticated user");

      // Re-authenticate
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // Delete user
      await deleteUser(user);
      
      alert(t('security_modals.delete_success', 'Your account has been successfully deleted.'));
      onClose();
      navigate('/');
    } catch (err) {
      console.error('Error deleting account:', err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError(t('security_modals.err_wrong_pwd', 'Incorrect password'));
      } else {
        setError(err.message || t('security_modals.err_delete_general', 'Failed to delete account. Please try again.'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4 text-red-600">{t('company_dashboard.profile_delete_title', 'Delete Account')}</h3>
        <p className="text-sm text-gray-600 mb-4 font-bold">{t('profile.delete_account_warning', 'Deleting your account is permanent and cannot be undone. All your data will be lost.')}</p>
        <p className="text-sm text-gray-600 mb-4">{t('security_modals.confirm_delete_msg', 'Please enter your password to confirm this action.')}</p>
        
        <form onSubmit={handleDelete} className="space-y-3">
          <div>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => { setPassword(e.target.value); setError(''); }} 
              placeholder={t('company_dashboard.profile_current_password', 'Password')} 
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${error ? 'border-red-500' : 'border-gray-300'}`} 
            />
            {error && (<p className="text-red-500 text-xs mt-1">{error}</p>)}
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button type="submit" variant="danger" className="flex-1" disabled={loading}>{loading ? t('security_modals.deleting', 'Deleting...') : t('company_dashboard.profile_delete_btn', 'Delete Account')}</Button>
            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={loading}>{t('company_dashboard.profile_cancel', 'Cancel')}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
