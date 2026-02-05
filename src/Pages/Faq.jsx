import React from "react";
import FaqHeroSection from "../components/FaqHeroSection";
import FaqCategory from "../components/FaqHelpContent";
export default function Faq() {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <FaqHeroSection />
      <FaqCategory/>

      
    </div>
  );
}
