import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { addToWishlist, getProduct } from '../api/endpoints';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { useState } from 'react';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id!).then(r => r.data),
    enabled: !!id,
  });

  const addWishlistMutation = useMutation({
    mutationFn: (productId: string) => addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner className="h-8 w-8" /></div>;
  if (!product) return <div className="text-center py-20 text-gray-500">Product not found</div>;

  const price = product.discount_price ?? product.base_price;
  const images = product.images.length ? product.images : [{ id: 'placeholder', image_url: '', display_order: 0, is_primary: true }];

  return (
    <div className="max-w-4xl mx-auto px-4 py-4">
      <div className="md:flex gap-8">
        <div className="md:w-1/2">
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
            {images[selectedImage]?.image_url ? (
              <img src={images[selectedImage].image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {images.map((img, i) => (
                <button key={img.id} onClick={() => setSelectedImage(i)} className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${i === selectedImage ? 'border-indigo-500' : 'border-transparent'}`}>
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="md:w-1/2 mt-4 md:mt-0">
          <h1 className="text-xl font-bold text-gray-900">{product.name}</h1>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-indigo-600">₹{price.toLocaleString()}</span>
            {product.discount_price && (
              <span className="text-lg text-gray-400 line-through">₹{product.base_price.toLocaleString()}</span>
            )}
          </div>
          {product.description && <p className="mt-4 text-sm text-gray-600 leading-relaxed">{product.description}</p>}
          {product.attributes.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Specifications</h3>
              <table className="w-full text-sm">
                <tbody>
                  {product.attributes.map(a => (
                    <tr key={a.id} className="border-b border-gray-100">
                      <td className="py-2 text-gray-500 pr-4">{a.attribute_name}</td>
                      <td className="py-2 text-gray-900">{a.attribute_value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-6 flex gap-3">
            <Button className="flex-1" onClick={() => isAuthenticated ? navigate(`/order/new?type=product&id=${product.id}`) : navigate('/login')}>
              Order Now
            </Button>
            <Button
              variant="secondary"
              onClick={() => (isAuthenticated ? addWishlistMutation.mutate(product.id) : navigate('/login'))}
              disabled={addWishlistMutation.isPending}
            >
              {addWishlistMutation.isPending ? 'Adding...' : 'Add to Wishlist'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
