import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { auth, db } from "../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import ProfileLayout from "../Common/ProfileLayout";
import PaymentManagement from "../../../components/Payment/PaymentManagement";
import { User, Shield, Key, Mail, Save, ChevronRight, Lock, Bell, CreditCard } from "lucide-react";

export default function AdminProfile() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          setUser({
            ...userData,
            uid: currentUser.uid,
            email: currentUser.email,
            name: userData.fullName || currentUser.displayName || "Admin User",
            avatar: userData.profileImage || currentUser.photoURL,
            role: "Administrator",
            createdAt: userData.createdAt?.toDate() || new Date(),
          });
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const stats = [
    { label: t('admin_dashboard.stats.users', 'Total Users'), value: '4.2k', trend: 'up', trendNote: '+12% this month' },
    { label: t('admin_dashboard.stats.revenue', 'Revenue'), value: '1.2B GNF', trend: 'up', trendNote: '+8% from last week' },
    { label: t('admin_dashboard.stats.active_projects', 'Active Projects'), value: '156', trend: 'down', trendNote: '-3% from yesterday' },
    { label: t('admin_dashboard.stats.tickets', 'Open Tickets'), value: '24', trend: 'up', trendNote: 'Needs attention' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ProfileLayout user={user} stats={stats}>
      <div className="flex border-b border-gray-100 bg-gray-50/30 overflow-x-auto no-scrollbar">
        {['overview', 'payments', 'security', 'notifications'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 text-sm font-bold transition-all relative ${
              activeTab === tab 
              ? 'text-blue-600 bg-white' 
              : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className="flex items-center gap-2">
              {tab === 'payments' && <CreditCard className="w-4 h-4" />}
              {t(`profile.tabs.${tab}`, tab.charAt(0).toUpperCase() + tab.slice(1))}
            </div>
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></div>
            )}
          </button>
        ))}
      </div>

      <div className="p-8">
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('profile.full_name', 'Full Name')}</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                    <input 
                      type="text" 
                      defaultValue={user?.name}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('profile.email', 'Email Address')}</label>
                   <div className="relative">
                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                     <input 
                      type="email" 
                      readOnly
                      defaultValue={user?.email}
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-100 rounded-xl text-gray-500 cursor-not-allowed font-medium"
                    />
                   </div>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('profile.bio', 'Administrative Bio')}</label>
                <textarea 
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium resize-none text-gray-800"
                  placeholder="Enter your administrative details..."
                  defaultValue="Senior Platform Administrator overseeing tech integrations and user management across Guinea's prefectures."
                />
             </div>

             <div className="pt-4 flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all hover:-translate-y-1">
                  <Save className="w-4 h-4" />
                  {t('profile.save_changes', 'Save Changes')}
                </button>
             </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PaymentManagement userRole="Administrator" />
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-xl">
                 <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900">{t('profile.security_status', 'Security Status')}</h4>
                <p className="text-sm text-blue-700/80 mt-1">{t('profile.security_desc', 'Your account is currently protected by standard authentication.')}</p>
              </div>
            </div>

            <div className="space-y-4">
               <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-blue-100 transition-colors">
                      <Key className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">{t('profile.change_password', 'Change Password')}</p>
                      <p className="text-xs text-gray-500 mt-1">{t('profile.password_last_changed', 'Last changed 3 months ago')}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
               </button>

               <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-200 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-blue-100 transition-colors">
                      <Lock className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">{t('profile.two_factor', 'Two-Factor Authentication')}</p>
                      <p className="text-xs text-gray-500 mt-1">{t('profile.two_factor_status', 'Not enabled')}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
               {['email_notifications', 'push_notifications', 'sms_alerts'].map((item) => (
                 <div key={item} className="flex items-center justify-between p-4 bg-gray-50/50 border border-gray-100 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-xl shadow-sm">
                        <Bell className="w-5 h-5 text-blue-600" />
                      </div>
                      <span className="font-bold text-gray-900">{t(`profile.${item}`, item.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()))}</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}
