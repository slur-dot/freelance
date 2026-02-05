// Currency utility for GNF (main) and USD (secondary)
export const CURRENCY_CONFIG = {
  MAIN: 'GNF',
  SECONDARY: 'USD',
  EXCHANGE_RATE: 8800, // 1 USD = 8,800 GNF
  MAIN_SYMBOL: 'GNF',
  SECONDARY_SYMBOL: '$'
};

/**
 * Convert GNF to USD
 * @param {number} gnfAmount - Amount in GNF
 * @returns {number} Amount in USD
 */
export const gnfToUsd = (gnfAmount) => {
  return Math.round(gnfAmount / CURRENCY_CONFIG.EXCHANGE_RATE);
};

/**
 * Convert USD to GNF
 * @param {number} usdAmount - Amount in USD
 * @returns {number} Amount in GNF
 */
export const usdToGnf = (usdAmount) => {
  return Math.round(usdAmount * CURRENCY_CONFIG.EXCHANGE_RATE);
};

/**
 * Format price with dual currency display
 * @param {number} amount - Amount in GNF
 * @param {Object} options - Formatting options
 * @returns {Object} Formatted price object
 */
export const formatPrice = (amount, options = {}) => {
  const {
    showSecondary = true,
    showSymbol = true,
    precision = 0
  } = options;

  // Ensure amount is a number
  const gnfAmount = Number(amount) || 0;
  const usdAmount = gnfToUsd(gnfAmount);

  // Format GNF amount
  const gnfFormatted = gnfAmount.toLocaleString('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision
  });

  // Format USD amount
  const usdFormatted = usdAmount.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  // Build display strings
  const gnfDisplay = showSymbol ? `${gnfFormatted} ${CURRENCY_CONFIG.MAIN_SYMBOL}` : gnfFormatted;
  const usdDisplay = showSymbol ? `$${usdFormatted}` : usdFormatted;

  return {
    gnf: gnfAmount,
    usd: usdAmount,
    gnfFormatted,
    usdFormatted,
    display: showSecondary ? `${gnfDisplay} (${usdDisplay})` : gnfDisplay,
    gnfDisplay,
    usdDisplay,
    main: gnfDisplay,
    secondary: usdDisplay
  };
};

/**
 * Format price for display in components
 * @param {number} amount - Amount in GNF
 * @param {Object} options - Formatting options
 * @returns {string} Formatted price string
 */
export const formatPriceDisplay = (amount, options = {}) => {
  return formatPrice(amount, options).display;
};

/**
 * Format price for main currency only
 * @param {number} amount - Amount in GNF
 * @param {Object} options - Formatting options
 * @returns {string} Formatted GNF price string
 */
export const formatMainPrice = (amount, options = {}) => {
  return formatPrice(amount, { ...options, showSecondary: false }).main;
};

/**
 * Format price for secondary currency only
 * @param {number} amount - Amount in GNF
 * @param {Object} options - Formatting options
 * @returns {string} Formatted USD price string
 */
export const formatSecondaryPrice = (amount, options = {}) => {
  return formatPrice(amount, { ...options, showSecondary: false }).secondary;
};

/**
 * Parse price from string (handles both GNF and USD)
 * @param {string} priceString - Price string to parse
 * @returns {number} Amount in GNF
 */
export const parsePrice = (priceString) => {
  if (!priceString) return 0;
  
  // Remove all non-numeric characters except decimal point
  const cleanString = priceString.replace(/[^\d.-]/g, '');
  const amount = parseFloat(cleanString) || 0;
  
  // If string contains $ or USD, convert from USD to GNF
  if (priceString.includes('$') || priceString.toLowerCase().includes('usd')) {
    return usdToGnf(amount);
  }
  
  // Otherwise assume it's GNF
  return amount;
};

/**
 * Get currency symbol
 * @param {string} currency - Currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currency) => {
  switch (currency?.toUpperCase()) {
    case 'GNF':
      return CURRENCY_CONFIG.MAIN_SYMBOL;
    case 'USD':
      return CURRENCY_CONFIG.SECONDARY_SYMBOL;
    default:
      return CURRENCY_CONFIG.MAIN_SYMBOL;
  }
};

/**
 * Validate currency amount
 * @param {number} amount - Amount to validate
 * @returns {boolean} Is valid amount
 */
export const isValidAmount = (amount) => {
  return !isNaN(amount) && amount >= 0 && isFinite(amount);
};

/**
 * Round to nearest currency unit
 * @param {number} amount - Amount to round
 * @param {string} currency - Currency type
 * @returns {number} Rounded amount
 */
export const roundCurrency = (amount, currency = 'GNF') => {
  const value = Number(amount) || 0;
  
  if (currency.toUpperCase() === 'USD') {
    return Math.round(value);
  }
  
  // For GNF, round to nearest 100
  return Math.round(value / 100) * 100;
};
