import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import type { ProductListItem } from '../../types';

interface CardProps {
  product: ProductListItem;
  wishlisted?: boolean;
  onWishlist?: (id: string) => void;
  onAddToCart?: (product: ProductListItem) => void;
}

export default function Card({ product, wishlisted = false, onWishlist, onAddToCart }: CardProps) {
  const price = product.discount_price ?? product.base_price;
  const savings = product.discount_price
    ? product.base_price - product.discount_price
    : 0;

  return (
    <div
      className="relative overflow-hidden flex flex-col"
      style={{
        background: 'var(--surface-card)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
    >
      {savings > 0 && (
        <span
          className="absolute top-2 left-2 z-10 text-white text-[10px] font-bold px-2 py-0.5"
          style={{ background: 'var(--accent-500)', borderRadius: 'var(--radius-sm)' }}
        >
          ₹{savings.toLocaleString('en-IN')} OFF
        </span>
      )}

      {onWishlist && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onWishlist(product.id); }}
          className="absolute top-2 right-2 z-10 p-1.5 rounded-full"
          style={{ background: 'var(--surface-card)', boxShadow: 'var(--shadow-sm)' }}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlisted
            ? <HeartSolidIcon className="h-4 w-4" style={{ color: 'var(--danger)' }} />
            : <HeartIcon className="h-4 w-4" style={{ color: 'var(--text-tertiary)' }} />}
        </button>
      )}

      <Link to={`/products/${product.id}`} className="block flex-1">
        <div className="aspect-[4/5] overflow-hidden" style={{ background: 'var(--surface-sunken)' }}>
          {product.primary_image ? (
            <img
              src={product.primary_image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
              No image
            </div>
          )}
        </div>

        <div className="p-3">
          <p
            className="line-clamp-2"
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
              color: 'var(--text-primary)',
              lineHeight: 'var(--leading-snug)',
            }}
          >
            {product.name}
          </p>

          {product.category_id && (
            <p className="mt-0.5" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              Category
            </p>
          )}

          <div className="mt-1.5 flex items-baseline gap-1.5 flex-wrap">
            <span style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)' }}>
              ₹{price.toLocaleString('en-IN')}
            </span>
            {product.discount_price && (
              <span className="line-through" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                ₹{product.base_price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="mt-1 flex items-center gap-1" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            <span style={{ color: 'var(--accent-400)' }}>★</span>
            <span>4.2 (128)</span>
            <span className="mx-1">·</span>
            <span>Free Install</span>
          </div>
        </div>
      </Link>

      {onAddToCart && (
        <div className="px-3 pb-3">
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToCart(product); }}
            className="w-full flex items-center justify-center gap-1.5 py-2 transition-colors"
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: 'var(--text-xs)',
              color: 'var(--brand-600)',
              background: 'transparent',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--brand-600)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--brand-50)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            <ShoppingCartIcon className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}
