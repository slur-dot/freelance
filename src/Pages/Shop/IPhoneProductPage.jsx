import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ShopAppleImage from "../../assets/ShopAppleImage.jpg";
import IphoneImage from "../../assets/iphone.png";
import MobileImage from "../../assets/mobile.jpg";

export default function IPhoneProductPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Currency state
  const [currency, setCurrency] = useState("GNF");

  // Base price in GNF
  const priceGNF = 1000000;
  const exchangeRate = 0.00012; // Example: 1 GNF = 0.00012 USD

  const convertPrice = (value, currency) => {
    return currency === "USD"
      ? (value * exchangeRate).toFixed(2)
      : value.toLocaleString();
  };

  // Flip state
  const [flipped, setFlipped] = useState(false);

  // Image carousel
  const images = [ShopAppleImage, IphoneImage, MobileImage];
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Reviews (load from localStorage or default)
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem("reviews");
    return saved
      ? JSON.parse(saved)
      : [
        {
          name: "Emily Lewis",
          location: t('locations.conakry'),
          rating: 5,
          comment: t('shop.product.default_review_comment'),
          image: null,
        },
      ];
  });

  // Persist reviews in localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  // New review form state
  const [reviewText, setReviewText] = useState("");
  const [reviewImage, setReviewImage] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewName, setReviewName] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setReviewImage(reader.result); // store as base64 string
    };
    reader.readAsDataURL(file);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim() || !reviewName.trim()) return; // Require both

    const newReview = {
      name: reviewName,
      location: t('locations.conakry'),
      rating,
      comment: reviewText,
      image: reviewImage,
    };

    setReviews([newReview, ...reviews]);

    setReviewName("");
    setReviewText("");
    setReviewImage(null);
    setRating(0);
  };

  // Color selection
  const [selectedColor, setSelectedColor] = useState("");
  const colors = ["midnight", "starlight", "blue", "purple", "yellow", "black", "white", "red"];

  // Serial number (seller side – simulated here)
  const [serialNumber, setSerialNumber] = useState("");

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex text-sm text-gray-500 flex-wrap">
            <span className="hover:text-gray-700 cursor-pointer">{t('home.title')}</span>
            <span className="mx-2">›</span>
            <span className="hover:text-gray-700 cursor-pointer">{t('shop.product.breadcrumb_shop')}</span>
            <span className="mx-2">›</span>
            <span className="text-gray-900">iPhone 14</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column (Details + Reviews) */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                {t('shop.product.iphone_14_title')}
              </h1>
              <p className="text-sm sm:text-base text-black">{t('shop.product.smartphone')}</p>
            </div>

            {/* Specifications */}
            <div className="bg-white">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                {t('shop.product.specifications')}
              </h2>
              <div>
                <div>
                  <h3 className="font-medium text-black mb-2">{t('shop.product.general')}</h3>
                  <div className="text-sm text-black space-y-1">
                    <p>{t('shop.product.model')}: iPhone 14</p>
                    <p>{t('shop.product.release_date')}: {t('shop.product.iphone_14_release')}</p>
                    <p>{t('shop.product.brand')}: Apple</p>
                    <p>{t('shop.product.os')}: iOS 16</p>
                    <p>
                      {t('shop.product.colors')}: {t('shop.product.color_names.midnight')}, {t('shop.product.color_names.starlight')}, {t('shop.product.color_names.blue')}, {t('shop.product.color_names.purple')}, (PRODUCT)RED,
                      {t('shop.product.color_names.yellow')}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-medium text-black mb-2">{t('shop.product.body_design')}</h3>
                  <div className="text-sm text-black space-y-1">
                    <p>{t('shop.product.dimensions')}: {t('shop.product.iphone_14_dimensions')}</p>
                    <p>{t('shop.product.weight')}: {t('shop.product.iphone_14_weight')}</p>
                    <p>
                      {t('shop.product.build')}: {t('shop.product.iphone_14_build_desc')}
                    </p>
                    <p>{t('shop.product.water_resistance')}: {t('shop.product.iphone_14_water_desc')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white">
              <h2 className="text-lg sm:text-xl font-semibold mb-5">
                {t('shop.product.availability')}
              </h2>
              <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0 items-start">
                <div className="bg-green-500 text-white px-3 py-1.5 rounded-md text-sm font-medium">
                  {t('shop.product.in_stock')}
                </div>
                <div className="bg-green-500 text-white px-3 py-1.5 rounded-md text-sm font-medium">
                  {t('shop.product.kyc_verified')}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">{t('shop.product.reviews')}</h2>
              <div className="space-y-4 mb-6">
                {reviews.map((review, index) => (
                  <div key={index} className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold overflow-hidden">
                        {review.image ? (
                          <img
                            src={review.image}
                            alt="Review"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          review.name.charAt(0)
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1 flex-wrap">
                          <h4 className="font-medium text-gray-900">
                            {review.name}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {review.location}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(review.rating)].map((_, i) => (
                            <FaStar
                              key={i}
                              className="w-4 h-4 text-yellow-400"
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 italic">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Review Form */}
              <form
                onSubmit={handleReviewSubmit}
                className="p-4 border rounded-lg space-y-3"
              >
                <h3 className="font-semibold">{t('shop.product.leave_review')}</h3>

                {/* Name Input */}
                <input
                  type="text"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder={t('shop.product.enter_name')}
                  className="w-full border rounded p-2 text-sm"
                  required
                />

                {/* Rating */}
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`cursor-pointer ${rating >= star ? "text-yellow-400" : "text-gray-300"
                        }`}
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder={t('shop.product.write_review')}
                  className="w-full border rounded p-2 text-sm"
                  required
                />

                {/* Image Upload */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm"
                />

                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  {t('shop.product.submit_review')}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Flip Card + Price + Options */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            {/* Flip Card */}
            <div
              className="relative w-full h-96 [perspective:1000px]"
              onClick={() => setFlipped(!flipped)}
              onMouseEnter={() => setFlipped(true)}
              onMouseLeave={() => setFlipped(false)}
            >
              <div
                className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${flipped ? "[transform:rotateY(180deg)]" : ""
                  }`}
              >
                {/* Front Side */}
                <div className="absolute inset-0 bg-white rounded-xl shadow-lg [backface-visibility:hidden] flex items-center justify-center">
                  <img
                    src={ShopAppleImage}
                    alt="iPhone 14"
                    className="w-full h-auto object-contain"
                  />
                </div>

                {/* Back Side */}
                <div className="absolute inset-0 bg-gray-900 text-white rounded-xl shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between p-4">
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <img
                      src={images[currentIndex]}
                      alt="iPhone Back"
                      className="w-60 h-auto rounded-lg object-contain"
                    />
                  </div>

                  {/* Image navigation */}
                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="p-2 bg-white/20 rounded-full hover:bg-white/40"
                    >
                      <ChevronLeft />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="p-2 bg-white/20 rounded-full hover:bg-white/40"
                    >
                      <ChevronRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Price + Buy Button + Options */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-green-50 to-blue-50 mt-4 rounded-lg shadow space-y-4">
              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('shop.product.choose_color')} <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1 rounded border ${selectedColor === color
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700"
                        }`}
                    >
                      {t('shop.product.color_names.' + color)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Serial Number - Hidden from public view */}
              {/* This will be shown only to vendors in their dashboard and buyers on invoice */}

              {/* Price */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {convertPrice(priceGNF, currency)} {currency}
                  </div>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="mt-2 border rounded-md px-3 py-1 text-sm"
                  >
                    <option value="GNF">GNF</option>
                    <option value="USD">USD</option>
                  </select>
                </div>

                <button
                  disabled={!selectedColor}
                  onClick={() => navigate("/shop/cart")}
                  className={`${!selectedColor
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                    } text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto`}
                >
                  <span>{t('shop.product.buy_now')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
