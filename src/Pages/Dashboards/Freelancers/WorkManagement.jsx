import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { 
  Plus, 
  Search, 
  Filter, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MoreVertical,
  ExternalLink,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { auth, db } from "../../../firebaseConfig";
import { ProjectService } from "../../../services/projectService";
import { FreelancerService } from "../../../services/freelancerService";
import ProjectModal from "../../../components/Modals/ProjectModal";
import JDModal from "../../../components/Modals/JDModal";

export default function WorkManagement() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("my-services"); // my-services, active-projects, applications
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isJDModalOpen, setIsJDModalOpen] = useState(false);

  const loadWorkData = async () => {
    if (!user) return;
    try {
       setLoading(true);
       const allProjects = await ProjectService.getProjects();
       setProjects(allProjects.filter(p => p.freelancerId === user.uid));
       const apps = await FreelancerService.getJDApplications(user.uid);
       setApplications(apps);
    } catch (error) {
       console.error("Error loading work data:", error);
    } finally {
       setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkData();
  }, [user]);

  const getStatusStep = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 1;
      case 'in_progress': case 'active': return 2;
      case 'review': return 3;
      case 'completed': case 'paid': return 4;
      default: return 1;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('work_management.title', 'Work Management')}</h1>
          <p className="text-gray-500 mt-1 font-medium">{t('work_management.subtitle', 'Manage your services, track active projects, and monitor applications.')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsJDModalOpen(true)}
            className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-2"
          >
            {t('work_management.apply_job', 'Apply for Job')}
          </button>
          <button 
            onClick={() => setIsProjectModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all hover:-translate-y-1 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            {t('work_management.post_new', 'Post New Service')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl border border-gray-100 max-w-fit overflow-x-auto no-scrollbar">
        {[
          { id: 'my-services', label: 'My Services', icon: Briefcase },
          { id: 'active-projects', label: 'Active Projects', icon: Clock },
          { id: 'applications', label: 'Applications', icon: TrendingUp },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-gray-500 hover:bg-white hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {activeTab === 'my-services' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-4 duration-500">
             {projects.length > 0 ? projects.map((p, idx) => (
               <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-12 -mt-12 transition-all group-hover:bg-blue-500/10"></div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 p-1">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{p.title}</h4>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">{p.description || 'Professional service offering...'}</p>
                  
                  <div className="w-full h-px bg-gray-50 my-5"></div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Rate / Budget</span>
                      <span className="text-lg font-bold text-gray-900">{(p.amount || 0).toLocaleString()} GNF</span>
                    </div>
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100 uppercase tracking-widest">
                      {p.status || 'Active'}
                    </span>
                  </div>
               </div>
             )) : (
               <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400 bg-white/50 border-2 border-dashed border-gray-100 rounded-3xl">
                  <Briefcase className="w-16 h-16 mb-4 opacity-10" />
                  <p className="font-bold text-xl">No services posted yet.</p>
                  <p className="text-sm">Start earning by posting your expertise.</p>
               </div>
             )}
          </div>
        )}

        {activeTab === 'active-projects' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             {/* Dynamic Project Progress Tracking */}
             <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                   <h3 className="font-bold text-xl text-gray-900">Project Progress Tracking</h3>
                   <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
                      <span className="text-sm font-bold text-blue-600">1 Project Active</span>
                   </div>
                </div>

                {/* Tracking Stepper */}
                <div className="relative">
                   <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 z-0"></div>
                   <div className="absolute top-5 left-0 h-1 bg-blue-600 z-0 transition-all duration-1000" style={{ width: '40%' }}></div>
                   
                   <div className="relative z-10 flex justify-between">
                      {[
                        { step: 1, label: 'Pending', desc: 'Awaiting start' },
                        { step: 2, label: 'Active', desc: 'In development' },
                        { step: 3, label: 'Review', desc: 'Client feedback' },
                        { step: 4, label: 'Paid', desc: 'Funds released' }
                      ].map((s) => (
                        <div key={s.step} className="flex flex-col items-center text-center max-w-[120px]">
                           <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors duration-500 ${
                             getStatusStep('active') >= s.step 
                             ? 'bg-blue-600 border-blue-100 text-white' 
                             : 'bg-white border-gray-100 text-gray-300'
                           }`}>
                              {getStatusStep('active') > s.step ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-black">{s.step}</span>}
                           </div>
                           <h5 className={`mt-3 text-sm font-bold ${getStatusStep('active') >= s.step ? 'text-gray-900' : 'text-gray-400'}`}>{s.label}</h5>
                           <p className="text-[10px] text-gray-400 mt-1 font-medium">{s.desc}</p>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400">Current Task</h4>
                      <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl">
                         <p className="font-bold text-gray-900">Homepage UI Refinement</p>
                         <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-gray-500">M1: Milestone 1</span>
                            <div className="flex -space-x-2">
                               <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white"></div>
                               <div className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white"></div>
                            </div>
                         </div>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400">Upcoming Milestone</h4>
                      <div className="bg-blue-50/30 border border-blue-100 p-5 rounded-2xl border-dashed">
                         <p className="font-bold text-blue-900 italic">No milestones pending.</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm">
                     <thead className="bg-gray-50/50 border-b border-gray-100">
                       <tr>
                         <th className="py-5 px-8 font-bold text-gray-500 uppercase tracking-widest">Project Name</th>
                         <th className="py-5 px-8 font-bold text-gray-500 uppercase tracking-widest">Client</th>
                         <th className="py-5 px-8 font-bold text-gray-500 uppercase tracking-widest">Deadline</th>
                         <th className="py-5 px-8 font-bold text-gray-500 uppercase tracking-widest">Priority</th>
                         <th className="py-5 px-8 font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                       <tr className="hover:bg-gray-50/50 transition-colors group">
                         <td className="py-5 px-8">
                           <div className="flex items-center gap-3">
                             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                             <span className="font-bold text-gray-900">E-commerce Integration</span>
                           </div>
                         </td>
                         <td className="py-5 px-8 text-gray-600 font-medium">Alpha Corp</td>
                         <td className="py-5 px-8 text-gray-500">Apr 15, 2026</td>
                         <td className="py-5 px-8">
                           <span className="px-3 py-1 bg-orange-50 text-orange-600 text-[10px] font-bold rounded-full border border-orange-100 uppercase tracking-widest">High</span>
                         </td>
                         <td className="py-5 px-8 text-right">
                           <button className="text-blue-600 font-bold hover:text-blue-700 underline underline-offset-4">Project Details</button>
                         </td>
                       </tr>
                     </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
             {applications.length > 0 ? applications.map((app, idx) => (
               <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 tracking-tight uppercase">{app.title}</h4>
                      <p className="text-sm text-gray-500 font-medium">Applied for at {app.client || 'Enterprise Client'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-right flex flex-col items-end">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</span>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                        app.status === 'hired' ? 'bg-green-50 text-green-600 border-green-100' :
                        app.status === 'shortlisted' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        'bg-gray-50 text-gray-500 border-gray-100'
                      }`}>
                        {app.status || 'Under Review'}
                      </span>
                    </div>
                    <button className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
               </div>
             )) : (
               <div className="py-20 text-center text-gray-400 bg-white border-2 border-dashed border-gray-100 rounded-3xl">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-10" />
                  <p className="font-bold text-xl">No active applications.</p>
                  <p className="text-sm">Apply to job descriptions to see them here.</p>
               </div>
             )}
          </div>
        )}
      </div>

      {/* Aesthetic Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8">
         {[
           { label: 'Weekly Reach', value: '+240%', trend: 'up', color: 'text-green-500' },
           { label: 'Active Quotes', value: '12', trend: 'neutral', color: 'text-blue-500' },
           { label: 'Success Rate', value: '98%', trend: 'up', color: 'text-green-500' },
           { label: 'Profile Views', value: '1.2k', trend: 'up', color: 'text-indigo-500' },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-baseline justify-between">
                <h5 className="text-2xl font-bold text-gray-900">{stat.value}</h5>
                <span className={`text-[10px] font-bold ${stat.color} bg-current/5 px-2 py-0.5 rounded-full`}>{stat.trend === 'up' ? '↗' : '→'}</span>
              </div>
           </div>
         ))}
      </div>

      {/* Modals */}
      <ProjectModal 
        isOpen={isProjectModalOpen} 
        onClose={() => setIsProjectModalOpen(false)} 
        user={user} 
        onSave={loadWorkData} 
      />
      <JDModal 
        isOpen={isJDModalOpen} 
        onClose={() => setIsJDModalOpen(false)} 
        user={user} 
        onSave={(newApp) => {
          setApplications(prev => [newApp, ...prev]);
          loadWorkData();
        }} 
      />
    </div>
  );
}
