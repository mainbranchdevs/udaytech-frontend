import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { getOrders } from '../api/endpoints';
import Spinner from '../components/ui/Spinner';
import Badge, { statusVariant } from '../components/ui/Badge';

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => getOrders().then((r) => r.data),
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <h1 className="text-base font-bold text-gray-900">My Orders</h1>
        {orders && <p className="text-xs text-gray-400 mt-0.5">{orders.length} orders</p>}
      </div>

      {orders?.length ? (
        <div className="divide-y divide-gray-100 bg-white mt-2">
          {orders.map((o) => (
            <Link
              key={o.id}
              to={`/orders/${o.id}`}
              className="flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors"
            >
              {/* Icon */}
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <ShoppingBagIcon className="h-5 w-5 text-[--brand]" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">Order #{o.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-xs text-gray-500 mt-0.5">{new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <div className="mt-1.5">
                  <Badge variant={statusVariant(o.status)}>{o.status}</Badge>
                </div>
              </div>

              {/* Amount + arrow */}
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-gray-900">₹{o.total_price.toLocaleString('en-IN')}</p>
                <ChevronRightIcon className="h-4 w-4 text-gray-400 mt-1 ml-auto" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <ShoppingBagIcon className="h-16 w-16 mx-auto text-gray-200 mb-4" />
          <p className="text-sm font-semibold text-gray-500">No orders yet</p>
          <p className="text-xs text-gray-400 mt-1">Your orders will appear here</p>
          <Link to="/products" className="inline-block mt-4 px-5 py-2 btn-brand text-white text-sm rounded-lg font-semibold">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
