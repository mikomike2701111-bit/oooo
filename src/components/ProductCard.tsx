import { useState } from 'react';
import { ShoppingBag, Heart } from 'lucide-react';
import { Product } from '../lib/supabase';
import { generateWhatsAppLink } from '../lib/whatsapp';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const [selectedSize, setSelectedSize] = useState<string>(availableSizes[0]);
  const [selectedColor, setSelectedColor] = useState<string>(product.color || '');
  const [isHovering, setIsHovering] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const originalPrice = 2400;
  const discountedPrice = 1200;

  const handleAddToCart = async () => {
    try {
      await addToCart(product, 1, selectedSize, selectedColor || product.color || '');
      alert('Added to cart!');
    } catch (error) {
      alert('Failed to add to cart');
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleWishlist(product);
    } catch (error) {
      console.error('Failed to update wishlist');
    }
  };

  const handleOrder = () => {
    const whatsappLink = generateWhatsAppLink(
      product.name,
      selectedSize,
      selectedColor || product.color || ''
    );
    window.open(whatsappLink, '_blank');
  };

  return (
    <div
      className="relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="aspect-square bg-gray-100 overflow-hidden relative">
        <img
          src={product.image_url || 'https://i.postimg.cc/FRkVjK26/316c4caea73bb89b04e80d7d08f6fa57.jpg'}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovering ? 'scale-110' : 'scale-100'
          }`}
        />

        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-5 h-5 ${
              isInWishlist(product.id)
                ? 'fill-red-500 text-red-500'
                : 'text-gray-700'
            }`}
          />
        </button>

        {isHovering && (
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent animate-fade-in flex flex-col justify-end p-4">
            <div className="text-white space-y-2">
              <h3 className="font-semibold text-lg line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-lg line-through text-gray-400">KSh {originalPrice.toLocaleString()}</span>
                <span className="text-xl font-bold">KSh {discountedPrice.toLocaleString()}</span>
                <span className="text-sm bg-red-500 text-white px-2 py-1 rounded">50% OFF</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-medium text-lg text-gray-900 line-clamp-2">
            {product.name}
          </h3>
          {product.color && (
            <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">
              {product.color}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg line-through text-gray-400">KSh {originalPrice.toLocaleString()}</span>
          <span className="text-xl font-bold text-red-600">KSh {discountedPrice.toLocaleString()}</span>
        </div>
        <div className="inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">50% OFF</div>

        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-900">Select Size:</p>
          <div className="flex gap-2 flex-wrap">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 text-sm font-medium border-2 rounded-lg transition-all ${
                  selectedSize === size
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 hover:border-gray-500'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={handleAddToCart}
            className="py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors rounded-full flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </button>
          <button
            onClick={handleOrder}
            className="py-3 bg-green-500 text-white font-medium hover:bg-green-600 transition-colors rounded-full"
          >
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
