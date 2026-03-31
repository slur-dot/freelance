import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Briefcase, Info, DollarSign } from "lucide-react";
import { ProjectService } from "../../services/projectService";

export default function ProjectModal({ isOpen, onClose, user, onSave }) {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: "",
    client: "",
    status: "pending"
  });

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!form.title || !form.amount) {
      alert("Please enter a title and amount.");
      return;
    }
    
    try {
      setSaving(true);
      const payload = {
        title: form.title,
        description: form.description,
        amount: Number(form.amount) || 0,
        status: form.status,
        client: form.client || user?.displayName || "Self",
        freelancerId: user?.uid 
      };

      await ProjectService.createProject(payload, user.uid);
      if (onSave) onSave();
      onClose();
      alert(t('freelancer_dashboard.modals.post_project.success', 'Project posted successfully!'));
    } catch (err) {
      console.error("Post project error:", err);
      alert('Failed to save project. Please check inputs.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-100 transform transition-all animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-10 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <Briefcase className="w-8 h-8" />
             </div>
             <div>
                <h3 className="text-2xl font-bold">{t('freelancer_dashboard.modals.post_project.title', 'Post New Service')}</h3>
                <p className="text-white/70 text-sm mt-1">{t('freelancer_dashboard.modals.post_project.subtitle', 'Offer your expertise to potential clients.')}</p>
             </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('freelancer_dashboard.modals.post_project.form.title', 'Service Title')}</label>
              <input 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium" 
                placeholder="e.g. Professional Web Development"
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('freelancer_dashboard.modals.post_project.form.description', 'Description')}</label>
              <textarea 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium resize-none" 
                rows={3} 
                placeholder="Briefly describe what you're offering..."
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('freelancer_dashboard.modals.post_project.form.budget', 'Rate / Budget (GNF)')}</label>
                <div className="relative">
                   <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                   <input 
                    type="number" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-10 pr-5 py-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold" 
                    placeholder="0.00"
                    value={form.amount} 
                    onChange={(e) => setForm({ ...form, amount: e.target.value })} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('freelancer_dashboard.modals.post_project.form.status', 'Initial Status')}</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold appearance-none cursor-pointer" 
                  value={form.status} 
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button 
              onClick={onClose}
              className="flex-1 px-8 py-4 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {t('freelancer_dashboard.modals.post_project.cancel', 'Cancel')}
            </button>
            <button 
              disabled={saving}
              onClick={handleSubmit}
              className="flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1 active:scale-95 disabled:bg-blue-300 disabled:translate-y-0"
            >
              {saving ? t('freelancer_dashboard.modals.post_project.saving', 'Posting...') : t('freelancer_dashboard.modals.post_project.save', 'Post Service')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
