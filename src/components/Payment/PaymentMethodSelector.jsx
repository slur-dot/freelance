import React, { useState } from 'react';
import { CreditCard, Smartphone, Building2, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import PriceDisplay from '../PriceDisplay';

// Import payment icons (you'll need to add these to your assets)
import StripeIcon from '../../assets/stripe-icon.png';
import OrangeMoneyIcon from '../../assets/orangemoney_icon.png';
import MTNIcon from '../../assets/mtn_icon.png';
import CashOnDelivery from '../../assets/CashOnDelivery.png';

const PaymentMethodSelector = ({ 
  selectedMethod, 
  onMethodChange, 
  amount, 
  currency = 'GNF',
  showAmount = true 
}) => {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    phoneNumber: '',
    bankAccount: '',
    bankName: '',
    deliveryAddress: ''
  });

  const paymentMethods = [
    {
      id: 'mtn',
      name: 'MTN MoMo',
      description: 'Pay with MTN Mobile Money',
      icon: MTNIcon,
      iconComponent: Smartphone,
      color: 'bg-yellow-600',
      available: true
    },
    {
      id: 'orange-money',
      name: 'Orange Money',
      description: 'Pay with Orange Money mobile wallet',
      icon: OrangeMoneyIcon,
      iconComponent: Smartphone,
      color: 'bg-orange-500',
      available: true
    },
    {
      id: 'ymo',
      name: 'YMO Payment Gateway',
      description: 'Pay securely with YMO',
      icon: null,
      iconComponent: CreditCard,
      color: 'bg-green-500',
      available: true
    },
    {
      id: 'yi-gateway',
      name: 'YI Gateway',
      description: 'Pay via YI Gateway (partnership)',
      icon: null,
      iconComponent: CreditCard,
      color: 'bg-teal-600',
      available: true
    },
    {
      id: 'stripe',
      name: 'Card (Visa / Mastercard)',
      description: 'Pay securely with your credit or debit card',
      icon: StripeIcon,
      iconComponent: CreditCard,
      color: 'bg-blue-600',
      available: true
    },
    {
      id: 'bank-transfer',
      name: 'Bank Transfer (IBAN)',
      description: 'Transfer directly to our bank account',
      icon: null,
      iconComponent: Building2,
      color: 'bg-green-600',
      available: true
    }
  ];

  const handleInputChange = (field, value) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'stripe':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number *
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
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
                  value={paymentDetails.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
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
                  value={paymentDetails.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
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
                value={paymentDetails.cardName}
                onChange={(e) => handleInputChange('cardName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="bg-blue-50 p-3 rounded-md">
              <div className="flex items-center gap-2 text-blue-800">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                Your payment information is encrypted and secure
              </p>
            </div>
          </div>
        );

      case 'ymo':
        return (
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-md">
              <div className="flex items-center gap-2 text-green-800">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">YMO Integration</span>
              </div>
              <p className="text-sm text-green-700 mt-1">
                You will be redirected to the YMO Payment Gateway to complete your payment.
              </p>
            </div>
            <div className="text-center py-4">
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md">
                Continue to YMO
              </button>
            </div>
          </div>
        );

      case 'yi-gateway':
        return (
          <div className="space-y-4">
            <div className="bg-teal-50 p-4 rounded-md">
              <div className="flex items-center gap-2 text-teal-800">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">YI Gateway</span>
              </div>
              <p className="text-sm text-teal-700 mt-1">
                You will be redirected to the YI Payment Gateway to complete your payment securely.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (Required) *
              </label>
              <input
                type="tel"
                placeholder="+224..."
                value={paymentDetails.phoneNumber || ''}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div className="text-center py-2">
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
                Continue to YI Gateway
              </button>
            </div>
          </div>
        );

      case 'orange-money':
      case 'mtn':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                placeholder="+224 123 456 789"
                value={paymentDetails.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <div className="bg-orange-50 p-3 rounded-md">
              <div className="flex items-center gap-2 text-orange-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Mobile Money Payment</span>
              </div>
              <p className="text-xs text-orange-700 mt-1">
                You will receive a payment request on your mobile device
              </p>
            </div>
          </div>
        );

      case 'bank-transfer':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bank Name *
              </label>
              <select
                value={paymentDetails.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Bank</option>
                <option value="bicig">BICIG (Banque Internationale pour le Commerce et l'Industrie de Guinée)</option>
                <option value="sgbg">SGBG (Société Générale de Banques en Guinée)</option>
                <option value="ecobank">Ecobank Guinée</option>
                <option value="uba">UBA (United Bank for Africa)</option>
                <option value="orabank">Orabank Guinée</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Number *
              </label>
              <input
                type="text"
                placeholder="Enter your account number"
                value={paymentDetails.bankAccount}
                onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="bg-green-50 p-3 rounded-md">
              <div className="text-sm text-green-800">
                <p className="font-medium">Bank Transfer Details:</p>
                <p className="mt-1">Account Name: Tech Solutions Guinea</p>
                <p>Account Number: 1234567890</p>
                <p>Reference: Order #{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
              </div>
            </div>
          </div>
        );



      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => {
            const IconComponent = method.iconComponent;
            return (
              <label
                key={method.id}
                className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${!method.available ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={(e) => onMethodChange(e.target.value)}
                  disabled={!method.available}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3 w-full">
                  <div className={`p-2 rounded-lg ${method.color}`}>
                    {method.icon ? (
                      <img src={method.icon} alt={method.name} className="h-6 w-6" />
                    ) : (
                      <IconComponent className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{method.name}</h4>
                      {selectedMethod === method.id && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Payment Form */}
      {selectedMethod && (
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            {paymentMethods.find(m => m.id === selectedMethod)?.name} Details
          </h4>
          {renderPaymentForm()}
        </div>
      )}

      {/* Amount Summary */}
      {showAmount && amount && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
            <PriceDisplay amount={amount} size="2xl" variant="bold" className="text-blue-600" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodSelector;
