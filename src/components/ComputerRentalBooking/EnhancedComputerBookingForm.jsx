import { useTranslation } from "react-i18next";import React, { useState } from "react";
import { Calendar, Clock, User, CreditCard, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function EnhancedComputerBookingForm() {
  const { t } = useTranslation();
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
  { id: 'yearly', name: 'Yearly Rental', duration: '365 days', discount: '25%' }];


  const deviceTypes = [
  { id: 'laptop', name: 'Laptop', basePrice: 200000, available: 15 },
  { id: 'desktop', name: 'Desktop Computer', basePrice: 150920, available: 8 },
  { id: 'workstation', name: 'Workstation', basePrice: 300000, available: 5 },
  { id: 'server', name: 'Server', basePrice: 509200, available: 3 }];


  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const calculatePrice = () => {
    const device = deviceTypes.find((d) => d.id === formData.deviceType);
    if (!device) return 0;

    const basePrice = device.basePrice * formData.quantity;
    const rentalType = rentalTypes.find((r) => r.id === formData.rentalType);
    const discount = rentalType ? parseFloat(rentalType.discount) : 0;

    return basePrice * (1 - discount / 100);
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        idImage: file
      }));
    }
  };

  const renderStepIndicator = () =>
  <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5].map((step) =>
    <div key={step} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
      step <= currentStep ?
      'bg-blue-600 text-white' :
      'bg-gray-200 text-gray-600'}`
      }>
            {step}
          </div>
          {step < 5 &&
      <div className={`w-16 h-1 mx-2 ${
      step < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`
      } />
      }
        </div>
    )}
    </div>;


  const renderStep1 = () =>
  <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">{t("select_rental_period_998", "Select Rental Period")}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {rentalTypes.map((type) =>
      <div
        key={type.id}
        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
        formData.rentalType === type.id ?
        'border-blue-600 bg-blue-50' :
        'border-gray-200 hover:border-gray-300'}`
        }
        onClick={() => handleInputChange('rentalType', type.id)}>
        
            <h3 className="font-semibold text-lg">{type.name}</h3>
            <p className="text-gray-600">{t("duration_389", "Duration:")} {type.duration}</p>
            <p className="text-green-600 font-medium">{t("discount_933", "Discount:")} {type.discount}</p>
          </div>
      )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("start_date_322", "Start Date")}
          </label>
          <input
          type="date"
          value={formData.startDate}
          onChange={(e) => handleInputChange('startDate', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          min={new Date().toISOString().split('T')[0]} />
        
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("end_date_90", "End Date")}
          </label>
          <input
          type="date"
          value={formData.endDate}
          onChange={(e) => handleInputChange('endDate', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          min={formData.startDate || new Date().toISOString().split('T')[0]} />
        
        </div>
      </div>

      <div className="flex justify-end">
        <button
        onClick={nextStep}
        disabled={!formData.rentalType || !formData.startDate || !formData.endDate}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
          {t("next_select_device_900", "Next: Select Device")}
        
      </button>
      </div>
    </div>;


  const renderStep2 = () =>
  <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">{t("select_device_700", "Select Device")}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {deviceTypes.map((device) =>
      <div
        key={device.id}
        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
        formData.deviceType === device.id ?
        'border-blue-600 bg-blue-50' :
        'border-gray-200 hover:border-gray-300'}`
        }
        onClick={() => handleInputChange('deviceType', device.id)}>
        
            <h3 className="font-semibold text-lg">{device.name}</h3>
            <p className="text-gray-600">{t("base_price_961", "Base Price:")} {device.basePrice.toLocaleString()} GNF/month</p>
            <p className="text-blue-600 font-medium">{t("available_832", "Available:")} {device.available} units</p>
          </div>
      )}
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("quantity_603", "Quantity")}
        </label>
        <input
        type="number"
        min="1"
        max={deviceTypes.find((d) => d.id === formData.deviceType)?.available || 1}
        value={formData.quantity}
        onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      
      </div>

      {formData.deviceType &&
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">{t("price_calculation_509", "Price Calculation")}</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>{t("base_price_339", "Base Price:")}</span>
              <span>{deviceTypes.find((d) => d.id === formData.deviceType)?.basePrice.toLocaleString()} {t("gnf_535", "GNF")}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("quantity_816", "Quantity:")}</span>
              <span>{formData.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span>{t("discount_268", "Discount:")}</span>
              <span>{rentalTypes.find((r) => r.id === formData.rentalType)?.discount}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>{t("total_192", "Total:")}</span>
              <span>{calculatePrice().toLocaleString()} {t("gnf_501", "GNF")}</span>
            </div>
          </div>
        </div>
    }

      <div className="flex justify-between">
        <button
        onClick={prevStep}
        className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600">
          {t("previous_533", "Previous")}
        
      </button>
        <button
        onClick={nextStep}
        disabled={!formData.deviceType}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
          {t("next_id_verification_720", "Next: ID Verification")}
        
      </button>
      </div>
    </div>;


  const renderStep3 = () =>
  <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <User className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">{t("id_verification_990", "ID Verification")}</h2>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("id_type_435", "ID Type")}
        </label>
        <select
        value={formData.idType}
        onChange={(e) => handleInputChange('idType', e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        
          <option value="">{t("select_id_type_4", "Select ID Type")}</option>
          <option value="national_id">{t("national_id_card_529", "National ID Card")}</option>
          <option value="passport">{t("passport_308", "Passport")}</option>
          <option value="driver_license">{t("drivers_license_687", "Driver's License")}</option>
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("id_number_335", "ID Number")}
        </label>
        <input
        type="text"
        value={formData.idNumber}
        onChange={(e) => handleInputChange('idNumber', e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={t("enter_your_id_number_22", "Enter your ID number")} />
      
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("upload_id_document_578", "Upload ID Document")}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          id="id-upload" />
        
          <label htmlFor="id-upload" className="cursor-pointer">
            {formData.idImage ?
          <div className="text-green-600">
                <CheckCircle className="h-8 w-8 mx-auto mb-2" />
                <p>{t("file_uploaded_828", "File uploaded:")} {formData.idImage.name}</p>
              </div> :

          <div className="text-gray-500">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p>{t("click_to_upload_id_document_614", "Click to upload ID document")}</p>
                <p className="text-sm">{t("supported_formats_jpg_png_pdf_408", "Supported formats: JPG, PNG, PDF")}</p>
              </div>
          }
          </label>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800">{t("verification_process_981", "Verification Process")}</h4>
            <p className="text-sm text-yellow-700 mt-1">
              {t("your_id_will_be_verified_within_24_hours_youll_r_930", "Your ID will be verified within 24 hours. You'll receive an email confirmation once verified.")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
        onClick={prevStep}
        className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600">
          {t("previous_528", "Previous")}
        
      </button>
        <button
        onClick={nextStep}
        disabled={!formData.idType || !formData.idNumber || !formData.idImage}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
          {t("next_rental_agreement_996", "Next: Rental Agreement")}
        
      </button>
      </div>
    </div>;


  const renderStep4 = () =>
  <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">{t("rental_agreement_991", "Rental Agreement")}</h2>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-3">{t("rental_terms_conditions_80", "Rental Terms & Conditions")}</h3>
        <div className="text-sm space-y-2 text-gray-700">
          <p>{t("_rental_period_409", "\u2022 Rental period:")} {rentalTypes.find((r) => r.id === formData.rentalType)?.name}</p>
          <p>{t("_device_604", "\u2022 Device:")} {deviceTypes.find((d) => d.id === formData.deviceType)?.name} x {formData.quantity}</p>
          <p>{t("_start_date_17", "\u2022 Start date:")} {formData.startDate}</p>
          <p>{t("_end_date_114", "\u2022 End date:")} {formData.endDate}</p>
          <p>{t("_total_cost_524", "\u2022 Total cost:")} {calculatePrice().toLocaleString()} {t("gnf_733", "GNF")}</p>
          <p>{t("_security_deposit_50000_gnf_per_device_13", "\u2022 Security deposit: 50,000 GNF per device")}</p>
          <p>{t("_late_return_fee_10000_gnf_per_day_441", "\u2022 Late return fee: 10,000 GNF per day")}</p>
          <p>{t("_damage_policy_customer_responsible_for_repair_c_880", "\u2022 Damage policy: Customer responsible for repair costs")}</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <label className="flex items-start gap-3">
          <input
          type="checkbox"
          checked={formData.agreementAccepted}
          onChange={(e) => handleInputChange('agreementAccepted', e.target.checked)}
          className="mt-1" />
        
          <span className="text-sm">
            {t("i_agree_to_the_rental_terms_and_conditions_and_und_752", "I agree to the rental terms and conditions and understand my responsibilities as a renter.")}
          </span>
        </label>

        <label className="flex items-start gap-3">
          <input
          type="checkbox"
          checked={formData.termsAccepted}
          onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
          className="mt-1" />
        
          <span className="text-sm">
            {t("i_consent_to_the_processing_of_my_personal_data_fo_249", "I consent to the processing of my personal data for rental purposes and ID verification.")}
          </span>
        </label>
      </div>

      <div className="flex justify-between">
        <button
        onClick={prevStep}
        className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600">
          {t("previous_328", "Previous")}
        
      </button>
        <button
        onClick={nextStep}
        disabled={!formData.agreementAccepted || !formData.termsAccepted}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
          {t("next_payment_482", "Next: Payment")}
        
      </button>
      </div>
    </div>;


  const renderStep5 = () =>
  <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <CreditCard className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold">{t("payment_information_664", "Payment Information")}</h2>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("payment_method_53", "Payment Method")}
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
          formData.paymentMethod === 'mobile_money' ?
          'border-blue-600 bg-blue-50' :
          'border-gray-200 hover:border-gray-300'}`
          }
          onClick={() => handleInputChange('paymentMethod', 'mobile_money')}>
          
            <h3 className="font-semibold">{t("mobile_money_691", "Mobile Money")}</h3>
            <p className="text-sm text-gray-600">{t("orange_money_mtn_mobile_money_984", "Orange Money, MTN Mobile Money")}</p>
          </div>
          <div
          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
          formData.paymentMethod === 'bank_transfer' ?
          'border-blue-600 bg-blue-50' :
          'border-gray-200 hover:border-gray-300'}`
          }
          onClick={() => handleInputChange('paymentMethod', 'bank_transfer')}>
          
            <h3 className="font-semibold">{t("bank_transfer_505", "Bank Transfer")}</h3>
            <p className="text-sm text-gray-600">{t("direct_bank_transfer_662", "Direct bank transfer")}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-3">{t("payment_summary_178", "Payment Summary")}</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{t("rental_cost_456", "Rental Cost:")}</span>
            <span>{calculatePrice().toLocaleString()} {t("gnf_875", "GNF")}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("security_deposit_719", "Security Deposit:")}</span>
            <span>{(50920 * formData.quantity).toLocaleString()} {t("gnf_627", "GNF")}</span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-2">
            <span>{t("total_amount_735", "Total Amount:")}</span>
            <span>{(calculatePrice() + 50920 * formData.quantity).toLocaleString()} {t("gnf_962", "GNF")}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
        onClick={prevStep}
        className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600">
          {t("previous_7", "Previous")}
        
      </button>
        <button
        onClick={() => {
          // Handle final submission
          console.log('Booking completed:', formData);
          alert(t("booking_submitted_successfully_you_will_receive_a_656", "Booking submitted successfully! You will receive a confirmation email shortly."));
        }}
        disabled={!formData.paymentMethod}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
          {t("complete_booking_2", "Complete Booking")}
        
      </button>
      </div>
    </div>;


  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("computer_rental_booking_249", "Computer Rental Booking")}</h1>
          <p className="text-gray-600">{t("complete_your_rental_booking_in_5_easy_steps_7", "Complete your rental booking in 5 easy steps")}</p>
        </div>

        {renderStepIndicator()}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
      </div>
    </div>);

}