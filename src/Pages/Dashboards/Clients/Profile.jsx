import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { auth, db } from "../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import ProfileLayout from "../Common/ProfileLayout";
import PaymentManagement from "../../../components/Payment/PaymentManagement";
import { User, Shield, Key, Mail, Save, ChevronRight, Lock, Bell, CreditCard, MapPin } from "lucide-react";
import { UserService } from "../../../services/userService";
import { guineaCitiesByRegion } from "../../../data/guineaCities";

export default function ClientProfile() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "Personal Projects",
    region: "",
    prefecture: "",
    subPrefecture: "",
  });

  // Derived data for cascading dropdowns
  const regionData = guineaCitiesByRegion.find(r => r.region === form.region);
  const prefectures = regionData ? regionData.prefectures : [];
  const prefectureData = prefectures.find(p => p.name === form.prefecture);
  const subPrefectures = prefectureData ? prefectureData.subprefectures : [];

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
            name: userData.fullName || currentUser.displayName || "Client User",
            avatar: userData.profileImage || currentUser.photoURL,
            role: "Client",
            createdAt: userData.createdAt?.toDate() || new Date(),
          });
          setForm({
            name: userData.fullName || currentUser.displayName || "Client User",
            company: userData.company || "Personal Projects",
            region: userData.region || "",
            prefecture: userData.prefecture || "",
            subPrefecture: userData.subPrefecture || ""
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
    { label: t('client_dashboard.stats.projects', 'Projects Posted'), value: user?.stats?.projects || '8', trend: 'up', trendNote: '2 active' },
    { label: t('client_dashboard.stats.spent', 'Total Spent'), value: user?.stats?.spent || '45M GNF', trend: 'up', trendNote: '+5M this month' },
    { label: t('client_dashboard.stats.hires', 'Total Hires'), value: user?.stats?.hires || '12', trend: 'up', trendNote: '3 repeat freelancers' },
    { label: t('client_dashboard.stats.rating', 'Client Rating'), value: user?.stats?.rating || '4.9', trend: 'up', trendNote: 'Excellent payer' },
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
                      value={form.name}
                      onChange={(e) => setForm({...form, name: e.target.value})}
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
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('profile.company', 'Company / Organization')}</label>
                <input 
                  type="text" 
                  value={form.company}
                  onChange={(e) => setForm({...form, company: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium text-gray-800"
                />
             </div>

              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('profile.country', 'Country')}</label>
                    <select className="w-full px-4 py-3 bg-gray-100 border border-gray-100 rounded-xl text-gray-500 cursor-not-allowed font-medium" disabled>
                      <option value="Guinea">Guinea</option>
                    </select>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('profile.region', 'Region')}</label>
                      <select 
                        value={form.region}
                        onChange={(e) => setForm({...form, region: e.target.value, prefecture: "", subPrefecture: ""})}
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium text-gray-800"
                      >
                        <option value="">{t('profile.select_region', 'Select Region')}</option>
                        {guineaCitiesByRegion.map((r, i) => <option key={i} value={r.region}>{r.region}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('profile.prefecture', 'Prefecture')}</label>
                      <select 
                        value={form.prefecture}
                        onChange={(e) => setForm({...form, prefecture: e.target.value, subPrefecture: ""})}
                        disabled={!form.region}
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium text-gray-800 disabled:opacity-50"
                      >
                        <option value="">{t('profile.select_prefecture', 'Select Prefecture')}</option>
                        {prefectures.map((p, i) => <option key={i} value={p.name}>{p.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('profile.subprefecture', 'Sub-Prefecture')}</label>
                      <select 
                        value={form.subPrefecture}
                        onChange={(e) => setForm({...form, subPrefecture: e.target.value})}
                        disabled={!form.prefecture}
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium text-gray-800 disabled:opacity-50"
                      >
                        <option value="">{t('profile.select_subprefecture', 'Select Sub-Prefecture')}</option>
                        {subPrefectures.map((sp, i) => <option key={i} value={sp}>{sp}</option>)}
                      </select>
                    </div>
                 </div>
              </div>

             <div className="pt-4 flex justify-end">
                <button 
                  onClick={async () => {
                    if (!user) return;
                    setSaving(true);
                    try {
                      await UserService.updateUserProfile(user.uid, {
                        fullName: form.name,
                        company: form.company,
                        region: form.region,
                        prefecture: form.prefecture,
                        subPrefecture: form.subPrefecture
                      });
                      setUser({...user, name: form.name});
                      alert(t('profile.update_success', 'Profile updated successfully!'));
                    } catch (err) {
                      console.error(err);
                      alert(t('profile.update_failed', 'Failed to update profile.'));
                    } finally {
                      setSaving(false);
                    }
                  }}
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all hover:-translate-y-1 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {saving ? t('profile.saving', 'Saving...') : t('profile.save_changes', 'Save Changes')}
                </button>
             </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PaymentManagement userRole="Client" />
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
                      <p className="text-xs text-gray-500 mt-1">{t('profile.password_last_changed', 'Last changed 2 months ago')}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
               </button>
            </div>

            {/* Delete Account — Hidden in Security Tab */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="bg-red-50/50 border border-red-100 p-4 rounded-2xl">
                <h4 className="font-bold text-red-800 text-sm">{t('profile.danger_zone', 'Danger Zone')}</h4>
                <p className="text-sm text-red-600/80 mt-1 mb-4">{t('profile.delete_account_warning', 'Deleting your account is permanent and cannot be undone. All your data will be lost.')}</p>
                <button 
                  onClick={() => {
                    if (window.confirm(t('profile.delete_account_confirm', 'Are you absolutely sure you want to delete your account? This action is irreversible.'))) {
                      alert(t('profile.delete_account_contact', 'Please contact support to complete account deletion.'));
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-xl text-sm transition-all"
                >
                  {t('profile.delete_account', 'Delete Account')}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="space-y-4">
               {['project_updates', 'hiring_messages', 'payment_confirmations'].map((item) => (
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
