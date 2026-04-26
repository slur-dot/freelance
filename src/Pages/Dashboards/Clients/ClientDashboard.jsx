import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { Info, Upload, Star, Edit, MapPin, Phone, ShoppingBag, TrendingUp, Bell, Globe, Shield, Users, Package, MessageCircle } from "lucide-react";
import AlexandraImg from "../../../assets/Alexandra.png";
import LiveChatWidget from "../../../components/Support/LiveChatWidget";
import { ClientService } from "../../../services/clientService";
import { auth } from "../../../firebaseConfig";
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

// Default Avatar (SVG data URL)
const DefaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Crect width='150' height='150' fill='%23e5e7eb'/%3E%3Ctext x='75' y='75' font-family='Arial, sans-serif' font-size='16' fill='%236b7280' text-anchor='middle' dy='.3em'%3EAvatar%3C/text%3E%3C/svg%3E";

// Profile Card Component
function ProfileCard({ profileData, onContact, onRefresh }) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.name || profileData.fullName || "",
        bio: profileData.bio || "",
        location: profileData.location || "",
        whatsapp: profileData.whatsapp || profileData.phone || "",
      });
    }
  }, [profileData]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file && profileData?.id) {
      setUploading(true);
      try {
        await ClientService.uploadAvatar(profileData.id, file);
        onRefresh();
      } catch (error) {
        alert("Failed to upload avatar");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSaveProfile = async () => {
    if (!profileData?.id) return;
    try {
      await ClientService.updateClientProfile(profileData.id, formData);
      setIsEditing(false);
      onRefresh();
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile");
    }
  };

  // Provide defaults if profileData is null (loading)
  const displayProfile = profileData || { name: t('client_dashboard.profile.your_name'), bio: "", location: "", whatsapp: "", verificationStatus: false };
  const avatarSrc = displayProfile.avatar || DefaultAvatar;

  const progress = displayProfile.name && displayProfile.bio && displayProfile.whatsapp ? 100 :
    displayProfile.name && displayProfile.bio ? 75 :
      displayProfile.name ? 50 : 25;

  return (
    <Card className="p-6 col-span-1 md:col-span-3">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={avatarSrc}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 shadow-sm"
              onError={(e) => { e.target.src = DefaultAvatar; }}
            />
            <label className={`absolute bottom-0 right-0 bg-green-600 p-1 rounded-full cursor-pointer hover:bg-green-700 transition-colors ${uploading ? 'opacity-50' : ''}`}>
              <Upload className="h-4 w-4 text-white" />
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" disabled={uploading} />
            </label>
          </div>
          <div className="flex-1">
            {/* Name & Bio Editing Logic */}
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-xl font-bold border border-gray-300 rounded px-2 py-1 block w-full"
                  placeholder={t('client_dashboard.profile.your_name')}
                />
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="text-sm text-gray-600 border border-gray-300 rounded px-2 py-1 w-full block"
                  rows={2}
                  placeholder={t('client_dashboard.profile.bio_placeholder')}
                />
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold">{displayProfile.name || displayProfile.fullName || t('client_dashboard.profile.your_name')}</h2>
                <p className="text-sm text-gray-600">{displayProfile.bio || t('client_dashboard.profile.no_bio')}</p>
                {!displayProfile.avatar && <p className="text-sm text-blue-600 mt-1">{t('client_dashboard.profile.add_photo')}</p>}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="w-4 h-4 mr-1" />
            {isEditing ? t('client_dashboard.profile.cancel') : t('client_dashboard.profile.edit_profile')}
          </Button>
          {isEditing && (
            <Button onClick={handleSaveProfile}>
              {t('client_dashboard.profile.save')}
            </Button>
          )}
        </div>
      </div>

      {/* Contact Info Editing */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          {isEditing ? (
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="border border-gray-300 rounded px-2 py-1"
              placeholder={t('client_dashboard.profile.location_placeholder')}
            />
          ) : (
            <span>{displayProfile.location || t('client_dashboard.profile.location_not_set')}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Phone className="w-4 h-4" />
          {isEditing ? (
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className="border border-gray-300 rounded px-2 py-1"
              placeholder={t('client_dashboard.profile.whatsapp_placeholder')}
            />
          ) : (
            <span>{displayProfile.whatsapp || displayProfile.phone || t('client_dashboard.profile.phone_not_set')}</span>
          )}
        </div>
      </div>

      {/* Progress Bar & Badges */}
      <div className="mb-4">
        <div className="text-sm mb-1">{t('client_dashboard.profile.profile_complete', { progress })}</div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Static Rating for MVP */}
      <div className="flex gap-2 mb-4">
        {displayProfile.verified && <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">{t('client_dashboard.profile.verified')}</span>}
      </div>

      <div className="flex gap-2">
        <Button onClick={onContact}>
          {t('client_dashboard.profile.contact_support')}
        </Button>
      </div>
    </Card>
  );
}

// Recent Orders Component
function RecentOrders({ orders }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // Ensure orders is an array
  const safeOrders = Array.isArray(orders) ? orders : [];

  return (
    <div className="md:col-span-1">
      <h3 className="text-lg font-semibold mb-2">{t('client_dashboard.recent_orders.title')}</h3>
      <Card className="h-[180px] flex flex-col">
        <CardContent className="flex flex-col justify-between flex-grow">
          {safeOrders.length > 0 ? (
            <div className="space-y-2 overflow-y-auto max-h-[100px]">
              {safeOrders.map((order) => {
                // Format order summary safely
                // assuming order.items is array, or take one item name if singular
                const itemName = Array.isArray(order.items) && order.items.length > 0 ? `${order.items[0].name} ${order.items.length > 1 ? `+${order.items.length - 1} more` : ''}` : "Order #" + order.id.slice(0, 5);

                return (
                  <div key={order.id} className="flex justify-between items-center text-sm">
                    <div className="flex flex-col">
                      <span className="font-medium truncate max-w-[120px]">{itemName}</span>
                      <span className="text-xs text-gray-500">{typeof order.totalAmount === 'number' ? order.totalAmount.toLocaleString() + ' GNF' : order.totalAmount}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {order.status || t('client_dashboard.recent_orders.pending')}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 text-sm py-4">
              {t('client_dashboard.recent_orders.no_orders')}
            </div>
          )}
          <Button className="mt-4 w-fit" onClick={() => navigate("/Clients/dashboard/Project-List")}>
            {t('client_dashboard.recent_orders.view_all')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Statistics Component
function Statistics({ stats }) {
  const { t } = useTranslation();
  const realStats = [
    { label: t('client_dashboard.stats.total_spent'), value: stats?.totalSpent ? `${stats.totalSpent.toLocaleString()} GNF` : "0 GNF", icon: TrendingUp },
    { label: t('client_dashboard.stats.orders'), value: stats?.totalOrders || 0, icon: ShoppingBag },
    { label: t('client_dashboard.stats.freelancers_hired'), value: stats?.freelancersHired || 0, icon: Users }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {realStats.map((stat, index) => (
        <div key={index} className="md:col-span-1">
          <h3 className="text-lg font-semibold mb-2">{stat.label}</h3>
          <Card className="h-[180px] flex flex-col">
            <div className="flex flex-row items-center justify-between p-4">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <stat.icon className="h-4 w-4 text-gray-500" />
            </div>
            <CardContent className="flex flex-col justify-between flex-grow">
              <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
              <Button className="mt-4 w-fit" onClick={() => { }}>
                {t('client_dashboard.stats.view_details')}
              </Button>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}

// Device Tracking Component
function DeviceTracking({ devices = [] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="md:col-span-1">
      <h3 className="text-lg font-semibold mb-2">{t('client_dashboard.device_tracking.title')}</h3>
      <Card className="h-[180px] flex flex-col">
        <CardContent className="flex flex-col justify-between flex-grow">
          <div className="space-y-2 overflow-y-auto max-h-[100px]">
            {devices.length > 0 ? (
              devices.map((device) => (
                <div key={device.id} className="flex justify-between items-center text-sm">
                  <div className="flex flex-col">
                    <span className="font-medium">{device.name}</span>
                    <span className="text-xs text-gray-500">{device.location}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${device.ready ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                    {device.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 text-sm py-4">
                {t('client_dashboard.device_tracking.no_tracking')}
              </div>
            )}
          </div>
          <Button className="mt-4 w-fit" onClick={() => navigate("#")}>
            {t('client_dashboard.device_tracking.view_map')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Digital Growth Bundle Component
function DigitalGrowthBundle() {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  return (
    <div className="md:col-span-2">
      <h3 className="text-lg font-semibold mb-2">{t('client_dashboard.growth_bundle.title')}</h3>
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Plan */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-lg font-semibold mb-2">{t('client_dashboard.growth_bundle.free_plan.title')}</h4>
            <ul className="text-sm text-gray-600 space-y-1 mb-4">
              <li>• {t('client_dashboard.growth_bundle.free_plan.purchases')}</li>
              <li>• {t('client_dashboard.growth_bundle.free_plan.no_monitoring')}</li>
              <li>• {t('client_dashboard.growth_bundle.free_plan.support')}</li>
            </ul>
            <Button variant="outline" className="w-full" disabled>
              {t('client_dashboard.growth_bundle.free_plan.current')}
            </Button>
          </div>

          {/* Premium Plan */}
          <div className="border-2 border-green-500 rounded-lg p-4 bg-green-50">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-lg font-semibold">{t('client_dashboard.growth_bundle.premium_plan.title')}</h4>
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">{t('client_dashboard.growth_bundle.premium_plan.limited_slots')}</span>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-bold text-green-600">
                  {selectedPlan === 'monthly' ? '40,000 GNF' : '200,000 GNF'}
                </span>
                <span className="text-sm text-gray-500">
                  /{selectedPlan === 'monthly' ? t('client_dashboard.growth_bundle.premium_plan.month') : t('client_dashboard.growth_bundle.premium_plan.six_months')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm line-through text-gray-500">{t('client_dashboard.growth_bundle.premium_plan.regular_price')}</span>
                <span className="text-xs bg-green-100 text-green-700 px-1 rounded">{t('client_dashboard.growth_bundle.premium_plan.discount')}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">{t('client_dashboard.growth_bundle.premium_plan.total_value')}</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {t('client_dashboard.growth_bundle.premium_plan.features.unlimited')}</li>
                <li>• {t('client_dashboard.growth_bundle.premium_plan.features.monitoring')}</li>
                <li>• {t('client_dashboard.growth_bundle.premium_plan.features.priority')}</li>
                <li>• {t('client_dashboard.growth_bundle.premium_plan.features.guarantee')}</li>
              </ul>
            </div>

            <div className="space-y-2">
              <Button className="w-full">
                {t('client_dashboard.growth_bundle.premium_plan.buy_now')}
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedPlan('monthly')}>
                  {t('client_dashboard.growth_bundle.premium_plan.monthly_btn')}
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setSelectedPlan('semiannual')}>
                  {t('client_dashboard.growth_bundle.premium_plan.semiannual_btn')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Notifications Component
function Notifications({ notifications = [] }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="md:col-span-1">
      <h3 className="text-lg font-semibold mb-2">{t('client_dashboard.notifications.title')}</h3>
      <Card className="h-[180px] flex flex-col">
        <CardContent className="flex flex-col justify-between flex-grow">
          <div className="space-y-2 overflow-y-auto max-h-[100px]">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-2 text-sm">
                  <Bell className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-gray-800">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 text-sm py-4">
                {t('client_dashboard.notifications.none')}
              </div>
            )}
          </div>
          <Button className="mt-4 w-fit" onClick={() => navigate("#")}>
            {t('client_dashboard.notifications.view_all')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ClientDashbaord() {
  const { t } = useTranslation();
  const [showChatWidget, setShowChatWidget] = useState(false);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authResolved, setAuthResolved] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setAuthResolved(true);
    });
    return () => unsubscribe();
  }, []);

  const fetchDashboardData = async () => {
    if (!authResolved) return;
    if (!user) {
      setLoading(false);
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      const [profileData, statsData, notificationsData] = await Promise.all([
        ClientService.getClientProfile(user.uid),
        ClientService.getDashboardStats(user.uid),
        ClientService.getNotifications(user.uid)
      ]);
      setProfile(profileData);
      setStats({ ...statsData, notifications: notificationsData });
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authResolved) {
      fetchDashboardData();
    }
  }, [user, authResolved]);

  if (loading && !stats) {
    return <div className="min-h-screen flex items-center justify-center">Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Quick Management Hub - New Prominent Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
           <div className="space-y-2 text-center md:text-left">
              <h2 className="text-3xl font-bold">{t('freelancer_dashboard.welcome', 'Welcome back,')} {profile?.name || profile?.fullName || user?.displayName || 'Client'}!</h2>
              <p className="text-blue-100 font-medium">{t('client_dashboard.hub_desc', 'Manage your purchases, hire freelancers, and track your global progress from your centralized client hub.')}</p>
           </div>
           <div className="flex flex-wrap justify-center gap-4">
              <Link to="/Clients/dashboard/Project-List" className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-blue-50 transition-all active:scale-95 whitespace-nowrap">
                 {t('client_dashboard.go_to_hub', 'View Purchases')}
              </Link>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Profile Card */}
        <ProfileCard
          profileData={profile}
          onContact={() => setShowChatWidget(true)}
          onRefresh={fetchDashboardData}
        />

        {/* Statistics */}
        <Statistics stats={stats} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Recent Orders */}
          <RecentOrders orders={stats?.recentOrders} />

          {/* Device Tracking (Placeholder data passed for now until backend supports it, currently empty) */}
          <DeviceTracking devices={[]} />

          {/* Notifications */}
          <Notifications notifications={stats?.notifications} />
        </div>

        {/* Digital Growth Bundle */}
        <DigitalGrowthBundle />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2 flex flex-col">
            <h3 className="text-lg font-semibold">{t('client_dashboard.purchase_history.title')}</h3>
            <Card className="h-[520px]">
              <CardContent className="flex flex-col items-center justify-center p-4 text-center h-full">
                <div className="w-full text-left mb-4 bg-gray-50">
                  <div className="grid grid-cols-4 gap-4 font-semibold text-sm text-gray-600 border-b border-gray-100 pb-5 p-4">
                    <div>{t('client_dashboard.purchase_history.date')}</div>
                    <div>{t('client_dashboard.purchase_history.product')}</div>
                    <div>{t('client_dashboard.purchase_history.status')}</div>
                    <div>{t('client_dashboard.purchase_history.amount')}</div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center flex-grow">
                  <h4 className="text-xl font-bold mb-2">{t('client_dashboard.purchase_history.start')}</h4>
                  <p className="text-gray-500 w-full">
                    {t('client_dashboard.purchase_history.desc')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Messages Section (right) */}
          <div className="md:col-span-1 md:row-span-2 flex flex-col">
            <h3 className="text-lg font-semibold mb-2">{t('client_dashboard.messages.title')}</h3>
            <Card className="flex-grow">
              <CardContent className="flex flex-col h-full p-0">
                <div className="flex-grow overflow-y-auto max-h-[300px] md:max-h-none flex items-center justify-center">
                  <div className="text-gray-500 text-sm p-4 text-center">
                    {t('client_dashboard.messages.none')}
                  </div>
                </div>
                <div className="p-4 border-t">
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => setShowChatWidget(true)}
                  >
                    {t('client_dashboard.messages.start_chat')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* LiveChatWidget */}
      {showChatWidget && <LiveChatWidget forceOpen={true} />}
    </div>
  );
}
