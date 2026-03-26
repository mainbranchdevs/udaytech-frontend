import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ChevronRightIcon, ShieldCheckIcon, WrenchScrewdriverIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { getBanners, getCategories, getProducts, getCombos } from '../api/endpoints';
import Skeleton from '../components/ui/Skeleton';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/ui/Toast';
import type { Banner, Category, ProductListItem, Combo } from '../types';

function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [idx, setIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!banners.length) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % banners.length), 3500);
    return () => clearInterval(t);
  }, [banners.length]);

  useEffect(() => {
    ref.current?.scrollTo({ left: idx * ref.current.offsetWidth, behavior: 'smooth' });
  }, [idx]);

  if (!banners.length) return (
    <div
      className="h-48 md:h-80 flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--brand-700), var(--brand-500))' }}
    >
      <div className="text-center px-6">
        <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 'var(--text-2xl)', color: 'white' }}>
          Welcome to UdayaTech
        </h2>
        <p className="mt-2" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)' }}>
          Products + Expert Installation, all in one place
        </p>
        <Link to="/products" className="inline-block mt-4">
          <Button variant="accent" size="md">Shop Now</Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="relative overflow-hidden">
      <div ref={ref} className="flex overflow-x-hidden">
        {banners.map((b) => (
          <div key={b.id} className="shrink-0 w-full relative">
            <img src={b.image_url} alt={b.title} className="w-full h-48 md:h-80 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-4 right-4">
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'white' }}>
                {b.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
      {banners.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="h-1.5 rounded-full transition-all"
              style={{
                width: i === idx ? '16px' : '6px',
                background: i === idx ? 'white' : 'rgba(255,255,255,0.5)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryRow({ categories }: { categories: Category[] }) {
  const roots = categories.filter((c) => !c.parent_id);
  if (!roots.length) return null;
  return (
    <section className="py-4 px-3">
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
        {roots.map((c) => (
          <Link
            key={c.id}
            to={`/products?category_id=${c.id}`}
            className="flex flex-col items-center shrink-0 gap-1.5"
          >
            <div
              className="h-14 w-14 flex items-center justify-center text-lg font-bold"
              style={{
                background: 'var(--brand-50)',
                color: 'var(--brand-600)',
                borderRadius: 'var(--radius-full)',
              }}
            >
              {c.name.charAt(0)}
            </div>
            <span
              className="text-center w-14 truncate"
              style={{ fontSize: 'var(--text-2xs)', fontWeight: 600, color: 'var(--text-secondary)' }}
            >
              {c.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function TrustSection() {
  const items = [
    { icon: ShieldCheckIcon, title: 'Verified Products', desc: '100% genuine' },
    { icon: WrenchScrewdriverIcon, title: 'Expert Install', desc: 'Professional setup' },
    { icon: ChatBubbleLeftRightIcon, title: 'Free Support', desc: 'Always here to help' },
  ];
  return (
    <section className="px-3 py-4">
      <div className="grid grid-cols-3 gap-2">
        {items.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex flex-col items-center text-center px-2 py-3"
            style={{ background: 'var(--surface-sunken)', borderRadius: 'var(--radius-lg)' }}
          >
            <Icon className="h-6 w-6 mb-1.5" style={{ color: 'var(--brand-600)' }} />
            <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-2xs)', color: 'var(--text-primary)' }}>
              {title}
            </p>
            <p style={{ fontSize: '9px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionHeader({ title, to }: { title: string; to: string }) {
  return (
    <div className="flex items-center justify-between px-3 pt-5 pb-2">
      <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>
        {title}
      </h2>
      <Link
        to={to}
        className="flex items-center gap-0.5"
        style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--brand-600)' }}
      >
        View All <ChevronRightIcon className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

function ComboBundleScroll({ combos }: { combos: Combo[] }) {
  if (!combos.length) return null;
  return (
    <section>
      <SectionHeader title="Service Bundles" to="/combos" />
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-3 pb-2">
        {combos.map((c) => (
          <Link
            key={c.id}
            to={`/combos/${c.id}`}
            className="shrink-0 w-[260px] relative overflow-hidden"
            style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}
          >
            <div className="h-36 overflow-hidden" style={{ background: 'var(--surface-sunken)' }}>
              {c.banner_image ? (
                <img src={c.banner_image} alt={c.name} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--brand-700), var(--brand-500))' }}
                >
                  <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-lg)', color: 'white' }}>
                    {c.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="line-clamp-1" style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'white' }}>
                {c.name}
              </p>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--accent-400)', marginTop: '2px' }}>
                ₹{c.price.toLocaleString('en-IN')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const { addItem } = useCart();
  const { toast } = useToast();

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
  const { data: combos } = useQuery({
    queryKey: ['combos'],
    queryFn: () => getCombos().then((r) => r.data),
  });

  const loading = bl || cl || pl;

  if (loading) {
    return (
      <div>
        <Skeleton style={{ height: '192px', borderRadius: 0 }} />
        <div className="grid grid-cols-2 gap-3 px-3 py-4">
          {[1, 2, 3, 4].map((i) => <Skeleton.Card key={i} />)}
        </div>
      </div>
    );
  }

  const handleAddToCart = (product: ProductListItem) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.discount_price ?? product.base_price,
      image: product.primary_image,
    });
    toast(`${product.name} added to cart`, 'success');
  };

  return (
    <div>
      <BannerCarousel banners={banners ?? []} />
      <CategoryRow categories={categories ?? []} />
      <TrustSection />

      <SectionHeader title="Featured Products" to="/products" />
      {products?.length ? (
        <div className="grid grid-cols-2 gap-3 px-3">
          {products.slice(0, 6).map((p: ProductListItem) => (
            <Card
              key={p.id}
              product={p}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      ) : (
        <p className="text-center py-10" style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
          No products available yet.
        </p>
      )}

      <ComboBundleScroll combos={combos ?? []} />

      <div className="h-6" />
    </div>
  );
}
