import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Filter, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import ShopProductCard from '../../components/ShopProductCard';
import { ProductService } from '../../services/productService';
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
  const [components, setComponents] = useState([]);

  useEffect(() => {
    const fetchComponents = async () => {
      const data = await ProductService.getProductsByCategory('Components');
      setComponents(data || []);
    };
    fetchComponents();
  }, []);

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
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #15803D 0%, #15803D ${(filters.priceRange[1] / 5092000) * 100}%, #d1d5db ${(filters.priceRange[1] / 5092000) * 100}%, #d1d5db 100%)`
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
