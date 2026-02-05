import React from 'react';
import { formatPrice } from '../utils/currencyUtils';

const PriceDisplay = ({ 
  amount, 
  size = 'normal', 
  showSecondary = true, 
  className = '',
  variant = 'default' // 'default', 'bold', 'highlight', 'muted'
}) => {
  const price = formatPrice(amount, { showSecondary });
  
  const sizeClasses = {
    small: 'text-sm',
    normal: 'text-base',
    large: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  };

  const variantClasses = {
    default: 'text-gray-900',
    bold: 'font-bold text-gray-900',
    highlight: 'font-bold text-green-600',
    muted: 'text-gray-500',
    red: 'text-red-500',
    blue: 'text-blue-600'
  };

  const baseClasses = sizeClasses[size] || sizeClasses.normal;
  const variantClass = variantClasses[variant] || variantClasses.default;
  const combinedClasses = `${baseClasses} ${variantClass} ${className}`.trim();

  return (
    <span className={combinedClasses}>
      {price.display}
    </span>
  );
};

export default PriceDisplay;
