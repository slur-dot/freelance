import React, { createContext, useContext } from 'react';
import { CURRENCY_CONFIG, formatPrice, formatPriceDisplay } from '../utils/currencyUtils';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const value = {
    // Currency configuration
    mainCurrency: CURRENCY_CONFIG.MAIN,
    secondaryCurrency: CURRENCY_CONFIG.SECONDARY,
    exchangeRate: CURRENCY_CONFIG.EXCHANGE_RATE,
    
    // Utility functions
    formatPrice,
    formatPriceDisplay,
    
    // Helper functions
    formatAmount: (amount, options = {}) => formatPriceDisplay(amount, options),
    formatMainPrice: (amount) => formatPriceDisplay(amount, { showSecondary: false }),
    formatSecondaryPrice: (amount) => formatPriceDisplay(amount, { showSecondary: false, currency: 'USD' }),
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyContext;
