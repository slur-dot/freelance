import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Loader2, ShoppingCart } from 'lucide-react';
import { ProductService } from '../../services/productService';
import { useCart } from '../../contexts/CartContext';
import PriceDisplay from '../../components/PriceDisplay';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;
    ProductService.getProductById(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="animate-spin w-10 h-10 text-green-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24">
        <p className="text-gray-600 mb-4">Product not found.</p>
        <Link to="/shop" className="text-green-600 hover:underline">Back to shop</Link>
      </div>
    );
  }

  const name = product.name || product.productName;
  const price = Number(product.price || product.currentPrice || 0);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name,
      price,
      currentPrice: price,
      image: product.imageUrl || product.image,
      quantity,
      sellerId: product.sellerId || null,
    });
    navigate('/shop/cart');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <img
          src={product.imageUrl || product.image || '/placeholder.svg?height=400&width=400'}
          alt={name}
          className="w-full rounded-xl object-cover max-h-[400px]"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{name}</h1>
          <p className="text-gray-600 mb-4">{product.category}</p>
          <div className="text-2xl font-semibold text-green-700 mb-4">
            <PriceDisplay amount={price} />
          </div>
          <p className="text-gray-700 mb-6">{product.description || 'No description available.'}</p>
          <div className="flex items-center gap-4 mb-6">
            <label className="text-sm font-medium">Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="border rounded-lg px-3 py-2 w-20"
            />
          </div>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
