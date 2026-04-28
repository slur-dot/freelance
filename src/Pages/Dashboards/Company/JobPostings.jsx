import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Briefcase,
  Users,
  Clock,
  MapPin,
  Eye,
  PauseCircle,
  PlayCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  DollarSign
} from "lucide-react";
import { auth } from "../../../firebaseConfig";
import { CompanyService } from "../../../services/companyService";
import PostJobModal from "../../../components/Modals/PostJobModal";

export default function JobPostings() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [expandedJob, setExpandedJob] = useState(null);
  const [jobApplications, setJobApplications] = useState({});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) loadJobs();
  }, [user]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await CompanyService.getCompanyJobs(user.uid);
      setJobs(data);
    } catch (err) {
      console.error("Error loading jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = async (jobId) => {
    if (expandedJob === jobId) {
      setExpandedJob(null);
      return;
    }
    setExpandedJob(jobId);
    if (!jobApplications[jobId]) {
      try {
        const apps = await CompanyService.getJobApplications(jobId);
        setJobApplications(prev => ({ ...prev, [jobId]: apps }));
      } catch (err) {
        console.error("Error loading applications:", err);
      }
    }
  };

  const handleStatusToggle = async (jobId, currentStatus) => {
    const newStatus = currentStatus === "open" ? "closed" : "open";
    try {
      await CompanyService.updateJobStatus(jobId, newStatus);
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
    } catch (err) {
      console.error("Error updating job status:", err);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    if (typeof timestamp === 'string') return timestamp;
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toLocaleDateString();
    if (timestamp._seconds) return new Date(timestamp._seconds * 1000).toLocaleDateString();
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {t('company_dashboard.job_postings_title', 'Job Postings')}
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            {t('company_dashboard.job_postings_subtitle', 'Post jobs, track applications, and hire top freelancers.')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/hire-freelancers')}
            className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
          >
            <Users className="w-5 h-5" />
            {t('company_dashboard.browse_freelancers', 'Browse Freelancers')}
          </button>
          <button
            onClick={() => setIsPostJobOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-green-600/20 flex items-center gap-2 transition-all hover:-translate-y-1 active:scale-95 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            {t('company_dashboard.post_new_job', 'Post New Job')}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: t('company_dashboard.total_jobs', 'Total Jobs'), value: jobs.length, color: 'text-blue-600', bg: 'bg-blue-50', icon: Briefcase },
          { label: t('company_dashboard.open_jobs', 'Open Jobs'), value: jobs.filter(j => j.status === 'open').length, color: 'text-green-600', bg: 'bg-green-50', icon: PlayCircle },
          { label: t('company_dashboard.total_applicants', 'Total Applicants'), value: jobs.reduce((sum, j) => sum + (j.applicants || 0), 0), color: 'text-indigo-600', bg: 'bg-indigo-50', icon: Users },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h5 className="text-2xl font-bold text-gray-900">{stat.value}</h5>
            </div>
          </div>
        ))}
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {jobs.length > 0 ? jobs.map((job) => (
          <div key={job.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Job Header */}
            <div
              className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
              onClick={() => toggleExpand(job.id)}
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <div className={`p-3 rounded-xl flex-shrink-0 ${job.status === 'open' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 truncate">{job.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{job.description || 'No description provided'}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {job.status || 'open'}
                    </span>
                    {job.category && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" /> {job.category}
                      </span>
                    )}
                    {job.location && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </span>
                    )}
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatDate(job.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0">
                <div className="text-right">
                  <div className="font-bold text-green-700 flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {(job.budget || 0).toLocaleString()} GNF
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 justify-end mt-1">
                    <Users className="w-3 h-3" /> {job.applicants || 0} applicants
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleStatusToggle(job.id, job.status); }}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      job.status === 'open' ? 'text-orange-500 hover:bg-orange-50' : 'text-green-500 hover:bg-green-50'
                    }`}
                    title={job.status === 'open' ? 'Close job' : 'Reopen job'}
                  >
                    {job.status === 'open' ? <PauseCircle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                  </button>
                  {expandedJob === job.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
              </div>
            </div>

            {/* Expanded: Applications */}
            {expandedJob === job.id && (
              <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-5 animate-in slide-in-from-top-2 duration-300">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {t('company_dashboard.applications_received', 'Applications Received')}
                </h4>
                {jobApplications[job.id] && jobApplications[job.id].length > 0 ? (
                  <div className="space-y-3">
                    {jobApplications[job.id].map((app) => (
                      <div key={app.id} className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-gray-900">{app.freelancerName || 'Freelancer'}</p>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{app.message || 'No message'}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-sm font-bold text-green-700">{(app.budget || 0).toLocaleString()} GNF</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            app.status === 'hired' ? 'bg-green-100 text-green-700' :
                            app.status === 'shortlisted' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {app.status || 'pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-400">
                    <Users className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    <p className="text-sm font-medium">{t('company_dashboard.no_applications', 'No applications yet for this job.')}</p>
                    <p className="text-xs mt-1">Share the job link to attract freelancers.</p>
                  </div>
                )}

                {/* Skills Tags */}
                {job.skills && job.skills.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )) : (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400 bg-white border-2 border-dashed border-gray-100 rounded-3xl">
            <Briefcase className="w-16 h-16 mb-4 opacity-10" />
            <p className="font-bold text-xl">{t('company_dashboard.no_jobs', 'No job postings yet.')}</p>
            <p className="text-sm mt-1">Post your first job to start receiving applications from freelancers.</p>
            <button
              onClick={() => setIsPostJobOpen(true)}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-green-600/20 transition-all hover:-translate-y-1 active:scale-95 cursor-pointer"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              {t('company_dashboard.post_new_job', 'Post New Job')}
            </button>
          </div>
        )}
      </div>

      {/* Post Job Modal */}
      <PostJobModal
        isOpen={isPostJobOpen}
        onClose={() => setIsPostJobOpen(false)}
        user={user}
        onSave={(newJob) => {
          setJobs(prev => [newJob, ...prev]);
        }}
      />
    </div>
  );
}
