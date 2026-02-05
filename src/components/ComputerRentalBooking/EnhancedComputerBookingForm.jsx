import React, { useState } from "react";
import { Calendar, Clock, User, CreditCard, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function EnhancedComputerBookingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Rental Period
    rentalType: '',
    startDate: '',
    endDate: '',
    
    // Step 2: Device Selection
    deviceType: '',
    deviceModel: '',
    quantity: 1,
    
    // Step 3: ID Verification
    idType: '',
    idNumber: '',
    idImage: null,
    verificationStatus: 'pending',
    
    // Step 4: Rental Agreement
    agreementAccepted: false,
    termsAccepted: false,
    
    // Step 5: Payment
    paymentMethod: '',
    billingInfo: {}
  });

  const rentalTypes = [
    { id: 'weekly', name: 'Weekly Rental', duration: '7 days', discount: '0%' },
    { id: 'monthly', name: 'Monthly Rental', duration: '30 days', discount: '10%' },
    { id: 'quarterly', name: 'Quarterly Rental', duration: '90 days', discount: '15%' },
    { id: 'yearly', name: 'Yearly Rental', duration: '365 days', discount: '25%' }
  ];

  const deviceTypes = [
    { id: 'laptop', name: 'Laptop', basePrice: 200000, available: 15 },
    { id: 'desktop', name: 'Desktop Computer', basePrice: 150920, available: 8 },
    { id: 'workstation', name: 'Workstation', basePrice: 300000, available: 5 },
    { id: 'server', name: 'Server', basePrice: 509200, available: 3 }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculatePrice = () => {
    const device = deviceTypes.find(d => d.id === formData.deviceType);
    if (!device) return 0;
    
    const basePrice = device.basePrice * formData.quantity;
    const rentalType = rentalTypes.find(r => r.id === formData.rentalType);
    const discount = rentalType ? parseFloat(rentalType.discount) : 0;
    
    return basePrice * (1 - discount / 100);
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        idImage: file
      }));
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step <= currentStep 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-600'
          }`}>
            {step}
          </div>
          {step < 5 && (
            <div className={`w-16 h-1 mx-2 ${
              step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Select Rental Period</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {rentalTypes.map((type) => (
          <div
            key={type.id}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              formData.rentalType === type.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleInputChange('rentalType', type.id)}
          >
            <h3 className="font-semibold text-lg">{type.name}</h3>
            <p className="text-gray-600">Duration: {type.duration}</p>
            <p className="text-green-600 font-medium">Discount: {type.discount}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleInputChange('startDate', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleInputChange('endDate', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min={formData.startDate || new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={nextStep}
          disabled={!formData.rentalType || !formData.startDate || !formData.endDate}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Next: Select Device
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Select Device</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {deviceTypes.map((device) => (
          <div
            key={device.id}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              formData.deviceType === device.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleInputChange('deviceType', device.id)}
          >
            <h3 className="font-semibold text-lg">{device.name}</h3>
            <p className="text-gray-600">Base Price: {device.basePrice.toLocaleString()} GNF/month</p>
            <p className="text-blue-600 font-medium">Available: {device.available} units</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quantity
        </label>
        <input
          type="number"
          min="1"
          max={deviceTypes.find(d => d.id === formData.deviceType)?.available || 1}
          value={formData.quantity}
          onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {formData.deviceType && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Price Calculation</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Base Price:</span>
              <span>{deviceTypes.find(d => d.id === formData.deviceType)?.basePrice.toLocaleString()} GNF</span>
            </div>
            <div className="flex justify-between">
              <span>Quantity:</span>
              <span>{formData.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>{rentalTypes.find(r => r.id === formData.rentalType)?.discount}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total:</span>
              <span>{calculatePrice().toLocaleString()} GNF</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          disabled={!formData.deviceType}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Next: ID Verification
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <User className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">ID Verification</h2>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ID Type
        </label>
        <select
          value={formData.idType}
          onChange={(e) => handleInputChange('idType', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select ID Type</option>
          <option value="national_id">National ID Card</option>
          <option value="passport">Passport</option>
          <option value="driver_license">Driver's License</option>
          <option value="student_id">Student ID</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ID Number
        </label>
        <input
          type="text"
          value={formData.idNumber}
          onChange={(e) => handleInputChange('idNumber', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter your ID number"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload ID Document
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
            {formData.idImage ? (
              <div className="text-green-600">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <p>File uploaded: {formData.idImage.name}</p>
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

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
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

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          disabled={!formData.idType || !formData.idNumber || !formData.idImage}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Next: Rental Agreement
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Rental Agreement</h2>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-3">Rental Terms & Conditions</h3>
        <div className="text-sm space-y-2 text-gray-700">
          <p>• Rental period: {rentalTypes.find(r => r.id === formData.rentalType)?.name}</p>
          <p>• Device: {deviceTypes.find(d => d.id === formData.deviceType)?.name} x {formData.quantity}</p>
          <p>• Start date: {formData.startDate}</p>
          <p>• End date: {formData.endDate}</p>
          <p>• Total cost: {calculatePrice().toLocaleString()} GNF</p>
          <p>• Security deposit: 50,000 GNF per device</p>
          <p>• Late return fee: 10,000 GNF per day</p>
          <p>• Damage policy: Customer responsible for repair costs</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={formData.agreementAccepted}
            onChange={(e) => handleInputChange('agreementAccepted', e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm">
            I agree to the rental terms and conditions and understand my responsibilities as a renter.
          </span>
        </label>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
            className="mt-1"
          />
          <span className="text-sm">
            I consent to the processing of my personal data for rental purposes and ID verification.
          </span>
        </label>
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
        >
          Previous
        </button>
        <button
          onClick={nextStep}
          disabled={!formData.agreementAccepted || !formData.termsAccepted}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Next: Payment
        </button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Payment Information</h2>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Method
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              formData.paymentMethod === 'mobile_money'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleInputChange('paymentMethod', 'mobile_money')}
          >
            <h3 className="font-semibold">Mobile Money</h3>
            <p className="text-sm text-gray-600">Orange Money, MTN Mobile Money</p>
          </div>
          <div
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              formData.paymentMethod === 'bank_transfer'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleInputChange('paymentMethod', 'bank_transfer')}
          >
            <h3 className="font-semibold">Bank Transfer</h3>
            <p className="text-sm text-gray-600">Direct bank transfer</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-3">Payment Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Rental Cost:</span>
            <span>{calculatePrice().toLocaleString()} GNF</span>
          </div>
          <div className="flex justify-between">
            <span>Security Deposit:</span>
            <span>{(50920 * formData.quantity).toLocaleString()} GNF</span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Total Amount:</span>
            <span>{(calculatePrice() + (50920 * formData.quantity)).toLocaleString()} GNF</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
        >
          Previous
        </button>
        <button
          onClick={() => {
            // Handle final submission
            console.log('Booking completed:', formData);
            alert('Booking submitted successfully! You will receive a confirmation email shortly.');
          }}
          disabled={!formData.paymentMethod}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Complete Booking
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Computer Rental Booking</h1>
          <p className="text-gray-600">Complete your rental booking in 5 easy steps</p>
        </div>

        {renderStepIndicator()}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
      </div>
    </div>
  );
}
