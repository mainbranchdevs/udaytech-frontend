import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { getProducts, getCategories } from '../api/endpoints';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';

export default function ProductListPage() {
  const [params] = useSearchParams();
  const search = params.get('search') || undefined;
  const category_id = params.get('category_id') ? Number(params.get('category_id')) : undefined;

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', { search, category_id }],
    queryFn: () => getProducts({ search, category_id }).then((r) => r.data),
  });
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then((r) => r.data),
  });

  const currentCat = categories?.find((c) => c.id === category_id);
  const rootCats = categories?.filter((c) => !c.parent_id) ?? [];

  return (
    <div className="min-h-screen">
      {/* Filter chips */}
      <div className="bg-white border-b border-gray-100 sticky top-[52px] z-30">
        <div className="flex items-center gap-2 px-3 py-2 overflow-x-auto no-scrollbar">
          <AdjustmentsHorizontalIcon className="h-4 w-4 text-gray-500 shrink-0" />
          <a
            href="/products"
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
              !category_id ? 'bg-[--brand] text-white border-[--brand]' : 'bg-white text-gray-600 border-gray-300 hover:border-[--brand]'
            }`}
          >
            All
          </a>
          {rootCats.map((c) => (
            <a
              key={c.id}
              href={`/products?category_id=${c.id}`}
              className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                category_id === c.id
                  ? 'bg-[--brand] text-white border-[--brand]'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-[--brand]'
              }`}
            >
              {c.name}
            </a>
          ))}
        </div>
      </div>

      {/* Page title */}
      <div className="bg-white px-3 py-2 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-sm font-bold text-gray-800">
          {search ? `Results for "${search}"` : currentCat ? currentCat.name : 'All Products'}
        </h1>
        {products && <span className="text-xs text-gray-400">{products.length} items</span>}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-8 w-8" />
        </div>
      ) : products?.length ? (
        <div className="grid grid-cols-2 gap-px bg-gray-200">
          {products.map((p) => (
            <div key={p.id} className="bg-white p-2">
              <Card product={p} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-sm text-gray-500 font-medium">No products found</p>
          <p className="text-xs text-gray-400 mt-1">Try a different search or category</p>
        </div>
      )}
    </div>
  );
}
