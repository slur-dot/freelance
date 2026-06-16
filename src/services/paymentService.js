// Payment processing service — Djomy credentials stay on the server (see /api/djomy-gateway)
class PaymentService {
  constructor() {
    this.stripePublicKey =
      import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_your_stripe_key';
    this.ymoClientId = import.meta.env.VITE_YMO_CLIENT_ID || 'your_ymo_client_id';
  }

  async processStripePayment(paymentData) {
    try {
      console.log('Processing Stripe payment:', paymentData);
      const response = await this.simulateApiCall({
        method: 'stripe',
        amount: paymentData.amount,
        currency: paymentData.currency,
        cardDetails: {
          number: paymentData.cardNumber,
          expiry: paymentData.expiryDate,
          cvv: paymentData.cvv,
          name: paymentData.cardName,
        },
      });
      return {
        success: true,
        transactionId: response.transactionId,
        message: 'Payment processed successfully with Stripe',
      };
    } catch (error) {
      return { success: false, error: error.message || 'Stripe payment failed' };
    }
  }

  async processYMOPayment(paymentData) {
    try {
      const response = await this.simulateApiCall({
        method: 'ymo',
        amount: paymentData.amount,
        currency: paymentData.currency,
      });
      return {
        success: true,
        transactionId: response.transactionId,
        message: 'YMO payment initiated successfully',
        redirectUrl: response.redirectUrl,
      };
    } catch (error) {
      return { success: false, error: error.message || 'YMO payment failed' };
    }
  }

  async processOrangeMoneyPayment(paymentData) {
    try {
      const response = await this.simulateApiCall({
        method: 'orange_money',
        amount: paymentData.amount,
        currency: paymentData.currency,
        phoneNumber: paymentData.phoneNumber,
      });
      return {
        success: true,
        transactionId: response.transactionId,
        message: 'Orange Money payment request sent to your phone',
      };
    } catch (error) {
      return { success: false, error: error.message || 'Orange Money payment failed' };
    }
  }

  async processMTNPayment(paymentData) {
    try {
      const response = await this.simulateApiCall({
        method: 'mtn_momo',
        amount: paymentData.amount,
        currency: paymentData.currency,
        phoneNumber: paymentData.phoneNumber,
      });
      return {
        success: true,
        transactionId: response.transactionId,
        message: 'MTN MoMo payment request sent to your phone',
      };
    } catch (error) {
      return { success: false, error: error.message || 'MTN MoMo payment failed' };
    }
  }

  async processBankTransfer(paymentData) {
    try {
      const referenceNumber = this.generateReferenceNumber();
      const response = await this.simulateApiCall({
        method: 'bank_transfer',
        amount: paymentData.amount,
        currency: paymentData.currency,
        bankDetails: {
          bankName: paymentData.bankName,
          accountNumber: paymentData.bankAccount,
        },
        reference: referenceNumber,
      });
      return {
        success: true,
        transactionId: response.transactionId,
        referenceNumber,
        message: 'Bank transfer details sent to your email',
        bankDetails: {
          accountName: 'Tech Solutions Guinea',
          accountNumber: '1234567890',
          bankName: 'BICIG',
          reference: referenceNumber,
        },
      };
    } catch (error) {
      return { success: false, error: error.message || 'Bank transfer setup failed' };
    }
  }

  async processCashOnDelivery(paymentData) {
    try {
      const response = await this.simulateApiCall({
        method: 'cash_on_delivery',
        amount: paymentData.amount,
        currency: paymentData.currency,
        deliveryAddress: paymentData.deliveryAddress,
      });
      return {
        success: true,
        transactionId: response.transactionId,
        message: 'Order confirmed for cash on delivery',
        deliveryAddress: paymentData.deliveryAddress,
      };
    } catch (error) {
      return { success: false, error: error.message || 'Cash on delivery setup failed' };
    }
  }

  /** Initiate Djomy hosted checkout via server-side proxy (no secrets in browser) */
  async processDjomyPayment(paymentData) {
    try {
      const response = await fetch('/api/djomy-gateway', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Number(paymentData.amount) || 0,
          countryCode: paymentData.countryCode || 'GN',
          payerNumber: paymentData.phoneNumber,
          merchantPaymentReference: paymentData.merchantPaymentReference,
          description: paymentData.description || 'Order payment',
          allowedPaymentMethods: paymentData.allowedPaymentMethods || [
            'OM',
            'MOMO',
            'CARD',
            'SOUTRA_MONEY',
            'PAYCARD',
          ],
          metadata: paymentData.metadata || {
            order_id: paymentData.merchantPaymentReference,
          },
          origin: window.location.origin,
        }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || 'Djomy payment initiation failed');
      }

      if (!result.redirectUrl) {
        throw new Error('Djomy did not return a redirect URL');
      }

      return {
        success: true,
        method: 'djomy',
        transactionId: result.transactionId,
        redirectUrl: result.redirectUrl,
        message: 'Redirecting to Djomy payment gateway...',
      };
    } catch (error) {
      console.error('Djomy payment failed:', error);
      return {
        success: false,
        error: error.message || 'Djomy payment initialization failed',
      };
    }
  }

  /** Verify Djomy payment status via server before marking order paid */
  async confirmDjomyPayment({ orderId, transactionId, status }) {
    const response = await fetch('/api/djomy-confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, transactionId, status }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok && !result.verified) {
      throw new Error(result.error || 'Payment verification failed');
    }
    return result;
  }

  async processPayment(paymentMethod, paymentData) {
    switch (paymentMethod) {
      case 'stripe':
        return this.processStripePayment(paymentData);
      case 'djomy':
        return this.processDjomyPayment(paymentData);
      case 'ymo':
        return this.processYMOPayment(paymentData);
      case 'orange-money':
        return this.processOrangeMoneyPayment(paymentData);
      case 'mtn':
        return this.processMTNPayment(paymentData);
      case 'bank-transfer':
        return this.processBankTransfer(paymentData);
      case 'cash-on-delivery':
        return this.processCashOnDelivery(paymentData);
      default:
        return { success: false, error: 'Invalid payment method' };
    }
  }

  generateReferenceNumber() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `TSG${timestamp}${random}`.toUpperCase();
  }

  async simulateApiCall(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          redirectUrl: data.method === 'ymo' ? 'https://ymo.example.com/checkout' : null,
        });
      }, 1000);
    });
  }

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
      case 'djomy':
        if (!paymentData.phoneNumber) {
          errors.phoneNumber = 'Phone number is required';
        }
        break;
      case 'bank-transfer':
        if (!paymentData.bankName) errors.bankName = 'Bank selection is required';
        if (!paymentData.bankAccount) errors.bankAccount = 'Account number is required';
        break;
      case 'cash-on-delivery':
        if (!paymentData.deliveryAddress) {
          errors.deliveryAddress = 'Delivery address is required';
        }
        break;
      default:
        break;
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  }
}

export default new PaymentService();
