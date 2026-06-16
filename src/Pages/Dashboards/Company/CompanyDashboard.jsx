import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Info, Upload, Star, Loader2, Eye, EyeOff, Edit, Lock, Trash2, ExternalLink } from "lucide-react";
import AlexandraImg from "../../../assets/Alexandra.png";
import LiveChatWidget from "../../../components/Support/LiveChatWidget";
import CompanyStatsDashboard from "../../../components/CompanyStatsDashboard";
import ProfileCard from "./components/ProfileCard";
import PhoneInput from "../../../components/PhoneInput";
import { storage, auth } from "../../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import GamificationProfile from "./components/GamificationProfile";
import { ActiveContracts, RecentPurchases } from "./components/ContractsAndPurchases";
import EmployeeManagement from "./components/EmployeeManagement";
import { CompanyService } from "../../../services/companyService";
import EnhancedNotifications from "./components/EnhancedNotifications";
import { useTranslation } from "react-i18next";

// Button Component
function Button({ children, className = "", variant = "default", disabled, ...props }) {
  const baseStyles =
  variant === "outline" ?
  "border border-gray-300 text-gray-500 bg-transparent hover:bg-gray-100" :
  variant === "ghost" ?
  "text-black hover:bg-gray-50" :
  "bg-green-600 hover:bg-green-700 text-white";
  return (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition ${baseStyles} ${className}`}
      disabled={disabled}
      {...props}>
      
      {children}
    </button>);

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

// Default Avatar (online fallback)
const DefaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23e5e7eb'/%3E%3Ctext x='75' y='75' font-family='Arial, sans-serif' font-size='16' fill='%236b7280' text-anchor='middle' dy='.3em'%3EAvatar%3C/text%3E%3C/svg%3E";

// Edit Profile Modal Component
function EditProfileModal({ companyData, onClose, onUpdate }) {
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
    setFormData((prev) => ({
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

      alert(t("profile_updated_successfully_493", "Profile updated successfully!"));
      onUpdate(); // Refresh data
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(t("failed_to_update_profile_please_try_again_125", "Failed to update profile. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-4">{t("edit_profile_511", "Edit Profile")}</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("company_name_226", "Company Name")}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required />
              
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("sector_527", "Sector")}</label>
              <input
                type="text"
                name="sector"
                value={formData.sector}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required />
              
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("location_766", "Location")}</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required />
              
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("email_333", "Email")}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required />
              
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("phone_957", "Phone")}</label>
              <PhoneInput
                value={formData.phone}
                onChange={(val) => setFormData((prev) => ({ ...prev, phone: val }))}
                countryCode={phoneCountryCode}
                onCountryCodeChange={setPhoneCountryCode}
                className="rounded-md"
                required />
              
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t("payment_number_351", "Payment Number")}</label>
              <PhoneInput
                value={formData.paymentNumber}
                onChange={(val) => setFormData((prev) => ({ ...prev, paymentNumber: val }))}
                countryCode={paymentCountryCode}
                onCountryCodeChange={setPaymentCountryCode}
                className="rounded-md"
                required />
              
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t("social_links_305", "Social Links")}</label>
            <div className="space-y-2">
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder={t("linkedin_url_620", "LinkedIn URL")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
              
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                placeholder={t("facebook_url_395", "Facebook URL")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
              
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder={t("website_url_424", "Website URL")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
              
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}>
              
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading}>
              {t("cancel_438", "Cancel")}
            
            </Button>
          </div>
        </form>
      </div>
    </div>);

}

// Change Password Modal Component
function ChangePasswordModal({ companyData, onClose }) {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 10;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      minLength,
      hasNumber,
      hasSpecialChar,
      isValid: minLength && hasNumber && hasSpecialChar
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validation
    const newPasswordValidation = validatePassword(formData.newPassword);
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!newPasswordValidation.isValid) {
      newErrors.newPassword = 'Password must be at least 10 characters with 1 number and 1 special character';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");

      // Re-authenticate user
      const credential = EmailAuthProvider.credential(user.email, formData.currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, formData.newPassword);

      alert(t("password_changed_successfully_340", "Password changed successfully!"));
      onClose();
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.code === 'auth/wrong-password') {
        setErrors({ currentPassword: 'Incorrect current password' });
      } else {
        alert(error.message || 'Failed to change password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">{t("change_password_192", "Change Password")}</h3>
        <p className="text-sm text-gray-600 mb-4">
          {t("please_set_a_new_password_for_security_minimum_10_476", "Please set a new password for security. Minimum 10 characters,\n          1 number, 1 special character.")}
        
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder={t("current_password_775", "Current Password")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'}`
              } />
            
            {errors.currentPassword &&
            <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
            }
          </div>

          <div>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder={t("new_password_983", "New Password")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.newPassword ? 'border-red-500' : 'border-gray-300'}`
              } />
            
            {errors.newPassword &&
            <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
            }
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder={t("confirm_new_password_499", "Confirm New Password")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`
              } />
            
            {errors.confirmPassword &&
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            }
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}>
              
              {loading ? 'Changing...' : 'Change Password'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading}>
              {t("cancel_275", "Cancel")}
            
            </Button>
          </div>
        </form>
      </div>
    </div>);

}

