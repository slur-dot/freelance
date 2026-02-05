import React from "react";
import ComputerRentalHero from "../components/ComputerRentalHero";
import ComputerRentalProducts from "../components/ComputerRentalProducts";

const ComputerRentalPage = () => {
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
