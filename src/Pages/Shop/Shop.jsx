// Shop.jsx
import React, { useState, useEffect } from 'react';
import { FaFire, FaClock } from 'react-icons/fa';
import SmartphoneStore from './SmartphoneStore';
import LaptopStore from './LaptopStore';
import DesktopStore from './DesktopStore';
import AccessoriesStore from './AccessoriesStore';
import ComponentsStore from './ComponentsStore';
import ShopHero from '../../components/ShopHero';

import { useTranslation } from "react-i18next";

const Shop = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('Smartphones');
  const [timeRemaining, setTimeRemaining] = useState({
    days: 45,
    hours: 12,
    minutes: 30,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sales Banner */}
      <div className="bg-red-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
            <div className="flex items-center mb-2 sm:mb-0">
              <FaFire className="text-xl mr-2" />
              <span className="text-lg sm:text-xl font-bold">
                {t('shop.banner.flash_sale')}
              </span>
            </div>
            <div className="flex items-center text-sm">
              <FaClock className="mr-2" />
              <span>
                {t('shop.banner.ends_may')} • {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m {t('shop.banner.left')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white border-b">
        <ShopHero />
      </div>

      {/* Category Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-4 sm:space-x-8 overflow-x-auto py-4 scrollbar-hidden">
            {[
              { name: 'Smartphones', onSale: true },
              { name: 'Laptops', onSale: true },
              { name: 'Desktops', onSale: false },
              { name: 'Accessories', onSale: true },
              { name: 'Components', onSale: false }
            ].map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`relative whitespace-nowrap px-3 py-2 text-sm font-medium rounded-lg ${selectedCategory === category.name
                    ? 'bg-[#3B82F6] text-white'
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {t(`shop.categories.${category.name.toLowerCase()}`)}
                {category.onSale && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
                    -20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Render Content Based on Selected Category */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedCategory === 'Smartphones' && <SmartphoneStore />}
        {selectedCategory === 'Laptops' && <LaptopStore />}
        {selectedCategory === 'Desktops' && <DesktopStore />}
        {selectedCategory === 'Accessories' && <AccessoriesStore />}
        {selectedCategory === 'Components' && <ComponentsStore />}
      </div>


    </div>
  );
};

export default Shop;
