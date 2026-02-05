import React, { useState } from "react";

export default function AddonsSelectionForm({ onContinue }) {
  const [selectedAddons, setSelectedAddons] = useState(["Charger"]);

  const addons = [
    "Charger",
    "Carrying Bag",
    "Sim / Data Plan",
    "Insurance",
    "On Site Technical Support",
    "Replacement Guarantee",
  ];

  const toggleAddon = (addon) => {
    setSelectedAddons((prevSelected) =>
      prevSelected.includes(addon)
        ? prevSelected.filter((item) => item !== addon)
        : [...prevSelected, addon]
    );
  };

  const handleSubmit = () => {
    if (onContinue) onContinue(selectedAddons);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-lg shadow-lg max-w-5xl w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              Booking Form
            </h1>
            <p className="text-black text-sm sm:text-base md:text-lg">
              Complete the booking form to complete your booking
            </p>
          </div>
        </div>

        {/* Add-ons Section */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
            Add-ons & Services
          </h2>
          <p className="text-black text-sm sm:text-base md:text-lg mb-4">
            Select Multiple
          </p>

          {/* Add-ons Buttons */}
          <div className="flex flex-col items-center gap-4">
            {/* First Row */}
            <div className="flex flex-wrap justify-center gap-4">
              {addons.slice(0, 4).map((addon) => (
                <button
                  key={addon}
                  onClick={() => toggleAddon(addon)}
                  className={`px-6 sm:px-10 md:px-12 py-2 rounded-lg text-xs sm:text-sm md:text-base font-medium transition-colors duration-200
                    ${
                      selectedAddons.includes(addon)
                        ? "bg-[#2E8B57] text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }
                  `}
                >
                  {addon}
                </button>
              ))}
            </div>

            {/* Second Row */}
            <div className="flex flex-wrap justify-center gap-4">
              {addons.slice(4).map((addon) => (
                <button
                  key={addon}
                  onClick={() => toggleAddon(addon)}
                  className={`px-6 sm:px-10 md:px-12 py-2 rounded-lg text-xs sm:text-sm md:text-base font-medium transition-colors duration-200
                    ${
                      selectedAddons.includes(addon)
                        ? "bg-[#2E8B57] text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }
                  `}
                >
                  {addon}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={handleSubmit}
            className="w-full max-w-[300px] bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-3xl font-medium text-lg sm:relative sm:left-[-40px]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
