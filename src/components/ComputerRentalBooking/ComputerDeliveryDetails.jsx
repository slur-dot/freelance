import React, { useState } from "react";

export default function ComputerDeliveryDetails({ onContinue }) {
  const [formData, setFormData] = useState({
    deliveryAddress: "",
    deliveryTime: "",
    deliveryType: "delivery",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onContinue) onContinue(formData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg md:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Booking Form</h1>
          <p className="text-black text-sm sm:text-base">
            Complete the booking form to complete your booking
          </p>
        </div>

        {/* Delivery Details Header + Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h2 className="text-lg sm:text-xl font-bold">Delivery Details</h2>
          <div className="flex space-x-2">
            {["delivery", "pickup"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleInputChange("deliveryType", type)}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  formData.deliveryType === type
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Delivery Address */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <label className="w-full sm:w-48 text-sm font-medium">Delivery Address</label>
            <input
              type="text"
              value={formData.deliveryAddress}
              onChange={(e) =>
                handleInputChange("deliveryAddress", e.target.value)
              }
              placeholder="123 Street New York"
              className="w-full sm:flex-1 px-4 py-3 rounded-md bg-gray-100"
              required
            />
          </div>

          {/* Preferred Delivery Time */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <label className="w-full sm:w-48 text-sm font-medium">
              Preferred Delivery Time
            </label>
            <input
              type="text"
              value={formData.deliveryTime}
              onChange={(e) =>
                handleInputChange("deliveryTime", e.target.value)
              }
              placeholder="10/02/2025"
              className="w-full sm:w-[25%] px-4 py-3 rounded-md bg-gray-100"
              required
            />
          </div>

          {/* Continue Button */}
          <div className="flex justify-center p-6">
            <button
              type="submit"
              className="w-full max-w-[300px] bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-3xl font-medium text-lg relative left-0 sm:left-[-40px]"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
