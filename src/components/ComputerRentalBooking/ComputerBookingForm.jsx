import React, { useState } from "react";
import OrganizationForm from "./OrganizationForm";
import DeviceDetailsForm from "./DeviceDetailsForm";
import ComputerDeliveryDetails from "./ComputerDeliveryDetails";
import AddonsSelectionForm from "./AddonsSelectionForm";
import ComputerPaymentDetails from "./ComputerPaymentDetails";
import EnhancedBookingStep from "./EnhancedBookingStep";
import RentalAgreementStep from "./RentalAgreementStep"; 

export default function ComputerBookingForm() {
  const [step, setStep] = useState(1);

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
    setStep(2);
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
  const handleAgreementContinue = (data) => {
    setAgreementData(data);
    setStep(8);

    console.log("Booking Completed:");
    console.log("Organization:", organizationData);
    console.log("Device Details:", deviceData);
    console.log("Delivery Details:", deliveryData);
    console.log("Add-ons:", addonsData);
    console.log("Payment:", paymentData);
    console.log("ID Verification:", idVerificationData);
    console.log("Agreement:", data);
  };

  return (
    <div>
      {step === 1 && <OrganizationForm onContinue={handleOrganizationContinue} />}
      {step === 2 && <DeviceDetailsForm onContinue={handleDeviceContinue} />}
      {step === 3 && <ComputerDeliveryDetails onContinue={handleDeliveryContinue} />}
      {step === 4 && <AddonsSelectionForm onContinue={handleAddonsContinue} />}
      {step === 5 && <ComputerPaymentDetails onContinue={handlePaymentContinue} />}
      {step === 6 && (
        <EnhancedBookingStep 
          onContinue={handleIdVerificationContinue} 
          formData={{
            organizationData,
            deviceData,
            deliveryData,
            addonsData,
            paymentData
          }}
        />
      )}
      {step === 7 && (
        <RentalAgreementStep 
          onContinue={handleAgreementContinue} 
          formData={{
            organizationData,
            deviceData,
            deliveryData,
            addonsData,
            paymentData,
            idVerification: idVerificationData
          }}
        />
      )}
      {step === 8 && (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold text-green-600">Booking Completed!</h1>
          <p className="mt-4">Thank you for submitting the details.</p>
        </div>
      )}
    </div>
  );
}
