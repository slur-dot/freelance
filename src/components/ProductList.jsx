import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

// Import local images
import iphoneProduct from "../assets/iphoneProduct.jpg";
import laptop from "../assets/Laptop.jpg";
import mobile from "../assets/mobile.jpg";

import { useTranslation } from "react-i18next";
import { useCart } from "../contexts/CartContext";

// Local product data with translation keys or logic to translate
// Since this is outside the component, we might need to move it inside or translate it inside the component.
// For now, let's keep data structure but we will handle translation in the component mapping.
const productData = [
  {
    id: 1,
    name: "iPhone 14",
    condition: "New",
    badge: "Best Selling",
    originalPrice: 7920000,
    currentPrice: 6336000,
    monthlyPrice: 720,
    monthlyOriginal: 900
  },
  {
    id: 2,
    name: "MacBook Pro M2",
    condition: "New",
    badge: "Best Selling",
    originalPrice: 13200000,
    currentPrice: 10560000,
    monthlyPrice: 1200,
    monthlyOriginal: 1500
  },
  {
    id: 3,
    name: "Samsung Galaxy S23",
    condition: "Used",
    badge: null,
    originalPrice: 6160000,
    currentPrice: 4928000,
    monthlyPrice: 560,
    monthlyOriginal: 700
  }
];

// Map IDs to images
const imageMap = {
  1: iphoneProduct,
  2: laptop,
  3: mobile
};

const ProductList = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const updatedProducts = productData.map((product) => ({
      ...product,
      image: imageMap[product.id] || "/placeholder.svg"
    }));
    setProducts(updatedProducts);
  }, []);

  const handleAddToCart = (id) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      addToCart({
        ...product,
        // Make the cart context treat it properly
        price: product.currentPrice,
        category: "Featured"
      });
    }
  };

  return (
    <div className="w-full flex justify-center py-6 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl w-full">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              condition: product.condition === "New" ? t('home.product_list.new') : t('home.product_list.used'),
              badge: product.badge === "Best Selling" ? t('home.product_list.best_selling') : product.badge
            }}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
