import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { getProducts, getCategories } from '../api/endpoints';
import Skeleton from '../components/ui/Skeleton';
import Card from '../components/ui/Card';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/ui/Toast';
import type { ProductListItem } from '../types';
import { useState } from 'react';

export default function ProductListPage() {
  const [params] = useSearchParams();
  const search = params.get('search') || undefined;
  const category_id = params.get('category_id') ? Number(params.get('category_id')) : undefined;
  const [sortBy, setSortBy] = useState('default');

  const { addItem } = useCart();
  const { toast } = useToast();

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

  const sorted = products ? [...products].sort((a, b) => {
    const pa = a.discount_price ?? a.base_price;
    const pb = b.discount_price ?? b.base_price;
    if (sortBy === 'price-low') return pa - pb;
    if (sortBy === 'price-high') return pb - pa;
    return 0;
  }) : [];

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
      {/* Filter chips */}
      <div
        className="sticky top-14 z-30"
        style={{ background: 'var(--surface-card)', borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div className="flex items-center gap-2 px-3 py-2.5 overflow-x-auto no-scrollbar">
          <AdjustmentsHorizontalIcon className="h-4 w-4 shrink-0" style={{ color: 'var(--text-tertiary)' }} />
          <a
            href="/products"
            className="shrink-0 px-3 py-1.5 text-xs font-semibold transition-colors"
            style={{
              borderRadius: 'var(--radius-sm)',
              background: !category_id ? 'var(--brand-600)' : 'var(--surface-card)',
              color: !category_id ? 'white' : 'var(--text-secondary)',
              border: !category_id ? 'none' : '1px solid var(--border-default)',
            }}
          >
            All
          </a>
          {rootCats.map((c) => (
            <a
              key={c.id}
              href={`/products?category_id=${c.id}`}
              className="shrink-0 px-3 py-1.5 text-xs font-semibold transition-colors"
              style={{
                borderRadius: 'var(--radius-sm)',
                background: category_id === c.id ? 'var(--brand-600)' : 'var(--surface-card)',
                color: category_id === c.id ? 'white' : 'var(--text-secondary)',
                border: category_id === c.id ? 'none' : '1px solid var(--border-default)',
              }}
            >
              {c.name}
            </a>
          ))}
        </div>
      </div>

      {/* Page header */}
      <div className="px-3 py-3 flex items-center justify-between">
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>
            {search ? `Results for "${search}"` : currentCat ? currentCat.name : 'All Products'}
          </h1>
          {products && (
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>
              {products.length} items
            </span>
          )}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-xs py-1.5 px-2 outline-none"
          style={{
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-default)',
            background: 'var(--surface-card)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <option value="default">Sort by</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 px-3">
          {[1, 2, 3, 4].map((i) => <Skeleton.Card key={i} />)}
        </div>
      ) : sorted.length ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-3 pb-4">
          {sorted.map((p) => (
            <Card key={p.id} product={p} onAddToCart={handleAddToCart} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-secondary)' }}>No products found</p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '4px' }}>Try a different search or category</p>
        </div>
      )}
    </div>
  );
}