// ProfileCard moved to components/ProfileCard.jsx

// Gamification Profile Component
function GamificationProfileLegacy({ gamificationData }) {
  if (!gamificationData) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t("gamification_profile_571", "Gamification Profile")}</h3>
        <div className="text-center text-gray-500">
          <p>{t("loading_gamification_data_771", "Loading gamification data...")}</p>
        </div>
      </Card>);

  }

  const { trainingProgress, financialBreakdown, achievements, level, points } = gamificationData;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{t("gamification_profile_195", "Gamification Profile")}</h3>

      {/* Training Progress */}
      <div className="mb-6">
        <h4 className="text-md font-semibold mb-3 text-green-600">{t("training_progress_453", "Training Progress")}</h4>
        <div className="space-y-3">
          {trainingProgress.completedCourses.map((course, index) =>
          <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium">{course.title}</p>
                <p className="text-sm text-gray-600">{t("completed_18", "Completed")}</p>
              </div>
              <span className="text-green-600 font-semibold">100%</span>
            </div>
          )}
          {trainingProgress.inProgressCourses.map((course, index) =>
          <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium">{course.title}</p>
                <p className="text-sm text-gray-600">{course.cost.toLocaleString()} {t("gnf__288", "GNF -")} {course.status}</p>
              </div>
              <span className="text-yellow-600 font-semibold">{course.progress}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Financial Breakdown */}
      <div className="mb-6">
        <h4 className="text-md font-semibold mb-3 text-blue-600">{t("financial_breakdown_242", "Financial Breakdown")}</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">{t("total_spent_326", "Total Spent")}</p>
            <p className="text-lg font-semibold">{financialBreakdown.totalSpent.toLocaleString()} {t("gnf_167", "GNF")}</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">{t("freelance_spending_470", "Freelance Spending")}</p>
            <p className="text-lg font-semibold">{financialBreakdown.freelanceSpending.toLocaleString()} {t("gnf_14", "GNF")}</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">{t("seller_purchases_200", "Seller Purchases")}</p>
            <p className="text-lg font-semibold">{financialBreakdown.sellerPurchases.toLocaleString()} {t("gnf_370", "GNF")}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">{t("training_costs_537", "Training Costs")}</p>
            <p className="text-lg font-semibold">{financialBreakdown.trainingCosts.toLocaleString()} {t("gnf_667", "GNF")}</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h4 className="text-md font-semibold mb-3 text-purple-600">{t("achievements_162", "Achievements")}</h4>
        <div className="space-y-2">
          {achievements.map((achievement, index) =>
          <div key={index} className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">{achievement.title}</p>
                <p className="text-xs text-gray-600">{achievement.description}</p>
              </div>
              <span className="text-purple-600 font-semibold text-sm">+{achievement.points} pts</span>
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">{t("level_609", "Level")} {level}</span>
          <span className="text-sm font-semibold text-purple-600">{points} points</span>
        </div>
      </div>
    </Card>);

}

// Active Contracts Component
function ActiveContractsLegacy({ contracts }) {
  if (!contracts || contracts.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t("active_contracts_148", "Active Contracts")}</h3>
        <div className="text-center text-gray-500">
          <p>{t("no_active_contracts_found_627", "No active contracts found")}</p>
        </div>
      </Card>);

  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{t("active_contracts_freelance224_405", "Active Contracts (Freelance-224)")}</h3>
      <div className="space-y-4">
        {contracts.filter((c) => c.status === 'active').map((contract, index) =>
        <div key={index} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{contract.title}</h4>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                {contract.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{contract.device}</p>
            <p className="text-lg font-semibold text-green-600">
              {contract.monthlyCost.toLocaleString()} GNF/month
            </p>
            <p className="text-xs text-gray-500">
              {t("provider_210", "Provider:")} {contract.provider}
            </p>
          </div>
        )}
      </div>
    </Card>);

}

