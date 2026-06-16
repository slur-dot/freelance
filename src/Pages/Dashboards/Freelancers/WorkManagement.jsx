import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Search,
  Briefcase,
  Clock,
  CheckCircle2,
  MoreVertical,
  ExternalLink,
  TrendingUp } from
"lucide-react";
import { auth } from "../../../firebaseConfig";
import { ProjectService } from "../../../services/projectService";
import { FreelancerService } from "../../../services/freelancerService";
import JDModal from "../../../components/Modals/JDModal";

export default function WorkManagement() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("assigned-projects"); // assigned-projects, applications
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(auth.currentUser);

  const [isJDModalOpen, setIsJDModalOpen] = useState(false);

  const loadWorkData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const allProjects = await ProjectService.getProjects();
      setProjects(allProjects.filter((p) => p.freelancerId === user.uid && p.type !== "job_posting" && p.type !== "job_application"));
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
    switch (status?.toLowerCase()) {
      case 'pending':return 1;
      case 'in_progress':case 'active':return 2;
      case 'review':return 3;
      case 'completed':case 'paid':return 4;
      default:return 1;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>);

  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t('work_management.title', 'Work Management')}</h1>
          <p className="text-gray-500 mt-1 font-medium">{t('work_management.subtitle_v2', 'Track your assigned projects and manage job applications.')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsJDModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all hover:-translate-y-1 active:scale-95">
            
            {t('work_management.apply_job', 'Apply for Job')}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl border border-gray-100 max-w-fit overflow-x-auto no-scrollbar">
        {[
        { id: 'assigned-projects', label: t('work_management.tab_assigned', 'Assigned Projects'), icon: Briefcase },
        { id: 'applications', label: t('work_management.tab_applications', 'My Applications'), icon: TrendingUp }].
        map((tab) =>
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
          activeTab === tab.id ?
          'bg-blue-600 text-white shadow-md' :
          'text-gray-500 hover:bg-white hover:text-gray-700'}`
          }>
          
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {activeTab === 'assigned-projects' &&
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
             {/* Dynamic Project Progress Tracking */}
             <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                   <h3 className="font-bold text-xl text-gray-900">{t('work_management.project_tracking', 'Project Progress Tracking')}</h3>
                   <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
                      <span className="text-sm font-bold text-blue-600">{projects.length} {t('work_management.projects_assigned', 'Projects Assigned')}</span>
                   </div>
                </div>

                {projects.length > 0 ?
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((p, idx) =>
              <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-12 -mt-12 transition-all group-hover:bg-blue-500/10"></div>
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                            <Briefcase className="w-6 h-6" />
                          </div>
                          <span className={`px-3 py-1 text-[10px] font-bold rounded-full border uppercase tracking-widest ${
                  p.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' :
                  p.status === 'in_progress' || p.status === 'active' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                  'bg-gray-50 text-gray-500 border-gray-100'}`
                  }>
                            {p.status || 'Pending'}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors tracking-tight">{p.title}</h4>
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">{p.description || t('work_management.no_description', 'No description provided.')}</p>
                        <div className="w-full h-px bg-gray-50 my-5"></div>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('work_management.client_label', 'Client')}</span>
                            <span className="text-sm font-bold text-gray-900">{p.client || '—'}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('work_management.budget_label', 'Budget')}</span>
                            <span className="text-lg font-bold text-gray-900">{(p.amount || 0).toLocaleString()} {t("gnf_175", "GNF")}</span>
                          </div>
                        </div>
                      </div>
              )}
                  </div> :

            <div className="py-20 flex flex-col items-center justify-center text-gray-400 bg-white/50 border-2 border-dashed border-gray-100 rounded-3xl">
                    <Briefcase className="w-16 h-16 mb-4 opacity-10" />
                    <p className="font-bold text-xl">{t('work_management.no_projects', 'No assigned projects yet.')}</p>
                    <p className="text-sm">{t('work_management.apply_prompt', 'Apply to jobs to get started.')}</p>
                  </div>
            }
             </div>
          </div>
        }



        {activeTab === 'applications' &&
        <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500">
             {applications.length > 0 ? applications.map((app, idx) =>
          <div key={idx} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 tracking-tight uppercase">{app.title}</h4>
                      <p className="text-sm text-gray-500 font-medium">{t("applied_for_at_986", "Applied for at")} {app.client || 'Enterprise Client'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-right flex flex-col items-end">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{t("status_566", "Status")}</span>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                app.status === 'hired' ? 'bg-green-50 text-green-600 border-green-100' :
                app.status === 'shortlisted' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                'bg-gray-50 text-gray-500 border-gray-100'}`
                }>
                        {app.status || 'Under Review'}
                      </span>
                    </div>
                    <button className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
               </div>
          ) :
          <div className="py-20 text-center text-gray-400 bg-white border-2 border-dashed border-gray-100 rounded-3xl">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-10" />
                  <p className="font-bold text-xl">{t("no_active_applications_304", "No active applications.")}</p>
                  <p className="text-sm">{t("apply_to_job_descriptions_to_see_them_here_909", "Apply to job descriptions to see them here.")}</p>
               </div>
          }
          </div>
        }
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
         {[
        { label: t('work_management.stat_projects', 'Assigned Projects'), value: projects.length, color: 'text-blue-500' },
        { label: t('work_management.stat_applications', 'Applications'), value: applications.length, color: 'text-green-500' },
        { label: t('work_management.stat_hired', 'Hired'), value: applications.filter((a) => a.status === 'hired').length, color: 'text-indigo-500' }].
        map((stat, i) =>
        <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-baseline justify-between">
                <h5 className="text-2xl font-bold text-gray-900">{stat.value}</h5>
              </div>
           </div>
        )}
      </div>

      {/* Modals */}
      <JDModal
        isOpen={isJDModalOpen}
        onClose={() => setIsJDModalOpen(false)}
        user={user}
        onSave={(newApp) => {
          setApplications((prev) => [newApp, ...prev]);
          loadWorkData();
        }} />
      
    </div>);

}