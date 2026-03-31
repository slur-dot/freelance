import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { X, Send, DollarSign, User } from "lucide-react";
import { FreelancerService } from "../../services/freelancerService";

export default function JDModal({ isOpen, onClose, user, onSave }) {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    budget: "",
    client: "",
    message: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!form.title || !form.budget) {
      alert("Please enter a title and budget.");
      return;
    }
    
    try {
      setSaving(true);
      const payload = {
        title: form.title,
        budget: Number(form.budget) || 0,
        client: form.client || "Client",
        message: form.message,
        status: "pending"
      };

      const newApp = await FreelancerService.applyToJD(user.uid, payload);
      if (onSave) onSave(newApp);
      onClose();
      alert(t('freelancer_dashboard.modals.apply_jd.success', 'Application submitted!'));
    } catch (err) {
      console.error("Apply to JD error:", err);
      alert('Failed to submit application. Please check inputs.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-100 transform transition-all animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-8 py-10 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <Send className="w-8 h-8" />
             </div>
             <div>
                <h3 className="text-2xl font-bold">{t('freelancer_dashboard.modals.apply_jd.title', 'Apply to Job')}</h3>
                <p className="text-white/70 text-sm mt-1">{t('freelancer_dashboard.modals.apply_jd.subtitle', 'Submit a proposal for an open job description.')}</p>
             </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('freelancer_dashboard.modals.apply_jd.form.title', 'Job Title')}</label>
              <input 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium" 
                placeholder="e.g. Senior Backend Architect Required"
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('freelancer_dashboard.modals.apply_jd.form.budget', 'Proposed Budget (GNF)')}</label>
                <div className="relative">
                   <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                   <input 
                    type="number" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-10 pr-5 py-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-bold" 
                    placeholder="0.00"
                    value={form.budget} 
                    onChange={(e) => setForm({ ...form, budget: e.target.value })} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('freelancer_dashboard.modals.apply_jd.form.client', 'Client / Company Name')}</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-10 pr-5 py-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-bold" 
                    placeholder="Alpha Corp"
                    value={form.client} 
                    onChange={(e) => setForm({ ...form, client: e.target.value })} 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('freelancer_dashboard.modals.apply_jd.form.message', 'Proposal Message')}</label>
              <textarea 
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-medium resize-none text-sm" 
                rows={4} 
                placeholder="Explain why you are the best fit for this role..."
                value={form.message} 
                onChange={(e) => setForm({ ...form, message: e.target.value })} 
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button 
              onClick={onClose}
              className="flex-1 px-8 py-4 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors"
            >
              {t('freelancer_dashboard.modals.apply_jd.cancel', 'Cancel')}
            </button>
            <button 
              disabled={saving}
              onClick={handleSubmit}
              className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-1 active:scale-95 disabled:bg-indigo-300 disabled:translate-y-0"
            >
              {saving ? t('freelancer_dashboard.modals.apply_jd.submitting', 'Submitting...') : t('freelancer_dashboard.modals.apply_jd.apply', 'Submit Application')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
