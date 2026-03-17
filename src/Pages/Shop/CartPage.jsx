import React, { useState } from "react";
import { Minus, Plus, Trash2, ChevronRight } from "lucide-react";
import ShopAppleImage from "../../assets/ShopAppleImage.jpg";
import { useNavigate } from "react-router-dom";

import { useCart } from "../../contexts/CartContext";
import { useTranslation } from "react-i18next";

export default function CartPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cartItems, updateQuantity, removeFromCart, subtotal } = useCart();

  const discount = 0; // Logic for discount can be added later
  const deliveryFee = cartItems.length > 0 ? 15000 : 0; // Example delivery fee
  const total = subtotal > 0 ? subtotal - discount + deliveryFee : 0;

  const formatPrice = (price) => {
    return (price || 0).toLocaleString() + " GNF";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center space-x-2 text-sm text-gray-600 mb-6 sm:mb-8">
          <span className="hover:text-gray-900 cursor-pointer">{t('home.title')}</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">{t('cart.breadcrumb')}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              {t('cart.title')}
            </h1>

            {cartItems.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 divide-y">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`py-4 ${index !== 0 ? "pt-4" : ""
                      } flex flex-col sm:flex-row sm:items-center sm:space-x-4`}
                  >
                    {/* Image */}
                    <div className="w-full sm:w-28 h-40 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden mb-4 sm:mb-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t('cart.condition')} {item.condition}
                      </p>
                      <p className="text-sm text-gray-600">
                        {t('cart.category')} {item.category}
                      </p>
                      <p className="text-base sm:text-lg font-bold text-gray-900 mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-3 mt-4 sm:mt-0">
                      {/* Quantity */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="h-8 w-8 p-0 border rounded text-gray-600 hover:bg-gray-100"
                        >
                          <Minus className="h-4 w-4 mx-auto" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="h-8 w-8 p-0 border rounded text-gray-600 hover:bg-gray-100"
                        >
                          <Plus className="h-4 w-4 mx-auto" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded"
                      >
                        <Trash2 className="h-4 w-4 mx-auto" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty Cart */}
            {cartItems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('cart.empty_title')}
                </h3>
                <p className="text-gray-500">
                  {t('cart.empty_desc')}
                </p>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md sticky top-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                {t('cart.summary_title')}
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-gray-600">{t('cart.subtotal')}</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-gray-600">{t('cart.discount')} (-20%)</span>
                  <span className="font-medium text-red-500">
                    -{discount} GNF
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-gray-600">{t('cart.delivery_fee')}</span>
                  <span className="font-medium">{formatPrice(deliveryFee)}</span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between items-center text-base sm:text-lg font-bold">
                  <span>{t('cart.total')}</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                disabled={cartItems.length === 0}
                onClick={() => navigate("/shipping-details")}
                className="w-full mt-4 sm:mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex justify-center items-center transition-colors disabled:opacity-50"
              >
                {t('cart.checkout_btn')}
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
