import React, { useState, useRef, useEffect } from "react";
import { Star, X, ArrowRight, MessageSquare, Heart, AlignJustify, Briefcase, Award, FolderGit2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import EmilyImage from "../assets/Emily.jpg";
import HireFreelanceImage from "../assets/HireFreelanceImage.png";
import LiveChatWidget from "./Support/LiveChatWidget";



export default function JobPostForm() {
  const { t } = useTranslation();
  const [skills, setSkills] = useState(["Cyber Security", "SAP", "IT Support Specialist"]);
  const [showLiveChat, setShowLiveChat] = useState(false);
  
  // Custom Autocomplete State
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Expanded list of IT related skills
  const availableSkills = [
    "Cyber Security", "SAP", "IT Support Specialist", "Web Development",
    "Data Analysis", "UI/UX Design", "Cloud Computing", "Python",
    "JavaScript", "React", "Node.js", "Java", "C++", "C#", "SQL",
    "NoSQL", "DevOps", "Docker", "Kubernetes", "AWS", "Azure",
    "Google Cloud", "Machine Learning", "Artificial Intelligence",
    "Blockchain", "Mobile Development", "iOS", "Android", "React Native",
    "Flutter", "Ruby on Rails", "PHP", "Laravel", "Vue.js", "Angular",
    "TypeScript", "GraphQL", "REST API"
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowDropdown(true);
  };

  const addSkill = (skill) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setInputValue("");
      setShowDropdown(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      addSkill(inputValue.trim());
    } else if (e.key === "Backspace" && !inputValue && skills.length > 0) {
      removeSkill(skills.length - 1);
    }
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handlePostJob = () => {
    alert(t('job_post.form.success'));
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section - Job Post Form */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-bold">{t('job_post.title')}</h2>
          <p className="text-gray-600">
            {t('job_post.subtitle')}
          </p>

          {/* Job Title */}
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h3 className="text-lg font-semibold">{t('job_post.form.job_title')}</h3>
              <input
                type="text"
                placeholder={t('job_post.form.job_title_placeholder')}
                className="flex-grow border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {t('job_post.form.job_title_help')}
            </p>
          </div>

          {/* Job Description */}
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h3 className="text-lg font-semibold">{t('job_post.form.description')}</h3>
              <textarea
                placeholder={t('job_post.form.description_placeholder')}
                className="min-h-[100px] flex-grow border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {t('job_post.form.description_help')}
            </p>
          </div>

          {/* Budget & Deadline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Budget */}
            <div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold">{t('job_post.form.budget')}</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      defaultValue="1000000"
                      className="w-32 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
                    />
                    <span className="text-gray-500">GNF</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {t('job_post.form.budget_help')}
                </p>
              </div>
            </div>

            {/* Deadline */}
            <div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-lg font-semibold">{t('job_post.form.deadline')}</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      defaultValue="10"
                      className="w-20 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
                    />
                    <span className="text-gray-500">{t('job_post.form.days')}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {t('job_post.form.deadline_help')}
                </p>
              </div>
            </div>
          </div>


          {/* Skills */}

          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h3 className="text-lg font-semibold">{t('job_post.form.skills')}</h3>
              <div className="flex-grow max-w-lg relative">
                
                {/* Custom Autocomplete Input Area */}
                <div 
                  className={`min-h-[48px] border rounded-md p-1.5 flex flex-wrap gap-2 items-center bg-gray-50 transition-colors ${showDropdown ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-300 hover:border-gray-400'}`}
                  onClick={() => inputRef.current?.focus()}
                >
                  {/* Chips */}
                  {skills.map((skill, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-1 bg-green-600 text-white px-2.5 py-1 rounded border border-green-700 text-sm"
                    >
                      <span className="max-w-[150px] truncate">{skill}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSkill(index);
                        }}
                        className="hover:bg-green-700 hover:text-red-200 rounded-full p-0.5 ml-1 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  
                  {/* Input field */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowDropdown(true)}
                    placeholder={skills.length === 0 ? t('job_post.form.skills_placeholder') : ""}
                    className="flex-grow min-w-[120px] bg-transparent outline-none p-1 text-sm text-gray-800 placeholder-gray-400"
                  />
                </div>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div 
                    ref={dropdownRef}
                    className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
                  >
                    {availableSkills
                      .filter(skill => !skills.includes(skill))
                      .filter(skill => skill.toLowerCase().includes(inputValue.toLowerCase()))
                      .map((skill, index) => (
                        <div
                          key={index}
                          onClick={() => addSkill(skill)}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700 transition-colors"
                        >
                          {skill}
                        </div>
                      ))}
                    
                    {/* Allow custom skill entry if no exact match */}
                    {inputValue && !availableSkills.some(s => s.toLowerCase() === inputValue.toLowerCase()) && (
                      <div
                        onClick={() => addSkill(inputValue.trim())}
                        className="px-4 py-2 bg-gray-50 hover:bg-gray-100 cursor-pointer text-sm text-blue-600 font-medium border-t border-gray-100 transition-colors"
                      >
                        Add "{inputValue}"
                      </div>
                    )}

                    {/* Empty State */}
                    {availableSkills.filter(skill => !skills.includes(skill) && skill.toLowerCase().includes(inputValue.toLowerCase())).length === 0 && !inputValue && (
                      <div className="px-4 py-3 text-sm text-gray-500 italic text-center">
                        No more default skills available
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {t('job_post.form.skills_help')}
            </p>
          </div>

          {/* Post a Job Button */}
          <div className="pt-6 border-t flex justify-center">
            <button
              onClick={handlePostJob}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium text-sm flex items-center justify-center gap-2"
              style={{ backgroundColor: '#15803D' }}
            >
              <ArrowRight className="w-4 h-4" />
              {t('job_post.form.post_btn')}
            </button>
          </div>

        </div>

        {/* Right Section - Freelancer Card */}

        <div className="lg:col-span-1 border border-gray-200 ">
          <div className="bg-white overflow-hidden">
            <img
              src={HireFreelanceImage}
              alt="Freelancer Portfolio"
              className="w-full h-48 object-cover"
            />
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={EmilyImage}
                  alt="Emily Lewis"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                />
                <div>
                  <h4 className="text-xl font-bold">Emily Lewis</h4>
                  <p className="text-sm text-gray-500">Conakry</p>
                </div>
              </div>

              {/* Freelancer Summary Badges */}
              <div className="grid grid-cols-3 gap-2 py-2">
                <div className="bg-blue-50 p-2 rounded-md text-center border border-blue-100">
                  <div className="flex justify-center mb-1"><Briefcase className="w-4 h-4 text-blue-600" /></div>
                  <div className="text-sm font-bold text-gray-800">5+ Yrs</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">{t('freelancer.profile.experienceLabel') || 'Experience'}</div>
                </div>
                <div className="bg-purple-50 p-2 rounded-md text-center border border-purple-100">
                  <div className="flex justify-center mb-1"><Award className="w-4 h-4 text-purple-600" /></div>
                  <div className="text-sm font-bold text-gray-800">Pro</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">{t('freelancer.profile.levelLabel') || 'Level'}</div>
                </div>
                <div className="bg-green-50 p-2 rounded-md text-center border border-green-100">
                  <div className="flex justify-center mb-1"><FolderGit2 className="w-4 h-4 text-green-600" /></div>
                  <div className="text-sm font-bold text-gray-800">42</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">{t('freelancer.profile.projectsLabel') || 'Projects'}</div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h5 className="text-md font-semibold mb-1">{t('job_post.freelancer.skills')}</h5>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-700 text-white px-2 py-1 rounded-full text-xs">SAP</span>
                  <span className="bg-green-700 text-white px-2 py-1 rounded-full text-xs">
                    IT Support Specialist
                  </span>
                </div>
                {/* Star with rating */}
                <div className="flex items-center gap-1 mt-2 mb-2">
                  <Star className="text-yellow-500 w-4 h-4 fill-current" />
                  <span className="text-sm text-gray-600 font-medium">4.9 (7)</span>
                </div>
              </div>

              {/* Rating */}
              <div className="bg-green-100 rounded-md p-3">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm italic text-gray-700 mt-2">
                  "Great work, delivered on time!"
                  <br />
                  <span className="font-semibold block text-right">- David Joe</span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700">
                  <AlignJustify className="w-5 h-5" />
                  <Heart className="w-5 h-5" />

                </button>
                <button className="ml-auto bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 px-4 py-2 rounded-full">
                  {t('job_post.freelancer.hire_btn')} <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowLiveChat(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2 mt-4 px-4 py-2 rounded-full"
              >
                <MessageSquare className="w-4 h-4" /> {t('job_post.freelancer.message_btn')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Chat Widget */}
      {showLiveChat && (
        <LiveChatWidget
          forceOpen={true}
          onClose={() => setShowLiveChat(false)}
        />
      )}
    </div>
  );
}
