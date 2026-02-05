import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

// Import local images
import iphoneProduct from "../assets/iphoneProduct.jpg";
import laptop from "../assets/Laptop.jpg";
import mobile from "../assets/mobile.jpg";

// Local product data
const productData = [
  {
    id: 1,
    name: "iPhone 14",
    condition: "New",
    badge: "Best Selling",
    originalPrice: "7,920,000 GNF",
    currentPrice: "6,336,000 GNF",
    monthlyPrice: "$720",
    monthlyOriginal: "$900"
  },
  {
    id: 2,
    name: "MacBook Pro M2",
    condition: "New",
    badge: "Best Selling",
    originalPrice: "13,200,000 GNF",
    currentPrice: "10,560,000 GNF",
    monthlyPrice: "$1200",
    monthlyOriginal: "$1500"
  },
  {
    id: 3,
    name: "Samsung Galaxy S23",
    condition: "Used",
    badge: null,
    originalPrice: "6,160,000 GNF",
    currentPrice: "4,928,000 GNF",
    monthlyPrice: "$560",
    monthlyOriginal: "$700"
  }
];

// Map IDs to images
const imageMap = {
  1: iphoneProduct,
  2: laptop,
  3: mobile
};

const ProductList = () => {
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
    alert(`${product.name} added to cart.`);
  };

  return (
    <div className="w-full flex justify-center py-6 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl w-full">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
