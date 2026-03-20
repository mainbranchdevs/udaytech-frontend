import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { TrashIcon, HeartIcon } from '@heroicons/react/24/outline';
import { getWishlist, removeFromWishlist } from '../api/endpoints';
import Spinner from '../components/ui/Spinner';

export default function WishlistPage() {
  const queryClient = useQueryClient();
  const { data: items, isLoading, isError } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => getWishlist().then((r) => r.data),
  });
  const removeMutation = useMutation({
    mutationFn: (id: string) => removeFromWishlist(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (isError) return (
    <div className="px-4 py-4 text-sm text-red-600 text-center">Unable to load wishlist. Try again.</div>
  );

  return (
    <div className="min-h-screen">
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <h1 className="text-base font-bold text-gray-900">My Wishlist</h1>
        {items && <p className="text-xs text-gray-400 mt-0.5">{items.length} items saved</p>}
      </div>

      {items?.length ? (
        <div className="bg-white mt-2 divide-y divide-gray-100">
          {items.map((item) => {
            const price = item.product.discount_price ?? item.product.base_price;
            const discountPct = item.product.discount_price
              ? Math.round(((item.product.base_price - item.product.discount_price) / item.product.base_price) * 100)
              : 0;
            return (
              <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                {/* Image */}
                <Link to={`/products/${item.product_id}`}>
                  <div className="h-16 w-16 rounded-lg bg-gray-50 overflow-hidden shrink-0">
                    {item.product.primary_image ? (
                      <img src={item.product.primary_image} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <Link to={`/products/${item.product_id}`} className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.product.name}</p>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-sm font-bold text-gray-900">₹{price.toLocaleString('en-IN')}</span>
                    {item.product.discount_price && (
                      <span className="text-xs text-gray-400 line-through">₹{item.product.base_price.toLocaleString('en-IN')}</span>
                    )}
                    {discountPct > 0 && (
                      <span className="text-xs text-green-600 font-semibold">{discountPct}% off</span>
                    )}
                  </div>
                </Link>

                {/* Remove */}
                <button
                  onClick={() => removeMutation.mutate(item.id)}
                  disabled={removeMutation.isPending}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors shrink-0"
                  aria-label="Remove from wishlist"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <HeartIcon className="h-16 w-16 mx-auto text-gray-200 mb-4" />
          <p className="text-sm font-semibold text-gray-500">Your wishlist is empty</p>
          <p className="text-xs text-gray-400 mt-1">Save products you like here</p>
          <Link to="/products" className="inline-block mt-4 px-5 py-2 btn-brand text-white text-sm rounded-lg font-semibold">
            Browse Products
          </Link>
        </div>
      )}
    </div>
  );
}
