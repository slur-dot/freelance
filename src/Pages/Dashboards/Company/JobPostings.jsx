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
  DollarSign,
  FileEdit,
  CheckCircle2,
  XCircle,
  ArrowRight
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
      if (data.length === 0) {
        // Inject mock jobs for demonstration
        const mockJobs = [
          {
            id: 'JOB-001',
            title: 'Senior React Developer',
            description: 'We need an experienced React developer to build a modern SaaS dashboard with real-time data.',
            category: 'Software Development',
            location: 'Conakry / Remote',
            budget: 2500000,
            deadline: '2024-06-30',
            status: 'open',
            createdAt: '2024-04-15',
            applicants: 5,
            skills: ['React', 'TypeScript', 'Node.js', 'Firebase'],
          },
          {
            id: 'JOB-002',
            title: 'Cloud Infrastructure Engineer',
            description: 'Set up and manage AWS infrastructure for our growing platform.',
            category: 'Cloud & Infrastructure',
            location: 'Remote',
            budget: 3000000,
            deadline: '2024-07-15',
            status: 'draft',
            createdAt: '2024-04-20',
            applicants: 0,
            skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
          },
          {
            id: 'JOB-003',
            title: 'UI/UX Designer for Mobile App',
            description: 'Design a polished mobile experience for our logistics tracking app.',
            category: 'Design & Creative',
            location: 'Conakry',
            budget: 1500000,
            deadline: '2024-05-01',
            status: 'closed',
            createdAt: '2024-03-01',
            applicants: 12,
            skills: ['Figma', 'UI Design', 'Prototyping'],
          },
        ];
        setJobs(mockJobs);
        // Pre-populate mock applications
        setJobApplications({
          'JOB-001': [
            { id: 'APP1', freelancerName: 'Amadou Diallo', message: 'I have 5 years of React experience and have built multiple SaaS dashboards.', budget: 2400000, status: 'shortlisted' },
            { id: 'APP2', freelancerName: 'Fatima Camara', message: 'Full-stack developer specializing in React + Firebase solutions.', budget: 2500000, status: 'pending' },
            { id: 'APP3', freelancerName: 'Moussa Keita', message: 'Expert in TypeScript and modern React patterns.', budget: 2200000, status: 'pending' },
          ],
          'JOB-003': [
            { id: 'APP4', freelancerName: 'Sarah Bah', message: 'Award-winning mobile UI designer with 50+ projects.', budget: 1500000, status: 'hired' },
            { id: 'APP5', freelancerName: 'Ibrahim Sow', message: 'Figma expert with logistics industry experience.', budget: 1400000, status: 'rejected' },
          ]
        });
      } else {
        setJobs(data);
      }
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
    const statusCycle = { draft: 'open', open: 'closed', closed: 'open' };
    const newStatus = statusCycle[currentStatus] || 'open';
    try {
      await CompanyService.updateJobStatus(jobId, newStatus).catch(() => {});
      setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
    } catch (err) {
      console.error("Error updating job status:", err);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await CompanyService.deleteJob?.(jobId).catch(() => {});
      setJobs(prev => prev.filter(j => j.id !== jobId));
    } catch (err) {
      console.error("Error deleting job:", err);
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: t('company_dashboard.total_jobs', 'Total Jobs'), value: jobs.length, color: 'text-blue-600', bg: 'bg-blue-50', icon: Briefcase },
          { label: t('company_dashboard.open_jobs', 'Open Jobs'), value: jobs.filter(j => j.status === 'open').length, color: 'text-green-600', bg: 'bg-green-50', icon: PlayCircle },
          { label: 'Drafts', value: jobs.filter(j => j.status === 'draft').length, color: 'text-yellow-600', bg: 'bg-yellow-50', icon: FileEdit },
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
                      job.status === 'open' ? 'bg-green-100 text-green-700' :
                      job.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {job.status || 'draft'}
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
                      job.status === 'open' ? 'text-orange-500 hover:bg-orange-50' :
                      job.status === 'draft' ? 'text-green-500 hover:bg-green-50' :
                      'text-blue-500 hover:bg-blue-50'
                    }`}
                    title={job.status === 'open' ? 'Close job' : job.status === 'draft' ? 'Publish job' : 'Reopen job'}
                  >
                    {job.status === 'open' ? <PauseCircle className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteJob(job.id); }}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {expandedJob === job.id ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
              </div>
            </div>

            {expandedJob === job.id && (
              <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-5 animate-in slide-in-from-top-2 duration-300">
                {/* Stage Progress Bar */}
                <div className="mb-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Posting Workflow</p>
                  <div className="flex items-center gap-0">
                    {['draft', 'open', 'closed'].map((stage, idx) => {
                      const stageIndex = ['draft', 'open', 'closed'].indexOf(job.status);
                      const isActive = idx <= stageIndex;
                      const isCurrent = stage === job.status;
                      return (
                        <React.Fragment key={stage}>
                          <div className="flex flex-col items-center gap-1">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                              isCurrent ? 'bg-green-600 border-green-600 text-white scale-110 shadow-lg shadow-green-200' :
                              isActive ? 'bg-green-100 border-green-300 text-green-700' :
                              'bg-gray-100 border-gray-200 text-gray-400'
                            }`}>
                              {stage === 'draft' ? <FileEdit className="w-4 h-4" /> :
                               stage === 'open' ? <PlayCircle className="w-4 h-4" /> :
                               <CheckCircle2 className="w-4 h-4" />}
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${
                              isCurrent ? 'text-green-700' : isActive ? 'text-green-600' : 'text-gray-400'
                            }`}>{stage}</span>
                          </div>
                          {idx < 2 && (
                            <div className={`flex-1 h-1 rounded-full mx-2 mb-4 transition-all ${
                              idx < stageIndex ? 'bg-green-400' : 'bg-gray-200'
                            }`} />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

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
                            app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {app.status === 'hired' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                            {app.status === 'rejected' && <XCircle className="w-3 h-3 inline mr-1" />}
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
