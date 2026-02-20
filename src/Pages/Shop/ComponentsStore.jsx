import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Filter, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import ShopProductCard from '../../components/ShopProductCard';

import { useTranslation } from "react-i18next";

const ComponentsStore = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [sortBy, setSortBy] = useState('Most Popular');
  const [filters, setFilters] = useState({
    categories: [],
    brands: [],
    priceRange: [0, 5092000],
    compatibility: []
  });
  const [filteredComponents, setFilteredComponents] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const components = [
    {
      id: 1,
      name: 'Intel Core i9-13900K',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 2509200,
      currentPrice: 2000000,
      rentPrice: 111000,
      currency: 'GNF',
      tags: ['New', 'High Performance'],
      rating: 4.8,
      reviews: 450,
      brand: 'Intel',
      category: 'Processors',
      compatibility: ['LGA 1700', 'DDR4/DDR5']
    },
    {
      id: 2,
      name: 'AMD Ryzen 9 7900X',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 2200000,
      currentPrice: 1760000,
      rentPrice: 98000,
      currency: 'GNF',
      tags: ['Popular', '12-Core'],
      rating: 4.7,
      reviews: 380,
      brand: 'AMD',
      category: 'Processors',
      compatibility: ['AM5', 'DDR5']
    },
    {
      id: 3,
      name: 'NVIDIA RTX 4080',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 4509200,
      currentPrice: 3600000,
      rentPrice: 200000,
      currency: 'GNF',
      tags: ['Gaming', 'Ray Tracing'],
      rating: 4.9,
      reviews: 520,
      brand: 'NVIDIA',
      category: 'Graphics Cards',
      compatibility: ['PCIe 4.0', '8K Ready']
    },
    {
      id: 4,
      name: 'Corsair Vengeance LPX 32GB',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 800000,
      currentPrice: 640000,
      rentPrice: 36000,
      currency: 'GNF',
      tags: ['High Speed', 'Low Latency'],
      rating: 4.6,
      reviews: 290,
      brand: 'Corsair',
      category: 'Memory',
      compatibility: ['DDR4', 'Intel/AMD']
    },
    {
      id: 5,
      name: 'Samsung 980 PRO 2TB SSD',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 1200000,
      currentPrice: 960000,
      rentPrice: 53000,
      currency: 'GNF',
      tags: ['NVMe', 'High Speed'],
      rating: 4.8,
      reviews: 680,
      brand: 'Samsung',
      category: 'Storage',
      compatibility: ['PCIe 4.0', 'M.2']
    },
    {
      id: 6,
      name: 'ASUS ROG Strix X670E-E',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 1800000,
      currentPrice: 1440000,
      rentPrice: 80000,
      currency: 'GNF',
      tags: ['Gaming', 'WiFi 6E'],
      rating: 4.7,
      reviews: 320,
      brand: 'ASUS',
      category: 'Motherboards',
      compatibility: ['AM5', 'DDR5']
    },
    {
      id: 7,
      name: 'Corsair RM850x PSU',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 600000,
      currentPrice: 480000,
      rentPrice: 27000,
      currency: 'GNF',
      tags: ['80+ Gold', 'Modular'],
      rating: 4.5,
      reviews: 410,
      brand: 'Corsair',
      category: 'Power Supplies',
      compatibility: ['ATX', 'PCIe 5.0']
    },
    {
      id: 8,
      name: 'Noctua NH-D15 CPU Cooler',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 400000,
      currentPrice: 320000,
      rentPrice: 18000,
      currency: 'GNF',
      tags: ['Silent', 'High Performance'],
      rating: 4.9,
      reviews: 850,
      brand: 'Noctua',
      category: 'Cooling',
      compatibility: ['Intel/AMD', 'Multiple Sockets']
    },
    {
      id: 9,
      name: 'Fractal Design Define 7',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 700000,
      currentPrice: 560000,
      rentPrice: 31000,
      currency: 'GNF',
      tags: ['Silent', 'Modular'],
      rating: 4.6,
      reviews: 240,
      brand: 'Fractal Design',
      category: 'Cases',
      compatibility: ['ATX', 'E-ATX']
    },
    {
      id: 10,
      name: 'ASUS ROG Swift 27" 4K',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 2000000,
      currentPrice: 1600000,
      rentPrice: 89000,
      currency: 'GNF',
      tags: ['4K', '144Hz', 'G-Sync'],
      rating: 4.8,
      reviews: 380,
      brand: 'ASUS',
      category: 'Monitors',
      compatibility: ['DisplayPort', 'HDMI 2.1']
    }
  ];

  useEffect(() => {
    let filtered = [...components];

    if (filters.categories.length > 0) {
      filtered = filtered.filter((component) =>
        filters.categories.includes(component.category)
      );
    }
    if (filters.brands.length > 0) {
      filtered = filtered.filter((component) => filters.brands.includes(component.brand));
    }
    if (filters.compatibility.length > 0) {
      filtered = filtered.filter((component) =>
        filters.compatibility.some(comp => component.compatibility.includes(comp))
      );
    }

    filtered = filtered.filter(
      (component) =>
        component.currentPrice >= filters.priceRange[0] &&
        component.currentPrice <= filters.priceRange[1]
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
    setFilteredComponents(filtered);
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
            {['Processors', 'Graphics Cards', 'Memory', 'Storage', 'Motherboards', 'Power Supplies', 'Cooling', 'Cases', 'Monitors'].map((category) => (
              <label key={category} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category)}
                  onChange={() => handleFilterChange('categories', category)}
                  className="mr-2 rounded border-gray-300 text-[#15803D] focus:ring-[#15803D]"
                />
                <span className="text-sm">{t(`shop.categories.${category.toLowerCase().replace(' ', '_')}`)}</span>
              </label>
            ))}
          </div>

          {/* Brand Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">{t('shop.filters.brand')}</h4>
            {['Intel', 'AMD', 'NVIDIA', 'Corsair', 'Samsung', 'ASUS', 'Noctua', 'Fractal Design'].map((brand) => (
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
            {['LGA 1700', 'AM5', 'DDR4', 'DDR5', 'PCIe 4.0', 'PCIe 5.0', 'M.2', 'ATX', 'E-ATX'].map((compatibility) => (
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
              max="5092000"
              step="50920"
              value={filters.priceRange[1]}
              onChange={handlePriceRangeChange}
              className="w-full"
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
            <h2 className="text-2xl font-bold text-gray-900">{t('shop.components.title')}</h2>
            <p className="text-gray-600">{t('shop.components.found', { count: filteredComponents.length })}</p>
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
          {filteredComponents.map((component) => (
            <ShopProductCard
              key={component.id}
              product={{ ...component, image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=300&h=300&fit=crop&auto=format' }}
              onAddToCart={addToCart}
            />
          ))}
        </div>

        {filteredComponents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">{t('shop.components.no_results')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentsStore;
