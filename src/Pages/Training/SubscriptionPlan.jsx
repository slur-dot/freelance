import React, { useState } from "react";
import { FaCrown, FaCreditCard, FaPaypal, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import paymentService from "../../services/paymentService";

const SubscriptionPlan = ({ 
  planType, // 'freelancer' or 'company'
  onPaymentSuccess 
}) => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  // Plan configuration
  const planConfig = {
    freelancer: {
      title: "Unlimited Access Plan",
      price: "880,000 GNF",
      priceUSD: "$100 per year",
      amount: 100,
      currency: "USD",
      features: [
        "✓ Unlimited access to all courses",
        "✓ Downloadable resources & certificates",
        "✓ Progress tracking & support"
      ]
    },
    company: {
      title: "Company Unlimited Plan",
      price: "8,800,000 GNF",
      priceUSD: "$1,000 per year",
      amount: 1000,
      currency: "USD",
      features: [
        "✓ Unlimited access to all courses",
        "✓ Up to 10 user licenses",
        "✓ Team dashboard & management",
        "✓ Custom training priority"
      ]
    }
  };

  const currentPlan = planConfig[planType];

  const handlePaymentDetailsChange = (field, value) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubscription = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    setShowPaymentForm(true);
  };

  const handlePayNow = async () => {
    setIsProcessing(true);
    setPaymentResult(null);

    try {
      // Validate payment data
      const validation = paymentService.validatePaymentData(selectedPaymentMethod, paymentDetails);
      if (!validation.isValid) {
        setPaymentResult({
          success: false,
          error: 'Please fill in all required payment details',
          errors: validation.errors
        });
        setIsProcessing(false);
        return;
      }

      // Process payment
      const result = await paymentService.processPayment(selectedPaymentMethod, {
        ...paymentDetails,
        amount: currentPlan.amount,
        currency: currentPlan.currency
      });

      setPaymentResult(result);

      if (result.success) {
        // Show success message in the UI
        setPaymentResult({
          success: true,
          message: `Payment successful! Your ${planType} subscription is now active.`
        });
        
        // Close the modal after a short delay
        setTimeout(() => {
          setShowPaymentForm(false);
          // Call the success callback if provided
          if (onPaymentSuccess) {
            onPaymentSuccess(result);
          }
        }, 3000);
      }
    } catch (error) {
      setPaymentResult({
        success: false,
        error: error.message || 'Payment processing failed'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
  };

  const renderPaymentForm = () => {
    if (selectedPaymentMethod === 'stripe') {
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number *
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={paymentDetails.cardNumber || ''}
              onChange={(e) => handlePaymentDetailsChange('cardNumber', formatCardNumber(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength="19"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date *
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                value={paymentDetails.expiryDate || ''}
                onChange={(e) => handlePaymentDetailsChange('expiryDate', formatExpiryDate(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV *
              </label>
              <input
                type="text"
                placeholder="123"
                value={paymentDetails.cvv || ''}
                onChange={(e) => handlePaymentDetailsChange('cvv', e.target.value.replace(/\D/g, ''))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength="4"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cardholder Name *
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={paymentDetails.cardName || ''}
              onChange={(e) => handlePaymentDetailsChange('cardName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="bg-blue-50 p-3 rounded-md">
            <div className="flex items-center gap-2 text-blue-800">
              <FaCheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Secure Payment</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Your payment information is encrypted and secure
            </p>
          </div>
        </div>
      );
    } else if (selectedPaymentMethod === 'paypal') {
      return (
        <div className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-md">
            <div className="flex items-center gap-2 text-yellow-800">
              <FaExclamationCircle className="h-4 w-4" />
              <span className="font-medium">PayPal Integration</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              You will be redirected to PayPal to complete your payment
            </p>
          </div>
          <div className="text-center py-4">
            <div className="bg-yellow-500 text-white px-6 py-2 rounded-md inline-block">
              Continue to PayPal
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Subscription Plan */}
      <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <FaCrown className="text-2xl text-yellow-500" />
            <h3 className="text-2xl font-bold text-green-800">{currentPlan.title}</h3>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4 max-w-sm mx-auto">
            <div className="text-2xl font-bold text-green-700 mb-1">{currentPlan.price}</div>
            <div className="text-lg text-gray-600 mb-3">{currentPlan.priceUSD}</div>
            {planType === 'company' && (
              <div className="text-xs text-gray-500 mb-3">For up to 10 users</div>
            )}
            
            <div className="text-xs text-gray-700 mb-4 space-y-1">
              {currentPlan.features.map((feature, index) => (
                <div key={index}>{feature}</div>
              ))}
            </div>
            
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleSubscription('stripe')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm"
              >
                <FaCreditCard className="text-xs" />
                Subscribe with Stripe
              </button>
              <button
                onClick={() => handleSubscription('paypal')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors text-sm"
              >
                <FaPaypal className="text-xs" />
                Subscribe with PayPal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {selectedPaymentMethod === 'stripe' ? 'Complete Your Stripe Payment' : 'Complete Your PayPal Payment'}
            </h3>
            
            {renderPaymentForm()}
            
            {paymentResult && (
              <div className={`p-3 rounded-md mt-4 ${paymentResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {paymentResult.success ? (
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>{paymentResult.message}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-red-600">✗</span>
                    <span>{paymentResult.error}</span>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowPaymentForm(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePayNow}
                disabled={isProcessing}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionPlan;
