import React, { useState } from "react";
import { Star, X, ArrowRight, MessageSquare, Heart, AlignJustify } from "lucide-react";

import EmilyImage from "../assets/Emily.jpg";
import HireFreelanceImage from "../assets/HireFreelanceImage.png";
import LiveChatWidget from "./Support/LiveChatWidget";



export default function JobPostForm() {
  const [skills, setSkills] = useState(["Cyber Security", "SAP", "IT Support Specialist"]);
  const [showLiveChat, setShowLiveChat] = useState(false);

  const addSkill = () => {
    setSkills([...skills, "New Skill"]);
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handlePostJob = () => {
    alert("Job posted successfully! Freelancers can now bid on your project.");
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Section - Job Post Form */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-bold">Post a Job</h2>
          <p className="text-gray-600">
            Find the right talent for your next project in Conakry and beyond.
          </p>

          {/* Job Title */}
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h3 className="text-lg font-semibold">Job Title</h3>
              <input
                type="text"
                placeholder="Need an IT Support Specialist in Conakry"
                className="flex-grow border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Enter a short and clear title for your job posting.
            </p>
          </div>

          {/* Job Description */}
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h3 className="text-lg font-semibold">Job Description</h3>
              <textarea
                placeholder="Describe the tasks, goals, and requirements."
                className="min-h-[100px] flex-grow border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Provide detailed information about the job.
            </p>
          </div>

          {/* Budget & Deadline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Budget */}
          <div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold">Budget</h3>
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
                Enter the estimated budget for this project.
              </p>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold">Deadline</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    defaultValue="10"
                    className="w-20 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-100"
                  />
                  <span className="text-gray-500">Days</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Specify how many days the freelancer has to complete the job.
              </p>
            </div>
          </div>
        </div>


         {/* Skills */}

        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h3 className="text-lg font-semibold">Skills Required</h3>
            <div className="flex items-center space-x-2 flex-grow">
              <select
                className="w-1/2 border border-gray-300 rounded-md p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                id="skillSelect"
              >
                <option value="" disabled selected>Select a skill</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="SAP">SAP</option>
                <option value="IT Support Specialist">IT Support Specialist</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Analysis">Data Analysis</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Cloud Computing">Cloud Computing</option>
              </select>
              <button
                onClick={addSkill}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 rounded-full"
              >
                Add
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Add multiple skills relevant to the job.
          </p>
          <div className="p-3 mt-3 rounded-md flex flex-wrap gap-2 ml-35 bg-gray-100 ">
            {skills.map((skill, index) => (
              <div key={index} className="relative ">
                <span className="bg-green-600 text-white px-3 py-1 rounded-md text-sm">
                  {skill}
                </span>
                <button
                  onClick={() => removeSkill(index)}
                  className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 shadow-sm text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Post a Job Button */}
        <div className="pt-6 border-t flex justify-center">
          <button
            onClick={handlePostJob}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-medium text-sm flex items-center justify-center gap-2"
            style={{ backgroundColor: '#15803D' }}
          >
            <ArrowRight className="w-4 h-4" />
            Post a Job
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

              {/* Skills */}
              <div>
                <h5 className="text-md font-semibold mb-1">Skills</h5>
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
                  Hire Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowLiveChat(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2 mt-4 px-4 py-2 rounded-full"
              >
                <MessageSquare className="w-4 h-4" /> Message Freelancer
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
