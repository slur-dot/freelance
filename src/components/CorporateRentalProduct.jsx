import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Users, Clock } from "lucide-react";
import iphoneProduct from "../assets/iphoneProduct.jpg";
import mobile from "../assets/mobile.jpg";
import Laptop from "../assets/Laptop.jpg";
import ComputerBookingForm from "./ComputerRentalBooking/ComputerBookingForm";

const RentalCard = ({ imageSrc, imageAlt, name, hourlyRate, dailyRate, monthlyRate, onRent }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden flex flex-col border border-gray-300 hover:border-green-600 transition-all duration-300 hover:shadow-lg">
      <div className="relative w-full h-40 sm:h-48 md:h-60">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="object-cover w-full h-full rounded-t-xl"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{name}</h3>
        
        {/* Pricing Table */}
        <div className="space-y-3 mb-6">
          {hourlyRate && (
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-600 transition-colors">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Hourly</span>
              </div>
              <span className="font-bold text-green-600">{hourlyRate}</span>
            </div>
          )}
          
          {dailyRate && (
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-600 transition-colors">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Daily</span>
              </div>
              <span className="font-bold text-green-600">{dailyRate}</span>
            </div>
          )}
          
          {monthlyRate && (
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-green-600 transition-colors">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Monthly</span>
              </div>
              <span className="font-bold text-green-600">{monthlyRate}</span>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <button
            onClick={() => onRent(name)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Rent Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CorporateRentalProduct() {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  const handleRentNow = (productName) => {
    setSelectedProduct(productName);
    setShowBookingForm(true);
  };

  const handleBackToProducts = () => {
    setShowBookingForm(false);
  };

  const smartphones = [
    {
      imageSrc: iphoneProduct,
      imageAlt: "iPhone 14",
      name: "iPhone 14",
      hourlyRate: "17,600 GNF ($2)",
      dailyRate: "132,000 GNF ($15)",
      monthlyRate: null,
    },
    {
      imageSrc: mobile,
      imageAlt: "Samsung Galaxy S23",
      name: "Samsung Galaxy S23",
      hourlyRate: "13,200 GNF ($1.5)",
      dailyRate: "105,600 GNF ($12)",
      monthlyRate: null,
    },
  ];

  const laptops = [
    {
      imageSrc: Laptop,
      imageAlt: "Basic Laptop",
      name: "Basic Laptop",
      hourlyRate: "8,800 GNF ($1)",
      dailyRate: null,
      monthlyRate: "440,000 GNF ($50)",
    },
    {
      imageSrc: Laptop,
      imageAlt: "Premium Laptop",
      name: "Premium Laptop",
      hourlyRate: "17,600 GNF ($2)",
      dailyRate: null,
      monthlyRate: "704,000 GNF ($80)",
    },
  ];

  return (
    <div className="w-full">
      {showBookingForm ? (
        <div className="px-4 md:px-6 lg:px-8 max-w-screen-xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            Rental Booking for: {selectedProduct}
          </h1>
          <ComputerBookingForm />
          <div className="mt-6">
            <button
              onClick={handleBackToProducts}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
            >
              Back to Rental Options
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 px-4 md:px-6 lg:px-8 max-w-screen-xl mx-auto">
            Rental Options
          </h1>

          {/* Smartphones Section */}
          <section className="px-4 md:px-6 lg:px-8 mb-12 max-w-screen-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Smartphones</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {smartphones.map((product) => (
                <RentalCard key={product.name} {...product} onRent={handleRentNow} />
              ))}
            </div>
          </section>

          {/* Laptops Section */}
          <section className="px-4 md:px-6 lg:px-8 mb-12 max-w-screen-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Laptops
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {laptops.map((product) => (
                <RentalCard key={product.name} {...product} onRent={handleRentNow} />
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative bg-[#1e4a4a] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-lg w-full mt-20">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-[#2a6060] rounded-full opacity-20 blur-3xl" />
                <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-[#2a6060] rounded-full opacity-20 blur-3xl" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#2a6060] rounded-full opacity-10 blur-3xl" />
                    </div>
          
                    <div className="relative z-10 flex flex-col items-center justify-center text-center max-w-screen-xl mx-auto">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8">
                          Buy 10 smartphones for your education project
                        </h2>
                        <button
                          onClick={() => handleBuyNow("Bulk Smartphone Order")}
                          className="bg-[#228B22] hover:bg-[#1e7a1e] text-white px-8 py-3 rounded-full text-base sm:text-lg font-semibold flex items-center gap-2"
                        >
                          Buy Now <ArrowRight className="h-5 w-5" />
                        </button>
                      </div>
                    </section>
          
        </>
      )}
    </div>
  );
}
