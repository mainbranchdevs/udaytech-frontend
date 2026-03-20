import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { getBanners, getCategories, getProducts } from '../api/endpoints';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import type { Banner, Category, ProductListItem } from '../types';

// ─── Banner Carousel ─────────────────────────────────────────────────────────
function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [idx, setIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!banners.length) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % banners.length);
    }, 3500);
    return () => clearInterval(t);
  }, [banners.length]);

  useEffect(() => {
    ref.current?.scrollTo({ left: idx * ref.current.offsetWidth, behavior: 'smooth' });
  }, [idx]);

  if (!banners.length) return (
    <div className="h-40 bg-gradient-to-r from-[--brand] to-blue-400 flex items-center justify-center">
      <p className="text-white/70 text-sm">Welcome to Udaya Tech</p>
    </div>
  );

  return (
    <div className="relative overflow-hidden">
      <div ref={ref} className="flex overflow-x-hidden">
        {banners.map((b) => (
          <div key={b.id} className="shrink-0 w-full">
            <img src={b.image_url} alt={b.title} className="w-full h-44 object-cover" />
          </div>
        ))}
      </div>
      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Category Pills ───────────────────────────────────────────────────────────
const CAT_COLORS = [
  'bg-blue-50 text-blue-700',
  'bg-orange-50 text-orange-700',
  'bg-green-50 text-green-700',
  'bg-purple-50 text-purple-700',
  'bg-red-50 text-red-700',
  'bg-yellow-50 text-yellow-700',
  'bg-teal-50 text-teal-700',
  'bg-pink-50 text-pink-700',
];

function CategoryRow({ categories }: { categories: Category[] }) {
  const roots = categories.filter((c) => !c.parent_id);
  if (!roots.length) return null;
  return (
    <section className="bg-white py-3 px-3">
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
        {roots.map((c, i) => (
          <Link
            key={c.id}
            to={`/products?category_id=${c.id}`}
            className={`flex flex-col items-center shrink-0 gap-1.5 ${CAT_COLORS[i % CAT_COLORS.length]}`}
          >
            <div className={`h-14 w-14 rounded-full flex items-center justify-center text-2xl font-bold ${CAT_COLORS[i % CAT_COLORS.length]} bg-opacity-50`}>
              {c.name.charAt(0)}
            </div>
            <span className="text-[10px] font-semibold text-center w-14 truncate text-gray-700">{c.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, to }: { title: string; to: string }) {
  return (
    <div className="flex items-center justify-between px-3 pt-4 pb-2 bg-white">
      <h2 className="text-sm font-bold text-gray-900">{title}</h2>
      <Link to={to} className="flex items-center gap-0.5 text-xs font-semibold text-[--brand]">
        View All <ChevronRightIcon className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { data: banners, isLoading: bl } = useQuery({
    queryKey: ['banners'],
    queryFn: () => getBanners().then((r) => r.data),
  });
  const { data: categories, isLoading: cl } = useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then((r) => r.data),
  });
  const { data: products, isLoading: pl } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => getProducts().then((r) => r.data),
  });

  if (bl || cl || pl) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <BannerCarousel banners={banners ?? []} />

      {/* Divider */}
      <div className="h-2 bg-gray-100" />

      {/* Categories */}
      <CategoryRow categories={categories ?? []} />

      {/* Promotional strip */}
      <div className="h-2 bg-gray-100" />
      <div className="bg-gradient-to-r from-orange-500 to-yellow-400 px-4 py-3 flex items-center gap-3">
        <span className="text-white text-xs font-bold uppercase tracking-wider">🔥 Hot Deals</span>
        <span className="ml-auto text-white/80 text-[10px]">Limited time offers</span>
      </div>

      {/* Products Grid */}
      <div className="bg-white">
        <SectionHeader title="Featured Products" to="/products" />
        {products?.length ? (
          <div className="grid grid-cols-2 gap-px bg-gray-200">
            {products.map((p: ProductListItem) => (
              <div key={p.id} className="bg-white p-2">
                <Card product={p} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-10">No products available yet.</p>
        )}
      </div>

      {/* Bottom space */}
      <div className="h-4 bg-gray-100" />
    </div>
  );
}
