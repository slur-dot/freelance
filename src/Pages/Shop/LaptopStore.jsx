import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFire } from 'react-icons/fa';
import PriceDisplay from '../../components/PriceDisplay';
import { Star, Filter, SlidersHorizontal } from 'lucide-react';
import LaptopImage from '../../assets/Laptop.jpg';
import { useCart } from '../../contexts/CartContext';
import ShopProductCard from '../../components/ShopProductCard';

import { useTranslation } from "react-i18next";

const LaptopStore = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [sortBy, setSortBy] = useState('Most Popular');
  const [filters, setFilters] = useState({
    conditions: [],
    brands: [],
    priceRange: [0, 15092000],
    screenSize: [],
    ram: [],
    storage: []
  });
  const [filteredLaptops, setFilteredLaptops] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const laptops = [
    {
      id: 1,
      name: 'MacBook Pro 16" M3 Pro',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 15092000,
      currentPrice: 12000000,
      rentPrice: 667000,
      currency: 'GNF',
      tags: ['New', 'Professional'],
      rating: 4.9,
      reviews: 850,
      brand: 'Apple',
      condition: 'New',
      isOnSale: true,
      discountPercent: 20,
      screenSize: '16"',
      ram: '18GB',
      storage: '512GB SSD'
    },
    {
      id: 2,
      name: 'Dell XPS 15',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 12000000,
      currentPrice: 9600000,
      rentPrice: 533000,
      currency: 'GNF',
      tags: ['Popular', 'Business'],
      rating: 4.7,
      reviews: 1200,
      brand: 'Dell',
      condition: 'New',
      isOnSale: true,
      discountPercent: 20,
      screenSize: '15.6"',
      ram: '16GB',
      storage: '1TB SSD'
    },
    {
      id: 3,
      name: 'HP Spectre x360',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 10000000,
      currentPrice: 8000000,
      rentPrice: 444000,
      currency: 'GNF',
      tags: ['2-in-1', 'Convertible'],
      rating: 4.6,
      reviews: 650,
      brand: 'HP',
      condition: 'New',
      isOnSale: true,
      discountPercent: 20,
      screenSize: '13.5"',
      ram: '16GB',
      storage: '512GB SSD'
    },
    {
      id: 4,
      name: 'Lenovo ThinkPad X1 Carbon',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 11000000,
      currentPrice: 8800000,
      rentPrice: 489000,
      currency: 'GNF',
      tags: ['Business', 'Durable'],
      rating: 4.8,
      reviews: 950,
      brand: 'Lenovo',
      condition: 'New',
      screenSize: '14"',
      ram: '16GB',
      storage: '512GB SSD'
    },
    {
      id: 5,
      name: 'ASUS ROG Strix G15',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 9000000,
      currentPrice: 7200000,
      rentPrice: 400000,
      currency: 'GNF',
      tags: ['Gaming', 'RTX'],
      rating: 4.5,
      reviews: 780,
      brand: 'ASUS',
      condition: 'New',
      screenSize: '15.6"',
      ram: '16GB',
      storage: '1TB SSD'
    },
    {
      id: 6,
      name: 'MacBook Air M2',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 8000000,
      currentPrice: 6400000,
      rentPrice: 356000,
      currency: 'GNF',
      tags: ['Portable', 'M2 Chip'],
      rating: 4.8,
      reviews: 1100,
      brand: 'Apple',
      condition: 'New',
      screenSize: '13.6"',
      ram: '8GB',
      storage: '256GB SSD'
    }
  ];

  useEffect(() => {
    let filtered = [...laptops];

    if (filters.conditions.length > 0) {
      filtered = filtered.filter((laptop) =>
        filters.conditions.includes(laptop.condition)
      );
    }
    if (filters.brands.length > 0) {
      filtered = filtered.filter((laptop) => filters.brands.includes(laptop.brand));
    }
    if (filters.screenSize.length > 0) {
      filtered = filtered.filter((laptop) => filters.screenSize.includes(laptop.screenSize));
    }
    if (filters.ram.length > 0) {
      filtered = filtered.filter((laptop) => filters.ram.includes(laptop.ram));
    }
    if (filters.storage.length > 0) {
      filtered = filtered.filter((laptop) => filters.storage.includes(laptop.storage));
    }

    filtered = filtered.filter(
      (laptop) =>
        laptop.currentPrice >= filters.priceRange[0] &&
        laptop.currentPrice <= filters.priceRange[1]
    );

    switch (sortBy) {
      case 'Price: Low to High':
        filtered.sort((a, b) => a.currentPrice - b.currentPrice);
        break;
      case 'Price: High to Low':
        filtered.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case 'Newest First':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'Best Rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
    }
    setFilteredLaptops(filtered);
  }, [filters, sortBy]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  const handlePriceRangeChange = (e) => {
    const value = Number(e.target.value);
    setFilters((prev) => ({
      ...prev,
      priceRange: [0, value],
    }));
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
      />
    ));
  };

  // Remove formatPrice function - using PriceDisplay component instead

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Filter Sidebar */}
      <div className={`lg:w-64 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
        <div className="bg-[#E5E7EB] p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{t('shop.filters.title')}</h3>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          {/* Condition Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">{t('shop.filters.condition')}</h4>
            {['New', 'Used'].map((condition) => (
              <label key={condition} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={filters.conditions.includes(condition)}
                  onChange={() => handleFilterChange('conditions', condition)}
                  className="mr-2 rounded border-gray-300 text-[#15803D] focus:ring-[#15803D]"
                />
                <span className="text-sm">{t(`shop.filters.conditions.${condition.toLowerCase()}`)}</span>
              </label>
            ))}
          </div>

          {/* Brand Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">{t('shop.filters.brand')}</h4>
            {['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS'].map((brand) => (
              <label key={brand} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(brand)}
                  onChange={() => handleFilterChange('brands', brand)}
                  className="mr-2 rounded border-gray-300 text-[#15803D] focus:ring-[#15803D]"
                />
                <span className="text-sm">{brand}</span>
              </label>
            ))}
          </div>

          {/* Screen Size Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">{t('shop.filters.screen_size')}</h4>
            {['13.6"', '14"', '15.6"', '16"'].map((size) => (
              <label key={size} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={filters.screenSize.includes(size)}
                  onChange={() => handleFilterChange('screenSize', size)}
                  className="mr-2 rounded border-gray-300 text-[#15803D] focus:ring-[#15803D]"
                />
                <span className="text-sm">{size}</span>
              </label>
            ))}
          </div>

          {/* RAM Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">{t('shop.filters.ram')}</h4>
            {['8GB', '16GB', '18GB', '32GB'].map((ram) => (
              <label key={ram} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={filters.ram.includes(ram)}
                  onChange={() => handleFilterChange('ram', ram)}
                  className="mr-2 rounded border-gray-300 text-[#15803D] focus:ring-[#15803D]"
                />
                <span className="text-sm">{ram}</span>
              </label>
            ))}
          </div>

          {/* Storage Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">{t('shop.filters.storage')}</h4>
            {['256GB SSD', '512GB SSD', '1TB SSD'].map((storage) => (
              <label key={storage} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={filters.storage.includes(storage)}
                  onChange={() => handleFilterChange('storage', storage)}
                  className="mr-2 rounded border-gray-300 text-[#15803D] focus:ring-[#15803D]"
                />
                <span className="text-sm">{storage}</span>
              </label>
            ))}
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">{t('shop.filters.price_range')}</h4>
            <input
              type="range"
              min="0"
              max="15092000"
              step="100000"
              value={filters.priceRange[1]}
              onChange={handlePriceRangeChange}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #15803D 0%, #15803D ${(filters.priceRange[1] / 15092000) * 100}%, #d1d5db ${(filters.priceRange[1] / 15092000) * 100}%, #d1d5db 100%)`
              }}
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>0 GNF</span>
              <span><PriceDisplay amount={filters.priceRange[1]} showSecondary={false} /></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl font-bold text-gray-900">{t('shop.laptops.title')}</h2>
            <p className="text-gray-600">{t('shop.laptops.found', { count: filteredLaptops.length })}</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              {t('shop.filters.title')}
            </button>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Most Popular">{t('shop.sorting.most_popular')}</option>
                <option value="Price: Low to High">{t('shop.sorting.price_low_high')}</option>
                <option value="Price: High to Low">{t('shop.sorting.price_high_low')}</option>
                <option value="Newest First">{t('shop.sorting.newest_first')}</option>
                <option value="Best Rating">{t('shop.sorting.best_rating')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredLaptops.map((laptop) => (
            <ShopProductCard
              key={laptop.id}
              product={{ ...laptop, image: LaptopImage }}
              onAddToCart={addToCart}
            />
          ))}
        </div>

        {filteredLaptops.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('shop.laptops.no_results')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaptopStore;
