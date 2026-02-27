import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getWishlist, removeFromWishlist } from '../api/endpoints';
import Spinner from '../components/ui/Spinner';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function WishlistPage() {
  const queryClient = useQueryClient();
  const { data: items, isLoading, isError } = useQuery({ queryKey: ['wishlist'], queryFn: () => getWishlist().then(r => r.data) });
  const removeMutation = useMutation({
    mutationFn: (id: string) => removeFromWishlist(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (isError) return <div className="px-4 py-4 max-w-2xl mx-auto text-sm text-red-600">Unable to load wishlist right now. Please try again.</div>;

  return (
    <div className="px-4 py-4 max-w-2xl mx-auto">
      <h1 className="text-lg font-semibold mb-4">Wishlist</h1>
      {items?.length ? (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm p-3 flex items-center gap-3">
              <Link to={`/products/${item.product_id}`} className="flex-1">
                <p className="text-sm font-medium text-gray-900">{item.product.name}</p>
                <p className="text-sm text-indigo-600">₹{(item.product.discount_price ?? item.product.base_price).toLocaleString()}</p>
              </Link>
              <button onClick={() => removeMutation.mutate(item.id)} className="p-1 text-gray-400 hover:text-red-500">
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">Your wishlist is empty.</p>
      )}
    </div>
  );
}
