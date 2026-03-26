import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { TrashIcon, HeartIcon } from '@heroicons/react/24/outline';
import { getWishlist, removeFromWishlist } from '../api/endpoints';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';

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
    <div className="px-4 py-4 text-center" style={{ fontSize: 'var(--text-sm)', color: 'var(--danger)' }}>
      Unable to load wishlist. Try again.
    </div>
  );

  return (
    <div>
      <div className="px-4 py-4">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}>
          My Wishlist
        </h1>
        {items && (
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>
            {items.length} items saved
          </p>
        )}
      </div>

      {items?.length ? (
        <div className="flex flex-col gap-2 px-4">
          {items.map((item) => {
            const price = item.product.discount_price ?? item.product.base_price;
            const savings = item.product.discount_price ? item.product.base_price - item.product.discount_price : 0;
            return (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3"
                style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}
              >
                <Link to={`/products/${item.product_id}`}>
                  <div
                    className="h-16 w-16 overflow-hidden shrink-0"
                    style={{ borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)' }}
                  >
                    {item.product.primary_image ? (
                      <img src={item.product.primary_image} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>No img</div>
                    )}
                  </div>
                </Link>

                <Link to={`/products/${item.product_id}`} className="flex-1 min-w-0">
                  <p className="line-clamp-2" style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>
                    {item.product.name}
                  </p>
                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>
                      ₹{price.toLocaleString('en-IN')}
                    </span>
                    {item.product.discount_price && (
                      <span className="line-through" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
                        ₹{item.product.base_price.toLocaleString('en-IN')}
                      </span>
                    )}
                    {savings > 0 && (
                      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--accent-500)' }}>
                        ₹{savings.toLocaleString('en-IN')} off
                      </span>
                    )}
                  </div>
                </Link>

                <button
                  onClick={() => removeMutation.mutate(item.id)}
                  disabled={removeMutation.isPending}
                  className="p-2 shrink-0 transition-colors"
                  style={{ color: 'var(--text-tertiary)', borderRadius: 'var(--radius-md)' }}
                  aria-label="Remove from wishlist"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4">
          <div
            className="w-16 h-16 mx-auto flex items-center justify-center mb-4"
            style={{ background: 'var(--danger-light)', borderRadius: 'var(--radius-full)' }}
          >
            <HeartIcon className="h-8 w-8" style={{ color: 'var(--danger)' }} />
          </div>
          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            Your wishlist is empty
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            Save products you like here
          </p>
          <Link to="/products" className="inline-block mt-4">
            <Button>Browse Products</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
