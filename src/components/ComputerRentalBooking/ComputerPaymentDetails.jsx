import { useTranslation } from "react-i18next";import React, { useState } from "react";
import PaymentMethodSelector from "../Payment/PaymentMethodSelector";
import PriceDisplay from "../PriceDisplay";
import PhoneInput from "../PhoneInput";

export default function ComputerPaymentDetails({ onContinue, bookingData }) {
  const { t } = useTranslation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('orange-money');
  const [paymentDetails, setPaymentDetails] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    countryCode: "+224",
    notes: "",
    confirmAccurate: true,
    agreeTerms: false
  });

  // Calculate Totals
  const device = bookingData?.deviceData || {};
  const addons = bookingData?.addonsData || [];

  const quantity = parseInt(device.quantity) || 1;
  const duration = parseInt(device.rentalDuration) || 1;
  const baseRate = 50000; // Mock base rate per device per day
  const rentalCost = quantity * duration * baseRate;

  const addonsCost = addons.reduce((sum, item) => sum + (item.cost || 0), 0);
  const deliveryCost = bookingData?.deliveryData?.deliveryType === 'delivery' ? 25000 : 0; // Mock delivery fee

  const totalCost = rentalCost + addonsCost + deliveryCost;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handlePaymentDetailsChange = (details) => {
    setPaymentDetails(details);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const phoneDigits = formData.phone.replace(/\D/g, '');
    const { countryData } = await import("../../utils/countryData");
    const selectedCountry = countryData.find((c) => c.code === formData.countryCode);
    const requiredDigits = selectedCountry ? selectedCountry.digits : 9;

    if (phoneDigits.length !== requiredDigits) {
      alert(`Invalid phone number length for ${selectedCountry?.name || 'selected country'}. Expected ${requiredDigits} digits.`);
      return;
    }

    if (!formData.agreeTerms) {
      alert(t("please_agree_to_the_rental_terms_and_conditions_638", "Please agree to the rental terms and conditions"));
      return;
    }

    if (onContinue) {
      onContinue({
        ...formData,
        paymentMethod: selectedPaymentMethod,
        paymentDetails: paymentDetails,
        totalCost: totalCost // Pass calculated cost
      });
    }
  };

  return (
    <div className="flex justify-center py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t("booking_form_681", "Booking Form")}</h1>
          <p className="mt-2 text-black">
            {t("complete_the_booking_form_to_complete_your_booking_771", "Complete the booking form to complete your booking")}
          </p>
        </div>

        {/* Order Summary */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t("order_summary_228", "Order Summary")}</h2>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex flex-col sm:flex-row justify-between gap-1">
              <span className="font-medium">{t("device_rental__798", "Device Rental (")}{quantity}{t("x_for_64", "x for")} {duration} {t("days_67", "days)")}</span>
              <span className="text-green-700 sm:text-gray-900 font-semibold">{rentalCost.toLocaleString()} {t("gnf_494", "GNF")}</span>
            </div>

            {addons.filter((a) => a.cost > 0).map((addon, idx) =>
            <div key={idx} className="flex flex-col sm:flex-row justify-between gap-1 text-gray-600">
                <span>+ {addon.name}</span>
                <span className="font-medium">{addon.cost.toLocaleString()} {t("gnf_630", "GNF")}</span>
              </div>
            )}

            {deliveryCost > 0 &&
            <div className="flex flex-col sm:flex-row justify-between gap-1 text-gray-600">
                <span>{t("delivery_fee_137", "Delivery Fee")}</span>
                <span className="font-medium">{deliveryCost.toLocaleString()} {t("gnf_820", "GNF")}</span>
              </div>
            }

            <div className="border-t border-gray-300 my-2 pt-3 flex justify-between items-center font-bold text-lg text-gray-900">
              <span className="text-base sm:text-lg">{t("total_572", "Total")}</span>
              <span className="text-[#15803D]">{totalCost.toLocaleString()} {t("gnf_760", "GNF")}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Payment Method Selection */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              {t("payment_method_199", "Payment Method")}
            </h2>
            <PaymentMethodSelector
              selectedMethod={selectedPaymentMethod}
              onMethodChange={handlePaymentMethodChange}
              amount={totalCost} // Use dynamic total
              currency="GNF"
              showAmount={true} />
            
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
              {t("contact_information_477", "Contact Information")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-4 gap-x-6 items-center">
              {/* Name */}
              <label htmlFor="name" className="text-gray-700 text-sm sm:text-base">
                {t("full_name__325", "Full Name *")}
              </label>
              <div className="sm:col-span-2">
                <input
                  id="name"
                  type="text"
                  placeholder={t("john_doe_394", "John Doe")}
                  className="w-full bg-gray-100 px-3 py-2 border rounded-md"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required />
                
              </div>

              {/* Phone Number */}
              <label htmlFor="phone-number" className="text-gray-700 text-sm sm:text-base">
                {t("phone_number__507", "Phone Number *")}
              </label>
              <div className="sm:col-span-2">
                <PhoneInput
                  id="phone-number"
                  value={formData.phone}
                  onChange={(val) => handleInputChange("phone", val)}
                  countryCode={formData.countryCode}
                  onCountryCodeChange={(code) => handleInputChange("countryCode", code)}
                  required />
                
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {t("special_instructions_or_notes_196", "Special Instructions or Notes")}
            </h2>
            <textarea
              placeholder={t("enter_special_instructions_or_notes_here_927", "Enter Special Instructions or Notes here")}
              className="min-h-[120px] w-full resize-y bg-gray-100 px-3 py-2 border rounded-md"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)} />
            
          </div>

          {/* Confirmation */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("confirmation_666", "Confirmation")}</h2>
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
                    backgroundSize: "70%"
                  }} />
                
                <label htmlFor="confirm-accurate" className="text-gray-700">
                  {t("i_confirm_the_information_provided_is_accurate_648", "I confirm the information provided is accurate")}
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
                    backgroundSize: "70%"
                  }} />
                
                <label htmlFor="agree-terms" className="text-gray-700">
                  {t("i_agree_to_the_392", "I agree to the")}{" "}
                  <a href="#" className="text-green-600 hover:underline">
                    {t("general_rental_terms_and_conditions_147", "general rental terms and conditions")}
                  </a>
                </label>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full max-w-[300px] bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-3xl font-medium text-lg">
              {t("continue_545", "Continue")}
            
            </button>
          </div>
        </form>
      </div>
    </div>);

}