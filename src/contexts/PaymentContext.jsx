import React, { createContext, useContext, useReducer } from 'react';
import paymentService from '../services/paymentService';

const PaymentContext = createContext();

const paymentReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PAYMENT_METHOD':
      return {
        ...state,
        selectedMethod: action.payload,
        paymentDetails: {},
        result: null
      };
    case 'SET_PAYMENT_DETAILS':
      return {
        ...state,
        paymentDetails: action.payload
      };
    case 'PROCESS_PAYMENT_START':
      return {
        ...state,
        isProcessing: true,
        result: null
      };
    case 'PROCESS_PAYMENT_SUCCESS':
      return {
        ...state,
        isProcessing: false,
        result: {
          success: true,
          ...action.payload
        }
      };
    case 'PROCESS_PAYMENT_ERROR':
      return {
        ...state,
        isProcessing: false,
        result: {
          success: false,
          ...action.payload
        }
      };
    case 'RESET_PAYMENT':
      return {
        selectedMethod: 'orange-money',
        paymentDetails: {},
        isProcessing: false,
        result: null
      };
    default:
      return state;
  }
};

const initialState = {
  selectedMethod: 'orange-money',
  paymentDetails: {},
  isProcessing: false,
  result: null
};

export const PaymentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  const setPaymentMethod = (method) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
  };

  const setPaymentDetails = (details) => {
    dispatch({ type: 'SET_PAYMENT_DETAILS', payload: details });
  };

  const processPayment = async (amount, currency = 'GNF', orderData = {}) => {
    dispatch({ type: 'PROCESS_PAYMENT_START' });

    try {
      // Validate payment data
      const validation = paymentService.validatePaymentData(state.selectedMethod, state.paymentDetails);
      if (!validation.isValid) {
        dispatch({
          type: 'PROCESS_PAYMENT_ERROR',
          payload: {
            error: 'Please fill in all required payment details',
            errors: validation.errors
          }
        });
        return;
      }

      // Process payment
      const result = await paymentService.processPayment(state.selectedMethod, {
        ...state.paymentDetails,
        amount,
        currency,
        ...orderData
      });

      if (result.success) {
        dispatch({ type: 'PROCESS_PAYMENT_SUCCESS', payload: result });
      } else {
        dispatch({ type: 'PROCESS_PAYMENT_ERROR', payload: result });
      }

      return result;
    } catch (error) {
      dispatch({
        type: 'PROCESS_PAYMENT_ERROR',
        payload: {
          error: error.message || 'Payment processing failed'
        }
      });
    }
  };

  const resetPayment = () => {
    dispatch({ type: 'RESET_PAYMENT' });
  };

  const value = {
    ...state,
    setPaymentMethod,
    setPaymentDetails,
    processPayment,
    resetPayment
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export default PaymentContext;
