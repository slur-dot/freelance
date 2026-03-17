// Payment processing service for different payment methods
class PaymentService {
  constructor() {
    // Use Vite env in the browser; fall back to process.env if available (SSR/tests)
    let env = {};
    
    try {
      // Try Vite's import.meta.env first
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        env = import.meta.env;
      }
    } catch (e) {
      // Fallback to process.env if available
      if (typeof process !== 'undefined' && process.env) {
        env = process.env;
      }
    }

    this.stripePublicKey = env.VITE_STRIPE_PUBLIC_KEY || env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_your_stripe_key';
    this.ymoClientId = env.VITE_YMO_CLIENT_ID || env.REACT_APP_YMO_CLIENT_ID || 'your_ymo_client_id';
  }

  // Process Stripe payment
  async processStripePayment(paymentData) {
    try {
      // In a real implementation, you would:
      // 1. Create a payment intent on your backend
      // 2. Use Stripe Elements for secure card input
      // 3. Confirm the payment with Stripe
      
      console.log('Processing Stripe payment:', paymentData);
      
      // Simulate API call
      const response = await this.simulateApiCall({
        method: 'stripe',
        amount: paymentData.amount,
        currency: paymentData.currency,
        cardDetails: {
          number: paymentData.cardNumber,
          expiry: paymentData.expiryDate,
          cvv: paymentData.cvv,
          name: paymentData.cardName
        }
      });

      return {
        success: true,
        transactionId: response.transactionId,
        message: 'Payment processed successfully with Stripe'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Stripe payment failed'
      };
    }
  }

  // Process YMO payment
  async processYMOPayment(paymentData) {
    try {
      console.log('Processing YMO payment:', paymentData);
      
      // In a real implementation, you would:
      // 1. Create a YMO order
      // 2. Redirect to YMO for approval
      // 3. Capture the payment after approval
      
      const response = await this.simulateApiCall({
        method: 'ymo',
        amount: paymentData.amount,
        currency: paymentData.currency
      });

      return {
        success: true,
        transactionId: response.transactionId,
        message: 'YMO payment initiated successfully',
        redirectUrl: response.redirectUrl
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'YMO payment failed'
      };
    }
  }

  // Process Orange Money payment
  async processOrangeMoneyPayment(paymentData) {
    try {
      console.log('Processing Orange Money payment:', paymentData);
      
      // In a real implementation, you would:
      // 1. Integrate with Orange Money API
      // 2. Send payment request to user's phone
      // 3. Verify payment completion
      
      const response = await this.simulateApiCall({
        method: 'orange_money',
        amount: paymentData.amount,
        currency: paymentData.currency,
        phoneNumber: paymentData.phoneNumber
      });

      return {
        success: true,
        transactionId: response.transactionId,
        message: 'Orange Money payment request sent to your phone'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Orange Money payment failed'
      };
    }
  }

  // Process MTN MoMo payment
  async processMTNPayment(paymentData) {
    try {
      console.log('Processing MTN MoMo payment:', paymentData);
      
      // In a real implementation, you would:
      // 1. Integrate with MTN MoMo API
      // 2. Send payment request to user's phone
      // 3. Verify payment completion
      
      const response = await this.simulateApiCall({
        method: 'mtn_momo',
        amount: paymentData.amount,
        currency: paymentData.currency,
        phoneNumber: paymentData.phoneNumber
      });

      return {
        success: true,
        transactionId: response.transactionId,
        message: 'MTN MoMo payment request sent to your phone'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'MTN MoMo payment failed'
      };
    }
  }

  // Process Bank Transfer
  async processBankTransfer(paymentData) {
    try {
      console.log('Processing Bank Transfer:', paymentData);
      
      // In a real implementation, you would:
      // 1. Generate unique reference number
      // 2. Store transfer details
      // 3. Send confirmation email with bank details
      
      const referenceNumber = this.generateReferenceNumber();
      
      const response = await this.simulateApiCall({
        method: 'bank_transfer',
        amount: paymentData.amount,
        currency: paymentData.currency,
        bankDetails: {
          bankName: paymentData.bankName,
          accountNumber: paymentData.bankAccount
        },
        reference: referenceNumber
      });

      return {
        success: true,
        transactionId: response.transactionId,
        referenceNumber: referenceNumber,
        message: 'Bank transfer details sent to your email',
        bankDetails: {
          accountName: 'Tech Solutions Guinea',
          accountNumber: '1234567890',
          bankName: 'BICIG',
          reference: referenceNumber
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Bank transfer setup failed'
      };
    }
  }

  // Process Cash on Delivery
  async processCashOnDelivery(paymentData) {
    try {
      console.log('Processing Cash on Delivery:', paymentData);
      
      // In a real implementation, you would:
      // 1. Store delivery address
      // 2. Schedule delivery
      // 3. Send confirmation to customer and delivery team
      
      const response = await this.simulateApiCall({
        method: 'cash_on_delivery',
        amount: paymentData.amount,
        currency: paymentData.currency,
        deliveryAddress: paymentData.deliveryAddress
      });

      return {
        success: true,
        transactionId: response.transactionId,
        message: 'Order confirmed for cash on delivery',
        deliveryAddress: paymentData.deliveryAddress
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Cash on delivery setup failed'
      };
    }
  }

  // Main payment processing method
  async processPayment(paymentMethod, paymentData) {
    switch (paymentMethod) {
      case 'stripe':
        return await this.processStripePayment(paymentData);
      case 'ymo':
        return await this.processYMOPayment(paymentData);
      case 'orange-money':
        return await this.processOrangeMoneyPayment(paymentData);
      case 'mtn':
        return await this.processMTNPayment(paymentData);
      case 'bank-transfer':
        return await this.processBankTransfer(paymentData);
      case 'cash-on-delivery':
        return await this.processCashOnDelivery(paymentData);
      default:
        return {
          success: false,
          error: 'Invalid payment method'
        };
    }
  }

  // Generate reference number for bank transfers
  generateReferenceNumber() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `TSG${timestamp}${random}`.toUpperCase();
  }

  // Simulate API call (replace with real API calls)
  async simulateApiCall(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          redirectUrl: data.method === 'ymo' ? 'https://ymo.example.com/checkout' : null
        });
      }, 1000);
    });
  }

  // Validate payment data
  validatePaymentData(paymentMethod, paymentData) {
    const errors = {};

    switch (paymentMethod) {
      case 'stripe':
        if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length < 16) {
          errors.cardNumber = 'Valid card number is required';
        }
        if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
          errors.expiryDate = 'Valid expiry date (MM/YY) is required';
        }
        if (!paymentData.cvv || paymentData.cvv.length < 3) {
          errors.cvv = 'Valid CVV is required';
        }
        if (!paymentData.cardName) {
          errors.cardName = 'Cardholder name is required';
        }
        break;

      case 'orange-money':
      case 'mtn':
        if (!paymentData.phoneNumber) {
          errors.phoneNumber = 'Phone number is required';
        }
        break;

      case 'bank-transfer':
        if (!paymentData.bankName) {
          errors.bankName = 'Bank selection is required';
        }
        if (!paymentData.bankAccount) {
          errors.bankAccount = 'Account number is required';
        }
        break;

      case 'cash-on-delivery':
        if (!paymentData.deliveryAddress) {
          errors.deliveryAddress = 'Delivery address is required';
        }
        break;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

export default new PaymentService();
