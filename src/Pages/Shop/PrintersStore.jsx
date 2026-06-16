import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

import { ProductService } from '../../services/productService';

export default function PrintersStore() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [printers, setPrinters] = React.useState([]);

  React.useEffect(() => {
    const fetchPrinters = async () => {
      const data = await ProductService.getProductsByCategory('Printers');
      setPrinters(data || []);
    };
    fetchPrinters();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {printers.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
          <div className="relative h-48 bg-gray-100 flex items-center justify-center p-4">
            <img src={product.image} alt={product.name} className="max-h-full object-contain" />
            <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
              {product.condition}
            </span>
          </div>
          <div className="p-4 flex flex-col h-[200px]">
            <div className="text-xs text-gray-500 mb-1">{product.brand}</div>
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 min-h-[40px]">{product.name}</h3>
            
            <div className="mt-auto">
              {/* Added Vendor Link functionality */}
              <button onClick={() => navigate('/vendor-profiles')} className="text-xs text-blue-600 hover:underline mb-2 block text-left w-full">
                Sold by: {product.vendor}
              </button>
              
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">{product.price.toLocaleString()} GNF</span>
                <button
                  onClick={() => addToCart({
                      id: product.id,
                      name: product.name,
                      currentPrice: product.price,
                      image: product.image,
                      vendor: product.vendor
                  })}
                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
