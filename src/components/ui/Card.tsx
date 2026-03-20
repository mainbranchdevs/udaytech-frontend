import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import type { ProductListItem } from '../../types';

interface CardProps {
  product: ProductListItem;
  wishlisted?: boolean;
  onWishlist?: (id: string) => void;
}

export default function Card({ product, wishlisted = false, onWishlist }: CardProps) {
  const price = product.discount_price ?? product.base_price;
  const discountPct = product.discount_price
    ? Math.round(((product.base_price - product.discount_price) / product.base_price) * 100)
    : 0;

  return (
    <div className="relative bg-white rounded-xl overflow-hidden card-hover shadow-sm border border-gray-100 group">
      {/* Discount badge */}
      {discountPct > 0 && (
        <span className="absolute top-2 left-2 z-10 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
          {discountPct}% OFF
        </span>
      )}

      {/* Wishlist button */}
      {onWishlist && (
        <button
          onClick={(e) => { e.preventDefault(); onWishlist(product.id); }}
          className="absolute top-2 right-2 z-10 p-1.5 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Wishlist"
        >
          {wishlisted
            ? <HeartSolidIcon className="h-4 w-4 text-red-500" />
            : <HeartIcon className="h-4 w-4 text-gray-400" />}
        </button>
      )}

      <Link to={`/products/${product.id}`} className="block">
        {/* Image */}
        <div className="aspect-square bg-gray-50 overflow-hidden">
          {product.primary_image ? (
            <img
              src={product.primary_image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No image</div>
          )}
        </div>

        {/* Info */}
        <div className="p-2.5">
          <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug">{product.name}</p>
          <div className="mt-1.5 flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm font-bold text-gray-900">₹{price.toLocaleString('en-IN')}</span>
            {product.discount_price && (
              <span className="text-xs text-gray-400 line-through">₹{product.base_price.toLocaleString('en-IN')}</span>
            )}
          </div>
          {discountPct > 0 && (
            <p className="text-[11px] font-semibold text-green-600 mt-0.5">{discountPct}% off</p>
          )}
        </div>
      </Link>
    </div>
  );
}
