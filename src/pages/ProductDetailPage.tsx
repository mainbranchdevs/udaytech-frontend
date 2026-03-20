import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { HeartIcon, ShoppingBagIcon, TruckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { addToWishlist, getProduct } from '../api/endpoints';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

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
    },
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  if (!product) return <div className="text-center py-20 text-gray-500">Product not found</div>;

  const price = product.discount_price ?? product.base_price;
  const discountPct = product.discount_price
    ? Math.round(((product.base_price - product.discount_price) / product.base_price) * 100)
    : 0;
  const images = product.images.length
    ? product.images
    : [{ id: 'placeholder', image_url: '', display_order: 0, is_primary: true }];

  return (
    <div className="pb-24">
      {/* Image Carousel */}
      <div className="relative bg-white">
        <div className="aspect-square overflow-hidden bg-gray-50">
          {images[selectedImage]?.image_url ? (
            <img
              src={images[selectedImage].image_url}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">No image</div>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-2 px-3 py-2 overflow-x-auto no-scrollbar bg-white">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(i)}
                className={`shrink-0 h-14 w-14 rounded-lg overflow-hidden border-2 transition-colors ${
                  i === selectedImage ? 'border-[--brand]' : 'border-gray-200'
                }`}
              >
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="flex justify-center gap-1.5 pb-2 bg-white">
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${i === selectedImage ? 'w-4 bg-[--brand]' : 'w-1.5 bg-gray-300'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="bg-white mt-2 px-3 py-4">
        <h1 className="text-base font-semibold text-gray-900 leading-snug">{product.name}</h1>

        {/* Price row */}
        <div className="flex items-baseline gap-2 mt-2 flex-wrap">
          <span className="text-2xl font-bold text-gray-900">₹{price.toLocaleString('en-IN')}</span>
          {product.discount_price && (
            <>
              <span className="text-sm text-gray-400 line-through">₹{product.base_price.toLocaleString('en-IN')}</span>
              <span className="text-sm font-bold text-green-600">{discountPct}% off</span>
            </>
          )}
        </div>

        {/* Trust badges */}
        <div className="flex gap-4 mt-4 py-3 border-y border-gray-100">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <TruckIcon className="h-4 w-4 text-green-500" />
            Free Delivery
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <ShieldCheckIcon className="h-4 w-4 text-blue-500" />
            Genuine Product
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-4">
            <h3 className="text-sm font-bold text-gray-800 mb-1">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Specifications */}
        {product.attributes.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-bold text-gray-800 mb-2">Specifications</h3>
            <div className="rounded-lg overflow-hidden border border-gray-100">
              {product.attributes.map((a, i) => (
                <div key={a.id} className={`flex text-sm ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                  <span className="w-2/5 px-3 py-2.5 text-gray-500 text-xs font-medium border-r border-gray-100">{a.attribute_name}</span>
                  <span className="flex-1 px-3 py-2.5 text-gray-900 text-xs">{a.attribute_value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-[72px] inset-x-0 z-40">
        <div className="max-w-[480px] mx-auto glass border-t border-gray-200 px-3 py-2.5 flex gap-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1 gap-2"
            onClick={() =>
              isAuthenticated ? addWishlistMutation.mutate(product.id) : navigate('/login')
            }
            loading={addWishlistMutation.isPending}
          >
            {wishlisted
              ? <HeartSolid className="h-5 w-5 text-red-500" />
              : <HeartIcon className="h-5 w-5" />}
            Wishlist
          </Button>
          <Button
            size="lg"
            className="flex-1"
            onClick={() =>
              isAuthenticated
                ? navigate(`/order/new?type=product&id=${product.id}`)
                : navigate('/login')
            }
          >
            <ShoppingBagIcon className="h-5 w-5" />
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
