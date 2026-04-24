import React, { useState } from 'react';
import { User, CheckCircle, AlertCircle } from 'lucide-react';

export default function EnhancedBookingStep({ onContinue, formData }) {
  const [idVerification, setIdVerification] = useState({
    idType: '',
    idNumber: '',
    idImage: null,
    verificationStatus: 'pending'
  });

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIdVerification(prev => ({
        ...prev,
        idImage: file
      }));
    }
  };

  const handleInputChange = (field, value) => {
    setIdVerification(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContinue = () => {
    const enhancedData = {
      ...formData,
      idVerification
    };
    
    onContinue(enhancedData);
  };

  const isFormValid = idVerification.idType && 
                     idVerification.idNumber && 
                     idVerification.idImage;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ID Verification</h1>
          <p className="text-gray-600">Please provide your ID information for rental verification</p>
        </div>

        {/* Step Indicator */}
        <div className="overflow-x-auto pb-4 mb-4">
          <div className="flex items-center justify-center min-w-max px-4">
            {[1, 2, 3, 4, 5, 6, 7].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= 6 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                {step < 7 && (
                  <div className={`w-8 sm:w-16 h-1 mx-1 sm:mx-2 ${
                    step < 6 ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* ID Verification Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold">ID Verification</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Type *
                </label>
                <select
                  value={idVerification.idType}
                  onChange={(e) => handleInputChange('idType', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select ID Type</option>
                  <option value="national_id">National ID Card</option>
                  <option value="passport">Passport</option>
                  <option value="driver_license">Driver's License</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Number *
                </label>
                <input
                  type="text"
                  value={idVerification.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your ID number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload ID Document *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="id-upload"
                  />
                  <label htmlFor="id-upload" className="cursor-pointer">
                    {idVerification.idImage ? (
                      <div className="text-green-600">
                        <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                        <p>File uploaded: {idVerification.idImage.name}</p>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                        <p>Click to upload ID document</p>
                        <p className="text-sm">Supported formats: JPG, PNG, PDF</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800">Verification Process</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    Your ID will be verified within 24 hours. You'll receive an email confirmation once verified.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 order-2 sm:order-1"
          >
            Previous
          </button>
          <button
            onClick={handleContinue}
            disabled={!isFormValid}
            className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 order-1 sm:order-2"
          >
            <CheckCircle className="h-5 w-5" />
            Continue to Agreement
          </button>
        </div>
      </div>
    </div>
  );
}
