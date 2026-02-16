import React from 'react';
import { Link } from 'react-router-dom';
import { FaFire } from 'react-icons/fa';
import PriceDisplay from './PriceDisplay';

const ShopProductCard = ({ product, onAddToCart }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 flex flex-col h-full overflow-hidden p-3">
            <Link to={`/shop/product/${product.id}`} className="block relative">
                <div className="w-full h-48 overflow-hidden bg-gray-100 rounded-xl">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Sale Badge */}
                {product.isOnSale && (
                    <div className="absolute top-3 right-3 bg-[#FF4D4F] text-white px-2 py-1 rounded-full text-xs font-bold flex items-center shadow-sm">
                        <FaFire className="mr-1" />
                        -{product.discountPercent}%
                    </div>
                )}

                {/* Vendor Overlay (Visual placeholder based on image)
            If we don't have vendor data, we might skip or put a placeholder
            The user image showed an overlay. We'll leave it out for now unless we have data, 
            or maybe add if 'vendor' exists in product.
         */}
            </Link>

            <div className="pt-3 px-1 flex flex-col flex-grow">
                {/* Title */}
                <Link to={`/shop/product/${product.id}`} className="block">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{product.name}</h3>
                </Link>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {product.tags && product.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 text-xs border border-gray-200 rounded text-gray-500 font-medium bg-white"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Prices */}
                <div className="mt-auto">
                    <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                        {product.originalPrice > product.currentPrice && (
                            <span className="text-gray-400 text-sm line-through decoration-gray-400">
                                <PriceDisplay amount={product.originalPrice} size="sm" showSecondary={false} variant="muted" />
                            </span>
                        )}
                        <span className="text-xl font-bold text-gray-900">
                            <PriceDisplay amount={product.currentPrice} size="xl" showSecondary={false} variant="default" />
                        </span>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 lg:border-none lg:pt-0">
                        <div className="text-sm text-gray-500">
                            <span className="text-gray-400">Rent</span> <span className="text-gray-900 font-semibold"><PriceDisplay amount={product.rentPrice} size="sm" showSecondary={false} /></span> <span className="text-gray-400">/month</span>
                        </div>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onAddToCart(product);
                            }}
                            className="bg-[#15803D] hover:bg-[#166534] text-white py-2 px-4 rounded-lg text-sm font-semibold transition-colors"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopProductCard;
