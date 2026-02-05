import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import PaymentMethodSelector from './PaymentMethodSelector';
import paymentService from '../../services/paymentService';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  amount, 
  currency = 'GNF',
  onSuccess,
  title = 'Complete Payment',
  description = 'Please select your preferred payment method'
}) => {
  const [selectedMethod, setSelectedMethod] = useState('orange-money');
  const [paymentDetails, setPaymentDetails] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handlePaymentMethodChange = (method) => {
    setSelectedMethod(method);
    setResult(null);
  };

  const handlePaymentDetailsChange = (details) => {
    setPaymentDetails(details);
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    setResult(null);

    try {
      const paymentResult = await paymentService.processPayment(selectedMethod, {
        ...paymentDetails,
        amount,
        currency
      });

      setResult(paymentResult);

      if (paymentResult.success && onSuccess) {
        onSuccess(paymentResult);
      }
    } catch (error) {
      setResult({
        success: false,
        error: error.message || 'Payment processing failed'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setSelectedMethod('orange-money');
    setPaymentDetails({});
    setResult(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <PaymentMethodSelector
            selectedMethod={selectedMethod}
            onMethodChange={handlePaymentMethodChange}
            amount={amount}
            currency={currency}
            showAmount={true}
          />

          {/* Payment Result */}
          {result && (
            <div className={`mt-6 p-4 rounded-md ${
              result.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={`font-medium ${
                  result.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {result.success ? 'Success!' : 'Error'}
                </span>
              </div>
              <p className={`text-sm mt-1 ${
                result.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {result.message || result.error}
              </p>
              {result.transactionId && (
                <p className="text-sm mt-1 text-green-700">
                  Transaction ID: {result.transactionId}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleProcessPayment}
            disabled={isProcessing}
            className={`px-6 py-2 rounded-md ${
              isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
