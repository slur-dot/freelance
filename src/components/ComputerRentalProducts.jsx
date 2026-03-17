import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import LaptopImage from "../assets/Laptop.jpg";
// Ideally import a printer image, falling back to LaptopImage or a placeholder if not available
// import PrinterImage from "../assets/Printer.jpg"; 
import { useTranslation } from "react-i18next";

const ComputerRentalProducts = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Laptop Data with additional properties
  const computers = [
    {
      id: 1,
      name: t('computer_rental.products.items.basic_laptop.name'),
      deviceType: 'laptop',
      brand: 'HP',
      category: 'Computers',
      subCategory: 'Laptops',
      priceValue: 250000,
      weeklyPrice: "250,000 GNF",
      monthlyPrice: "900,000 GNF",
      image: LaptopImage,
      specs: t('computer_rental.products.items.basic_laptop.specs')
    },
    {
      id: 2,
      name: t('computer_rental.products.items.standard_laptop.name'),
      deviceType: 'laptop',
      brand: 'Dell',
      category: 'Computers',
      subCategory: 'Laptops',
      priceValue: 350000,
      weeklyPrice: "350,000 GNF",
      monthlyPrice: "1,200,000 GNF",
      image: LaptopImage,
      specs: t('computer_rental.products.items.standard_laptop.specs')
    },
    {
      id: 3,
      name: t('computer_rental.products.items.premium_laptop.name'),
      deviceType: 'laptop',
      brand: 'Apple',
      category: 'Computers',
      subCategory: 'Laptops',
      priceValue: 500000,
      weeklyPrice: "500,000 GNF",
      monthlyPrice: "1,800,000 GNF",
      image: LaptopImage,
      specs: t('computer_rental.products.items.premium_laptop.specs')
    },
  ];

  // Printer Data
  const printers = [
    {
      id: 101,
      name: t('computer_rental.products.items.laserjet.name'),
      deviceType: 'printer',
      brand: 'HP',
      category: 'Printers',
      subCategory: 'Laser Printers',
      priceValue: 150000,
      weeklyPrice: "150,000 GNF",
      monthlyPrice: "500,000 GNF",
      image: LaptopImage, // Placeholder
      specs: t('computer_rental.products.items.laserjet.specs')
    },
    {
      id: 102,
      name: t('computer_rental.products.items.color_laserjet.name'),
      deviceType: 'printer',
      brand: 'Epson',
      category: 'Printers',
      subCategory: 'Laser Printers',
      priceValue: 250000,
      weeklyPrice: "250,000 GNF",
      monthlyPrice: "850,000 GNF",
      image: LaptopImage, // Placeholder
      specs: t('computer_rental.products.items.color_laserjet.specs')
    },
    {
      id: 103,
      name: t('computer_rental.products.items.office_printer.name'),
      deviceType: 'printer',
      brand: 'Canon',
      category: 'Printers',
      subCategory: 'Multifunction Printers',
      priceValue: 400000,
      weeklyPrice: "400,000 GNF",
      monthlyPrice: "1,400,000 GNF",
      image: LaptopImage, // Placeholder
      specs: t('computer_rental.products.items.office_printer.specs')
    }
  ];

  // Mobile Devices Data
  const mobileDevices = [
    {
      id: 201,
      name: 'Samsung Galaxy Tab S8',
      deviceType: 'tablet',
      brand: 'Samsung',
      category: 'Mobile Devices',
      subCategory: 'Tablets',
      priceValue: 100000,
      weeklyPrice: "100,000 GNF",
      monthlyPrice: "350,000 GNF",
      image: LaptopImage, // Placeholder
      specs: '11" Display, 128GB Storage'
    },
    {
      id: 202,
      name: 'iPhone 13 Pro',
      deviceType: 'phone',
      brand: 'Apple',
      category: 'Mobile Devices',
      subCategory: 'Smartphones',
      priceValue: 150000,
      weeklyPrice: "150,000 GNF",
      monthlyPrice: "500,000 GNF",
      image: LaptopImage, // Placeholder
      specs: '6.1" OLED, 128GB'
    }
  ];

  const allProducts = useMemo(() => [...computers, ...printers, ...mobileDevices], [t]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState(1000000);

  // Derived filter options
  const brands = useMemo(() => [...new Set(allProducts.map(p => p.brand))], [allProducts]);
  const categories = useMemo(() => [...new Set(allProducts.map(p => p.category))], [allProducts]);
  const subCategories = useMemo(() => {
    if (!selectedCategory) return [...new Set(allProducts.map(p => p.subCategory))];
    return [...new Set(allProducts.filter(p => p.category === selectedCategory).map(p => p.subCategory))];
  }, [allProducts, selectedCategory]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter(product => {
      const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchBrand = selectedBrand ? product.brand === selectedBrand : true;
      const matchCategory = selectedCategory ? product.category === selectedCategory : true;
      const matchSubCategory = selectedSubCategory ? product.subCategory === selectedSubCategory : true;
      const matchPrice = product.priceValue <= maxPrice;
      
      return matchSearch && matchBrand && matchCategory && matchSubCategory && matchPrice;
    });
  }, [allProducts, searchQuery, selectedBrand, selectedCategory, selectedSubCategory, maxPrice]);

  const handleBooking = (product) => {
    // Pass the product details to booking. 
    navigate("/computer-rental/booking", { state: { ...product } });
  };

  return (
    <div id="rental-products" className="scroll-mt-20">
      {/* Full-Width Breadcrumb */}
      <div className="w-full border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-20 py-2 sm:py-3 flex items-center text-xs sm:text-sm text-gray-500">
          <span className="cursor-pointer hover:text-green-600" onClick={() => navigate('/')}>{t('computer_rental.products.breadcrumbs.home')}</span>
          <span className="mx-1 sm:mx-2">{">"}</span>
          <span className="font-semibold text-gray-800">{t('computer_rental.products.breadcrumbs.computer_rentals')}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-20 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{t('computer_rental.products.header.title')}</h1>
            <p className="text-gray-500 mt-1">{t('computer_rental.products.header.subtitle')}</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by product or brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedSubCategory(""); // Reset sub-category on category change
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sub-Category Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Sub-type</label>
              <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                disabled={!selectedCategory && subCategories.length === 0}
              >
                <option value="">All Sub-types</option>
                {subCategories.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            {/* Brand Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Brands</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Price Filter Slider */}
            <div className="lg:col-span-5 pt-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Max Price (Weekly): {maxPrice.toLocaleString()} GNF
              </label>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-400">0 GNF</span>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="50000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <span className="text-sm font-medium text-gray-400">1,000,000+ GNF</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtered Products Grid */}
        <div className="mb-12">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="text-lg font-bold text-gray-700">No products found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedBrand("");
                  setSelectedCategory("");
                  setSelectedSubCategory("");
                  setMaxPrice(1000000);
                }}
                className="mt-4 text-green-600 hover:text-green-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all bg-white cursor-pointer flex flex-col hover:-translate-y-1"
                  onClick={() => handleBooking(product)}
                >
                  <div className="relative h-48 overflow-hidden bg-white p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <span className="bg-gray-900/80 backdrop-blur px-2 py-1 rounded text-xs font-semibold text-white w-fit">
                        {product.brand}
                      </span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-white/90 shadow backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                      {product.subCategory}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow bg-gray-50/50 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">{product.name}</h3>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2">{product.specs}</p>

                    <div className="mt-auto flex flex-col gap-3">
                      <div className="flex justify-between items-end bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('computer_rental.products.labels.weekly')}</span>
                          <span className="text-green-600 font-bold text-lg leading-none mt-1">{product.weeklyPrice}</span>
                        </div>
                        <div className="w-px h-8 bg-gray-100 mx-2"></div>
                        <div className="flex flex-col items-end">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t('computer_rental.products.labels.monthly')}</span>
                          <span className="text-gray-700 font-bold text-sm leading-none mt-1">{product.monthlyPrice}</span>
                        </div>
                      </div>

                      <button
                        className="w-full bg-gray-900 hover:bg-green-600 text-white rounded-lg py-2.5 px-4 text-sm font-bold transition-colors flex justify-center items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBooking(product);
                        }}
                      >
                        {t('computer_rental.products.labels.rent_now')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ComputerRentalProducts;
