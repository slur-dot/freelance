import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LaptopImage from "../assets/Laptop.jpg";
// Ideally import a printer image, falling back to LaptopImage or a placeholder if not available
// import PrinterImage from "../assets/Printer.jpg"; 

const ComputerRentalProducts = () => {
  const navigate = useNavigate();

  // Laptop Data with Weekly/Monthly pricing
  const products = [
    {
      id: 1,
      name: "Basic Laptop",
      weeklyPrice: "250,000 GNF",
      monthlyPrice: "900,000 GNF",
      image: LaptopImage,
      specs: "Core i5, 8GB RAM, 256GB SSD"
    },
    {
      id: 2,
      name: "Standard Laptop",
      weeklyPrice: "350,000 GNF",
      monthlyPrice: "1,200,000 GNF",
      image: LaptopImage,
      specs: "Core i7, 16GB RAM, 512GB SSD"
    },
    {
      id: 3,
      name: "Premium Laptop",
      weeklyPrice: "500,000 GNF",
      monthlyPrice: "1,800,000 GNF",
      image: LaptopImage,
      specs: "M1 MacBook Air / High-end Windows"
    },
  ];

  // Printer Data
  const printers = [
    {
      id: 101,
      name: "LaserJet Pro M404n",
      weeklyPrice: "150,000 GNF",
      monthlyPrice: "500,000 GNF",
      image: LaptopImage, // Placeholder, replace with actual printer image if available
      specs: "Monochrome Laser, Fast Printing"
    },
    {
      id: 102,
      name: "Color LaserJet Pro MFP",
      weeklyPrice: "250,000 GNF",
      monthlyPrice: "850,000 GNF",
      image: LaptopImage, // Placeholder
      specs: "Color, Scan, Copy, Print"
    },
    {
      id: 103,
      name: "High-Volume Office Printer",
      weeklyPrice: "400,000 GNF",
      monthlyPrice: "1,400,000 GNF",
      image: LaptopImage, // Placeholder
      specs: "Heavy Duty, Network Ready"
    }
  ];

  const handleBooking = (product) => {
    // Pass the product details to booking. 
    navigate("/computer-rental/booking", { state: { ...product } });
  };

  return (
    <div>
      {/* Full-Width Breadcrumb */}
      <div className="w-full border-b border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-20 py-2 sm:py-3 flex items-center text-xs sm:text-sm text-gray-500">
          <span className="cursor-pointer hover:text-green-600" onClick={() => navigate('/')}>Home</span>
          <span className="mx-1 sm:mx-2">{">"}</span>
          <span className="font-semibold text-gray-800">Computer Rentals</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-20 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">IT Equipment Rental</h1>
            <p className="text-gray-500 mt-1">Flexible rentals for your business needs</p>
          </div>
        </div>

        {/* Laptops Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-green-500 rounded-full"></span>
            Laptops & Workstations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white cursor-pointer flex flex-col"
                onClick={() => handleBooking(product)}
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold text-gray-700">
                    {product.specs}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 font-medium">Weekly</span>
                      <span className="text-green-600 font-bold text-lg">{product.weeklyPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">

                      <span className="text-sm text-gray-500 font-medium">Monthly</span>
                      <span className="text-green-600 font-bold text-lg">{product.monthlyPrice}</span>
                    </div>

                    <button
                      className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 px-4 text-sm font-medium transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBooking(product);
                      }}
                    >
                      Rent Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Printers Section */}
        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
            Printers & Scanners
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {printers.map((printer) => (
              <div
                key={printer.id}
                className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white cursor-pointer flex flex-col"
                onClick={() => handleBooking(printer)}
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {/* Using LaptopImage as placeholder if no PrinterImage */}
                  <img
                    src={printer.image}
                    alt={printer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold text-gray-700">
                    {printer.specs}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{printer.name}</h3>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 font-medium">Weekly</span>
                      <span className="text-blue-600 font-bold text-lg">{printer.weeklyPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 font-medium">Monthly</span>
                      <span className="text-blue-600 font-bold text-lg">{printer.monthlyPrice}</span>
                    </div>

                    <button
                      className="w-full mt-3 bg-gray-900 hover:bg-gray-800 text-white rounded-lg py-2 px-4 text-sm font-medium transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBooking(printer);
                      }}
                    >
                      Rent Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ComputerRentalProducts;
