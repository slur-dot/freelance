import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Mail, Phone, Upload, Send, MessageSquare, Briefcase, Handshake, CheckCircle2 } from 'lucide-react';
import partnershipImage from '../assets/partnership-humanImage.jpeg';
import { db, storage } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Partnership() {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    partnershipType: '',
    projectDetails: '',
    comments: '',
  });
  
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSubmitSuccess(false);

    try {
      let fileUrl = null;
      let fileName = null;

      if (file) {
        const fileRef = ref(storage, `partnerships/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(fileRef, file);
        fileUrl = await getDownloadURL(snapshot.ref);
        fileName = file.name;
      }

      await addDoc(collection(db, 'partnerships'), {
        ...formData,
        fileUrl,
        fileName,
        createdAt: serverTimestamp(),
        status: 'pending'
      });

      setSubmitSuccess(true);
      setFormData({
        name: '', email: '', phone: '', partnershipType: '', projectDetails: '', comments: ''
      });
      setFile(null);
      
      setTimeout(() => setSubmitSuccess(false), 5000);
      
    } catch (error) {
      console.error('Error submitting application:', error);
      setErrorMsg('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white pt-24 pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center z-10">
          <span className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full font-semibold mb-6">
            <Handshake className="w-5 h-5" /> Let's Grow Together
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Partner With Freelance
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join our ecosystem of talented professionals and forward-thinking companies. We're looking for mutually beneficial partnerships to create lasting impact.
          </p>
        </div>
      </div>

      {/* Main Form Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full flex flex-col md:flex-row">
          
          {/* Left Info Panel (Image) */}
          <div className="md:w-5/12 hidden md:block relative min-h-[600px]">
            <img 
              src={partnershipImage} 
              alt="Partnership Handshake" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-slate-900/40 to-slate-900/90 flex flex-col justify-end p-12 text-white">
              <div className="space-y-6 mb-8">
                <div className="flex gap-4 items-start">
                  <div className="bg-[#15803D]/80 backdrop-blur-sm p-3 rounded-full mt-1">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xl">Market Expansion</h4>
                    <p className="text-gray-200 mt-1">Access new markets and a broader audience.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="bg-blue-600/80 backdrop-blur-sm p-3 rounded-full mt-1">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xl">Premium Resources</h4>
                    <p className="text-gray-200 mt-1">Leverage our extensive pool of vetted talent.</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-white/20">
                <p className="text-gray-300 mb-2">Have questions?</p>
                <a href="mailto:partners@freelance.com" className="text-white font-medium hover:text-blue-300 flex items-center gap-2">
                  <Mail className="w-5 h-5" /> partners@freelance-224.com
                </a>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="p-8 md:p-12 lg:p-16 md:w-7/12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Application Form</h2>
            <p className="text-gray-500 mb-8">Fill out the details below and our partnership team will reach out to you.</p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {/* Name / Company */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company / Organization Name *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#15803D] focus:border-transparent transition-colors"
                      placeholder="e.g. Acme Corp"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#15803D] focus:border-transparent transition-colors"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#15803D] focus:border-transparent transition-colors"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </div>

                {/* Partnership Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type of Partnership *</label>
                  <select
                    name="partnershipType"
                    required
                    value={formData.partnershipType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#15803D] focus:border-transparent transition-colors text-gray-700"
                  >
                    <option value="" disabled>Select partnership type</option>
                    <option value="affiliate">Affiliate / Referral</option>
                    <option value="technology">Technology Provider</option>
                    <option value="sponsor">Sponsorship / Event</option>
                    <option value="education">Educational Institution</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Project Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project / Proposal Details *</label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      name="projectDetails"
                      required
                      value={formData.projectDetails}
                      onChange={handleInputChange}
                      rows="4"
                      className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#15803D] focus:border-transparent transition-colors resize-none"
                      placeholder="Briefly describe the proposed partnership..."
                    ></textarea>
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Comments</label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      name="comments"
                      value={formData.comments}
                      onChange={handleInputChange}
                      rows="3"
                      className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#15803D] focus:border-transparent transition-colors resize-none"
                      placeholder="Any other details we should know?"
                    ></textarea>
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Optional Document (Pitch Deck, Proposal)</label>
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, PPTX, DOCX (MAX. 10MB)</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                    />
                  </label>
                  {file && (
                    <p className="mt-2 text-sm text-[#15803D] font-medium flex items-center gap-2">
                      <Upload className="w-4 h-4" /> {file.name}
                    </p>
                  )}
                </div>
              </div>

              {errorMsg && (
                <div className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-200 text-sm">
                  {errorMsg}
                </div>
              )}
              
              {submitSuccess && (
                <div className="p-4 rounded-lg bg-green-50 text-green-700 border border-green-200 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Your partnership application has been submitted successfully! We will contact you soon.</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full text-white font-bold py-4 px-8 rounded-lg transition-colors flex justify-center items-center gap-2 mt-4 
                  ${isSubmitting ? 'bg-[#15803D]/70 cursor-not-allowed' : 'bg-[#15803D] hover:bg-[#166534]'}`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'} {!isSubmitting && <Send className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
