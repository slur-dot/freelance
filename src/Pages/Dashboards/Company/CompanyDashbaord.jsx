import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Info, Upload, Star, Loader2, Eye, EyeOff, Edit, Lock, Trash2, ExternalLink } from "lucide-react";
import AlexandraImg from "../../../assets/Alexandra.png";
import LiveChatWidget from "../../../components/Support/LiveChatWidget";
import CompanyStatsDashboard from "../../../components/CompanyStatsDashboard";
import ProfileCard from "./components/ProfileCard";
import { storage, auth } from "../../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import GamificationProfile from "./components/GamificationProfile";
import { ActiveContracts, RecentPurchases } from "./components/ContractsAndPurchases";
import EmployeeManagement from "./components/EmployeeManagement";
import { CompanyService } from "../../../services/companyService";
import EnhancedNotifications from "./components/EnhancedNotifications";

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
        <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
              <input
                type="text"
                name="sector"
                value={formData.sector}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Number</label>
              <input
                type="tel"
                name="paymentNumber"
                value={formData.paymentNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Social Links</label>
            <div className="space-y-2">
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder="LinkedIn URL"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                placeholder="Facebook URL"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="Website URL"
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
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
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

      alert('Password changed successfully!');
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
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <p className="text-sm text-gray-600 mb-4">
          Please set a new password for security. Minimum 10 characters,
          1 number, 1 special character.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              placeholder="Current Password"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              placeholder="New Password"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.newPassword ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm New Password"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ProfileCard moved to components/ProfileCard.jsx

// Gamification Profile Component
function GamificationProfileLegacy({ gamificationData }) {
  if (!gamificationData) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Gamification Profile</h3>
        <div className="text-center text-gray-500">
          <p>Loading gamification data...</p>
        </div>
      </Card>
    );
  }

  const { trainingProgress, financialBreakdown, achievements, level, points } = gamificationData;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Gamification Profile</h3>

      {/* Training Progress */}
      <div className="mb-6">
        <h4 className="text-md font-semibold mb-3 text-green-600">Training Progress</h4>
        <div className="space-y-3">
          {trainingProgress.completedCourses.map((course, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium">{course.title}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
              <span className="text-green-600 font-semibold">100%</span>
            </div>
          ))}
          {trainingProgress.inProgressCourses.map((course, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium">{course.title}</p>
                <p className="text-sm text-gray-600">{course.cost.toLocaleString()} GNF - {course.status}</p>
              </div>
              <span className="text-yellow-600 font-semibold">{course.progress}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Breakdown */}
      <div className="mb-6">
        <h4 className="text-md font-semibold mb-3 text-blue-600">Financial Breakdown</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Spent</p>
            <p className="text-lg font-semibold">{financialBreakdown.totalSpent.toLocaleString()} GNF</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600">Freelance Spending</p>
            <p className="text-lg font-semibold">{financialBreakdown.freelanceSpending.toLocaleString()} GNF</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600">Seller Purchases</p>
            <p className="text-lg font-semibold">{financialBreakdown.sellerPurchases.toLocaleString()} GNF</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Training Costs</p>
            <p className="text-lg font-semibold">{financialBreakdown.trainingCosts.toLocaleString()} GNF</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h4 className="text-md font-semibold mb-3 text-purple-600">Achievements</h4>
        <div className="space-y-2">
          {achievements.map((achievement, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">{achievement.title}</p>
                <p className="text-xs text-gray-600">{achievement.description}</p>
              </div>
              <span className="text-purple-600 font-semibold text-sm">+{achievement.points} pts</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">Level {level}</span>
          <span className="text-sm font-semibold text-purple-600">{points} points</span>
        </div>
      </div>
    </Card>
  );
}

// Active Contracts Component
function ActiveContractsLegacy({ contracts }) {
  if (!contracts || contracts.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Active Contracts</h3>
        <div className="text-center text-gray-500">
          <p>No active contracts found</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Active Contracts (Freelance-224)</h3>
      <div className="space-y-4">
        {contracts.filter(c => c.status === 'active').map((contract, index) => (
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
              Provider: {contract.provider}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

// Recent Purchases Component
function RecentPurchasesLegacy({ purchases }) {
  if (!purchases || purchases.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Purchases (Sellers)</h3>
        <div className="text-center text-gray-500">
          <p>No purchases found</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Purchases (Sellers)</h3>
      <div className="space-y-3">
        {purchases.slice(0, 5).map((purchase, index) => (
          <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium">{purchase.item}</p>
              <p className="text-sm text-gray-600">Seller: {purchase.seller}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold">{purchase.amount.toLocaleString()} GNF</p>
              <span className={`px-2 py-1 text-xs rounded-full ${purchase.status === 'delivered'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
                }`}>
                {purchase.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
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
        <h3 className="text-lg font-semibold">Employee Management</h3>
        <Button onClick={handleAddEmployee} className="text-sm">
          Add Employee
        </Button>
      </div>

      {employees && employees.length > 0 ? (
        <div className="space-y-3">
          {employees.map((employee, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium">{employee.name}</p>
                <p className="text-sm text-gray-600">{employee.role}</p>
                {employee.assignedDevice && (
                  <p className="text-xs text-blue-600">Device: {employee.assignedDevice}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{employee.email}</p>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                  {employee.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <p>No employees found</p>
          <p className="text-sm">Add your first employee to get started</p>
        </div>
      )}
    </Card>
  );
}

// Enhanced Notifications Component
function EnhancedNotificationsLegacy({ notifications }) {
  if (!notifications || notifications.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Notifications</h3>
        <div className="text-center text-gray-500">
          <p>No notifications found</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>
      <div className="space-y-3">
        {notifications.slice(0, 7).map((notification, index) => (
          <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${!notification.read ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-gray-50'
            }`}>
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1">
              <p className="font-medium text-sm">{notification.title}</p>
              <p className="text-sm text-gray-600">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
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
    if (!user) return;

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
            <h3 className="text-yellow-800 font-medium">Using Offline Mode</h3>
            <p className="text-yellow-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Company Dashboard</h1>
        <p className="text-gray-600">Fatoumata SARL - Trader in Matam</p>
        {error && (
          <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-md p-2">
            <p className="text-yellow-700 text-sm">
              ⚠️ Using offline mode - {error}
            </p>
          </div>
        )}
      </div>

      {/* Company Selector removed - only Fatoumata SARL available */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Profile Card */}
        <ProfileCard
          onContact={() => setShowChatWidget(true)}
          companyData={selectedCompany}
          onAvatarUpdate={handleAvatarUpdate}
        />

        {/* Transactions Card */}
        <div className="md:col-span-1 w-full">
          <h3 className="text-base md:text-lg font-semibold mb-2">Total Transactions</h3>
          <Card className="h-[180px] flex flex-col">
            <div className="flex flex-row items-center justify-between pb-2 p-4">
              <p className="text-sm font-medium text-gray-500">Completed Transactions</p>
              <Info className="h-4 w-4 text-gray-500" />
            </div>
            <CardContent className="flex flex-col justify-between flex-grow p-4">
              <div className="text-2xl sm:text-4xl font-bold">
                {selectedCompany?.status?.transactions || 0} Transactions
              </div>
              <Button className="mt-4 w-full sm:w-fit" onClick={() => navigate("#")}>
                View Transactions
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Profile Completion Card */}
        <div className="md:col-span-1 w-full">
          <h3 className="text-base md:text-lg font-semibold mb-2">Profile Completion</h3>
          <Card className="h-[180px] flex flex-col">
            <div className="flex flex-row items-center justify-between pb-2 p-4">
              <p className="text-sm font-medium text-gray-500">Profile Completion Status</p>
              <Info className="h-4 w-4 text-gray-500" />
            </div>
            <CardContent className="flex flex-col justify-between flex-grow p-4">
              <div className="text-2xl sm:text-4xl font-bold">
                {selectedCompany?.profileCompletion || 0}%
              </div>
              <Button className="mt-4 w-full sm:w-fit" onClick={() => navigate("#")}>
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Messages Section - Data comes from CompanyStatsDashboard */}
        <div className="md:col-span-1 md:row-span-2 flex flex-col w-full">
          <h3 className="text-base md:text-lg font-semibold mb-2">Current Queries</h3>
          <Card className="flex-grow">
            <CardContent className="flex flex-col h-full p-0">
              <div className="flex-grow overflow-y-auto max-h-[300px] md:max-h-none">
                {messages.length > 0 ? (
                  <>
                    {messages.slice(0, 7).map((message, index) => (
                      <div key={message.id} className="flex items-center gap-3 p-4 border-b last:border-b-0">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <img src={AlexandraImg} alt={message.from} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-grow">
                          <p className="font-semibold">{message.from}</p>
                          <p className="text-sm text-gray-500">
                            {message.message.length > 50
                              ? `${message.message.substring(0, 50)}...`
                              : message.message
                            }
                          </p>
                        </div>
                      </div>
                    ))}
                    {messages.length > 7 && (
                      <div className="text-center text-xs text-gray-500 p-4">
                        +{messages.length - 7} more messages
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    No messages yet
                  </div>
                )}
              </div>
              <div className="p-4 border-t">
                <Button variant="ghost" className="w-full" onClick={() => setShowChatWidget(true)}>
                  MANAGE MESSAGES
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Employee Management Section */}
        <div className="md:col-span-2 flex flex-col w-full">
          <EmployeeManagement
            employees={dashboardData?.employees}
          />
        </div>
      </div>

      {/* Enhanced Dashboard Sections */}
      {dashboardData && (
        <div className="mt-8 max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold mb-6">Company Analytics & Management</h2>

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
      )}

      {/* Company Statistics Dashboard */}
      {selectedCompany && (
        <div className="mt-8 max-w-7xl mx-auto">
          <CompanyStatsDashboard companyId={selectedCompany.id} />
        </div>
      )}


      {/* LiveChatWidget */}
      {showChatWidget && <LiveChatWidget forceOpen={true} />}
    </div>
  );
}
