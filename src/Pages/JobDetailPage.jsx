import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Briefcase, MapPin, Clock, DollarSign, Users, ArrowRight, Loader2,
  Heart, Bookmark, Send, Building2, Calendar, Tag, ChevronLeft,
  CheckCircle, Share2
} from "lucide-react";
import { db } from "../firebaseConfig";
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs, updateDoc, increment } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";

export default function JobDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userData } = useAuth();

  const [job, setJob] = useState(null);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [showApplyForm, setShowApplyForm] = useState(false);

  useEffect(() => {
    async function loadJob() {
      setLoading(true);
      try {
        // If it's a demo/fallback job passed from the board, use it directly
        if (location.state?.fallbackJob) {
          setJob(location.state.fallbackJob);
          setLoading(false);
          return;
        }

        const jobDoc = await getDoc(doc(db, "projects", id));
        if (jobDoc.exists()) {
          const jobData = { id: jobDoc.id, ...jobDoc.data() };
          setJob(jobData);

          // Fetch company profile
          if (jobData.companyId) {
            try {
              const companyDoc = await getDoc(doc(db, "users", jobData.companyId));
              if (companyDoc.exists()) {
                setCompany({ id: companyDoc.id, ...companyDoc.data() });
              }
            } catch (e) { console.warn("Could not fetch company:", e); }
          }

          // Check if already applied
          if (currentUser) {
            try {
              const appsRef = collection(db, "projects");
              const q = query(appsRef, where("type", "==", "job_application"), where("jobId", "==", id), where("freelancerId", "==", currentUser.uid));
              const snap = await getDocs(q);
              if (!snap.empty) setApplied(true);
            } catch (e) { /* ignore */ }

            // Check saved/favorited
            try {
              const savedRef = collection(db, "users", currentUser.uid, "savedJobs");
              const sq = query(savedRef, where("jobId", "==", id));
              const ssnap = await getDocs(sq);
              if (!ssnap.empty) {
                const data = ssnap.docs[0].data();
                if (data.type === "favorite") setFavorited(true);
                else setSaved(true);
              }
            } catch (e) { /* ignore */ }
          }
        }
      } catch (err) {
        console.error("Error loading job:", err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadJob();
  }, [id, currentUser, location.state]);

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

  const handleApply = async () => {
    if (!currentUser) { navigate("/login"); return; }
    try {
      setApplying(true);
      await addDoc(collection(db, "projects"), {
        type: "job_application",
        jobId: id,
        freelancerId: currentUser.uid,
        freelancerName: userData?.fullName || userData?.name || currentUser.displayName || "Freelancer",
        freelancerEmail: currentUser.email || "",
        message: applicationMessage,
        budget: job.budget || 0,
        status: "pending",
        clientId: currentUser.uid,
        createdAt: serverTimestamp(),
      });
      // Increment applicants count
      try {
        await updateDoc(doc(db, "projects", id), { applicants: increment(1) });
      } catch (e) { /* ignore */ }
      setApplied(true);
      setShowApplyForm(false);
    } catch (err) {
      console.error("Error applying:", err);
      alert(t("job_board.apply_error", "Failed to submit application. Please try again."));
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser) { navigate("/login"); return; }
    try {
      const savedRef = collection(db, "users", currentUser.uid, "savedJobs");
      await addDoc(savedRef, {
        jobId: id,
        jobTitle: job.title,
        companyName: job.companyName || "",
        type: "saved",
        createdAt: serverTimestamp(),
      });
      setSaved(true);
    } catch (err) {
      console.error("Error saving job:", err);
    }
  };

  const handleFavorite = async () => {
    if (!currentUser) { navigate("/login"); return; }
    try {
      const savedRef = collection(db, "users", currentUser.uid, "savedJobs");
      await addDoc(savedRef, {
        jobId: id,
        jobTitle: job.title,
        companyName: job.companyName || "",
        type: "favorite",
        createdAt: serverTimestamp(),
      });
      setFavorited(true);
    } catch (err) {
      console.error("Error favoriting job:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-400 gap-4">
        <Briefcase className="w-16 h-16 opacity-20" />
        <h2 className="text-xl font-bold">{t("job_board.not_found", "Job not found")}</h2>
        <button onClick={() => navigate("/job-board")} className="text-blue-600 hover:underline text-sm font-medium">
          ← {t("job_board.back_to_board", "Back to Job Board")}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <button onClick={() => navigate("/job-board")} className="flex items-center gap-1 text-blue-200 hover:text-white text-sm mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> {t("job_board.back_to_board", "Back to Job Board")}
          </button>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-green-500/20 text-green-200 text-xs font-bold rounded-full uppercase">
                  {job.status || "Open"}
                </span>
                {job.category && (
                  <span className="px-3 py-1 bg-white/10 text-white/80 text-xs font-medium rounded-full flex items-center gap-1">
                    <Tag className="w-3 h-3" /> {job.category}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-blue-200 text-sm mt-3">
                {job.companyName && (
                  <button
                    onClick={() => company ? navigate(`/hire-freelancers/info`, { state: { companyId: job.companyId } }) : null}
                    className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                  >
                    <Building2 className="w-4 h-4" /> {job.companyName}
                  </button>
                )}
                {job.location && (
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                )}
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {t("job_board.posted", "Posted")} {formatDate(job.createdAt)}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-right">
                <p className="text-blue-200 text-xs uppercase font-bold tracking-wider">{t("job_board.budget_label", "Budget")}</p>
                <p className="text-2xl sm:text-3xl font-bold">{formatBudget(job.budget)}</p>
              </div>
              {job.deadline && (
                <div className="text-right">
                  <p className="text-blue-200 text-xs uppercase font-bold tracking-wider">{t("job_board.deadline_label", "Deadline")}</p>
                  <p className="text-lg font-semibold">{formatDate(job.deadline)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left — Job Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                {t("job_board.description", "Job Description")}
              </h2>
              <div className="prose prose-gray max-w-none text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {job.description || t("job_board.no_description", "No description provided.")}
              </div>
            </div>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">{t("job_board.required_skills", "Required Skills")}</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-xl border border-blue-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Apply Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              {applied ? (
                <div className="flex items-center gap-3 text-green-700 bg-green-50 p-4 rounded-xl">
                  <CheckCircle className="w-6 h-6" />
                  <div>
                    <p className="font-bold">{t("job_board.already_applied", "You've already applied!")}</p>
                    <p className="text-sm text-green-600">{t("job_board.applied_msg", "The company will review your application and reach out.")}</p>
                  </div>
                </div>
              ) : showApplyForm ? (
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900">{t("job_board.apply_title", "Submit Your Application")}</h3>
                  <textarea
                    rows={4}
                    value={applicationMessage}
                    onChange={(e) => setApplicationMessage(e.target.value)}
                    placeholder={t("job_board.apply_message_placeholder", "Tell the company why you're the best fit for this job...")}
                    className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleApply}
                      disabled={applying}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:bg-green-300"
                    >
                      {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4" /> {t("job_board.submit_application", "Submit Application")}</>}
                    </button>
                    <button onClick={() => setShowApplyForm(false)} className="px-6 py-3 text-gray-500 hover:bg-gray-100 rounded-xl font-medium transition-colors">
                      {t("common.cancel", "Cancel")}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => currentUser ? setShowApplyForm(true) : navigate("/login")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 text-lg transition-all shadow-lg shadow-blue-600/20 hover:-translate-y-0.5"
                >
                  <Send className="w-5 h-5" />
                  {currentUser ? t("job_board.apply_now", "Apply Now") : t("job_board.login_to_apply", "Login to Apply")}
                </button>
              )}
            </div>
          </div>

          {/* Right — Sidebar */}
          <div className="space-y-5">
            {/* Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3">
              <button
                onClick={handleSave}
                disabled={saved}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-all ${
                  saved
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                <Bookmark className={`w-4 h-4 ${saved ? "fill-blue-600" : ""}`} />
                {saved ? t("job_board.saved", "Saved for Later") : t("job_board.save_for_later", "Save for Later")}
              </button>
              <button
                onClick={handleFavorite}
                disabled={favorited}
                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-all ${
                  favorited
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-500"
                }`}
              >
                <Heart className={`w-4 h-4 ${favorited ? "fill-red-500" : ""}`} />
                {favorited ? t("job_board.favorited", "Added to Favorites") : t("job_board.add_favorite", "Add to Favorites")}
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: job.title, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert(t("job_board.link_copied", "Link copied to clipboard!"));
                  }
                }}
                className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-sm bg-white border border-gray-200 text-gray-700 hover:border-gray-400 transition-all"
              >
                <Share2 className="w-4 h-4" /> {t("job_board.share_job", "Share this Job")}
              </button>
            </div>

            {/* Company Card */}
            {(company || job.companyName) && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">{t("job_board.about_company", "About the Company")}</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-lg">
                    {(job.companyName || "C").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{job.companyName || "Company"}</p>
                    <p className="text-xs text-gray-500">{company?.location || company?.city || job.location || "Guinea"}</p>
                  </div>
                </div>
                {company?.bio && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{company.bio}</p>
                )}
                {company && (
                  <button
                    onClick={() => navigate("/hire-freelancers/info", { state: { companyId: job.companyId } })}
                    className="w-full py-2.5 rounded-xl text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Building2 className="w-4 h-4" /> {t("job_board.view_profile", "View Company Profile")}
                  </button>
                )}
              </div>
            )}

            {/* Job Meta */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">{t("job_board.job_details", "Job Details")}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><DollarSign className="w-4 h-4" /> {t("job_board.budget_label", "Budget")}</span>
                  <span className="font-bold text-green-700">{formatBudget(job.budget)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><MapPin className="w-4 h-4" /> {t("job_board.location_label", "Location")}</span>
                  <span className="font-medium text-gray-900">{job.location || "—"}</span>
                </div>
                {job.deadline && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-2"><Clock className="w-4 h-4" /> {t("job_board.deadline_label", "Deadline")}</span>
                    <span className="font-medium text-gray-900">{formatDate(job.deadline)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><Users className="w-4 h-4" /> {t("job_board.applicants", "Applicants")}</span>
                  <span className="font-medium text-gray-900">{job.applicants || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><Calendar className="w-4 h-4" /> {t("job_board.posted", "Posted")}</span>
                  <span className="font-medium text-gray-900">{formatDate(job.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
