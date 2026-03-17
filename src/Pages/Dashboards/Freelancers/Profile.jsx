import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { auth, db } from "../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import ProfileLayout from "../Common/ProfileLayout";
import { User, Shield, Key, Mail, Save, ChevronRight, Lock, Bell, Briefcase, Award, ExternalLink } from "lucide-react";

export default function FreelancerProfile() {
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
            name: userData.fullName || currentUser.displayName || "Freelancer",
            avatar: userData.profileImage || currentUser.photoURL,
            role: "Freelancer",
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
    { label: t('freelancer_dashboard.stats.completed_jobs', 'Completed Jobs'), value: '24', trend: 'up', trendNote: '5/5 Average Rating' },
    { label: t('freelancer_dashboard.stats.total_earned', 'Total Earned'), value: '85M GNF', trend: 'up', trendNote: '+15M this month' },
    { label: t('freelancer_dashboard.stats.active_bids', 'Active Bids'), value: '12', trend: 'up', trendNote: '3 high probability' },
    { label: t('freelancer_dashboard.stats.success_rate', 'Success Rate'), value: '98%', trend: 'up', trendNote: 'Top Rated' },
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
        {['overview', 'professional', 'security'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 text-sm font-bold transition-all relative flex-shrink-0 ${
              activeTab === tab 
              ? 'text-blue-600 bg-white' 
              : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {t(`profile.tabs.${tab}`, tab.charAt(0).toUpperCase() + tab.slice(1))}
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
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('profile.bio', 'Professional Bio')}</label>
                <textarea 
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium resize-none text-gray-800"
                  placeholder="Tell clients about your expertise..."
                  defaultValue="Full-stack developer specializing in React and Node.js solutions for businesses in West Africa."
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

        {activeTab === 'professional' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('profile.skills', 'Skills & Experts')}</label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {['React.js', 'Node.js', 'Firebase', 'Tailwind CSS', 'UI Design'].map(skill => (
                      <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-bold rounded-lg border border-blue-100">
                        {skill}
                      </span>
                    ))}
                    <button className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-bold rounded-lg border border-gray-200 hover:bg-gray-200 transition-colors">
                      + Add Skill
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('profile.hourly_rate', 'Hourly Rate (GNF)')}</label>
                  <input 
                    type="text" 
                    defaultValue="150,000 GNF/hr"
                    className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t('profile.portfolio', 'Portfolio URL')}</label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      defaultValue="https://portfolio.myname.com"
                      className="w-full pl-10 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium"
                    />
                  </div>
                </div>
             </div>

             <div className="pt-4 flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all hover:-translate-y-1">
                  <Save className="w-4 h-4" />
                  {t('profile.save_pro_info', 'Update Portfolio')}
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
                      <p className="text-xs text-gray-500 mt-1">{t('profile.password_last_changed', 'Last changed 1 month ago')}</p>
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