// Recent Purchases Component
function RecentPurchasesLegacy({ purchases }) {
  if (!purchases || purchases.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t("recent_purchases_sellers_510", "Recent Purchases (Sellers)")}</h3>
        <div className="text-center text-gray-500">
          <p>{t("no_purchases_found_843", "No purchases found")}</p>
        </div>
      </Card>);

  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{t("recent_purchases_sellers_667", "Recent Purchases (Sellers)")}</h3>
      <div className="space-y-3">
        {purchases.slice(0, 5).map((purchase, index) =>
        <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium">{purchase.item}</p>
              <p className="text-sm text-gray-600">{t("seller_324", "Seller:")} {purchase.seller}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{purchase.amount.toLocaleString()} {t("gnf_493", "GNF")}</p>
              <span className={`px-2 py-1 text-xs rounded-full ${purchase.status === 'delivered' ?
            'bg-green-100 text-green-700' :
            'bg-yellow-100 text-yellow-700'}`
            }>
                {purchase.status}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>);

}

// Employee Management Component
function EmployeeManagementLegacy({ employees }) {
  const navigate = useNavigate();

  const handleAddEmployee = () => {
    navigate('/company/dashboard/emplolyee-list');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{t("employee_management_135", "Employee Management")}</h3>
        <Button onClick={handleAddEmployee} className="text-sm">
          {t("add_employee_566", "Add Employee")}
        </Button>
      </div>

      {employees && employees.length > 0 ?
      <div className="space-y-3">
          {employees.map((employee, index) =>
        <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium">{employee.name}</p>
                <p className="text-sm text-gray-600">{employee.role}</p>
                {employee.assignedDevice &&
            <p className="text-xs text-blue-600">{t("device_137", "Device:")} {employee.assignedDevice}</p>
            }
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{employee.email}</p>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                  {employee.status}
                </span>
              </div>
            </div>
        )}
        </div> :

      <div className="text-center text-gray-500 py-8">
          <p>{t("no_employees_found_225", "No employees found")}</p>
          <p className="text-sm">{t("add_your_first_employee_to_get_started_608", "Add your first employee to get started")}</p>
        </div>
      }
    </Card>);

}

// Enhanced Notifications Component
function EnhancedNotificationsLegacy({ notifications }) {
  if (!notifications || notifications.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t("notifications_970", "Notifications")}</h3>
        <div className="text-center text-gray-500">
          <p>{t("no_notifications_found_416", "No notifications found")}</p>
        </div>
      </Card>);

  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{t("recent_notifications_930", "Recent Notifications")}</h3>
      <div className="space-y-3">
        {notifications.slice(0, 7).map((notification, index) =>
        <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${!notification.read ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-gray-50'}`
        }>
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1">
              <p className="font-medium text-sm">{notification.title}</p>
              <p className="text-sm text-gray-600">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>);

}

