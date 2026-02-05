import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import { Star, Filter, SlidersHorizontal } from 'lucide-react';

const DesktopStore = () => {
  const [sortBy, setSortBy] = useState('Most Popular');
  const [filters, setFilters] = useState({
    conditions: [],
    brands: [],
    priceRange: [0, 20000000],
    processor: [],
    ram: [],
    storage: [],
    gpu: []
  });
  const [filteredDesktops, setFilteredDesktops] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const desktops = [
    {
      id: 1,
      name: 'Apple Mac Studio M2 Ultra',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 20000000,
      currentPrice: 16000000,
      rentPrice: 889000,
      currency: 'GNF',
      tags: ['New', 'Professional'],
      rating: 4.9,
      reviews: 450,
      brand: 'Apple',
      condition: 'New',
      processor: 'M2 Ultra',
      ram: '64GB',
      storage: '1TB SSD',
      gpu: 'M2 Ultra GPU'
    },
    {
      id: 2,
      name: 'Dell OptiPlex 7090',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 12000000,
      currentPrice: 9600000,
      rentPrice: 533000,
      currency: 'GNF',
      tags: ['Business', 'Reliable'],
      rating: 4.6,
      reviews: 320,
      brand: 'Dell',
      condition: 'New',
      processor: 'Intel i7-11700',
      ram: '32GB',
      storage: '1TB SSD',
      gpu: 'Intel UHD Graphics'
    },
    {
      id: 3,
      name: 'HP Pavilion Desktop',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 8000000,
      currentPrice: 6400000,
      rentPrice: 356000,
      currency: 'GNF',
      tags: ['Home', 'Affordable'],
      rating: 4.4,
      reviews: 280,
      brand: 'HP',
      condition: 'New',
      processor: 'AMD Ryzen 5',
      ram: '16GB',
      storage: '512GB SSD',
      gpu: 'AMD Radeon Graphics'
    },
    {
      id: 4,
      name: 'ASUS ROG Strix G15CE',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 15092000,
      currentPrice: 12000000,
      rentPrice: 667000,
      currency: 'GNF',
      tags: ['Gaming', 'RTX'],
      rating: 4.7,
      reviews: 520,
      brand: 'ASUS',
      condition: 'New',
      processor: 'Intel i7-12700F',
      ram: '32GB',
      storage: '1TB SSD',
      gpu: 'RTX 3070'
    },
    {
      id: 5,
      name: 'Lenovo ThinkCentre M920',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 10000000,
      currentPrice: 8000000,
      rentPrice: 444000,
      currency: 'GNF',
      tags: ['Business', 'Compact'],
      rating: 4.5,
      reviews: 380,
      brand: 'Lenovo',
      condition: 'New',
      processor: 'Intel i5-9500',
      ram: '16GB',
      storage: '512GB SSD',
      gpu: 'Intel UHD Graphics'
    },
    {
      id: 6,
      name: 'Custom Gaming PC Build',
      image: '/placeholder.svg?height=300&width=300',
      originalPrice: 18000000,
      currentPrice: 14400000,
      rentPrice: 800000,
      currency: 'GNF',
      tags: ['Custom', 'High-End'],
      rating: 4.8,
      reviews: 650,
      brand: 'Custom',
      condition: 'New',
      processor: 'AMD Ryzen 9 5900X',
      ram: '32GB',
      storage: '2TB SSD',
      gpu: 'RTX 4080'
    }
  ];

  useEffect(() => {
    let filtered = [...desktops];
    
    if (filters.conditions.length > 0) {
      filtered = filtered.filter((desktop) =>
        filters.conditions.includes(desktop.condition)
      );
    }
    if (filters.brands.length > 0) {
      filtered = filtered.filter((desktop) => filters.brands.includes(desktop.brand));
    }
    if (filters.processor.length > 0) {
      filtered = filtered.filter((desktop) => filters.processor.includes(desktop.processor));
    }
    if (filters.ram.length > 0) {
      filtered = filtered.filter((desktop) => filters.ram.includes(desktop.ram));
    }
    if (filters.storage.length > 0) {
      filtered = filtered.filter((desktop) => filters.storage.includes(desktop.storage));
    }
    if (filters.gpu.length > 0) {
      filtered = filtered.filter((desktop) => filters.gpu.includes(desktop.gpu));
    }
    
    filtered = filtered.filter(
      (desktop) =>
        desktop.currentPrice >= filters.priceRange[0] &&
        desktop.currentPrice <= filters.priceRange[1]
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
    setFilteredDesktops(filtered);
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
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
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
            <h3 className="text-lg font-semibold">Filters</h3>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          {/* Condition Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Condition</h4>
            {['New', 'Used'].map((condition) => (
              <label key={condition} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={filters.conditions.includes(condition)}
                  onChange={() => handleFilterChange('conditions', condition)}
                  className="mr-2 rounded border-gray-300 text-[#15803D] focus:ring-[#15803D]"
                />
                <span className="text-sm">{condition}</span>
              </label>
            ))}
          </div>

          {/* Brand Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Brand</h4>
            {['Apple', 'Dell', 'HP', 'ASUS', 'Lenovo', 'Custom'].map((brand) => (
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

          {/* Processor Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Processor</h4>
            {['M2 Ultra', 'Intel i7-11700', 'AMD Ryzen 5', 'Intel i7-12700F', 'Intel i5-9500', 'AMD Ryzen 9 5900X'].map((processor) => (
              <label key={processor} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={filters.processor.includes(processor)}
                  onChange={() => handleFilterChange('processor', processor)}
                  className="mr-2 rounded border-gray-300 text-[#15803D] focus:ring-[#15803D]"
                />
                <span className="text-sm">{processor}</span>
              </label>
            ))}
          </div>

          {/* RAM Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">RAM</h4>
            {['16GB', '32GB', '64GB'].map((ram) => (
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
            <h4 className="font-medium mb-3">Storage</h4>
            {['512GB SSD', '1TB SSD', '2TB SSD'].map((storage) => (
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

          {/* GPU Filter */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Graphics Card</h4>
            {['M2 Ultra GPU', 'Intel UHD Graphics', 'AMD Radeon Graphics', 'RTX 3070', 'RTX 4080'].map((gpu) => (
              <label key={gpu} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={filters.gpu.includes(gpu)}
                  onChange={() => handleFilterChange('gpu', gpu)}
                  className="mr-2 rounded border-gray-300 text-[#15803D] focus:ring-[#15803D]"
                />
                <span className="text-sm">{gpu}</span>
              </label>
            ))}
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h4 className="font-medium mb-3">Price Range</h4>
            <input
              type="range"
              min="0"
              max="20000000"
              step="100000"
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
            <h2 className="text-2xl font-bold text-gray-900">Desktop Computers</h2>
            <p className="text-gray-600">{filteredDesktops.length} desktops found</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>
            
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Most Popular">Most Popular</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="Newest First">Newest First</option>
                <option value="Best Rating">Best Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredDesktops.map((desktop) => (
            <Link
              key={desktop.id}
              to={`/shop/product/${desktop.id}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="p-4">
                <div className="relative mb-4">
                  <div className="w-full h-48 overflow-hidden rounded-lg">
                    <img
                      src={`https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=300&h=300&fit=crop&auto=format`}
                      alt={desktop.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {desktop.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 text-xs rounded-full ${
                          tag === 'New' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900">{desktop.name}</h3>
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">{renderStars(desktop.rating)}</div>
                    <span className="text-xs sm:text-sm text-gray-600">({desktop.reviews})</span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg sm:text-xl font-bold text-gray-900">
                      {formatPrice(desktop.currentPrice)}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Rent: <span className="font-medium">{formatPrice(desktop.rentPrice)}</span> /month
                    </div>
                  </div>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors text-sm sm:text-base">
                    Add to Cart
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredDesktops.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No desktops found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopStore;
