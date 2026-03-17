import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ComputerRentalHero from "../components/ComputerRentalHero";
import ComputerRentalProducts from "../components/ComputerRentalProducts";

const ComputerRentalPage = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <ComputerRentalHero />

      {/* Products Section */}
      <div className="bg-gray-50 py-12">
        <ComputerRentalProducts />
      </div>
    </div>
  );
};

export default ComputerRentalPage;
