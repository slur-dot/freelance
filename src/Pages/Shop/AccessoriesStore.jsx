import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Filter, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import ShopProductCard from '../../components/ShopProductCard';

import { useTranslation } from "react-i18next";

const AccessoriesStore = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [sortBy, setSortBy] = useState('Most Popular');
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: [0, 2000000],
    compatibility: []
  });
  const [filteredAccessories, setFilteredAccessories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const accessories = [
    {
      id: 1,
      name: 'Apple Magic Keyboard',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 800000,
      currentPrice: 640000,
      rentPrice: 36000,
      currency: 'GNF',
      tags: ['New', 'Wireless'],
      rating: 4.7,
      reviews: 1200,
      brand: 'Apple',
      category: 'Keyboards',
      compatibility: ['Mac', 'iPad']
    },
    {
      id: 2,
      name: 'Logitech MX Master 3S',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 600000,
      currentPrice: 480000,
      rentPrice: 27000,
      currency: 'GNF',
      tags: ['Popular', 'Ergonomic'],
      rating: 4.8,
      reviews: 950,
      brand: 'Logitech',
      category: 'Mice',
      compatibility: ['Windows', 'Mac', 'Linux']
    },
    {
      id: 3,
      name: 'Samsung 27" 4K Monitor',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 1509200,
      currentPrice: 1200000,
      rentPrice: 67000,
      currency: 'GNF',
      tags: ['4K', 'Professional'],
      rating: 4.6,
      reviews: 680,
      brand: 'Samsung',
      category: 'Monitors',
      compatibility: ['Windows', 'Mac', 'Gaming Consoles']
    },
    {
      id: 4,
      name: 'JBL Charge 5 Speaker',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 400000,
      currentPrice: 320000,
      rentPrice: 18000,
      currency: 'GNF',
      tags: ['Portable', 'Waterproof'],
      rating: 4.5,
      reviews: 850,
      brand: 'JBL',
      category: 'Audio',
      compatibility: ['Bluetooth', 'USB-C']
    },
    {
      id: 5,
      name: 'Dell USB-C Hub',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 300000,
      currentPrice: 240000,
      rentPrice: 13000,
      currency: 'GNF',
      tags: ['Multi-Port', 'Compact'],
      rating: 4.4,
      reviews: 420,
      brand: 'Dell',
      category: 'Adapters',
      compatibility: ['USB-C', 'Thunderbolt']
    },
    {
      id: 6,
      name: 'Corsair Gaming Headset',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 509200,
      currentPrice: 400000,
      rentPrice: 22000,
      currency: 'GNF',
      tags: ['Gaming', '7.1 Surround'],
      rating: 4.6,
      reviews: 720,
      brand: 'Corsair',
      category: 'Audio',
      compatibility: ['PC', 'PS5', 'Xbox']
    },
    {
      id: 7,
      name: 'Anker Power Bank 20000mAh',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 250920,
      currentPrice: 200000,
      rentPrice: 11000,
      currency: 'GNF',
      tags: ['High Capacity', 'Fast Charge'],
      rating: 4.7,
      reviews: 1100,
      brand: 'Anker',
      category: 'Power',
      compatibility: ['iPhone', 'Android', 'Tablets']
    },
    {
      id: 8,
      name: 'Microsoft Surface Pen',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 350920,
      currentPrice: 280000,
      rentPrice: 16000,
      currency: 'GNF',
      tags: ['Stylus', 'Pressure Sensitive'],
      rating: 4.5,
      reviews: 380,
      brand: 'Microsoft',
      category: 'Stylus',
      compatibility: ['Surface', 'iPad']
    }
  ];

  useEffect(() => {
    let filtered = [...accessories];

    if (filters.categories.length > 0) {
      filtered = filtered.filter((accessory) =>
        filters.categories.includes(accessory.category)
      );
    }
    if (filters.brands.length > 0) {
      filtered = filtered.filter((accessory) => filters.brands.includes(accessory.brand));
    }
    if (filters.compatibility.length > 0) {
      filtered = filtered.filter((accessory) =>
        filters.compatibility.some(comp => accessory.compatibility.includes(comp))
      );
    }

    filtered = filtered.filter(
      (accessory) =>
        accessory.currentPrice >= filters.priceRange[0] &&
        accessory.currentPrice <= filters.priceRange[1]
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
    setFilteredAccessories(filtered);
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

  const formatPrice = (price) => {
    return price.toLocaleString() + ' GNF';
  };

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

          {/* Category Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">{t('shop.filters.category')}</h4>
            {['Keyboards', 'Mice', 'Monitors', 'Audio', 'Adapters', 'Stylus', 'Power'].map((category) => (
              <label key={category} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleFilterChange('categories', category)}
                  className="mr-2 rounded border-gray-300 text-[#15803D] focus:ring-[#15803D]"
                />
                <span className="text-sm">{t(`shop.categories.${category.toLowerCase()}`)}</span>
              </label>
            ))}
          </div>

          {/* Brand Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">{t('shop.filters.brand')}</h4>
            {['Apple', 'Logitech', 'Samsung', 'JBL', 'Dell', 'Corsair', 'Anker', 'Microsoft'].map((brand) => (
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

          {/* Compatibility Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">{t('shop.filters.compatibility')}</h4>
            {['Windows', 'Mac', 'iPhone', 'Android', 'iPad', 'Gaming Consoles', 'Bluetooth', 'USB-C'].map((compatibility) => (
              <label key={compatibility} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={filters.compatibility.includes(compatibility)}
                  onChange={() => handleFilterChange('compatibility', compatibility)}
                  className="mr-2 rounded border-gray-300 text-[#15803D] focus:ring-[#15803D]"
                />
                <span className="text-sm">{compatibility}</span>
              </label>
            ))}
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">{t('shop.filters.price_range')}</h4>
            <input
              type="range"
              min="0"
              max="2000000"
              step="10000"
              value={filters.priceRange[1]}
              onChange={handlePriceRangeChange}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #15803D 0%, #15803D ${(filters.priceRange[1] / 2000000) * 100}%, #d1d5db ${(filters.priceRange[1] / 2000000) * 100}%, #d1d5db 100%)`
              }}
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>0 GNF</span>
              <span>{formatPrice(filters.priceRange[1])}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl font-bold text-gray-900">{t('shop.accessories.title')}</h2>
            <p className="text-gray-600">{t('shop.accessories.found', { count: filteredAccessories.length })}</p>
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

        {/* NGO Appeal Section */}
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">NGO</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">{t('shop.accessories.ngo_title')}</h3>
          </div>
          <p className="text-gray-700 mb-4">
            {t('shop.accessories.ngo_desc')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">{t('shop.accessories.usb_cable')}</h4>
              <div className="text-2xl font-bold text-green-600 mb-1">88,000 GNF</div>
              <div className="text-sm text-gray-600">$10 USD</div>
              <div className="text-xs text-blue-600 mt-2">{t('shop.accessories.perfect_ngo')}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">{t('shop.accessories.power_adapter')}</h4>
              <div className="text-2xl font-bold text-green-600 mb-1">132,000 GNF</div>
              <div className="text-sm text-gray-600">$15 USD</div>
              <div className="text-xs text-blue-600 mt-2">{t('shop.accessories.universal_comp')}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">{t('shop.accessories.headphones')}</h4>
              <div className="text-2xl font-bold text-green-600 mb-1">176,000 GNF</div>
              <div className="text-sm text-gray-600">$20 USD</div>
              <div className="text-xs text-blue-600 mt-2">{t('shop.accessories.training_ready')}</div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800">
              {t('shop.accessories.ngo_qualification')}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredAccessories.map((accessory) => (
            <ShopProductCard
              key={accessory.id}
              product={{ ...accessory, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop&auto=format' }}
              onAddToCart={addToCart}
            />
          ))}
        </div>

        {filteredAccessories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('shop.accessories.no_results')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessoriesStore;
