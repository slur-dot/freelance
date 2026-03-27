import React, { useState } from "react";

export default function AddonsSelectionForm({ onContinue, deviceData }) {
  const isMobile = deviceData?.deviceType === 'phone' || deviceData?.deviceType === 'tablet';

  // Paid Services with costs conditionally structured
  const paidServices = [
    { name: "Insurance", cost: 200000 },
    { name: "Carrying Bag", cost: 30000 },
    ...(isMobile ? [
      { name: "SIM Data Plan", cost: 50000 },
      { name: "Mobile Back Cover", cost: 25000 },
      { name: "Screen Protector", cost: 15000 },
    ] : [
      { name: "On Site Technical Support", cost: 150000 },
      { name: "Replacement Guarantee", cost: 100000 },
    ])
  ];

  const includedItems = ["Charger"];

  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (service) => {
    setSelectedServices((prev) => {
      const exists = prev.find((item) => item.name === service.name);
      if (exists) {
        return prev.filter((item) => item.name !== service.name);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleSubmit = () => {
    if (onContinue) {
      // Combine included items (cost 0) with selected paid services
      const allAddons = [
        ...includedItems.map(item => ({ name: item, cost: 0, type: 'included' })),
        ...selectedServices.map(item => ({ ...item, type: 'service' }))
      ];
      onContinue(allAddons);
    }
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

        {/* Included Items Section */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Included Accessories</h2>
          <div className="flex flex-wrap gap-4">
            {includedItems.map((item) => (
              <div
                key={item}
                className="px-6 py-2 rounded-lg bg-gray-100 text-gray-500 font-medium border border-gray-200 cursor-not-allowed flex items-center gap-2"
              >
                <span>✓</span>
                {item}
                <span className="text-xs ml-1">(Included)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Paid Services Section */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            Add-ons & Services
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Select additional services to add to your purchase
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paidServices.map((service) => {
              const isSelected = selectedServices.some(s => s.name === service.name);
              return (
                <button
                  key={service.name}
                  onClick={() => toggleService(service)}
                  className={`flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-4 rounded-lg font-medium transition-all duration-200 border gap-2
                    ${isSelected
                      ? "bg-green-50 border-green-500 text-green-700 shadow-sm"
                      : "bg-white border-gray-200 text-gray-700 hover:border-green-300 hover:bg-gray-50"
                    }
                  `}
                >
                  <span className="text-xs sm:text-base text-left break-words">{service.name}</span>
                  <span className={`text-[10px] sm:text-sm ${isSelected ? 'font-bold' : ''} whitespace-nowrap`}>
                    {service.cost.toLocaleString()} GNF
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={handleSubmit}
            className="w-full max-w-[300px] bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-3xl font-medium text-lg"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
