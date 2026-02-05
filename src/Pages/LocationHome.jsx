import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import FreelancerLocation from "../components/FreelancerLocation";
import LocationHero from "../components/LocationHero";

export default function LocationHome() {
  const [activeTab, setActiveTab] = useState("freelancers");

  return (
    <div>
      <LocationHero />

      {/* Breadcrumb + Tabs Row  */}
      <div className="flex flex-wrap items-center justify-start gap-6 mb-4 px-4 sm:px-6 lg:px-8 pt-4">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-500 flex items-center ml-25 ">
          <ol className="inline-flex p-0 list-none">
            <li className="flex items-center">
              <Link to="/" className="text-gray-600 hover:underline">
                Home
              </Link>
              <ChevronRight className="h-3 w-3 mx-2" />
            </li>
            <li className="flex items-center">
              <span className="text-blue-500">Freelancer Locations</span>
            </li>
          </ol>
        </nav>

        {/* Tabs  */}
        <div className="flex ml-50 space-x-4">
          <button
            type="button"
            onClick={() => setActiveTab("freelancers")}
            className={`rounded-none px-0 pb-2  ${
              activeTab === "freelancers"
                ? "text-[#228B22]  "
                : "text-gray-600 hover:text-[#228B22]"
            }`}
          >
            Freelancer Locations
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pickup")}
            className={`rounded-none px-0 pb-2  ${
              activeTab === "pickup"
                ? "text-[#228B22] "
                : "text-gray-600 hover:text-[#228B22]"
            }`}
          >
            Pick-Up Locations
          </button>
        </div>
      </div>

      {/* Location Section */}
      <FreelancerLocation activeTab={activeTab} />
    </div>
  );
}
