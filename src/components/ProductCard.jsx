import React from "react";

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="border rounded-lg shadow-md overflow-hidden">
      <img src={product.image} alt={product.name} className="w-full h-30 object-cover" />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-sm text-gray-500">{product.condition}</p>
        {product.badge && (
          <span className="inline-block mt-1 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
            {product.badge}
          </span>
        )}
        <div className="mt-2">
          <p className="text-red-500 line-through">{product.originalPrice}</p>
          <p className="text-green-600 font-bold">{product.currentPrice}</p>
          <p className="text-sm text-gray-500">
            {product.monthlyOriginal} → {product.monthlyPrice} /mo
          </p>
        </div>
        <button
          onClick={() => onAddToCart(product.id)}
          className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
