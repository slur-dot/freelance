import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Briefcase, MapPin, Clock, DollarSign, Search,
  Users, ArrowRight, Loader2, Heart, Bookmark
} from "lucide-react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, limit, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";



const categories = [
  "All",
  "Software Development",
  "Cloud & Infrastructure",
  "Cyber Security",
  "Data & Analytics",
  "SAP",
  "Design & Creative",
  "IT Support",
  "Business Applications",
];

async function fetchPublicJobs() {
  try {
    const jobsRef = collection(db, "projects");
    const q = query(jobsRef, where("type", "==", "job_posting"), where("status", "==", "open"), limit(50));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("Error fetching public jobs:", err);
    return null;
  }
}

export default function JobBoard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [favoritedJobs, setFavoritedJobs] = useState(new Set());

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchPublicJobs();
      setJobs(data && data.length > 0 ? data : []);
      setLoading(false);
    }
    load();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.skills || []).some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      selectedCategory === "All" || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatBudget = (budget) => {
    if (!budget) return "—";
    return Number(budget).toLocaleString() + " GNF";
  };

  const formatDate = (d) => {
    if (!d) return "";
    if (typeof d === "string") return d;
    if (d.seconds) return new Date(d.seconds * 1000).toLocaleDateString();
    return new Date(d).toLocaleDateString();
  };

  const handleSave = async (e, job) => {
    e.stopPropagation();
    if (!currentUser) { navigate("/login"); return; }
    try {
      await addDoc(collection(db, "users", currentUser.uid, "savedJobs"), {
        jobId: job.id, jobTitle: job.title, companyName: job.companyName || "", type: "saved", createdAt: serverTimestamp(),
      });
      setSavedJobs(prev => new Set([...prev, job.id]));
    } catch (err) { console.error("Error saving job:", err); }
  };

  const handleFavorite = async (e, job) => {
    e.stopPropagation();
    if (!currentUser) { navigate("/login"); return; }
    try {
      await addDoc(collection(db, "users", currentUser.uid, "savedJobs"), {
        jobId: job.id, jobTitle: job.title, companyName: job.companyName || "", type: "favorite", createdAt: serverTimestamp(),
      });
      setFavoritedJobs(prev => new Set([...prev, job.id]));
    } catch (err) { console.error("Error favoriting job:", err); }
  };

  const handleCardClick = (job) => {
    navigate(`/job-board/${job.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Briefcase className="w-4 h-4" />
            {t("job_board.badge", "Open Opportunities")}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {t("job_board.title", "Find Your Next Project")}
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
            {t("job_board.subtitle", "Browse job opportunities posted by verified vendors across Guinea.")}
          </p>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("job_board.search_placeholder", "Search jobs by title, skill, or keyword...")}
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 bg-white shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300/30 text-base"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {cat === "All" ? t("job_board.all_categories", "All") : cat}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {t("job_board.showing", "Showing")} <span className="font-bold text-gray-900">{filteredJobs.length}</span> {t("job_board.jobs", "jobs")}
          </p>
          {currentUser && userRole && ['Vendor', 'Seller'].includes(userRole) && (
            <button
              onClick={() => navigate("/hire-freelancers/info/job-post")}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-600/20 hover:-translate-y-0.5"
            >
              <Briefcase className="w-4 h-4" />
              {t("job_board.post_job", "Post a Job")}
            </button>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            <p className="text-sm">{t("job_board.loading", "Loading jobs...")}</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase className="w-16 h-16 mx-auto text-gray-200 mb-4" />
            <h3 className="text-xl font-bold text-gray-400">{t("job_board.no_jobs", "No jobs found")}</h3>
            <p className="text-gray-400 text-sm mt-2">{t("job_board.try_different", "Try a different search or category.")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => handleCardClick(job)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden group cursor-pointer"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {job.companyName || t("job_board.company", "Company")}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase flex-shrink-0">
                      {t("job_board.status_open", "Open")}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{job.description}</p>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                    {job.location && (
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                    )}
                    <span className="flex items-center gap-1 font-bold text-green-700">
                      <DollarSign className="w-3.5 h-3.5" /> {formatBudget(job.budget)}
                    </span>
                    {job.deadline && (
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {formatDate(job.deadline)}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> {job.applicants || 0} {t("job_board.applicants", "applicants")}
                    </span>
                  </div>

                  {/* Skills */}
                  {job.skills && job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {job.skills.slice(0, 5).map((skill, i) => (
                        <span key={i} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">{skill}</span>
                      ))}
                      {job.skills.length > 5 && (
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">+{job.skills.length - 5}</span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCardClick(job); }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
                    >
                      {t("job_board.view_details", "View Details")} <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleSave(e, job)}
                      disabled={savedJobs.has(job.id)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        savedJobs.has(job.id)
                          ? "bg-blue-50 border-blue-200 text-blue-600"
                          : "border-gray-200 text-gray-400 hover:border-blue-300 hover:text-blue-600"
                      }`}
                      title={t("job_board.save_for_later", "Save for Later")}
                    >
                      <Bookmark className={`w-4 h-4 ${savedJobs.has(job.id) ? "fill-blue-600" : ""}`} />
                    </button>
                    <button
                      onClick={(e) => handleFavorite(e, job)}
                      disabled={favoritedJobs.has(job.id)}
                      className={`p-2.5 rounded-xl border transition-all ${
                        favoritedJobs.has(job.id)
                          ? "bg-red-50 border-red-200 text-red-500"
                          : "border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500"
                      }`}
                      title={t("job_board.add_favorite", "Add to Favorites")}
                    >
                      <Heart className={`w-4 h-4 ${favoritedJobs.has(job.id) ? "fill-red-500" : ""}`} />
                    </button>
                  </div>
                </div>


              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
