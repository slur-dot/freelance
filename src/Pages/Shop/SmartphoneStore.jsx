import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFire } from 'react-icons/fa';
import { ProductService } from '../../services/productService';
import { useCart } from '../../contexts/CartContext';

const SmartphoneStore = () => {
  const { addToCart } = useCart();
  const [sortBy, setSortBy] = useState('Most Popular');
  const [filters, setFilters] = useState({
    conditions: [],
    brands: [],
    priceRange: [0, 8000000],
    availability: [],
    ratings: [],
  });
  const [filteredSmartphones, setFilteredSmartphones] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // 👈 Mobile filter toggle
  /* 
   * FETCHING REAL PRODUCTS FROM FIRESTORE 
   */
  const [smartphones, setSmartphones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductService.getProducts();

        // Filter for smartphones only if needed, or rely on collection filtering
        // For now, assume all products fetched are relevant or filter purely on frontend
        // Mapping firestore data to component shape if necessary
        const mapped = data.map(p => ({
          ...p,
          // enhance with defaults if missing
          currentPrice: p.currentPrice || p.price || 0,
          originalPrice: p.originalPrice || (p.price * 1.2), // fake original if missing
          tags: p.tags || ['New'],
          rating: p.rating || 5, // default rating
          reviews: p.reviews || 0,
          image: p.image || '/placeholder.svg'
        }));
        setSmartphones(mapped);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...smartphones];
    if (filters.conditions.length > 0) {
      filtered = filtered.filter((phone) =>
        filters.conditions.includes(phone.condition)
      );
    }
    if (filters.brands.length > 0) {
      filtered = filtered.filter((phone) => filters.brands.includes(phone.brand));
    }
    if (filters.availability.length > 0) {
      filtered = filtered.filter((phone) => filters.availability.includes(phone.availability));
    }
    if (filters.ratings.length > 0) {
      filtered = filtered.filter((phone) =>
        filters.ratings.some(rating => Math.floor(phone.rating) >= rating)
      );
    }
    filtered = filtered.filter(
      (phone) =>
        phone.currentPrice >= filters.priceRange[0] &&
        phone.currentPrice <= filters.priceRange[1]
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
    setFilteredSmartphones(filtered);
  }, [filters, sortBy]);

  const handleConditionChange = (condition) => {
    setFilters((prev) => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter((c) => c !== condition)
        : [...prev.conditions, condition],
    }));
  };

  const handleBrandChange = (brand) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  const handleAvailabilityChange = (availability) => {
    setFilters((prev) => ({
      ...prev,
      availability: prev.availability.includes(availability)
        ? prev.availability.filter((a) => a !== availability)
        : [...prev.availability, availability],
    }));
  };

  const handleRatingChange = (rating) => {
    setFilters((prev) => ({
      ...prev,
      ratings: prev.ratings.includes(rating)
        ? prev.ratings.filter((r) => r !== rating)
        : [...prev.ratings, rating],
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
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden flex justify-end mb-2">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
        >
          {isFilterOpen ? 'Close Filters' : 'Open Filters'}
        </button>
      </div>

      {/* Sidebar Filters */}
      <div
        className={`${isFilterOpen ? 'block' : 'hidden'} lg:block lg:w-64 flex-shrink-0`}
      >
        <div className="bg-[#E5E7EB] rounded-lg shadow-sm p-4 sm:p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-sm sm:text-base">Filters</h3>
          </div>
          <div>
            <h4 className="font-medium text-sm sm:text-base mb-3">Condition</h4>
            <div className="space-y-2">
              {['New', 'Used'].map((condition) => (
                <label key={condition} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.conditions.includes(condition)}
                    onChange={() => handleConditionChange(condition)}
                    className="rounded border-gray-300 text-[#15803D] focus:ring-[#15803D]"
                  />
                  <span className="ml-2 text-xs sm:text-sm text-gray-600">{condition}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-sm sm:text-base mb-3">Brand</h4>
            <div className="space-y-2">
              {['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Huawei', 'Oppo'].map((brand) => (
                <label key={brand} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    className="rounded border-gray-300 text-[#15803D] focus:ring-[#15803D]"
                  />
                  <span className="ml-2 text-xs sm:text-sm text-gray-600">{brand}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-sm sm:text-base mb-3">Availability</h4>
            <div className="space-y-2">
              {['Conakry', 'Global'].map((availability) => (
                <label key={availability} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.availability.includes(availability)}
                    onChange={() => handleAvailabilityChange(availability)}
                    className="rounded border-gray-300 text-[#15803D] focus:ring-[#15803D]"
                  />
                  <span className="ml-2 text-xs sm:text-sm text-gray-600">{availability}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-sm sm:text-base mb-3">Minimum Rating</h4>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <label key={rating} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.ratings.includes(rating)}
                    onChange={() => handleRatingChange(rating)}
                    className="rounded border-gray-300 text-[#15803D] focus:ring-[#15803D]"
                  />
                  <span className="ml-2 text-xs sm:text-sm text-gray-600">
                    {rating} star{rating > 1 ? 's' : ''} & up
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-sm sm:text-base mb-3">Price Range</h4>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="8000000"
                value={filters.priceRange[1]}
                onChange={handlePriceRangeChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                <span>0 GNF</span>
                <span>{filters.priceRange[1].toLocaleString()} GNF</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Smartphones</h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Showing {filteredSmartphones.length} of {smartphones.length} Products
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs sm:text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>Most Popular</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
              <option>Best Rating</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredSmartphones.map((phone) => (
            <Link
              key={phone.id}
              to={`/shop/product/${phone.id}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="p-4">
                <div className="relative mb-4">
                  <div className="w-full h-48 overflow-hidden rounded-lg">
                    <img
                      src={ShopAppleImage}
                      alt={phone.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Sale Badge */}
                  {phone.isOnSale && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <FaFire className="mr-1" />
                      -{phone.discountPercent}%
                    </div>
                  )}

                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    {phone.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 text-xs rounded-full ${tag === 'New' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                          }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-900">{phone.name}</h3>
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center">{renderStars(phone.rating)}</div>
                    <span className="text-xs sm:text-sm text-gray-600">({phone.reviews})</span>
                  </div>
                  <div className="space-y-1">
                    {phone.isOnSale && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs sm:text-sm text-gray-500 line-through">
                          <PriceDisplay amount={phone.originalPrice} size="small" variant="muted" />
                        </span>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          Save {Math.round((phone.originalPrice - phone.currentPrice) / 100000) / 10}M GNF
                        </span>
                      </div>
                    )}
                    <div className="text-lg sm:text-xl font-bold text-gray-900">
                      <PriceDisplay amount={phone.currentPrice} size="xl" variant="bold" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="text-xs sm:text-sm text-gray-600">
                        Rent: <span className="font-medium"><PriceDisplay amount={phone.rentPrice} size="small" showSecondary={false} /></span> /month
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(phone);
                          alert("Added to cart!");
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors text-sm sm:text-base"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 sm:mt-8 md:mt-12">
          <div className="flex space-x-2">
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed text-xs sm:text-sm">
              Previous
            </button>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm">1</button>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm">2</button>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm">3</button>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SmartphoneStore;