// Utility function to safely handle Firestore timestamps
function formatTimestamp(timestamp) {
  if (!timestamp) return new Date();

  // Handle Firestore timestamp with _seconds property (Firestore format)
  if (timestamp._seconds) {
    return new Date(timestamp._seconds * 1000);
  }

  // Handle Firestore timestamp with seconds property (alternative format)
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000);
  }

  // Handle regular Date object or timestamp
  if (timestamp instanceof Date) {
    return timestamp;
  }

  // Handle string or number timestamp
  return new Date(timestamp);
}

export default function CompanyDashboard() {
  const { t } = useTranslation();
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Fetch dashboard data
  const loadDashboardData = async (companyId) => {
    try {
      const data = await CompanyService.getDashboardData(companyId);
      setDashboardData(data);
      setMessages(data.notifications || []); // Assuming notifications are used as messages for now or fetch separately
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      // setDashboardData(null); // Keep previous data or set null
    }
  };

  // Fetch company data for the logged-in user
  const fetchMyCompany = async () => {
    if (!user) {
      setLoading(false);
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Fetch Profile
      const profile = await CompanyService.getCompanyProfile(user.uid);

      if (profile) {
        const companyProfile = { ...profile, id: user.uid };
        setSelectedCompany(companyProfile);
        setCompanies([companyProfile]);

        // 2. Load related dashboard data
        await loadDashboardData(user.uid);

      } else {
        setError("Company profile not completed. Please finish setup.");
      }
    } catch (err) {
      setError(`Failed to load company data: ${err.message}`);
      console.error('Error fetching company:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCompany();
  }, [user]);

  // Handle avatar update and profile updates
  const handleAvatarUpdate = () => {
    fetchMyCompany();
  };

  // Company selector removed - only Fatoumata SARL is available

  if (error && !selectedCompany) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h3 className="text-yellow-800 font-medium">{t("using_offline_mode_583", "Using Offline Mode")}</h3>
            <p className="text-yellow-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Quick Management Hub - New Prominent Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="space-y-2 text-center md:text-left">
              <h2 className="text-3xl font-bold">{t("welcome_back_849", "Welcome back,")} {selectedCompany?.name || 'Fatoumata SARL'}!</h2>
              <p className="text-blue-100 font-medium">{t("manage_your_contracts_job_postings_and_company_p_281", "Manage your contracts, job postings, and company profile from your centralized business hub.")}</p>
           </div>
           <div className="flex flex-wrap justify-center gap-4">
              <Link to="/company/dashboard/contracts" className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-50 transition-all active:scale-95 whitespace-nowrap">
                 {t("manage_contracts_884", "Manage Contracts")}
              </Link>
           </div>
        </div>
      </div>
      <div className="mb-6 max-w-7xl mx-auto">
        {error &&
        <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-md p-2">
            <p className="text-yellow-700 text-sm">
              {t("_using_offline_mode__124", "\u26A0\uFE0F Using offline mode -")} {error}
            </p>
          </div>
        }
      </div>

      {/* Company Selector removed - only Fatoumata SARL available */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Profile Card */}
        <ProfileCard
          onContact={() => setShowChatWidget(true)}
          companyData={selectedCompany}
          onAvatarUpdate={handleAvatarUpdate} />
        

        {/* Transactions Card */}
        <div className="md:col-span-1 w-full">
          <h3 className="text-base md:text-lg font-semibold mb-2">{t('company_dashboard.dashboard_total_transactions')}</h3>
          <Card className="h-[180px] flex flex-col">
            <div className="flex flex-row items-center justify-between pb-2 p-4">
              <p className="text-sm font-medium text-gray-500">{t('company_dashboard.dashboard_completed_transactions')}</p>
              <Info className="h-4 w-4 text-gray-500" />
            </div>
            <CardContent className="flex flex-col justify-between flex-grow p-4">
              <div className="text-2xl sm:text-4xl font-bold">
                {selectedCompany?.status?.transactions || 0} {t('company_dashboard.dashboard_transactions_label')}
              </div>
              <Button className="mt-4 w-full sm:w-fit" onClick={() => navigate("/company/dashboard/transactions")}>
                {t('company_dashboard.dashboard_view_transactions')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Profile Completion Card */}
        <div className="md:col-span-1 w-full">
          <h3 className="text-base md:text-lg font-semibold mb-2">{t('company_dashboard.dashboard_profile_completion_title')}</h3>
          <Card className="h-[180px] flex flex-col">
            <div className="flex flex-row items-center justify-between pb-2 p-4">
              <p className="text-sm font-medium text-gray-500">{t('company_dashboard.dashboard_profile_completion_status')}</p>
              <Info className="h-4 w-4 text-gray-500" />
            </div>
            <CardContent className="flex flex-col justify-between flex-grow p-4">
              <div className="text-2xl sm:text-4xl font-bold">
                {selectedCompany?.profileCompletion || 0}%
              </div>
              <Button className="mt-4 w-full sm:w-fit" onClick={() => navigate("/company/dashboard/profile")}>
                {t('company_dashboard.dashboard_complete_profile_btn')}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Messages Section - Data comes from CompanyStatsDashboard */}
        <div className="md:col-span-1 md:row-span-2 flex flex-col w-full">
          <h3 className="text-base md:text-lg font-semibold mb-2">{t('company_dashboard.dashboard_current_queries')}</h3>
          <Card className="flex-grow">
            <CardContent className="flex flex-col h-full p-0">
              <div className="flex-grow overflow-y-auto max-h-[300px] md:max-h-none">
                {messages.length > 0 ?
                <>
                    {messages.slice(0, 7).map((message, index) =>
                  <div key={message.id} className="flex items-center gap-3 p-4 border-b last:border-b-0">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <img src={AlexandraImg} alt={message.from} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <p className="font-semibold">{message.from}</p>
                          <p className="text-sm text-gray-500">
                            {message.message.length > 50 ?
                        `${message.message.substring(0, 50)}...` :
                        message.message
                        }
                          </p>
                        </div>
                      </div>
                  )}
                    {messages.length > 7 &&
                  <div className="text-center text-xs text-gray-500 p-4">
                        +{messages.length - 7} {t('company_dashboard.dashboard_more_messages')}
                      </div>
                  }
                  </> :

                <div className="p-4 text-center text-gray-500">
                    {t('company_dashboard.dashboard_no_messages')}
                  </div>
                }
              </div>
              <div className="p-4 border-t">
                <Button variant="ghost" className="w-full" onClick={() => setShowChatWidget(true)}>
                  {t('company_dashboard.dashboard_manage_messages')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee Management Section */}
        <div className="md:col-span-2 flex flex-col w-full">
          <EmployeeManagement
            employees={dashboardData?.employees} />
          
        </div>
      </div>

      {/* Enhanced Dashboard Sections */}
      {dashboardData &&
      <div className="mt-8 max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">{t('company_dashboard.dashboard_analytics_title')}</h2>

          {/* Gamification Profile */}
          <div className="mb-8">
            <GamificationProfile gamificationData={dashboardData.gamification} />
          </div>

          {/* Contracts and Purchases */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <ActiveContracts contracts={dashboardData.contracts} />
            <RecentPurchases purchases={dashboardData.purchases} />
          </div>

          {/* Enhanced Notifications */}
          <div className="mb-8">
            <EnhancedNotifications notifications={dashboardData.notifications} />
          </div>
        </div>
      }

      {/* Company Statistics Dashboard */}
      {selectedCompany &&
      <div className="mt-8 max-w-7xl mx-auto">
          <CompanyStatsDashboard companyId={selectedCompany.id} />
        </div>
      }


      {/* LiveChatWidget */}
      {showChatWidget && <LiveChatWidget forceOpen={true} />}
    </div>);

}