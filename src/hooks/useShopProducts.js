import { useEffect, useState } from 'react';
import { ProductService } from '../services/productService';

/** Load Firestore products for a shop category; maps to ShopProductCard shape. */
export function useShopProducts(category) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const raw = category
          ? await ProductService.getProductsByCategory(category)
          : await ProductService.getProducts();
        if (cancelled) return;
        const mapped = raw.map((p) => ({
          id: p.id,
          name: p.name || p.productName || 'Product',
          image: p.imageUrl || p.image || '/placeholder.svg?height=300&width=300',
          originalPrice: p.originalPrice || p.price || 0,
          currentPrice: p.price || p.currentPrice || 0,
          rentPrice: p.rentPrice,
          currency: p.currency || 'GNF',
          tags: p.tags || (p.listed ? ['Listed'] : []),
          rating: p.rating || 0,
          reviews: p.reviews || 0,
          brand: p.brand || p.category || '',
          condition: p.condition || 'New',
          isOnSale: p.isOnSale || false,
          discountPercent: p.discountPercent,
          sellerId: p.sellerId,
        }));
        setProducts(mapped);
      } catch (e) {
        console.error(e);
        setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [category]);

  return { products, loading };
}
