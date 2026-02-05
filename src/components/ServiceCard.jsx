import React from "react";
import { FaArrowRight } from "react-icons/fa";

export default function ServiceCard({ icon, title, description, buttonText, additionalContent }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 lg:p-8 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 hover:bg-slate-800/70">
      <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex-shrink-0 mx-auto sm:mx-0">{icon}</div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{title}</h3>
          <p className="text-gray-400 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">{description}</p>
          {additionalContent && <div className="mb-3 sm:mb-4">{additionalContent}</div>}
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto rounded transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
            {buttonText}
            <FaArrowRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
