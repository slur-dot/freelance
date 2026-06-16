import { useTranslation } from "react-i18next";import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { RentalService } from "../../services/rentalService";
import OrganizationForm from "./OrganizationForm";
import DeviceDetailsForm from "./DeviceDetailsForm";
import ComputerDeliveryDetails from "./ComputerDeliveryDetails";
import AddonsSelectionForm from "./AddonsSelectionForm";
import ComputerPaymentDetails from "./ComputerPaymentDetails";
import EnhancedBookingStep from "./EnhancedBookingStep";
import RentalAgreementStep from "./RentalAgreementStep";

export default function ComputerBookingForm({ isCorporateSales = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const prefilledProduct = location.state || {};
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [organizationData, setOrganizationData] = useState({});
  const [deviceData, setDeviceData] = useState({});
  const [deliveryData, setDeliveryData] = useState({});
  const [addonsData, setAddonsData] = useState([]);
  const [paymentData, setPaymentData] = useState({});
  const [idVerificationData, setIdVerificationData] = useState({});
  const [agreementData, setAgreementData] = useState({});

  // Step 1 -> Organization
  const handleOrganizationContinue = (data) => {
    setOrganizationData(data);
    if (isCorporateSales) {
      setStep(3); // Skip Device details entirely
    } else {
      setStep(2);
    }
  };

  // Step 2 -> Device
  const handleDeviceContinue = (data) => {
    setDeviceData(data);
    setStep(3);
  };

  // Step 3 -> Delivery
  const handleDeliveryContinue = (data) => {
    setDeliveryData(data);
    setStep(4);
  };

  // Step 4 -> Add-ons
  const handleAddonsContinue = (data) => {
    setAddonsData(data);
    setStep(5);
  };

  // Step 5 -> Payment
  const handlePaymentContinue = (data) => {
    setPaymentData(data);
    setStep(6);
  };

  // Step 6 -> ID Verification
  const handleIdVerificationContinue = (data) => {
    setIdVerificationData(data);
    setStep(7);
  };

  // Step 7 -> Rental Agreement
  const handleAgreementContinue = async (agreement) => {
    if (!currentUser) {
      alert(t("please_log_in_to_complete_your_booking_777", "Please log in to complete your booking."));
      navigate("/login");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        isCorporateSales,
        organization: organizationData,
        device: deviceData,
        delivery: deliveryData,
        addons: addonsData,
        payment: paymentData,
        idVerification: { ...idVerificationData, hasFile: !!idVerificationData?.file },
        agreement
      };
      await RentalService.submitBooking(currentUser.uid, payload);
      setAgreementData(agreement);
      setStep(8);
    } catch (err) {
      console.error("Booking submit failed:", err);
      alert(t("failed_to_submit_booking_please_try_again_50", "Failed to submit booking. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {step === 1 && <OrganizationForm onContinue={handleOrganizationContinue} />}
      {step === 2 && <DeviceDetailsForm onContinue={handleDeviceContinue} prefilledProduct={prefilledProduct} />}
      {step === 3 && <ComputerDeliveryDetails onContinue={handleDeliveryContinue} />}
      {step === 4 && <AddonsSelectionForm onContinue={handleAddonsContinue} deviceData={deviceData} />}
      {step === 5 &&
      <ComputerPaymentDetails
        onContinue={handlePaymentContinue}
        bookingData={{
          deviceData,
          deliveryData,
          addonsData
        }} />

      }
      {step === 6 &&
      <EnhancedBookingStep
        onContinue={handleIdVerificationContinue}
        formData={{
          organizationData,
          deviceData,
          deliveryData,
          addonsData,
          paymentData
        }} />

      }
      {step === 7 &&
      <RentalAgreementStep
        onContinue={handleAgreementContinue}
        formData={{
          organizationData,
          deviceData,
          deliveryData,
          addonsData,
          paymentData,
          idVerification: idVerificationData
        }} />

      }
      {step === 8 &&
      <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold text-green-600">{t("booking_completed_639", "Booking Completed!")}</h1>
          <p className="mt-4">{t("thank_you_for_submitting_the_details_304", "Thank you for submitting the details.")}</p>
        </div>
      }
    </div>);

}