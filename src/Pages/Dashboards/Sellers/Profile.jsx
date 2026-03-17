import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { auth, db } from "../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import ProfileLayout from "../Common/ProfileLayout";
import { User, Shield, Key, Mail, Save, ChevronRight, Lock, Bell, ShoppingBag, Truck, CreditCard } from "lucide-react";

export default function SellerProfile() {
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
            name: userData.fullName || currentUser.displayName || "Seller User",
            avatar: userData.profileImage || currentUser.photoURL,
            role: "Seller",
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
    { label: t('seller_dashboard.stats.products', 'Total Products'), value: '156', trend: 'up', trendNote: '12 new this month' },
    { label: t('seller_dashboard.stats.orders', 'Pending Orders'), value: '24', trend: 'up', trendNote: '18 ready to ship' },
    { label: t('seller_dashboard.stats.revenue', 'Store Revenue'), value: '125M GNF', trend: 'up', trendNote: '+18% vs last month' },
    { label: t('seller_dashboard.stats.satisfaction', 'Satisfaction'), value: '4.8/5', trend: 'up', trendNote: '95% positive feedback' },
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
        {['overview', 'store_settings', 'security'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 text-sm font-bold transition-all relative flex-shrink-0 ${
              activeTab === tab 
              ? 'text-blue-600 bg-white' 
              : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {t(`profile.tabs.${tab}`, tab.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))}
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

             <div className="pt-4 flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all hover:-translate-y-1">
                  <Save className="w-4 h-4" />
                  {t('profile.save_changes', 'Save Changes')}
                </button>
             </div>
          </div>
        )}

        {activeTab === 'store_settings' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('profile.store_name', 'Store Name')}</label>
                  <div className="relative">
                    <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      defaultValue={user?.storeName || "My Guinee Store"}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('profile.shipping_policy', 'Shipping Policy')}</label>
                  <textarea 
                    rows="3"
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium resize-none text-gray-800"
                    defaultValue="Standard delivery within Conakry takes 1-2 business days. Regional delivery up to 5 days."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('profile.payout_method', 'Payout Method')}</label>
                     <div className="flex items-center gap-4 p-4 border border-blue-100 bg-blue-50/30 rounded-2xl">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                        <div>
                          <p className="font-bold text-sm text-gray-900">Orange Money</p>
                          <p className="text-xs text-gray-500">**** 8901</p>
                        </div>
                        <button className="ml-auto text-xs font-bold text-blue-600 hover:underline">{t('profile.edit', 'Edit')}</button>
                     </div>
                  </div>
                  
                  <div className="space-y-4">
                     <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('profile.delivery_partners', 'Delivery Partners')}</label>
                     <div className="flex items-center gap-4 p-4 border border-gray-100 bg-white rounded-2xl">
                        <Truck className="w-6 h-6 text-gray-400" />
                        <div>
                          <p className="font-bold text-sm text-gray-900">Local Couriers</p>
                          <p className="text-xs text-gray-500">3 active partners</p>
                        </div>
                        <button className="ml-auto text-xs font-bold text-blue-600 hover:underline">{t('profile.manage', 'Manage')}</button>
                     </div>
                  </div>
                </div>
             </div>

             <div className="pt-4 flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all hover:-translate-y-1">
                  <Save className="w-4 h-4" />
                  {t('profile.save_store', 'Update Store')}
                </button>
             </div>
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
          </div>
        )}
      </div>
    </ProfileLayout>
  );
}
