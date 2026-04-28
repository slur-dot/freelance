import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Briefcase, DollarSign, MapPin, Calendar, Tag, FileText } from "lucide-react";
import { CompanyService } from "../../services/companyService";

export default function PostJobModal({ isOpen, onClose, user, onSave }) {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    deadline: "",
    skills: "",
    location: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!form.title || !form.budget) {
      alert(t('company_dashboard.post_job.validation', 'Please enter at least a job title and budget.'));
      return;
    }

    try {
      setSaving(true);
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category || "General",
        budget: Number(form.budget) || 0,
        deadline: form.deadline || null,
        skills: form.skills ? form.skills.split(",").map(s => s.trim()) : [],
        location: form.location || "Remote"
      };

      const newJob = await CompanyService.postJobDescription(user.uid, payload);
      if (onSave) onSave(newJob);
      setForm({ title: "", description: "", category: "", budget: "", deadline: "", skills: "", location: "" });
      onClose();
    } catch (err) {
      console.error("Post job error:", err);
      alert(t('company_dashboard.post_job.error', 'Failed to post job. Please try again.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 transform transition-all animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-8 py-8 text-white relative flex-shrink-0">
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Briefcase className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">{t('company_dashboard.post_job.title', 'Post a New Job')}</h3>
              <p className="text-white/70 text-sm mt-1">{t('company_dashboard.post_job.subtitle', 'Describe the role and find the perfect freelancer.')}</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-5 overflow-y-auto flex-1">
          {/* Job Title */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('company_dashboard.post_job.form.title', 'Job Title')} *</label>
            <input 
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium" 
              placeholder="e.g. Senior React Developer Needed"
              value={form.title} 
              onChange={(e) => setForm({ ...form, title: e.target.value })} 
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {t('company_dashboard.post_job.form.description', 'Job Description')}
            </label>
            <textarea 
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium resize-none text-sm" 
              rows={4} 
              placeholder="Describe the project requirements, expectations, and deliverables..."
              value={form.description} 
              onChange={(e) => setForm({ ...form, description: e.target.value })} 
            />
          </div>

          {/* Category + Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {t('company_dashboard.post_job.form.category', 'Category')}
              </label>
              <select 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium"
                value={form.category} 
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Select category</option>
                <option value="Software Development">Software Development</option>
                <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Data & Analytics">Data & Analytics</option>
                <option value="SAP">SAP</option>
                <option value="Business Applications">Business Applications</option>
                <option value="Design & Creative">Design & Creative</option>
                <option value="IT Support">IT Support</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {t('company_dashboard.post_job.form.location', 'Location')}
              </label>
              <input 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium" 
                placeholder="Conakry / Remote"
                value={form.location} 
                onChange={(e) => setForm({ ...form, location: e.target.value })} 
              />
            </div>
          </div>

          {/* Budget + Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                {t('company_dashboard.post_job.form.budget', 'Budget (GNF)')} *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="number" 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-10 pr-5 py-3.5 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-bold" 
                  placeholder="500,000"
                  value={form.budget} 
                  onChange={(e) => setForm({ ...form, budget: e.target.value })} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {t('company_dashboard.post_job.form.deadline', 'Deadline')}
              </label>
              <input 
                type="date" 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium" 
                value={form.deadline} 
                onChange={(e) => setForm({ ...form, deadline: e.target.value })} 
              />
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('company_dashboard.post_job.form.skills', 'Required Skills (comma-separated)')}</label>
            <input 
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all font-medium text-sm" 
              placeholder="React, Node.js, Python, AWS"
              value={form.skills} 
              onChange={(e) => setForm({ ...form, skills: e.target.value })} 
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <button 
              onClick={onClose}
              className="flex-1 px-8 py-4 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {t('company_dashboard.post_job.cancel', 'Cancel')}
            </button>
            <button 
              disabled={saving}
              onClick={handleSubmit}
              className="flex-[2] bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-green-600/20 transition-all hover:-translate-y-1 active:scale-95 disabled:bg-green-300 disabled:translate-y-0 cursor-pointer"
            >
              {saving ? t('company_dashboard.post_job.posting', 'Publishing...') : t('company_dashboard.post_job.submit', 'Publish Job Posting')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
