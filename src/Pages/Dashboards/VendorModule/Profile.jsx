import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { auth, db } from "../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import ProfileLayout from "../Common/ProfileLayout";
import PaymentManagement from "../../../components/Payment/PaymentManagement";
import { User, Shield, Key, Mail, Save, ChevronRight, Lock, Bell, ShoppingCart, Truck, Package, Building2, CreditCard } from "lucide-react";

export default function VendorProfile() {
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
            name: userData.fullName || currentUser.displayName || "Vendor User",
            avatar: userData.profileImage || currentUser.photoURL,
            role: "Vendor",
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
    { label: t('vendor_dashboard.stats.inventory', 'Stock Items'), value: '420', trend: 'up', trendNote: '85% stock level' },
    { label: t('vendor_dashboard.stats.orders', 'Active Orders'), value: '38', trend: 'up', trendNote: '12 new today' },
    { label: t('vendor_dashboard.stats.fulfillment', 'Fulfillment'), value: '99.2%', trend: 'up', trendNote: 'Excellent speed' },
    { label: t('vendor_dashboard.stats.revenue', 'Total Sales'), value: '245M GNF', trend: 'up', trendNote: 'Target: 300M GNF' },
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
        {['overview', 'business_info', 'payments', 'security'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 text-sm font-bold transition-all relative flex-shrink-0 ${
              activeTab === tab 
              ? 'text-blue-600 bg-white' 
              : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className="flex items-center gap-2">
              {tab === 'payments' && <CreditCard className="w-4 h-4" />}
              {t(`profile.tabs.${tab}`, tab.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))}
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

             <div className="pt-4 flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all hover:-translate-y-1">
                  <Save className="w-4 h-4" />
                  {t('profile.save_changes', 'Save Changes')}
                </button>
             </div>
          </div>
        )}

        {activeTab === 'business_info' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('profile.business_name', 'Registered Business Name')}</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      defaultValue={user?.businessName || "Global Solutions Vendor"}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('profile.tax_reg', 'Tax ID')}</label>
                    <input type="text" defaultValue="GN-TAX-55667" className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl outline-none font-medium"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('profile.warehouse', 'Warehouse Locations')}</label>
                    <input type="text" defaultValue="Kaloum, Conakry" className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl outline-none font-medium"/>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('profile.supply_type', 'Supply Type')}</label>
                    <input type="text" defaultValue="Hardware & Electronics" className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl outline-none font-medium"/>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 border-b pb-2">{t('profile.supply_chain', 'Supply Chain Metrics')}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Avg Delivery</p>
                      <p className="text-lg font-bold text-blue-600">2.4 Days</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Return Rate</p>
                      <p className="text-lg font-bold text-green-600">0.8%</p>
                    </div>
                  </div>
                </div>
             </div>

             <div className="pt-4 flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all hover:-translate-y-1">
                  <Save className="w-4 h-4" />
                  {t('profile.update_business', 'Update Business Info')}
                </button>
             </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PaymentManagement userRole="Vendor" />
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
                      <p className="text-xs text-gray-500 mt-1">{t('profile.password_last_changed', 'Last changed 3 weeks ago')}</p>
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
