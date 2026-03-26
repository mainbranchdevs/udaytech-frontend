import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { getOrders } from '../api/endpoints';
import Spinner from '../components/ui/Spinner';
import Badge, { statusVariant } from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => getOrders().then((r) => r.data),
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div>
      <div className="px-4 py-4">
        <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'var(--text-xl)', color: 'var(--text-primary)' }}>
          My Orders
        </h1>
        {orders && (
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>
            {orders.length} orders
          </p>
        )}
      </div>

      {orders?.length ? (
        <div className="flex flex-col gap-3 px-4">
          {orders.map((o) => (
            <Link
              key={o.id}
              to={`/orders/${o.id}`}
              className="flex items-center gap-3 px-4 py-4 transition-colors"
              style={{ background: 'var(--surface-card)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}
            >
              <div
                className="h-10 w-10 flex items-center justify-center shrink-0"
                style={{ background: 'var(--brand-50)', borderRadius: 'var(--radius-full)' }}
              >
                <ShoppingBagIcon className="h-5 w-5" style={{ color: 'var(--brand-600)' }} />
              </div>

              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Order #{o.id.slice(0, 8).toUpperCase()}
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  {new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <div className="mt-1.5">
                  <Badge variant={statusVariant(o.status)}>{o.status}</Badge>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  ₹{o.total_price.toLocaleString('en-IN')}
                </p>
                <ChevronRightIcon className="h-4 w-4 mt-1 ml-auto" style={{ color: 'var(--text-tertiary)' }} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4">
          <div
            className="w-16 h-16 mx-auto flex items-center justify-center mb-4"
            style={{ background: 'var(--brand-50)', borderRadius: 'var(--radius-full)' }}
          >
            <ShoppingBagIcon className="h-8 w-8" style={{ color: 'var(--brand-500)' }} />
          </div>
          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            No orders yet
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: '4px' }}>
            Your orders will appear here
          </p>
          <Link to="/products" className="inline-block mt-4">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
