import React from "react";
import HeroHireFreelancer from "../components/HeroHireFreelancer";
import FreelancerProfile from "../components/FreelancerProfile"; 
import HireFreelancerFooter from "../components/HireFreelancerFooter";

export default function HireFreelancer() {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Hero Section */}
      <HeroHireFreelancer />

      {/* Freelancer Profile Section */}
      <div >
        <FreelancerProfile />
      </div>
        {/* Footer Section */}  
        <HireFreelancerFooter/>
    </div>
  );
}
