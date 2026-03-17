import React, { useState } from "react";
import iphoneProduct from "../assets/iphoneProduct.jpg";
import mobile from "../assets/mobile.jpg";
import Laptop from "../assets/Laptop.jpg";
import { ArrowRight } from "lucide-react";
import ComputerBookingForm from "./ComputerRentalBooking/ComputerBookingForm";
import { useTranslation } from "react-i18next";

const ProductCard = ({ imageSrc, imageAlt, name, price, discountText, onBuy, buyBtnText }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-md overflow-hidden flex flex-col border border-gray-400">
      <div className="relative w-full h-40 sm:h-48 md:h-60">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="object-cover w-full h-full rounded-t-xl"
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{name}</h3>
        <p className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
          {price} <span className="text-sm font-normal text-gray-500">{discountText}</span>
        </p>
        <div className="mt-auto">
          <button
            onClick={() => onBuy(name)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
          >
            {buyBtnText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function CorporateSalesProduct() {
  const { t } = useTranslation();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  const handleBuyNow = (productName) => {
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
      name: t('corporate_sales.sales.products.iphone14.name'),
      price: "6,336,000 GNF($1,200)",
      discountText: t('corporate_sales.sales.discount_text'),
    },
    {
      imageSrc: mobile,
      imageAlt: "Samsung Galaxy S23",
      name: t('corporate_sales.sales.products.s23.name'),
      price: "4,928,000 GNF($960)",
      discountText: t('corporate_sales.sales.discount_text'),
    },
  ];

  const laptops = [
    {
      imageSrc: Laptop,
      imageAlt: "MacBook Pro M2",
      name: t('corporate_sales.sales.products.macbook_pro.name'),
      price: "10,560,000 GNF($1,200)",
      discountText: t('corporate_sales.sales.discount_text'),
    },
    {
      imageSrc: Laptop,
      imageAlt: "Dell XPS 13",
      name: t('corporate_sales.sales.products.dell_xps.name'),
      price: "8,448,000 GNF($960)",
      discountText: t('corporate_sales.sales.discount_text'),
    },
  ];

  return (
    <div className="w-full">
      {showBookingForm ? (
        <div className="px-4 md:px-6 lg:px-8 max-w-screen-xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            {t('corporate_sales.sales.booking_title', { product: selectedProduct })}
          </h1>
          <ComputerBookingForm isCorporateSales={true} />
          <div className="mt-6">
            <button
              onClick={handleBackToProducts}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
            >
              {t('corporate_sales.sales.back_to_products')}
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 px-4 md:px-6 lg:px-8 max-w-screen-xl mx-auto">
            {t('corporate_sales.sales.title')}
          </h1>

          {/* Smartphones Section */}
          <section className="px-4 md:px-6 lg:px-8 mb-12 max-w-screen-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">{t('corporate_sales.sales.smartphones')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {smartphones.map((product) => (
                <ProductCard key={product.name} {...product} onBuy={handleBuyNow} buyBtnText={t('corporate_sales.sales.buy_now')} />
              ))}
            </div>
          </section>

          {/* Laptops Section */}
          <section className="px-4 md:px-6 lg:px-8 mb-12 max-w-screen-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              {t('corporate_sales.sales.laptops')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {laptops.map((product) => (
                <ProductCard key={product.name} {...product} onBuy={handleBuyNow} buyBtnText={t('corporate_sales.sales.buy_now')} />
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
                {t('corporate_sales.sales.cta.title')}
              </h2>
              <button
                onClick={() => handleBuyNow("Bulk Smartphone Order")}
                className="bg-[#228B22] hover:bg-[#1e7a1e] text-white px-8 py-3 rounded-full text-base sm:text-lg font-semibold flex items-center gap-2"
              >
                {t('corporate_sales.sales.cta.button')} <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
