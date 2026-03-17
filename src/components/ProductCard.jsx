import { useTranslation } from "react-i18next";

const ProductCard = ({ product, onAddToCart }) => {
  const { t } = useTranslation();
  return (
    <div className="border rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <div className="flex-grow">
          <p className="text-sm text-gray-500">{product.condition}</p>
          {product.badge && (
            <span className="inline-block mt-1 text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
              {product.badge}
            </span>
          )}
          <div className="mt-2">
            <p className="text-red-500 line-through">{product.originalPrice.toLocaleString()} GNF</p>
            <p className="text-green-600 font-bold">{product.currentPrice.toLocaleString()} GNF</p>
            <p className="text-sm text-gray-500">
              ${product.monthlyOriginal} → ${product.monthlyPrice} {t('shop.product.per_month')}
            </p>
          </div>
        </div>
        <button
          onClick={() => onAddToCart(product.id)}
          className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 mt-auto"
        >
          {t('shop.product.add_to_cart')}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
