import { Link } from 'react-router-dom';
import { TrashIcon, MinusIcon, PlusIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';

export default function CartPage() {
  const { items, subtotal, updateQty, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div
          className="w-20 h-20 flex items-center justify-center mb-4"
          style={{ background: 'var(--brand-50)', borderRadius: 'var(--radius-full)', color: 'var(--brand-500)' }}
        >
          <ShoppingBagIcon className="h-10 w-10" />
        </div>
        <h2
          className="mb-2"
          style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}
        >
          Your cart is empty
        </h2>
        <p className="mb-6" style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
          Browse our products and find something you love.
        </p>
        <Link to="/products">
          <Button variant="primary">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-28">
      <div className="px-4 py-4">
        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: 'var(--text-xl)',
            color: 'var(--text-primary)',
          }}
        >
          Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>
      </div>

      <div className="flex flex-col gap-3 px-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex gap-3 p-3"
            style={{
              background: 'var(--surface-card)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              className="shrink-0 w-[72px] overflow-hidden"
              style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-md)', background: 'var(--surface-sunken)' }}
            >
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>
                  No img
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <p
                  className="line-clamp-2"
                  style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}
                >
                  {item.name}
                </p>
                <p className="mt-0.5" style={{ fontWeight: 700, fontSize: 'var(--text-base)', color: 'var(--text-primary)' }}>
                  ₹{item.price.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="flex items-center justify-between mt-2">
                <div
                  className="flex items-center gap-0"
                  style={{ borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-default)' }}
                >
                  <button
                    onClick={() => updateQty(item.productId, item.qty - 1)}
                    className="w-8 h-8 flex items-center justify-center transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    aria-label="Decrease quantity"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span
                    className="w-8 h-8 flex items-center justify-center"
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 600,
                      fontSize: 'var(--text-sm)',
                      color: 'var(--text-primary)',
                      borderLeft: '1.5px solid var(--border-default)',
                      borderRight: '1.5px solid var(--border-default)',
                    }}
                  >
                    {item.qty}
                  </span>
                  <button
                    onClick={() => updateQty(item.productId, item.qty + 1)}
                    className="w-8 h-8 flex items-center justify-center transition-colors"
                    style={{ color: 'var(--brand-600)' }}
                    aria-label="Increase quantity"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.productId)}
                  className="p-2 transition-colors"
                  style={{ color: 'var(--danger)', borderRadius: 'var(--radius-md)' }}
                  aria-label="Remove item"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="fixed bottom-[64px] left-0 right-0 px-4 py-3 flex items-center justify-between z-40"
        style={{
          background: 'var(--surface-card)',
          boxShadow: 'var(--shadow-float)',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Subtotal</p>
          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}>
            ₹{subtotal.toLocaleString('en-IN')}
          </p>
        </div>
        <Link to="/order/new">
          <Button variant="accent" size="lg">Place Order</Button>
        </Link>
      </div>
    </div>
  );
}
