import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useTranslation } from "react-i18next";
import { useCart } from "../contexts/CartContext";
import { ProductService } from "../services/productService";

const ProductList = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await ProductService.getProducts();
        // Just take the first 3 products for the preview
        setProducts(fetchedProducts.slice(0, 3));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const handleAddToCart = (id) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      addToCart({
        ...product,
        price: product.currentPrice || product.price,
        category: "Featured"
      });
    }
  };

  if (loading) {
    return <div className="w-full flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
  }

  if (products.length === 0) {
    return <div className="w-full text-center py-10 text-gray-500">No products available at the moment.</div>;
  }

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
