import React, { useState } from 'react';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function RentalAgreementStep({ onContinue, formData }) {
  const [agreement, setAgreement] = useState({
    agreementAccepted: false,
    termsAccepted: false
  });

  const handleAgreementChange = (field, value) => {
    setAgreement(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContinue = () => {
    const enhancedData = {
      ...formData,
      agreement
    };
    
    console.log("Rental Agreement Completed:");
    console.log("All Data:", enhancedData);
    
    onContinue(enhancedData);
  };

  const isFormValid = agreement.agreementAccepted && agreement.termsAccepted;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rental Agreement</h1>
          <p className="text-gray-600">Please review and accept the rental terms and conditions</p>
        </div>

        {/* Step Indicator */}
        <div className="overflow-x-auto pb-4 mb-4">
          <div className="flex items-center justify-center min-w-max px-4">
            {[1, 2, 3, 4, 5, 6, 7].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= 7 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 7 && (
                  <div className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 ${
                    step < 7 ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rental Agreement Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold">Rental Terms & Conditions</h2>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold mb-3">Rental Terms & Conditions</h3>
              <div className="text-sm space-y-2 text-gray-700">
                <p>• Rental period: Based on your selection</p>
                <p>• Device: {formData.deviceData?.deviceType || 'Selected device'}</p>
                <p>• Security deposit: 50,000 GNF per device</p>
                <p>• Late return fee: 10,000 GNF per day</p>
                <p>• Damage policy: Customer responsible for repair costs</p>
                <p>• ID verification required for all rentals</p>
                <p>• Agreement valid for selected rental period only</p>
                <p>• Device must be returned in same condition as received</p>
                <p>• Any modifications to device are prohibited</p>
                <p>• Customer is responsible for data backup before return</p>
                <p>• Rental can be extended with prior notice and payment</p>
                <p>• Early termination may incur additional fees</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreement.agreementAccepted}
                  onChange={(e) => handleAgreementChange('agreementAccepted', e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm">
                  I agree to the rental terms and conditions and understand my responsibilities as a renter.
                </span>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreement.termsAccepted}
                  onChange={(e) => handleAgreementChange('termsAccepted', e.target.checked)}
                  className="mt-1"
                />
                <span className="text-sm">
                  I consent to the processing of my personal data for rental purposes and ID verification.
                </span>
              </label>
            </div>
          </div>

          {/* Booking Summary Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold">Booking Summary</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-blue-800">Rental Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Organization:</span>
                    <span>{formData.organizationData?.companyName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Device:</span>
                    <span>{formData.deviceData?.deviceType || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span>{formData.deliveryData?.deliveryMethod || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Add-ons:</span>
                    <span>{formData.addonsData?.length || 0} selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment:</span>
                    <span>{formData.paymentData?.paymentMethod || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-green-800">ID Verification</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>ID Type:</span>
                    <span>{formData.idVerification?.idType || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ID Number:</span>
                    <span>{formData.idVerification?.idNumber || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Document:</span>
                    <span>{formData.idVerification?.idImage ? 'Uploaded' : 'Not uploaded'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Important Notice</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      By completing this booking, you agree to all terms and conditions. 
                      Your rental will be confirmed once payment is processed and ID is verified.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
          >
            Previous
          </button>
          <button
            onClick={handleContinue}
            disabled={!isFormValid}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <CheckCircle className="h-5 w-5" />
            Complete Booking
          </button>
        </div>
      </div>
    </div>
  );
}
