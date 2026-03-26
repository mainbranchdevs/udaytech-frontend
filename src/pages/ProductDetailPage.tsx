import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { HeartIcon, ShoppingCartIcon, TruckIcon, ShieldCheckIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { addToWishlist, getProduct } from '../api/endpoints';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id!).then((r) => r.data),
    enabled: !!id,
  });

  const addWishlistMutation = useMutation({
    mutationFn: (productId: string) => addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      setWishlisted(true);
      toast('Added to wishlist', 'success');
    },
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  if (!product) return (
    <div className="text-center py-20" style={{ color: 'var(--text-secondary)' }}>Product not found</div>
  );

  const price = product.discount_price ?? product.base_price;
  const savings = product.discount_price ? product.base_price - product.discount_price : 0;
  const images = product.images.length
    ? product.images
    : [{ id: 'placeholder', image_url: '', display_order: 0, is_primary: true }];

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price,
      image: images[0]?.image_url || null,
    });
    toast(`${product.name} added to cart`, 'success');
  };

  return (
    <div className="pb-28">
      {/* Image Gallery */}
      <div style={{ background: 'var(--surface-card)' }}>
        <div className="aspect-[4/5] overflow-hidden relative" style={{ background: 'var(--surface-sunken)' }}>
          {images[selectedImage]?.image_url ? (
            <img
              src={images[selectedImage].image_url}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--text-tertiary)' }}>
              No image
            </div>
          )}

          {savings > 0 && (
            <span
              className="absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-1"
              style={{ background: 'var(--accent-500)', borderRadius: 'var(--radius-sm)' }}
            >
              ₹{savings.toLocaleString('en-IN')} OFF
            </span>
          )}

          <button
            onClick={() => isAuthenticated ? addWishlistMutation.mutate(product.id) : navigate('/login')}
            className="absolute top-3 right-3 p-2"
            style={{
              background: 'var(--surface-card)',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-sm)',
            }}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {wishlisted
              ? <HeartSolid className="h-5 w-5" style={{ color: 'var(--danger)' }} />
              : <HeartIcon className="h-5 w-5" style={{ color: 'var(--text-tertiary)' }} />}
          </button>
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 px-3 py-2 overflow-x-auto no-scrollbar">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(i)}
                className="shrink-0 h-14 w-14 overflow-hidden transition-all"
                style={{
                  borderRadius: 'var(--radius-md)',
                  border: i === selectedImage ? '2px solid var(--brand-500)' : '2px solid var(--border-default)',
                }}
              >
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {images.length > 1 && (
          <div className="flex justify-center gap-1.5 pb-3">
            {images.map((_, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === selectedImage ? '16px' : '6px',
                  background: i === selectedImage ? 'var(--brand-500)' : 'var(--border-default)',
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="mt-2 px-4 py-4" style={{ background: 'var(--surface-card)' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--text-primary)', lineHeight: 'var(--leading-snug)' }}>
          {product.name}
        </h1>

        <div className="flex items-baseline gap-2 mt-2 flex-wrap">
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-2xl)', color: 'var(--text-primary)' }}>
            ₹{price.toLocaleString('en-IN')}
          </span>
          {product.discount_price && (
            <>
              <span className="line-through" style={{ fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)' }}>
                ₹{product.base_price.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--accent-500)' }}>
                Save ₹{savings.toLocaleString('en-IN')}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 mt-1" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          <span style={{ color: 'var(--accent-400)' }}>★</span>
          <span>4.2 (128 ratings)</span>
        </div>

        {/* Trust badges */}
        <div className="flex gap-4 mt-4 py-3" style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-1.5" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            <TruckIcon className="h-4 w-4" style={{ color: 'var(--success)' }} />
            Free Delivery
          </div>
          <div className="flex items-center gap-1.5" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
            <ShieldCheckIcon className="h-4 w-4" style={{ color: 'var(--brand-500)' }} />
            Genuine Product
          </div>
        </div>

        {/* Highlights / Attributes */}
        {product.attributes.length > 0 && (
          <div className="mt-4">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Highlights
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {product.attributes.map((a) => (
                <div
                  key={a.id}
                  className="px-3 py-2"
                  style={{ background: 'var(--surface-sunken)', borderRadius: 'var(--radius-sm)' }}
                >
                  <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--text-tertiary)', display: 'block' }}>
                    {a.attribute_name}
                  </span>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {a.attribute_value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {product.description && (
          <div className="mt-4">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--text-primary)', marginBottom: '4px' }}>
              Description
            </h3>
            <p
              className={descExpanded ? '' : 'line-clamp-3'}
              style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)' }}
            >
              {product.description}
            </p>
            {product.description.length > 150 && (
              <button
                onClick={() => setDescExpanded(!descExpanded)}
                style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--brand-600)', marginTop: '4px' }}
              >
                {descExpanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        )}

        {/* Installation badge */}
        <div
          className="flex items-center gap-2 mt-4 px-3 py-3"
          style={{
            background: 'var(--brand-50)',
            border: '1px solid var(--brand-200)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <WrenchScrewdriverIcon className="h-5 w-5 shrink-0" style={{ color: 'var(--brand-600)' }} />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--brand-700)' }}>
            Free professional installation included
          </span>
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div
        className="fixed bottom-16 inset-x-0 z-40 px-4 py-3 flex items-center gap-3"
        style={{
          background: 'var(--surface-card)',
          boxShadow: 'var(--shadow-float)',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <div className="shrink-0">
          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}>
            ₹{price.toLocaleString('en-IN')}
          </p>
        </div>
        <Button
          variant="secondary"
          size="lg"
          className="flex-1 gap-1.5"
          onClick={handleAddToCart}
        >
          <ShoppingCartIcon className="h-5 w-5" />
          Add to Cart
        </Button>
        <Button
          variant="accent"
          size="lg"
          className="flex-1"
          onClick={() =>
            isAuthenticated
              ? navigate(`/order/new?type=product&id=${product.id}`)
              : navigate('/login')
          }
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}
