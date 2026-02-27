import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getBanners, getCategories, getProducts } from '../api/endpoints';
import Spinner from '../components/ui/Spinner';
import type { Banner, Category, ProductListItem } from '../types';

function BannerCarousel({ banners }: { banners: Banner[] }) {
  if (!banners.length) return null;
  return (
    <div className="overflow-x-auto flex snap-x snap-mandatory gap-4 px-4 py-4">
      {banners.map((b) => (
        <div key={b.id} className="snap-center shrink-0 w-[90vw] md:w-[600px] rounded-xl overflow-hidden">
          <img src={b.image_url} alt={b.title} className="w-full h-40 md:h-56 object-cover" />
        </div>
      ))}
    </div>
  );
}

function CategoryGrid({ categories }: { categories: Category[] }) {
  const roots = categories.filter((c) => !c.parent_id);
  if (!roots.length) return null;
  return (
    <section className="px-4 py-4">
      <h2 className="text-lg font-semibold mb-3">Categories</h2>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {roots.map((c) => (
          <Link key={c.id} to={`/products?category_id=${c.id}`} className="flex flex-col items-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
              {c.name.charAt(0)}
            </div>
            <span className="mt-2 text-xs text-center text-gray-700">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

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
          {product.discount_price && (
            <span className="text-xs text-gray-400 line-through">₹{product.base_price.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const { data: banners, isLoading: bl } = useQuery({ queryKey: ['banners'], queryFn: () => getBanners().then(r => r.data) });
  const { data: categories, isLoading: cl } = useQuery({ queryKey: ['categories'], queryFn: () => getCategories().then(r => r.data) });
  const { data: products, isLoading: pl } = useQuery({ queryKey: ['products', 'featured'], queryFn: () => getProducts().then(r => r.data) });

  if (bl || cl || pl) return <div className="flex items-center justify-center py-20"><Spinner className="h-8 w-8" /></div>;

  return (
    <div>
      <BannerCarousel banners={banners ?? []} />
      <CategoryGrid categories={categories ?? []} />
      <section className="px-4 py-4">
        <h2 className="text-lg font-semibold mb-3">Products</h2>
        {products?.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No products available yet.</p>
        )}
      </section>
    </div>
  );
}
