import React, { useState } from "react";
import PaymentMethodSelector from "../Payment/PaymentMethodSelector";
import PriceDisplay from "../PriceDisplay";

export default function ComputerPaymentDetails({ onContinue }) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('orange-money');
  const [paymentDetails, setPaymentDetails] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    notes: "",
    confirmAccurate: true,
    agreeTerms: false,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handlePaymentDetailsChange = (details) => {
    setPaymentDetails(details);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onContinue) {
      onContinue({
        ...formData,
        paymentMethod: selectedPaymentMethod,
        paymentDetails: paymentDetails
      });
    }
  };

  return (
    <div className="flex justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Booking Form</h1>
          <p className="mt-2 text-black">
            Complete the booking form to complete your booking
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Payment Method Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              Payment Method
            </h2>
            <PaymentMethodSelector
              selectedMethod={selectedPaymentMethod}
              onMethodChange={handlePaymentMethodChange}
              amount={50920} // Example rental amount
              currency="GNF"
              showAmount={true}
            />
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-y-4 gap-x-6 items-center">
              {/* Name */}
              <label htmlFor="name" className="text-gray-700">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                className="w-full bg-gray-100 px-3 py-2 border rounded-md"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />

              {/* Phone Number */}
              <label htmlFor="phone-number" className="text-gray-700">
                Phone Number *
              </label>
              <input
                id="phone-number"
                type="tel"
                placeholder="+224 123 456 789"
                className="w-full bg-gray-100 px-3 py-2 border rounded-md"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Special Instructions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Special Instructions or Notes
            </h2>
            <textarea
              placeholder="Enter Special Instructions or Notes here"
              className="min-h-[120px] w-full resize-y bg-gray-100 px-3 py-2 border rounded-md"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
            />
          </div>

          {/* Confirmation */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Confirmation</h2>
            <div className="space-y-4">
              {/* First Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="confirm-accurate"
                  checked={formData.confirmAccurate}
                  onChange={(e) =>
                    handleInputChange("confirmAccurate", e.target.checked)
                  }
                  className="w-5 h-5 appearance-none border border-gray-300 rounded-sm checked:bg-green-600 checked:border-green-600 focus:outline-none transition duration-200 relative"
                  style={{
                    backgroundImage:
                      "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"white\"><path fill-rule=\"evenodd\" d=\"M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z\" clip-rule=\"evenodd\"/></svg>')",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "70%",
                  }}
                />
                <label htmlFor="confirm-accurate" className="text-gray-700">
                  I confirm the information provided is accurate
                </label>
              </div>

              {/* Second Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={formData.agreeTerms}
                  onChange={(e) =>
                    handleInputChange("agreeTerms", e.target.checked)
                  }
                  className="w-5 h-5 appearance-none border border-gray-300 rounded-sm checked:bg-green-600 checked:border-green-600 focus:outline-none transition duration-200 relative"
                  style={{
                    backgroundImage:
                      "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 20 20\" fill=\"white\"><path fill-rule=\"evenodd\" d=\"M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z\" clip-rule=\"evenodd\"/></svg>')",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "70%",
                  }}
                />
                <label htmlFor="agree-terms" className="text-gray-700">
                  I agree to the{" "}
                  <a href="#" className="text-green-600 hover:underline">
                    general rental terms and conditions
                  </a>
                </label>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full max-w-[300px] bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-3xl font-medium text-lg relative left-[-40px]"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
