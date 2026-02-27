import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../api/endpoints';
import Spinner from '../components/ui/Spinner';
import type { ProductListItem } from '../types';

function ProductCard({ product }: { product: ProductListItem }) {
  const price = product.discount_price ?? product.base_price;
  return (
    <Link to={`/products/${product.id}`} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="aspect-square bg-gray-100">
        {product.primary_image ? (
          <img src={product.primary_image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No image</div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-sm font-bold text-indigo-600">₹{price.toLocaleString()}</span>
          {product.discount_price && <span className="text-xs text-gray-400 line-through">₹{product.base_price.toLocaleString()}</span>}
        </div>
      </div>
    </Link>
  );
}

export default function ProductListPage() {
  const [params] = useSearchParams();
  const search = params.get('search') || undefined;
  const category_id = params.get('category_id') ? Number(params.get('category_id')) : undefined;

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', { search, category_id }],
    queryFn: () => getProducts({ search, category_id }).then(r => r.data),
  });
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: () => getCategories().then(r => r.data) });

  const currentCat = categories?.find(c => c.id === category_id);

  return (
    <div className="px-4 py-4">
      <h1 className="text-lg font-semibold">
        {search ? `Results for "${search}"` : currentCat ? currentCat.name : 'All Products'}
      </h1>
      {categories && categories.length > 0 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          <Link to="/products" className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border ${!category_id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300'}`}>All</Link>
          {categories.filter(c => !c.parent_id).map(c => (
            <Link key={c.id} to={`/products?category_id=${c.id}`} className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium border ${category_id === c.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-300'}`}>{c.name}</Link>
          ))}
        </div>
      )}
      {isLoading ? (
        <div className="flex justify-center py-12"><Spinner /></div>
      ) : products?.length ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-6">No products found.</p>
      )}
    </div>
  );
}
